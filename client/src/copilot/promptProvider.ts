import * as vscode from 'vscode';
import { getDummySuggestion } from './promptParser';
import { getSurroundingLines } from '../utils';
import { ERROR_MESSAGES, PROMPTS } from '../constants';

export const promptProvider = {
  async showPromptInputBox(client: any) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage(ERROR_MESSAGES.NO_ACTIVE_EDITOR);
      return;
    }

    const input = await vscode.window.showInputBox({
      prompt: PROMPTS.INPUT_BOX,
    });

    if (!input) {
      return;
    }

    const document = editor.document;
    const position = editor.selection.active;
    const surroundingLines = await getSurroundingLines(document, position);
    const prompt = `${surroundingLines}\n${input}`;
    
    const suggestion = await getDummySuggestion(prompt);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(document.uri, position, suggestion);
    await vscode.workspace.applyEdit(edit);
  }
};
