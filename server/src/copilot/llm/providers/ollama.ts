import { LargeLanguageModel } from './largeLanguageModel';
import { Embedding, ModelConfig } from '../../utils/types';
import { robustFetch as fetch } from '../../utils/robustFetch';
import { log } from '../../../state';
import { DocumentationType } from '../../utils/constants';

class Ollama implements LargeLanguageModel {
    getIdentifier(): string {
        return 'ollama';
    }

    async generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string> {
        let { apiUrl, llmModel } = config;

        // Default to local Ollama if no URL is provided
        if (!apiUrl) {
            apiUrl = OLLAMA_ENDPOINTS.CONTENT;
        }

        // If no model is specified in config, default to tinyllama 
        if (!llmModel) {
            config.llmModel = 'tinyllama';
        }

        const request = this.createGenerateContentRequest(promptArray, config);

        try {
            log(`Sending request to Ollama: ${apiUrl} with model: ${config.llmModel}`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: No Authorization header needed for local Ollama!
                },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices.length > 0) {
                    const text = data.choices[0]?.message?.content;
                    return text;
                } else {
                    log('Error: No choices returned from Ollama');
                    throw new Error('Failed to generate content');
                }
            } else {
                log('Error: Invalid status code returned from Ollama');
                log(`Response Status: ${response.status}, Response Data: ${await response.text()}`);
                throw new Error('Failed to generate content');
            }
        } catch (error: any) {
            log(`Error generating content: ${error.message}, for the request: ${JSON.stringify(request)}`);
            throw new Error('Failed to generate content due to an error');
        }
    }

    // Embeddings support (Optional, but good to have)
    async generateEmbeddings(config: any, text: string): Promise<Embedding[]> {
        let { apiUrl, embeddingModel } = config;

        if (!apiUrl) {
            apiUrl = OLLAMA_ENDPOINTS.EMBEDDINGS;
        }

        // Default embedding model for Ollama
        let model = embeddingModel || 'nomic-embed-text';
        const request = this.createGenerateEmbeddingsRequest(text, model);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    return data.data[0].embedding;
                } else {
                    throw new Error('Failed to generate embeddings');
                }
            } else {
                throw new Error('Failed to generate embeddings');
            }
        } catch (error: any) {
            log(`Error generating embeddings: ${error.message}`);
            throw new Error('Failed to generate embeddings due to an error');
        }
    }

    getDocsEmbeddings(data: any, docType: string): number[] {
        // Retrieve pre-calculated embeddings if they exist
        switch (docType) {
            case DocumentationType.NAMESPACE:
                return data.ollama?.embeddings;
            case DocumentationType.TEMPLATE:
                return data.model?.embeddings?.ollama;
            case DocumentationType.GRAMMAR:
                return data.grammar?.embeddings?.ollama;
        }
        return [];
    }

    private createGenerateContentRequest(promptArray: { content: string; role: string }[], config: ModelConfig) {
        const { llmModel, additionalParams } = config;

        // We use the /v1/ compatibility endpoint, so the body is identical to OpenAI
        const request: any = {
            model: llmModel || 'tinyllama',
            messages: promptArray,
            stream: false // Important for Ollama to return JSON at once
        };

        request.temperature = additionalParams?.temperature ?? 0;
        request.top_p = additionalParams?.topP ?? 0.9;
        return request;
    }

    private createGenerateEmbeddingsRequest(text: string, model: string) {
        return {
            input: [text],
            model: model,
        };
    }
}

// These point to your local machine (or the Mock Server)
export const OLLAMA_ENDPOINTS = {
    CONTENT: 'http://localhost:11434/v1/chat/completions',
    EMBEDDINGS: 'http://localhost:11434/v1/embeddings',
};

export default new Ollama();