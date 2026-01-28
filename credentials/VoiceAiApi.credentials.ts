import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VoiceAiApi implements ICredentialType {
	name = 'voiceAiApi';
	displayName = 'Voice AI API';
	icon = 'file:voiceai.svg' as const;

	documentationUrl = 'https://voice.ai/docs/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Voice.ai API key (Bearer token)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://dev.voice.ai/api/v1/tts',
			url: '/voices',
			method: 'GET',
		},
	};
}
