import axios from 'axios';

interface GenerateContentRequest {
    inputs: string;
    parameters?: {
        temperature?: number;
        max_new_tokens?: number;
        top_k?: number;
        top_p?: number;
    };
}

function createGenerateContentRequest(prompt: string, config: any): GenerateContentRequest {
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

    return {
        inputs: prompt,
        parameters
    };
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

        if (response.status === 200 && response.data.generated_text) {
            return response.data;
        } else {
            console.error('Error: Invalid status code or no generated text returned', response.status, response.data);
            throw new Error('Failed to generate content');
        }
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate content due to an error');
    }
}
