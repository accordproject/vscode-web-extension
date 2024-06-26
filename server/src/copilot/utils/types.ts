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
    requestType: 'inline' | 'general' | 'fix' | 'model' | 'grammar';
    instruction?: string;
	language?: string;
    previousContent?: string;
    previousError?: any;
}

export interface AgentPlannerParams {
    documents: Documents;
    promptConfig: PromptConfig;
    config: ModelConfig;
}

export interface ModelConfig {
    provider: string;
    llmModel: string;
    modelConfig?: any;
    embeddingModel?: string;
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
    Fix = 'fix',
    Model = 'model',
    Grammar = 'grammar',
}

export enum Language {
    Concerto = 'Concerto',
    TypeScript = 'TypeScript',
    JavaScript = 'JavaScript',
    Ergo = 'Ergo'
}

export interface Embedding {
    embedding: number[];
}

export interface GeminiEmbeddings {
    embeddings: Embedding;
}

export interface OpenAIEmbeddings {
    embeddings: number[];
}

export interface TypesEmbeddings {
    fileName: string;
    gemini: GeminiEmbeddings;
    openai: OpenAIEmbeddings;
}

export interface EmbeddingsData {
    [key: string]: TypesEmbeddings;
}