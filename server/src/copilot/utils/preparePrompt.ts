interface DocumentDetails {
    content: string;
    cursorPosition: number;
	fileExtension?: string;
}

interface PromptConfig {
    requestType: 'inline' | 'general';
    instruction?: string;
	language?: string;
}

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


export { preparePrompt, DocumentDetails, PromptConfig };
