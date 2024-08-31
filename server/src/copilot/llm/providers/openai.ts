import { LargeLanguageModel } from './largeLanguageModel';
import { Embedding, ModelConfig } from '../../utils/types';
import  { robustFetch as fetch } from '../../utils/robustFetch';
import { log } from '../../../state';
import { DocumentationType } from '../../utils/constants';

class OpenAI implements LargeLanguageModel {
    getIdentifier(): string {
        return 'openai';
    }

    async generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string> {
        let { apiUrl } = config;
        const { accessToken } = config;

        if (!apiUrl) {
            apiUrl = OPENAI_ENDPOINTS.CONTENT;
        }

        const request = this.createGenerateContentRequest(promptArray, config);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    const text = data.choices[0]?.message?.content;
                    return text;
                } else {
                    log('Error: No choices returned');
                    throw new Error('Failed to generate content');
                }
            } else {
                log('Error: Invalid status code returned');
                log(`Response Status: ${response.status}, Response Data: ${await response.text()}`);
                throw new Error('Failed to generate content');
            }
        } catch (error: any) {
            log(`Error generating content: ${error.message}, for the request: ${JSON.stringify(request)}`);
            throw new Error('Failed to generate content due to an error');
        }
    }

    async generateEmbeddings(config: any, text: string): Promise<Embedding[]> {
        let { apiUrl, embeddingModel } = config;
        const { accessToken } = config;
        
        if (!apiUrl) {
            apiUrl = OPENAI_ENDPOINTS.EMBEDDINGS;
        }

        embeddingModel = embeddingModel || OPENAI_ENDPOINTS.EMBEDDING_MODEL;
        const request = this.createGenerateEmbeddingsRequest(text, embeddingModel);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    const embeddings: Embedding[] = data.data[0].embedding;
                    return embeddings;
                } else {
                    log('Error: No embedding returned');
                    throw new Error('Failed to generate embeddings');
                }
            } else {
                log('Error: Invalid status code returned');
                log(`Response Status: ${response.status}, Response Data: ${await response.text()}`);
                throw new Error('Failed to generate embeddings');
            }
        } catch (error: any) {
            log(`Error generating embeddings: ${error.message}, for the request: ${JSON.stringify(request)}`);
            throw new Error('Failed to generate embeddings due to an error');
        }
    }

    getDocsEmbeddings(data: any, docType: string): number[] {

        switch (docType) {
            case DocumentationType.NAMESPACE:
                return data.openai?.embeddings;
            case DocumentationType.TEMPLATE:
                return data.model?.embeddings?.openai;
            case DocumentationType.GRAMMAR:
                return data.grammar?.embeddings?.openai;
        }

        return [];
    } 

    private createGenerateContentRequest(promptArray: { content: string; role: string }[], config: ModelConfig) {
        const { llmModel, additionalParams } = config;

        const request: {
            model: string;
            messages: { role: string; content: string }[];
            max_tokens?: number;
            temperature?: number;
            top_p?: number;
            frequency_penalty?: number;
            presence_penalty?: number;
        } = {
            model: llmModel,
            messages: promptArray,
        };

        if (additionalParams?.temperature !== undefined) request.temperature = additionalParams.temperature;
        if (additionalParams?.maxTokens !== undefined) request.max_tokens = additionalParams.maxTokens;
        if (additionalParams?.topP !== undefined) request.top_p = additionalParams.topP;
        if (additionalParams?.frequencyPenalty !== undefined) request.frequency_penalty = additionalParams.frequencyPenalty;
        if (additionalParams?.presencePenalty !== undefined) request.presence_penalty = additionalParams.presencePenalty;
        
        return request;
    }

    private createGenerateEmbeddingsRequest(text: string, model: string) {
        return {
            input: [text],
            model: model,
        };
    }
}

export const OPENAI_ENDPOINTS = {
    CONTENT: 'https://api.openai.com/v1/chat/completions',
    EMBEDDINGS: 'https://api.openai.com/v1/embeddings',
    EMBEDDING_MODEL: 'text-embedding-ada-002',
};

export default new OpenAI();
