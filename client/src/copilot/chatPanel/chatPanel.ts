import * as vscode from 'vscode';
import { getSuggestion } from '../generators/suggestionProvider';
import { DocumentDetails, PromptConfig } from '../types';
import { CHAT_PANEL } from '../../constants';
import { LanguageClient } from 'vscode-languageclient/browser';
import { parseMarkdown, updateWebview } from './chatUtils';
import { log } from '../../log';

let currentPanel: vscode.WebviewPanel | undefined;

export function createOrShowChatPanel(client: LanguageClient, context: any, errorMessage?: string) {
    const column = vscode.ViewColumn.Beside;
    const editor = vscode.window.activeTextEditor;

    if (currentPanel) {
        currentPanel.reveal(column);
        if (errorMessage) {
            currentPanel.webview.postMessage({ command: 'setValue', text: errorMessage });
        }
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'chatPanel',
        CHAT_PANEL.TITLE,
        column,
        {
            enableScripts: true,
            localResourceRoots: [context.extensionUri]
        }
    );

    currentPanel.onDidDispose(() => {
        currentPanel = undefined;
    });

    currentPanel.webview.onDidReceiveMessage(
        async message => {
            switch (message.type) {
                case 'sendMessage':
                    await handleSendMessage(message.text, client);
                    break;
                case 'webviewLoaded':
                    if (errorMessage) {                        
                        const document = editor.document;
                        const content = document.getText();
                        await handleSendMessage(errorMessage, client, content);
                    }
            }
        }
    );

    updateWebview(currentPanel, context.extensionUri);
}

async function handleSendMessage(message: string, client: any, content?: string) {
    if (!currentPanel) {
        return;
    }

    addMessageToChat({ text: `${CHAT_PANEL.NEW_MESSAGE_ICON}${message}`, type: 'newMessage' });
    addMessageToChat({ text: CHAT_PANEL.THINKING_MESSAGE, type: 'thinking' });
    
    const promptConfig: PromptConfig = {
        requestType: (content)? 'fix' : 'general',
        language: 'plaintext',
        instruction: message
    };

    const documentDetails: DocumentDetails = {
        content: (content)? content : '',
        cursorPosition: 0
    };

    const suggestion = await getSuggestion(client, documentDetails, promptConfig);

    if (suggestion) {
        removeThinkingMessage();
        addMessageToChat({ text: parseMarkdown(suggestion), type: 'newMessage' });
    } else {
        removeThinkingMessage();
        addMessageToChat({ text: CHAT_PANEL.ERROR_MESSAGE, type: 'newMessage' });
    }
}

function addMessageToChat(message: { text: string, type: string }) {
    if (currentPanel) {
        currentPanel.webview.postMessage(message);
    }
}

function removeThinkingMessage() {
    if (currentPanel) {
        currentPanel.webview.postMessage({ type: 'removeThinking' });
    }
}

