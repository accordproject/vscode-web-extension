import axios from 'axios';
import { log } from '../../state';
import { LLM_ENDPOINTS } from '../utils/constants';

/*
    API call to generate content using the Huggingface model
    Documentation: https://huggingface.co/blog/inference-endpoints-llm 
    Sample Endpoint: missing
    based on the API documentation, these interfaces are used to generate content using the Huggingface models
*/
interface Message {
    role: string;
    content: string;
}

interface GenerateContentRequest {
    inputs: string;
    parameters?: {
        temperature?: number;
        max_new_tokens?: number;
        top_k?: number;
        top_p?: number;
    };
}

function createGenerateContentRequest(promptArray: Message[], config: any): GenerateContentRequest {
    const {
        temperature,
        maxTokens,
        topK,
        topP,
    } = config;

    const parameters: GenerateContentRequest['parameters'] = {};

    if (temperature !== undefined) parameters.temperature = temperature;
    if (maxTokens !== undefined) parameters.max_new_tokens = maxTokens;
    if (topK !== undefined) parameters.top_k = topK;
    if (topP !== undefined) parameters.top_p = topP;

    // Concatenate the promptArray into a single input string
    const inputs = promptArray.map(message => {
        if (message.role === 'system') {
            return message.content;
        } else if (message.role === 'user') {
            return `Human: ${message.content}`;
        } else if (message.role === 'assistant') {
            return `Assistant: ${message.content}`;
        }
        return '';
    }).join('\n');

    return {
        inputs,
        parameters
    };
}

export async function generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string> {
    let { apiUrl, accessToken } = config;

    if (!apiUrl) 
        apiUrl = LLM_ENDPOINTS.HUGGINGFACE;
    
    const request: GenerateContentRequest = createGenerateContentRequest(promptArray, config);

    try {
        const response = await axios.post<any>(
            apiUrl,
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 200 && response.data.generated_text) {
            return response.data.generated_text;
        } else {
            log('Error: Invalid status code or no generated text returned ' + response.status + ', Response data: ' + response.data);
            throw new Error('Failed to generate content');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                log('Error generating content: ' + error.response.status + ' ' + error.response.statusText);
                log('Response data: ' + (error.response.data?.error || JSON.stringify(error.response.data)));
            }
        } else {
            log('Unexpected error generating content: ' + error);
        }
        throw new Error('Failed to generate content due to an error');
    }
}
