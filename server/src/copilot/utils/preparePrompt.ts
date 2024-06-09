import { DocumentDetails, PromptConfig } from './types';

let defaultInstruction = '// Analyze the following code in ${language} and complete the code based on the context. ';

function preparePrompt(documentDetails: DocumentDetails, promptConfig: PromptConfig): string {
    const { content, cursorPosition } = documentDetails;
    const { requestType, instruction } = promptConfig;

    if (requestType === 'inline') {
        const beforeCursor = content.slice(0, cursorPosition);
        const afterCursor = content.slice(cursorPosition);
		defaultInstruction = defaultInstruction.replace('${language}', promptConfig.language || '');
		const finalInstruction = instruction ? defaultInstruction + instruction : defaultInstruction;
        return `${beforeCursor} ${finalInstruction} ${afterCursor}`;
    } else {
        return content;
    }
}

function incorporateSuggestion(originalContent: string, cursorPosition: number, suggestion: string): string {
    return originalContent.slice(0, cursorPosition) + suggestion + originalContent.slice(cursorPosition);
}

export { preparePrompt, incorporateSuggestion};
