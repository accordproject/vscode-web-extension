import * as vscode from 'vscode';
import { getDummySuggestion } from './promptParser';
import { getSurroundingLines } from '../utils';

const debounceDelay = 2000; // 2 seconds
let debouncePromise: Promise<vscode.InlineCompletionItem[] | null> | null = null;

export const inlineSuggestionProvider: vscode.InlineCompletionItemProvider = {
  provideInlineCompletionItems: async (document, position, context, token) => {
    // Cancel any existing debounce promise
    if (debouncePromise) {
      debouncePromise = null;
    }

    // Set a new debounce promise
    debouncePromise = new Promise<vscode.InlineCompletionItem[] | null>((resolve) => {
      setTimeout(async () => {
        const lineText = document.lineAt(position.line).text;
        const surroundingLines = await getSurroundingLines(document, position);
        const prompt = `${surroundingLines}\n${lineText}`;
        const suggestion = await getDummySuggestion(prompt);
        const items: vscode.InlineCompletionItem[] = [
          new vscode.InlineCompletionItem(
            suggestion,
            new vscode.Range(position, position.translate(0, 10))
          )
        ];
        resolve(items);
      }, debounceDelay);
    });

    // Wait for the debounce promise to resolve
    return debouncePromise || null;
  } 
};
