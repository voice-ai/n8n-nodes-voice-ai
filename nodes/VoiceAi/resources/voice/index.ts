import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

const showOnlyForVoice = {
	resource: ['voice'],
};

const showOnlyForVoiceGet = {
	resource: ['voice'],
	operation: ['get', 'delete', 'update'],
};

const showOnlyForVoiceCreate = {
	resource: ['voice'],
	operation: ['create'],
};

const showOnlyForVoiceUpdate = {
	resource: ['voice'],
	operation: ['update'],
};

async function preSendCloneVoice(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const voiceName = this.getNodeParameter('voiceName') as string;
	const binaryInputField = this.getNodeParameter('audioFile', 'data') as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;

	const fileBuffer = await this.helpers.getBinaryDataBuffer(binaryInputField);
	const binaryData = this.helpers.assertBinaryData(binaryInputField);

	const formData = new FormData();
	formData.append(
		'file',
		new Blob([new Uint8Array(fileBuffer)], { type: binaryData.mimeType }),
		binaryData.fileName || 'audio.mp3',
	);
	formData.append('name', voiceName);

	if (additionalOptions.voiceVisibility) {
		formData.append('voice_visibility', additionalOptions.voiceVisibility as string);
	}

	if (additionalOptions.language) {
		formData.append('language', additionalOptions.language as string);
	}

	requestOptions.body = formData;
	return requestOptions;
}

export const voiceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForVoice,
		},
		options: [
			{
				name: 'Create (Clone)',
				value: 'create',
				description: 'Create a new voice by cloning from an audio file',
				action: 'Create a voice',
				routing: {
					request: {
						method: 'POST',
						url: '/clone-voice',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
					send: {
						preSend: [preSendCloneVoice],
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a voice',
				action: 'Delete a voice',
				routing: {
					request: {
						method: 'DELETE',
						url: '={{"/voice/" + $parameter["voiceId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a voice by ID',
				action: 'Get a voice',
				routing: {
					request: {
						method: 'GET',
						url: '={{"/voice/" + $parameter["voiceId"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many voices',
				action: 'Get many voices',
				routing: {
					request: {
						method: 'GET',
						url: '/voices',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a voice metadata',
				action: 'Update a voice',
				routing: {
					request: {
						method: 'PUT',
						url: '={{"/voice/" + $parameter["voiceId"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	// Voice ID for Get, Delete, Update operations
	{
		displayName: 'Voice',
		description: 'The voice to operate on',
		name: 'voiceId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: showOnlyForVoiceGet,
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'listVoices',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. voice_abc123',
			},
		],
		required: true,
	},
	// Create Voice Fields
	{
		displayName: 'Voice Name',
		description: 'Name for the new voice',
		name: 'voiceName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForVoiceCreate,
		},
		required: true,
	},
	{
		displayName: 'Audio File',
		description: 'The binary property containing the audio file for voice cloning',
		name: 'audioFile',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyForVoiceCreate,
		},
		required: true,
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForVoiceCreate,
		},
		options: [
			{
				displayName: 'Language',
				name: 'language',
				description: 'Language code for the voice (e.g., en, es, fr)',
				type: 'string',
				default: 'en',
			},
			{
				displayName: 'Voice Visibility',
				name: 'voiceVisibility',
				description: 'Whether the voice is public or private',
				type: 'options',
				options: [
					{
						name: 'Private',
						value: 'PRIVATE',
						description: 'Only you can use this voice',
					},
					{
						name: 'Public',
						value: 'PUBLIC',
						description: 'Anyone can use this voice',
					},
				],
				default: 'PRIVATE',
			},
		],
	},
	// Update Voice Fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForVoiceUpdate,
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				description: 'New name for the voice',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'name',
					},
				},
			},
			{
				displayName: 'Voice Visibility',
				name: 'voiceVisibility',
				description: 'Whether the voice is public or private',
				type: 'options',
				options: [
					{
						name: 'Private',
						value: 'PRIVATE',
						description: 'Only you can use this voice',
					},
					{
						name: 'Public',
						value: 'PUBLIC',
						description: 'Anyone can use this voice',
					},
				],
				default: 'PRIVATE',
				routing: {
					send: {
						type: 'body',
						property: 'voice_visibility',
					},
				},
			},
		],
	},
];
