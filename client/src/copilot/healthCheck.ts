'use strict';

import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { getSuggestion } from './generators/suggestionProvider';
import { DocumentDetails, PromptConfig } from './types';
import { log } from '../log';

export let copilotHealthStatus: boolean = true;

export async function checkCopilotHealth(client: LanguageClient): Promise<void> {
    const documentDetails: DocumentDetails = {
        content: 'Health check, please respond.',
		cursorPosition: 0
	};

    const promptConfig: PromptConfig = {
        requestType: 'general',
		language: 'plaintext'
	};

    const response = await getSuggestion(client, documentDetails, promptConfig);
    
    if (response) {
        copilotHealthStatus = true;
        log(response + 'Copilot is healthy.');
    } else {
        copilotHealthStatus = false;
        log('Copilot failed health check.');
    }
}
