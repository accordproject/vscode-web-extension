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

export interface MistralAIEmbeddings {
    embeddings: number[];
}

export interface ModelEmbeddings {
    fileName: string;
    fileContent: string;
    gemini: GeminiEmbeddings;
    openai: OpenAIEmbeddings;
    mistralai: MistralAIEmbeddings;
}

export interface ModelsEmbeddingsData {
    [key: string]: ModelEmbeddings;
}

export interface EmbeddingsTemplates {
    gemini: any; 
    openai: any;
    mistralai: any;
}

export interface TemplateContent {
    content: string;
    embeddings?: EmbeddingsTemplates;
}

export interface TemplateEmbeddings {
    [templateName: string]: {
        model: TemplateContent;
        grammar: TemplateContent;
        sample: TemplateContent;
    };
}