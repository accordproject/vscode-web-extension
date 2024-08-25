import { PromptConfig, ModelConfig, Documents } from './types';

export function generateCacheKey(
    documents: Documents,
    promptConfig: PromptConfig,
    modelConfig: ModelConfig
): string {
    const { main, contextDocuments } = documents;
    const { content, cursorPosition } = main;
    let contextContent = '';

    if (contextDocuments)
        contextContent = contextDocuments.map((doc) => doc.content).join('');

    const { requestType, language, instruction } = promptConfig;
    const { provider, llmModel, apiUrl, additionalParams, accessToken } = modelConfig;

    return [
        content,
        cursorPosition || content.length,
        requestType,
        language,
        instruction || '',
        provider,
        llmModel,
        apiUrl || '',
        accessToken,
        JSON.stringify(additionalParams || {}),
        contextContent,
    ].join(':');
}
