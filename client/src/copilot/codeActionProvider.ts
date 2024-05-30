import * as vscode from 'vscode';

export const codeActionProvider = {
	provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
	  const codeActions: vscode.CodeAction[] = [];
  
	  const generateWithCopilotAction = new vscode.CodeAction('Generate with Accord Copilot', vscode.CodeActionKind.QuickFix);
	  generateWithCopilotAction.command = {
		command: 'cicero-vscode-extension.startPromptProviderUI',
		title: 'Generate with Accord Copilot'
	  };
  
	  codeActions.push(generateWithCopilotAction);
  
	  return codeActions;
	}
};

