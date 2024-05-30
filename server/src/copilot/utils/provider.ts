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

    // Remove duplicate parts of the suggestion that match the content before the cursor
    let cleanSuggestion = suggestion;
    const overlapLength = Math.min(beforeCursor.length, suggestion.length);

    for (let i = 0; i < overlapLength; i++) {
        const beforeCursorSuffix = beforeCursor.slice(beforeCursor.length - i);
        const suggestionPrefix = suggestion.slice(0, i);

        if (beforeCursorSuffix === suggestionPrefix) {
            cleanSuggestion = suggestion.slice(i);
        }
    }

    // Remove parts of the suggestion that match the content after the cursor
    const afterCursorTrimmed = afterCursor.trim();
    const afterCursorIndex = cleanSuggestion.indexOf(afterCursorTrimmed);

    if (afterCursorTrimmed && afterCursorIndex !== -1) {
        cleanSuggestion = cleanSuggestion.slice(0, afterCursorIndex);
    }

    // Remove any leading text that is already present in the document before the cursor
    if (cleanSuggestion.startsWith(beforeCursor.trim())) {
        cleanSuggestion = cleanSuggestion.replace(beforeCursor.trim(), '').trim();
    }

    return cleanSuggestion;
}