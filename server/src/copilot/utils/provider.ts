import * as Diff from 'diff';
import { log } from '../../state';

interface ProviderResponse {
    content: string;
}

function extractCodeFromResponse(response: any): string {
	const text = response;
	const codeBlockMatch = text.match(/```[a-z]*\n([\s\S]*?)\n```/);
	if (codeBlockMatch) {
		return codeBlockMatch[1].trim();
	}
	return text.trim();    
}

export function filterInlineSuggestion(response: any): ProviderResponse {
    const content = extractCodeFromResponse(response);
    return { content };
}

export function cleanSuggestion(documentContent: string, cursorPosition: number, suggestion: string): string {

    suggestion = filterInlineSuggestion(suggestion).content;
    
    const beforeCursor = documentContent.slice(0, cursorPosition);
    const afterCursor = documentContent.slice(cursorPosition);

    const beforeCursorLines = beforeCursor.split('\n');
    const cursorLineIndex = beforeCursorLines.length - 1;

    const diff = Diff.diffLines(beforeCursor + afterCursor, suggestion);

    let cleanSuggestion = '';
    let currentLineIndex = 1;

    // Iterate over the diff chunks and build the cleaned suggestion
    for (const part of diff) {
        const partLines = part.value.split('\n');
        if (part.added && currentLineIndex >= cursorLineIndex) {
            cleanSuggestion += part.value;
            break;
        }
        else if (!part.added && !part.removed) {
            currentLineIndex += partLines.length;
        }    
    }

    cleanSuggestion = cleanSuggestion.trim();

    // Remove any leading text that is already present in the document before the cursor
    const overlapLength = Math.min(beforeCursor.length, cleanSuggestion.length);

    for (let i = 0; i < overlapLength; i++) {
        const beforeCursorSuffix = beforeCursor.slice(beforeCursor.length - i);
        const suggestionPrefix = cleanSuggestion.slice(0, i);

        if (beforeCursorSuffix === suggestionPrefix) {
            cleanSuggestion = cleanSuggestion.slice(i);
        }
    }

    // Remove parts of the suggestion that match the content after the cursor
    const afterCursorTrimmed = afterCursor.trim();
    const afterCursorIndex = cleanSuggestion.indexOf(afterCursorTrimmed);

    if (afterCursorTrimmed && afterCursorIndex !== -1) {
        cleanSuggestion = cleanSuggestion.slice(0, afterCursorIndex);
    }

    return cleanSuggestion;
}
