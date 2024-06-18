import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { log } from '../../log';
import { DocumentDetails, ModelConfig, PromptConfig } from '../types';
import { DEFAULT_LLM_MODELS, DEFAULT_LLM_ENDPOINTS } from '../../constants';

export async function getSuggestion(client: LanguageClient, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const apiKey = config.get<string>('apiKey');
    const provider = config.get<string>('provider');
    let llmModel = config.get<string>('llmModel');
    let apiUrl;

    if (!llmModel) {
        switch (provider) {
            case 'gemini':
                llmModel = DEFAULT_LLM_MODELS.GEMINI;
                apiUrl =  DEFAULT_LLM_ENDPOINTS.GEMINI;
                break;
            case 'openai':
                llmModel = DEFAULT_LLM_MODELS.OPENAI;
                apiUrl =  DEFAULT_LLM_ENDPOINTS.OPENAI;
                break;
            case 'anthropic':
                llmModel = DEFAULT_LLM_MODELS.ANTHROPIC;
                apiUrl =  DEFAULT_LLM_ENDPOINTS.ANTHROPIC;
                break;
            case 'huggingface':
                llmModel = DEFAULT_LLM_MODELS.HUGGINGFACE_MISTRAL;
                apiUrl =  DEFAULT_LLM_ENDPOINTS.HUGGINGFACE;
                break;    
            default:
                llmModel = '';
                apiUrl = '';
        }
    }

    // keys like maxTokens, temperature, topP comes from additionalParams
    const additionalParams = config.get<any>('additionalParams');

    let modelConfig: ModelConfig = {
        provider,
        llmModel,
        apiUrl,
        accessToken: apiKey,
        additionalParams: {} 
    };

    if (additionalParams) {
        modelConfig.additionalParams = {
            ...modelConfig.additionalParams,
            ...additionalParams
        };
    }

    try {
        log('Generating content...');
        const response: string = await client.sendRequest('generateContent', {
            modelConfig,
            documentDetails,
            promptConfig
        });
        return response;
    } catch (error) {
        log('Error generating content: ' + error);
        return null;
    }
}
