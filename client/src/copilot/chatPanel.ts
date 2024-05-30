import * as vscode from 'vscode';
import { htmlTemplate } from './templates/chatView';
import { cssTemplate } from './templates/chatStyle';
import { scriptTemplate } from './templates/chatScript';
import { getSuggestion } from './promptParser';
import { DocumentDetails, PromptConfig } from './types';
import { CHAT_PANEL } from '../constants';
import { LanguageClient } from 'vscode-languageclient/browser';

let currentPanel: vscode.WebviewPanel | undefined;

export function createOrShowChatPanel(client: LanguageClient, context: any) {
    const column = vscode.ViewColumn.Beside;

    if (currentPanel) {
        currentPanel.reveal(column);
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
            }
        }
    );

    updateWebview(currentPanel, context.extensionUri);
}

function updateWebview(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    const webview = panel.webview;

    panel.title = CHAT_PANEL.TITLE;
    webview.html = getHtmlForWebview(webview, extensionUri);
}

function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
    return htmlTemplate(cssTemplate, scriptTemplate);
}

async function handleSendMessage(message: string, client: any) {
    if (!currentPanel) {
        return;
    }

    addMessageToChat({ text: `${CHAT_PANEL.NEW_MESSAGE_ICON}${message}`, type: 'newMessage' });
    addMessageToChat({ text: CHAT_PANEL.THINKING_MESSAGE, type: 'thinking' });
    
    const promptConfig: PromptConfig = {
        requestType: 'general',
        language: 'plaintext',
        instruction: message
    };

    const documentDetails: DocumentDetails = {
        content: message,
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

function parseMarkdown(text: string): string {
    const markdown = require('markdown-it')();
    return markdown.render(text);
}
