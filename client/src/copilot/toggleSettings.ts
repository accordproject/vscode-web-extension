'use strict';

import * as vscode from 'vscode';
import { log } from '../log';
import { codeActionProvider } from './codeActionProvider';
import { inlineSuggestionProvider } from './inlineSuggestionProvider';

let codeActionProviderDisposable: vscode.Disposable | null = null;
let inlineSuggestionProviderDisposable: vscode.Disposable | null = null;

export function registerToggleSettingsCommands(context: vscode.ExtensionContext, client: any): void {
    context.subscriptions.push(vscode.commands.registerCommand('cicero-vscode-extension.toggleInlineSuggestions', async () => {
        const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
        const currentSetting = config.get('enableInlineSuggestions', true);
        await config.update('enableInlineSuggestions', !currentSetting, vscode.ConfigurationTarget.Global);
        log(`Inline suggestions ${!currentSetting ? 'enabled' : 'disabled'}`);

        // Enable/Disable inline suggestion provider
        if (!currentSetting) {
            inlineSuggestionProviderDisposable = vscode.languages.registerInlineCompletionItemProvider(
                { pattern: '**/*' }, // Apply to all file types
                inlineSuggestionProvider(client)
            );
            context.subscriptions.push(inlineSuggestionProviderDisposable);
        } else {
            if (inlineSuggestionProviderDisposable) {
                inlineSuggestionProviderDisposable.dispose();
                inlineSuggestionProviderDisposable = null;
            }
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('cicero-vscode-extension.toggleCodeActions', async () => {
        const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
        const currentSetting = config.get('enableCodeActions', true);
        await config.update('enableCodeActions', !currentSetting, vscode.ConfigurationTarget.Global);
        log(`Code actions ${!currentSetting ? 'enabled' : 'disabled'}`);

        // Enable/disable code actions
        if (!currentSetting) {
            codeActionProviderDisposable = vscode.languages.registerCodeActionsProvider(
                { scheme: 'file' },
                { provideCodeActions: codeActionProvider.provideCodeActions }
            );
            context.subscriptions.push(codeActionProviderDisposable);
        } else {
            if (codeActionProviderDisposable) {
                codeActionProviderDisposable.dispose();
                codeActionProviderDisposable = null;
            }
        }
    }));
}
