import axios from 'axios';
import { log } from '../../state';
import { LLM_ENDPOINTS } from '../utils/constants';
import { ModelConfig } from '../utils/types';

/*
	API request to generate content using the Anthropic model
	Documentation: https://docs.anthropic.com/en/api/complete
	Sample Endpoint: https://api.anthropic.com/v1/complete
	based on the API documentation, these interfaces are used to generate content using the Anthropic models
*/

interface Message {
    role: string;
    content: string;
}

interface GenerateContentRequest {
    model: string;
    prompt: string;
    max_tokens_to_sample?: number;
    stop_sequences?: string[];
    temperature?: number;
    top_p?: number;
    top_k?: number;
    metadata?: object;
    stream?: boolean;
}

function createGenerateContentRequest(promptArray: Message[], config: ModelConfig): GenerateContentRequest {

    const { llmModel: model, additionalParams } = config;

	// Based on the API documentation, the prompt should be formatted as follows
    const formattedPrompt = `\n\nHuman: ` + promptArray.map(message => {
        if (message.role === 'user') {
            return `\n\nHuman: ${message.content}`;
        } else if (message.role === 'system') {
            return `\n\nAssistant: ${message.content}`;
        }
        return '';
    }).join(' ') + '\n\nAssistant:';

    const request: GenerateContentRequest = {
        model,
        prompt: formattedPrompt
    };

    if (additionalParams?.temperature !== undefined) request.temperature = additionalParams.temperature;
    if (additionalParams?.maxTokens !== undefined) request.max_tokens_to_sample = additionalParams.maxTokens;
    if (additionalParams?.topP !== undefined) request.top_p = additionalParams.topP;
    if (additionalParams?.topK !== undefined) request.top_k = additionalParams.topK;
    if (additionalParams?.metadata !== undefined) request.metadata = additionalParams.metadata;
    if (additionalParams?.stream !== undefined) request.stream = additionalParams.stream;
    if (additionalParams?.stopSequences !== undefined) request.stop_sequences = additionalParams.stopSequences;

    return request;
}

export async function generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string> {
    let { apiUrl, accessToken } = config;

    if(!apiUrl)
        apiUrl = LLM_ENDPOINTS.ANTHROPIC;

    const request: GenerateContentRequest = createGenerateContentRequest(promptArray, config);

    try {
        const response = await axios.post<any>(
            apiUrl,
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': accessToken,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        if (response.status === 200 && response.data.completion) {
			let generatedContent = response.data.completion;
            return generatedContent;
        } else {
            log('Error: Invalid status code or no completion returned ' + response.status + ', Response Status: ' + response.statusText)
            log('Response Data: ' + JSON.stringify(response.data?.error || response.data) );
            throw new Error('Failed to generate content');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                log('Error generating content: ' + error.response.status + error.response.statusText);
                log('Response data: ' + JSON.stringify(error.response.data?.error || error.response.data));
            } 
        } else {
            log('Unexpected error generating content:' + error);
        }
        throw new Error('Failed to generate content due to an error');
    }
}
