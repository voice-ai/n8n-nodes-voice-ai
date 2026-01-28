import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

const showOnlyForSpeech = {
	resource: ['speech'],
};

const showOnlyForTextToSpeech = {
	resource: ['speech'],
	operation: ['textToSpeech'],
};

async function returnBinaryData(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	responseData: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;
	const audioFormat = (additionalOptions.audioFormat as string) || 'mp3';

	const mimeType = audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';

	const binaryData = await this.helpers.prepareBinaryData(
		responseData.body as Buffer,
		`speech.${audioFormat}`,
		mimeType,
	);

	return items.map(() => ({
		json: responseData.headers as IDataObject,
		binary: { data: binaryData },
	}));
}

export const speechDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSpeech,
		},
		options: [
			{
				name: 'Text to Speech',
				value: 'textToSpeech',
				description: 'Converts text into speech and returns audio',
				action: 'Convert text to speech',
				routing: {
					request: {
						method: 'POST',
						url: '/speech',
						returnFullResponse: true,
						encoding: 'arraybuffer',
					},
					output: {
						postReceive: [returnBinaryData],
					},
				},
			},
		],
		default: 'textToSpeech',
	},
	// Voice Selection
	{
		displayName: 'Voice',
		description: 'Select the voice to use for the conversion',
		name: 'voice',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: showOnlyForTextToSpeech,
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
		routing: {
			send: {
				type: 'body',
				property: 'voice_id',
			},
		},
	},
	// Text Input
	{
		displayName: 'Text',
		description: 'The text that will be converted into speech',
		placeholder: 'e.g. Hello, welcome to Voice AI!',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: showOnlyForTextToSpeech,
		},
		required: true,
		routing: {
			send: {
				type: 'body',
				property: 'text',
			},
		},
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForTextToSpeech,
		},
		options: [
			{
				displayName: 'Audio Format',
				name: 'audioFormat',
				description: 'Output format of the generated audio',
				type: 'options',
				options: [
					{
						name: 'MP3',
						value: 'mp3',
						description: 'MP3 audio format',
					},
					{
						name: 'WAV',
						value: 'wav',
						description: 'WAV audio format',
					},
				],
				default: 'mp3',
				routing: {
					send: {
						type: 'body',
						property: 'audio_format',
					},
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				description: 'Language code for the speech (e.g., en, es, fr)',
				type: 'string',
				default: 'en',
				routing: {
					send: {
						type: 'body',
						property: 'language',
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				description: 'The model to use for text-to-speech conversion',
				type: 'string',
				default: 'voiceai-tts-v1-latest',
				routing: {
					send: {
						type: 'body',
						property: 'model',
					},
				},
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				description: 'Controls randomness in speech generation (0-2)',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberStepSize: 0.1,
				},
				default: 1,
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Top P',
				name: 'topP',
				description: 'Controls diversity via nucleus sampling (0-1)',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberStepSize: 0.1,
				},
				default: 0.8,
				routing: {
					send: {
						type: 'body',
						property: 'top_p',
					},
				},
			},
		],
	},
];
