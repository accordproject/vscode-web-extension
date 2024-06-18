import * as vscode from 'vscode';
import { log } from '../log';

export const codeActionProvider = {
	provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
	  const codeActions: vscode.CodeAction[] = [];
	  const diagnostic = context.diagnostics[0];
	  log('Diagnostic: ' + diagnostic.message)
	  const generateWithCopilotAction = new vscode.CodeAction('Generate with Accord Copilot', vscode.CodeActionKind.QuickFix);
	  generateWithCopilotAction.command = {
		command: 'cicero-vscode-extension.startPromptProviderUI',
		title: 'Generate with Accord Copilot'
	  };
  
	  codeActions.push(generateWithCopilotAction);
	  
	  const filePathRegex = /.+\bfile:\/\/\/.+/;
        const isErrorMessage = filePathRegex.test(diagnostic.message);

        if (isErrorMessage) {
			const fixErrorWithCopilotAction = new vscode.CodeAction('Fix error with Accord Copilot', vscode.CodeActionKind.QuickFix);
				fixErrorWithCopilotAction.command = {
				command: 'cicero-vscode-extension.chatPanelWithErrorMessage',
				title: 'Fix error with Accord Copilot',
				arguments: [diagnostic.message]
			};

			codeActions.push(fixErrorWithCopilotAction);
		}
	  return codeActions;
	}
};

