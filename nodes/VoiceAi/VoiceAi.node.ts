import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { speechDescription } from './resources/speech';
import { voiceDescription } from './resources/voice';
import { listVoices } from './resources/utils';

export class VoiceAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Voice AI',
		name: 'voiceAi',
		icon: 'file:voiceai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Voice.ai text-to-speech and voice management API',
		defaults: {
			name: 'Voice AI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'voiceAiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://dev.voice.ai/api/v1/tts',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Speech',
						value: 'speech',
					},
					{
						name: 'Voice',
						value: 'voice',
					},
				],
				default: 'speech',
			},
			...speechDescription,
			...voiceDescription,
		],
	};

	methods = {
		listSearch: {
			listVoices,
		},
	};
}
