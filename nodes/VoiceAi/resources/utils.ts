import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

interface VoiceAiVoice {
	voice_id: string;
	name: string;
	status: string;
	voice_visibility: string;
}

export async function listVoices(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'voiceAiApi', {
		method: 'GET',
		url: 'https://dev.voice.ai/api/v1/tts/voices',
	});

	const voices = response as VoiceAiVoice[];

	const results = voices
		.filter((voice: VoiceAiVoice) => {
			if (!filter) return true;
			return voice.name.toLowerCase().includes(filter.toLowerCase());
		})
		.map((voice: VoiceAiVoice) => ({
			name: `${voice.name} (${voice.status})`,
			value: voice.voice_id,
		}));

	return { results };
}
