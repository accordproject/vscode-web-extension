export interface DocumentDetails {
    content: string;
    cursorPosition: number;
	fileExtension?: string;
}

export interface PromptConfig {
    requestType: 'inline' | 'general' | 'fix';
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
    apiUrl?: string;
    accessToken: string;
    additionalParams?: AdditionalParams;
}

export interface AdditionalParams {
    [key: string]: any;
}

export enum RequestType {
    Inline = 'inline',
    General = 'general',
    Fix = 'fix'
}

export enum Language {
    Concerto = 'Concerto',
    TypeScript = 'TypeScript',
    JavaScript = 'JavaScript',
    Ergo = 'Ergo'
}