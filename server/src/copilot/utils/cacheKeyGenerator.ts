import { DocumentDetails, PromptConfig, ModelConfig } from './types';

export function generateCacheKey(
    documentDetails: DocumentDetails,
    promptConfig: PromptConfig,
    modelConfig: ModelConfig
): string {
    const { content, cursorPosition } = documentDetails;
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
    ].join(':');
}
