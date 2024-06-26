export interface DocumentDetails {
    content: string;
    cursorPosition?: number;
    fileExtension?: string;
    fileName?: string;
}

export interface Documents {
    main: DocumentDetails;
    contextDocuments?: DocumentDetails[];
}

export interface PromptConfig {
    requestType: string; // 'inline' | 'general' | 'fix' | 'model' | 'grammar';
    language?: any;
	instruction?: string;
}

export interface ModelConfig {
    provider: string;
    llmModel: string;
    accessToken: string;
    apiUrl?: string;
    additionalParams?: AdditionalParams;
    embeddingModel?: string;
}

export interface AdditionalParams {
    [key: string]: any;
}

