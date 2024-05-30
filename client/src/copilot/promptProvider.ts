import * as vscode from 'vscode';
import { getSuggestion } from './promptParser';
import { ERROR_MESSAGES, PROMPTS } from '../constants';
import { DocumentDetails, PromptConfig } from './types';

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

    const documentDetails: DocumentDetails = {
      content: document.getText(),
      cursorPosition: document.offsetAt(position)
    };

    const promptConfig: PromptConfig = {
      requestType: 'inline',
      language: document.languageId,
      instruction: input
    };

    const suggestion = await getSuggestion(client, documentDetails, promptConfig);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(document.uri, position, suggestion);
    await vscode.workspace.applyEdit(edit);
  }
};
