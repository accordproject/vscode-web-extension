export interface DocumentDetails {
    content: string;
    cursorPosition: number;
	fileExtension?: string;
}

export interface PromptConfig {
    requestType: 'inline' | 'general';
    instruction?: string;
	language?: string;
    previousContent?: string;
    previousError?: any;
}

export interface AgentPlannerParams {
    documentDetails: DocumentDetails;
    promptConfig: PromptConfig;
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