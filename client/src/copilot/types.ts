export interface DocumentDetails {
    content: string;
    cursorPosition: number;
    fileExtension?: string;
}

export interface PromptConfig {
    requestType: string;
    language: any;
	instruction?: string;
}

export interface ModelConfig {
    provider: string;
    llmModel: string;
    apiUrl: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    accessToken: string;
}

