import axios from 'axios';

/*
	API request to generate content using the Anthropic model
	Documentation: https://docs.anthropic.com/en/api/complete
	Sample Endpoint: https://api.anthropic.com/v1/complete
	based on the API documentation, these interfaces are used to generate content using the Anthropic models
*/

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

function createGenerateContentRequest(prompt: string, config: any): GenerateContentRequest {
    const {
        model,
        maxTokens,
        temperature,
        stopSequences,
        topP,
        topK,
        metadata,
        stream
    } = config;

	// Based on the API documentation, the prompt should be formatted as follows
    const formattedPrompt = `\n\nHuman: ${prompt} \n\nAssistant:`;

    const request: GenerateContentRequest = {
        model,
        prompt: formattedPrompt
    };

	if (maxTokens !== undefined) request.max_tokens_to_sample = maxTokens;
    if (temperature !== undefined) request.temperature = temperature;
    if (stopSequences !== undefined) request.stop_sequences = stopSequences;
    if (topP !== undefined) request.top_p = topP;
    if (topK !== undefined) request.top_k = topK;
    if (metadata !== undefined) request.metadata = metadata;
    if (stream !== undefined) request.stream = stream;

    return request;
}

export async function generateContent(config: any, prompt: string): Promise<any> {
    const { apiUrl, accessToken } = config;
    const request: GenerateContentRequest = createGenerateContentRequest(prompt, config);

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
            console.error('Error: Invalid status code or no completion returned', {
                status: response.status,
                statusText: response.statusText,
                data: response.data?.error || response.data
            });
            throw new Error('Failed to generate content');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Error generating content:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data?.error || error.response.data
                });
            } 
        } else {
            console.error('Unexpected error generating content:', error);
        }
        throw new Error('Failed to generate content due to an error');
    }
}
