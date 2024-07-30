import { LargeLanguageModel } from './largeLanguageModel';
import { Embedding, ModelConfig } from '../../utils/types';
import  { robustFetch as fetch } from '../../utils/robustFetch';
import { log } from '../../../state';
import { DocumentationType } from '../../utils/constants';

class Gemini implements LargeLanguageModel {
    getIdentifier(): string {
        return 'gemini';
    }

    async generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string> {
        let { apiUrl } = config;
        const { accessToken, llmModel } = config;

        if (!apiUrl) {
            apiUrl = GEMINI_ENDPOINTS.CONTENT;
        }

        const updatedApiUrl = this.replaceModelInApiUrl(apiUrl, llmModel);
        const request = this.createGenerateContentRequest(promptArray, config);

        try {
            const response = await fetch(`${updatedApiUrl}?key=${accessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates.length > 0) {
                    const generatedContent = data.candidates[0]?.content;
                    const text = generatedContent?.parts[0]?.text;
                    return text;
                } else {
                    log('Error: No candidates returned');
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
            apiUrl = GEMINI_ENDPOINTS.EMBEDDINGS;
        }

        embeddingModel = embeddingModel || GEMINI_ENDPOINTS.EMBEDDING_MODEL;
        const updatedApiUrl = this.replaceModelInApiUrl(apiUrl, embeddingModel);
        const request = this.createGenerateEmbeddingsRequest(text, embeddingModel);

        try {
            const response = await fetch(`${updatedApiUrl}?key=${accessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.embedding) {
                    const embedding: Embedding[] = data.embedding.values;
                    return embedding;
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
                return data.gemini?.embeddings?.embedding;
            case DocumentationType.TEMPLATE:
                return data.model?.embeddings?.gemini?.embedding;
            case DocumentationType.GRAMMAR:
                return data.grammar?.embeddings?.gemini?.embedding;
        }

        return [];
    } 

    private createGenerateContentRequest(promptArray: { content: string; role: string }[], config: ModelConfig) {
        const { additionalParams } = config;

        const generationConfig: {
            temperature?: number;
            maxOutputTokens?: number;
            topP?: number;
            topK?: number;
        } = {};

        if (additionalParams?.temperature !== undefined) generationConfig.temperature = additionalParams.temperature;
        if (additionalParams?.maxTokens !== undefined) generationConfig.maxOutputTokens = additionalParams.maxTokens;
        if (additionalParams?.topP !== undefined) generationConfig.topP = additionalParams.topP;
        if (additionalParams?.topK !== undefined) generationConfig.topK = additionalParams.topK;

        const contents = promptArray.map(item => ({
            parts: [{ text: item.content }],
            role: item.role === 'user' ? 'user' : 'model'
        }));

        return {
            contents: contents,
            generationConfig: generationConfig
        };
    }

    private createGenerateEmbeddingsRequest(text: string, model: string) {
        return {
            model: model,
            content: {
                parts: [{ text: text }]
            }
        };
    }

    private replaceModelInApiUrl(apiUrl: string, llmModel: string): string {
        const regex = /\/models\/[^:]+/;
        return apiUrl.replace(regex, `/models/${llmModel}`);
    }
}

export const GEMINI_ENDPOINTS = {
    CONTENT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    EMBEDDINGS: 'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent',
    EMBEDDING_MODEL: 'text-embedding-004'
};

export default new Gemini();
