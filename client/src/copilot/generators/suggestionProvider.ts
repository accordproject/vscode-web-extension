import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { log } from '../../log';
import { Documents, ModelConfig, PromptConfig } from '../utils/types';
import { DEFAULT_LLM_ENDPOINTS } from '../utils/constants';
import { setLLMHealthStatus } from '../healthCheck';

export async function getSuggestion(client: LanguageClient, documents: Documents, promptConfig: PromptConfig): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const apiKey = config.get<string>('apiKey');
    const provider = config.get<string>('provider');
    let llmModel = config.get<string>('llmModel');

    let apiUrl;
    switch (provider) {
        case 'gemini':
            apiUrl =  DEFAULT_LLM_ENDPOINTS.GEMINI;
            break;
        case 'openai':
            apiUrl =  DEFAULT_LLM_ENDPOINTS.OPENAI;
            break;
        case 'mistral':
            apiUrl =  DEFAULT_LLM_ENDPOINTS.MISTRALAI;
            break;
        default:
            apiUrl = '';
    }

    // keys like maxTokens, temperature, topP comes from additionalParams
    const additionalParams = config.get<any>('additionalParams');

    const modelConfig: ModelConfig = {
        provider,
        llmModel,
        apiUrl,
        accessToken: apiKey,
        additionalParams: {...additionalParams}
    };

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
