export interface DocumentDetails {
    content: string;
    cursorPosition: number;
    fileExtension?: string;
}

export interface PromptConfig {
    requestType: string; // 'inline' | 'general' | 'fix' 
    language?: any;
	instruction?: string;
}

export interface ModelConfig {
    provider: string;
    llmModel: string;
    accessToken: string;
    apiUrl?: string;
    additionalParams?: AdditionalParams;
}

export interface AdditionalParams {
    [key: string]: any;
}

