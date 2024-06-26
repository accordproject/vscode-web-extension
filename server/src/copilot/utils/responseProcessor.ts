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

const REGEX = {
    BLOCK_START: /{\s*$/,
    BLOCK_END: /^\s*}/,
    STATEMENT_END: /;$/,
    COMMENT: /\/\/.*/,
    EMPTY_LINE: /^\s*$/,
    TRIPLE_QUOTES_CONTENT: /```([\s\S]*?)```/,
    KEYWORDS: /\b(namespace|import|transaction|asset|concept)\b/g
};



export function beautifyConcertoCode(rawCode: string): string {
    let code = extractCodeFromResponse(rawCode);

    // Ensure the code has proper newlines around keywords and braces
    code = code.replace(REGEX.KEYWORDS, '\n$1')
               .replace(/({|})/g, '\n$1\n')
               .replace(/;/g, ';\n')
               .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
               .replace(/(\s*}\s*)(\S)/g, '$1\n$2'); // Newline after closing brace if there isn't one

    let lines = code.split('\n');
    let beautifiedCode = '';
    let indentLevel = 0;
    const indentSize = 4;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (REGEX.COMMENT.test(line)) {
            beautifiedCode += ' '.repeat(indentLevel * indentSize) + line + '\n';
            continue;
        }

        if (REGEX.BLOCK_END.test(line)) {
            indentLevel = Math.max(indentLevel - 1, 0);
        }

        beautifiedCode += ' '.repeat(indentLevel * indentSize) + line + '\n';

        if (REGEX.BLOCK_START.test(line)) {
            indentLevel++;
        }

        if (i < lines.length - 1 && REGEX.EMPTY_LINE.test(lines[i + 1])) {
            beautifiedCode += '\n';
        }
    }

    return beautifiedCode.trim();
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
