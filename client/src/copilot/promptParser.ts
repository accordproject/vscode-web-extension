import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { log } from '../log';
import { DocumentDetails, ModelConfig, PromptConfig } from './types';
import { DEFAULT_LLM_MODELS } from '../constants';

export async function getSuggestion(client: LanguageClient, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const apiKey = config.get<string>('apiKey');
    const apiUrl = config.get<string>('apiUrl');
    const provider = config.get<string>('provider');
    let llmModel = config.get<string>('llmModel');

    if (!llmModel) {
        switch (provider) {
            case 'gemini':
                llmModel = DEFAULT_LLM_MODELS.GEMINI;
                break;
            case 'openai':
                llmModel = DEFAULT_LLM_MODELS.OPENAI;
                break;
            case 'anthropic':
                llmModel = DEFAULT_LLM_MODELS.ANTHROPIC;
                break;
            default:
                llmModel = '';
        }
    }


    // parse maxTokens as a number, convert it from string to number
    const maxTokens = config.get<number | null>('maxTokens', null);
    const temperature = config.get<number | null>('temperature', null);
    const additionalParams = config.get<any>('additionalParams');

    let modelConfig: ModelConfig = {
        provider,
        llmModel,
        apiUrl,
        accessToken: apiKey 
    };

    if (maxTokens) 
        modelConfig.maxTokens = maxTokens;

    if (temperature) 
        modelConfig.temperature = temperature;

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
