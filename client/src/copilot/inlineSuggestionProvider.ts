import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { getSuggestion } from './generators/suggestionProvider';
import { log } from '../log';
import { DocumentDetails, Documents, PromptConfig } from './utils/types';

const debounceDelay = 2000; // 2 seconds
let debounceTimer: NodeJS.Timeout | null = null;
let currentResolve: ((value: vscode.InlineCompletionItem[] | null) => void) | null = null;

export const inlineSuggestionProvider = (client: LanguageClient): vscode.InlineCompletionItemProvider => {
  return {
    provideInlineCompletionItems: async (document, position) => {

      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }

      if (currentResolve) {
        currentResolve(null);
        currentResolve = null;
      }
      
      return new Promise<vscode.InlineCompletionItem[] | null>((resolve) => {

        currentResolve = resolve;

        debounceTimer = setTimeout(async () => {
          log('Providing Inline Completion and suggestions');
          
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
            language: document.languageId
          };

          try {
            const suggestion = await getSuggestion(client, documents, promptConfig);
            const items: vscode.InlineCompletionItem[] = [
              new vscode.InlineCompletionItem(
                suggestion,
                new vscode.Range(position, position.translate(0, 10))
              )
            ];
            resolve(items);
          } catch (error) {
            log('Error generating content: ' + error);
            resolve(null);
          } finally {
            currentResolve = null;
          }
        }, debounceDelay);
      });
    }
  };
};
