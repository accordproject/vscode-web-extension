import LargeLanguageModelProvider from './llmProvider';
import { Embedding, ModelConfig, DocumentDetails, PromptConfig, Documents } from '../utils/types';
import { agentPlanner } from '../agent/agentPlanner';
import { getPromptFromCache, setPromptToCache } from '../utils/promptCache';
import { incorporateSuggestion } from '../utils/preparePrompt';
import { generateCacheKey } from '../utils/cacheKeyGenerator';
import { beautifyConcertoCode, cleanSuggestion } from '../utils/responseProcessor';
import { handleConcertoDocumentChange } from '../../documents/concertoHandler';
import { Lock } from '../utils/lock';
import { GLOBAL_STATE, log } from '../../state';
import { DEFAULTS, REGEX } from '../utils/constants';
import { TextDocument } from 'vscode-languageserver-textdocument';

const lock = new Lock();

const modelProvider = new LargeLanguageModelProvider();

async function generateContentByProvider(provider: string, config: ModelConfig, promptArray: Array<{ content: string, role: string }>): Promise<string> {
    const model = modelProvider.get(provider);
    if (!model) throw new Error('Invalid model name specified in config');
    return model.generateContent(config, promptArray);
}

export async function generateEmbeddingsByProvider(provider: string, config: ModelConfig, text: string): Promise<Embedding[]> {
    const model = modelProvider.get(provider);
    if (!model) throw new Error('Invalid model name specified in config');
    return model.generateEmbeddings(config, text);
}

async function handleErrors(updatedContent: string, promptConfig: PromptConfig, documentDetails: DocumentDetails, iteration: number): Promise<any[]> {
    const tempDocumentName = DEFAULTS.TEMP_DOCUMENT_EXTENSION + documentDetails.fileExtension;
    const tempDocument = TextDocument.create(tempDocumentName, promptConfig.language || '', iteration + 1, updatedContent);
    const changeEvent = { document: tempDocument };

    await handleConcertoDocumentChange(GLOBAL_STATE, changeEvent);
    const errors = [...GLOBAL_STATE.diagnostics.diagnosticMap[tempDocumentName] || []];

    if (errors.length !== 0) {
        log(`Errors found in the generated suggestion: ${errors.map(e => e.message).join(', ')}`);
        promptConfig.previousContent = updatedContent;
        promptConfig.previousError = errors;
    }

    return errors;
}

export async function generateContent(config: ModelConfig, documents: Documents, promptConfig: PromptConfig): Promise<string> {
    return lock.execute(async () => {
        let generatedContent = '';
        let shouldCache = false;
        let errors: any[] = [];
        let iteration = 0;
        const documentDetails: DocumentDetails = documents.main;

        log('Generating content for document :' + (documentDetails.fileName || ''));

        const cacheKey = generateCacheKey(documents, promptConfig, config);
        const maxRetries = DEFAULTS.MAX_RETRIES;

        try {
            const { provider } = config;

            do {        
                if (iteration === 0) 
                    log('Generating content from model:' + provider);
                else
                    log('Fixing errors in generated content from model:' + provider + ' Attempt: ' + iteration);    
                
                const cachedResponse = getPromptFromCache(cacheKey);
                if (!cachedResponse) {
                    const promptArray = await agentPlanner({ documents, promptConfig, config});
                    generatedContent = await generateContentByProvider(provider, config, promptArray);
                    if (promptConfig.requestType === 'inline') {
                        const documentContent = documentDetails.content;
                        const cursorPosition = documentDetails.cursorPosition? documentDetails.cursorPosition : documentContent.length;

                        const filteredResponse = cleanSuggestion(documentContent, cursorPosition, generatedContent.replace(REGEX.COMMENT, ''));
                        generatedContent = filteredResponse;
                        const updatedContent = incorporateSuggestion(documentContent, cursorPosition, generatedContent);
                        errors = await handleErrors(updatedContent, promptConfig, documentDetails, iteration);
                        iteration++;
                    } else if (promptConfig.requestType === 'model') {
                        generatedContent = beautifyConcertoCode(generatedContent);
                        errors = await handleErrors(generatedContent, promptConfig, documentDetails, iteration);
                        iteration++;
                    }
                    shouldCache = true;
                }
                else {
                    generatedContent = cachedResponse;
                }

            } while (errors.length > 0 && iteration < maxRetries);

            return generatedContent;

        } catch (error) {
            log('Error generating content: ' + error);
            throw error;
        } finally {
            if (shouldCache && generatedContent) 
                setPromptToCache(cacheKey, generatedContent);             
        }
    });    
}
