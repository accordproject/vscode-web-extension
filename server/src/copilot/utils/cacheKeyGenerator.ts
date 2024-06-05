import { DocumentDetails, PromptConfig } from './types';

export function generateCacheKey(documentDetails: DocumentDetails, promptConfig: PromptConfig): string {
    const { content, cursorPosition } = documentDetails;
    const { requestType, language, instruction } = promptConfig;

    return `${content}:${cursorPosition}:${requestType}:${language}:${instruction || ''}`;
}
