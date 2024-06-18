import * as vscode from 'vscode';
import { CHAT_PANEL } from '../../constants';
import { htmlTemplate } from './templates/chatView';
import { cssTemplate } from './templates/chatStyle';
import { scriptTemplate } from './templates/chatScript';

export function updateWebview(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    const webview = panel.webview;

    panel.title = CHAT_PANEL.TITLE;
    webview.html = getHtmlForWebview(webview, extensionUri);
}

function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
    return htmlTemplate(cssTemplate, scriptTemplate);
}

export function parseMarkdown(text: string): string {
    const markdown = require('markdown-it')();
    return markdown.render(text);
}