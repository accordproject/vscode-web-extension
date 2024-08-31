import * as Diff from 'diff';

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
        const beforeCursorSuffix = beforeCursor.slice(beforeCursor.length - i).toLowerCase();
        const suggestionPrefix = cleanSuggestion.slice(0, i).toLowerCase();

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

    if(cleanSuggestion.length === 0 && suggestion.length !== 0)
        cleanSuggestion = suggestion;

    return cleanSuggestion;
}

export function beautifyConcertoCode(rawCode: string): string {
    const code = extractCodeFromResponse(rawCode); 
    return code;
}

export function beautifyGrammarMd(text: any): string {
    // Regular expression to match and clean up the placeholders
    const placeholderPattern = /"\s*{\s*{\s*([\w\s]+)\s*}\s*}\s*"\s*/g;
  
    // Replace the matches with cleaned placeholders
    const cleanedText = text.replace(placeholderPattern, (match: any, p1: any) => `{{${p1.trim()}}}`);
  
    // Regular expression to remove newlines and extra spaces inside placeholders
    const cleanNewlinesPattern = /{\s*{\s*([\w\s]+)\s*}\s*}/g;
    const finalCleanedText = cleanedText.replace(cleanNewlinesPattern, (match: any, p1: any) => `{{${p1.trim()}}}`);
  
    return finalCleanedText;
}
