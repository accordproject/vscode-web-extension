'use strict';

import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { getSuggestion } from './generators/suggestionProvider';
import { DocumentDetails, Documents, PromptConfig } from './utils/types';
import { log } from '../log';

export let copilotHealthStatus = true;

export async function checkCopilotHealth(client: LanguageClient): Promise<void> {
    const documentDetails: DocumentDetails = {
        content: '',
		cursorPosition: 0
	};

    const documents: Documents = {
        main: documentDetails
    };

    const promptConfig: PromptConfig = {
        requestType: 'general',
		language: 'plaintext',
        instruction: 'Health check, please respond.'
	};

    const response = await getSuggestion(client, documents, promptConfig);
    
    if (response) {
        copilotHealthStatus = true;
        log(response + 'Copilot is healthy.');
    } else {
        copilotHealthStatus = false;
        log('Copilot failed health check.');
    }
}