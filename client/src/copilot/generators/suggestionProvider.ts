import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { log } from '../../log';
import { Documents, ModelConfig, PromptConfig } from '../utils/types';
import { DEFAULT_LLM_MODELS, DEFAULT_LLM_ENDPOINTS } from '../utils/constants';
import { setLLMHealthStatus } from '../healthCheck';

export async function getSuggestion(client: LanguageClient, documents: Documents, promptConfig: PromptConfig): Promise<string | null> {
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
            case 'mistralai':
                llmModel = DEFAULT_LLM_MODELS.MISTRALAI;
                apiUrl =  DEFAULT_LLM_ENDPOINTS.MISTRALAI;
                break;   
            default:
                llmModel = '';
                apiUrl = '';
        }
    }

    // keys like maxTokens, temperature, topP comes from additionalParams
    const additionalParams = config.get<any>('additionalParams');

    const modelConfig: ModelConfig = {
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
            documents,
            promptConfig
        });
        return response;
    } catch (error) {
        setLLMHealthStatus(false);
        log('Error generating content: ' + error);
        return null;
    }
}
