# @voice-ai-labs/n8n-nodes-voice-ai

This is an n8n community node. It lets you use Voice.ai in your n8n workflows.

Voice.ai is a text-to-speech and voice cloning API that enables you to generate realistic speech from text and create custom voice models.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Alternatively, you can install it via the n8n Community Nodes interface or using npm:

```bash
npm install @voice-ai-labs/n8n-nodes-voice-ai
```

## Operations

### Speech
- **Text to Speech**: Convert text into realistic speech audio

### Voice
- **Get Many**: Retrieve a list of available voices
- **Get**: Get details of a specific voice by ID
- **Create (Clone)**: Clone a voice from an audio file
- **Update**: Update voice metadata
- **Delete**: Delete a voice

## Credentials

To use this node, you need a Voice.ai API key.

### How to get your API key:

1. Sign up for a Voice.ai account at [https://voice.ai](https://voice.ai)
2. Navigate to your developer dashboard
3. Generate an API key
4. Copy the API key

### Setting up credentials in n8n:

1. In n8n, go to **Credentials** > **New**
2. Search for "Voice AI API"
3. Enter your API key in the "API Key" field
4. Click **Save**

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with**: n8n 2.4.6

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Voice.ai API Documentation](https://voice.ai/docs/api-reference)
* [Voice.ai Homepage](https://voice.ai)

## Version history

### 1.0.0
- Initial release
- Text-to-speech conversion with customizable parameters
- Voice management operations (list, get, create, update, delete)
- Voice cloning from audio files
