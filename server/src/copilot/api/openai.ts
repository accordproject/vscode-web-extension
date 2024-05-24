import axios from 'axios';

/*
	API call to generate content using the OpenAI model
	Documentation: https://platform.openai.com/docs/api-reference/completions/create
	Sample Endpoint: https://api.openai.com/v1/completions
	based on the API documentation, these interfaces are used to generate content using the OpenAI models
*/

interface GenerateContentRequest {
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
}

function createGenerateContentRequest(prompt: string, config: any): GenerateContentRequest {
    const { model, maxTokens, temperature, topP, frequencyPenalty, presencePenalty } = config;

	const request: GenerateContentRequest = {
        model: model || 'gpt-3.5-turbo-instruct',
        prompt: prompt,
    };

    if (maxTokens !== undefined) request.max_tokens = maxTokens;
    if (temperature !== undefined) request.temperature = temperature;
    if (topP !== undefined) request.top_p = topP;
    if (frequencyPenalty !== undefined) request.frequency_penalty = frequencyPenalty;
    if (presencePenalty !== undefined) request.presence_penalty = presencePenalty;
    
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
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
			let generatedContent = response.data;
			let text = generatedContent?.choices[0]?.text;
            return text;
        } else {
            console.error('Error: Invalid status code or no choices returned', response.status, response.data);
            throw new Error('Failed to generate content. Invalid response from server.');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Error generating content:', error.response.status, error.response.statusText);
                console.error('Response data:', error.response.data);
                throw new Error(`Failed to generate content due to an error (${error.response.status} ${error.response.statusText}).`);
            } else if (error.request) {
                console.error('Error generating content: Request failed');
                console.error('Request data:', error.config);
                throw new Error('Failed to send request to the server.');
            } else {
                console.error('Error generating content:', error.message);
                throw new Error('An error occurred while processing the request.');
            }
		} else {
			console.error('Error generating content:', error);
            throw new Error('An unexpected error occurred while generating content.');
		}		
    }
}
