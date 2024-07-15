import LargeLanguageModelProvider from './llmProvider';
import gemini from './providers/gemini';
import openai from './providers/openai';
import mistral from './providers/mistral';
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
modelProvider.register(gemini);
modelProvider.register(openai);
modelProvider.register(mistral);

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
    await lock.acquire();

    let generatedContent: string = '';
    let shouldCache = false;
    let errors: any[] = [];
    let iteration = 0;
    log('Generating content for document: ' + documents);
    let documentDetails: DocumentDetails = documents.main;

    const cacheKey = generateCacheKey(documentDetails, promptConfig);
    const maxRetries = DEFAULTS.MAX_RETRIES;

    try {
        const { provider } = config;

        do {        
            if (iteration === 0) 
                log('Generating content from model:' + provider);
            else
                log('Fixing errors in generated content from model:' + provider + ' Attempt: ' + iteration);    
            
            const promptArray = await agentPlanner({ documents, promptConfig, config});
            // log('Prompt Array: ' + JSON.stringify(promptArray));
            const cachedResponse = getPromptFromCache(cacheKey);
            if (!cachedResponse) {
                generatedContent = await generateContentByProvider(provider, config, promptArray);
                if (promptConfig.requestType === 'inline') {
                    let documentContent = documentDetails.content;
                    let cursorPosition = documentDetails.cursorPosition? documentDetails.cursorPosition : documentContent.length;

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
        
        lock.release();
    }
}
