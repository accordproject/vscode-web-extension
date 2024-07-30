import * as vscode from 'vscode';
import { getSuggestion } from './generators/suggestionProvider';
import { ERROR_MESSAGES, PROMPTS } from './utils/constants';
import { DocumentDetails, Documents, PromptConfig } from './utils/types';

export const promptProvider = {
  async showPromptInputBox(client: any) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage(ERROR_MESSAGES.NO_ACTIVE_EDITOR);
      return;
    }

    const inputBox = vscode.window.createInputBox();
    inputBox.prompt = PROMPTS.INPUT_BOX;
    inputBox.ignoreFocusOut = true;
    let suggestion = '';

    inputBox.onDidAccept(async () => {
      inputBox.busy = true; 
      inputBox.prompt = PROMPTS.GENERATING_CODE;
      const input = inputBox.value;

      if (!input) {
        inputBox.hide();
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;
      const documentDetails: DocumentDetails = {
        content: document.getText(),
        cursorPosition: document.offsetAt(position),
        fileExtension: document.fileName.split('.').pop()
      };

      const documents: Documents = {
        main: documentDetails
      };

      const promptConfig: PromptConfig = {
        requestType: 'inline',
        language: document.languageId,
        instruction: input
      };

      try {
        suggestion = await getSuggestion(client, documents, promptConfig);
      } catch (error) {
        vscode.window.showErrorMessage(`${ERROR_MESSAGES.GENERATE_CONTENT_ERROR}: ${error.message}`);
        inputBox.hide();
        return;
      }

      inputBox.hide();
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, position, suggestion);
      await vscode.workspace.applyEdit(edit);
    });

    inputBox.onDidHide(() => {
      inputBox.dispose();
    });

    inputBox.show();
  }
};