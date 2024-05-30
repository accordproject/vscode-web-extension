import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { log } from '../log';
import { DocumentDetails, ModelConfig, PromptConfig } from './types';

export async function getSuggestion(client: LanguageClient, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const apiKey = config.get<string>('apiKey');
    const apiUrl = config.get<string>('apiUrl');
    const modelName = config.get<string>('modelName');
    // parse maxTokens as a number, convert it from string to number
    const maxTokens = config.get<number | null>('maxTokens', null);
    const temperature = config.get<number | null>('temperature', null);
    const additionalParams = config.get<any>('additionalParams');

    let modelConfig: ModelConfig = {
        modelName,
        apiUrl,
        accessToken: apiKey 
    };

    if (maxTokens) 
        modelConfig.maxTokens = maxTokens;

    if (temperature) 
        modelConfig.temperature = temperature;

    log('Model Config: ' + JSON.stringify(modelConfig));

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
