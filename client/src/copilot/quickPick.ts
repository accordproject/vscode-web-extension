'use strict';

import * as vscode from 'vscode';
import { GENERAL } from '../constants';
import { copilotHealthStatus } from './healthCheck';
import { createOrShowChatPanel } from './chatPanel';
import { LanguageClient } from 'vscode-languageclient/browser';

export function registerQuickPickCommand(context: vscode.ExtensionContext, client: LanguageClient): void {

    context.subscriptions.push(vscode.commands.registerCommand('cicero-vscode-extension.showQuickPick', async () => {
		const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
		const enableInlineSuggestions = config.get('enableInlineSuggestions', true);
		const enableCodeActions = config.get('enableCodeActions', true);
		
        const options = [
			{ label: copilotHealthStatus ? GENERAL.QUICK_PICK_STATUS_OK : GENERAL.QUICK_PICK_STATUS_ERROR },
            { label: GENERAL.QUICK_PICK_OPTION_SETTINGS },
            { label: GENERAL.QUICK_PICK_OPTION_SUGGESTIONS },
			{ label: GENERAL.QUICK_PICK_OPTION_CHAT_AGENT },
            { label: '', kind: vscode.QuickPickItemKind.Separator },
            { label: enableInlineSuggestions ? GENERAL.QUICK_PICK_OPTION_DISABLE_INLINE_SUGGESTIONS : GENERAL.QUICK_PICK_OPTION_ENABLE_INLINE_SUGGESTIONS },
            { label: enableCodeActions ? GENERAL.QUICK_PICK_OPTION_DISABLE_CODE_ACTIONS : GENERAL.QUICK_PICK_OPTION_ENABLE_CODE_ACTIONS }
        ];

        const selection = await vscode.window.showQuickPick(options, { placeHolder: GENERAL.QUICK_PICK_PLACEHOLDER });
        if (selection?.label === GENERAL.QUICK_PICK_OPTION_SETTINGS) {
            vscode.commands.executeCommand('cicero-vscode-extension.configureSettings');
        } else if (selection?.label === GENERAL.QUICK_PICK_OPTION_SUGGESTIONS) {
            vscode.commands.executeCommand('cicero-vscode-extension.startPromptProviderUI');
        } else if (selection?.label === 'Open Chat Agent') { // Add this condition
            createOrShowChatPanel(client, context);
        } else if (selection?.label === GENERAL.QUICK_PICK_OPTION_ENABLE_INLINE_SUGGESTIONS || selection?.label === GENERAL.QUICK_PICK_OPTION_DISABLE_INLINE_SUGGESTIONS) {
            vscode.commands.executeCommand('cicero-vscode-extension.toggleInlineSuggestions');
        } else if (selection?.label === GENERAL.QUICK_PICK_OPTION_ENABLE_CODE_ACTIONS || selection?.label === GENERAL.QUICK_PICK_OPTION_DISABLE_CODE_ACTIONS) {
            vscode.commands.executeCommand('cicero-vscode-extension.toggleCodeActions');
        }
    }));
}
