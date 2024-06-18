import { generateContent as generateGeminiContent } from './gemini';
import { generateContent as generateOpenAIContent } from './openai';
import { generateContent as generateAnthropicContent } from './anthropic';
import { generateContent as generateHuggingfaceContent } from './huggingface';
import { getPromptFromCache, setPromptToCache } from '../utils/promptCache';
import { incorporateSuggestion } from '../utils/preparePrompt';
import { REGEX, PROVIDERS, DEFAULTS } from '../utils/constants';
import { generateCacheKey } from '../utils/cacheKeyGenerator';
import { cleanSuggestion } from '../utils/provider';
import { agentPlanner } from '../agent/agentPlanner';
import { ModelConfig, DocumentDetails, PromptConfig } from '../utils/types';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { GLOBAL_STATE } from '../../state';
import { Lock } from '../utils/lock';
import { log } from '../../state';
import { handleConcertoDocumentChange } from '../../documents/concertoHandler';

const lock = new Lock();

async function generateContentByProvider(provider: string, config: ModelConfig, promptArray: Array<{ content: string, role: string }>): Promise<string> {
    switch (provider) {
        case PROVIDERS.GEMINI:
            return await generateGeminiContent(config, promptArray);
        case PROVIDERS.OPENAI:
            return await generateOpenAIContent(config, promptArray);
        case PROVIDERS.ANTHROPIC:
            return await generateAnthropicContent(config, promptArray);
        case PROVIDERS.HUGGINGFACE:
            return await generateHuggingfaceContent(config, promptArray);
        default:
            throw new Error('Invalid model name specified in config');
    }
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

export async function generateContent(config: ModelConfig, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string> {

	await lock.acquire();

	let generatedContent: string = '';
	let shouldCache = false;
	let errors: any[] = [];
	let iteration = 0;

	const cacheKey = generateCacheKey(documentDetails, promptConfig);
	const maxRetries = DEFAULTS.MAX_RETRIES;

	try {
		const { provider } = config;

		do {		
			if (iteration === 0) 
				log('Generating content from model:' + provider);
			else
				log('Fixing errors in generated content from model:' + provider + ' Attempt: ' + iteration);	
			
			const promptArray = await agentPlanner({ documentDetails, promptConfig });
			const cachedResponse = getPromptFromCache(cacheKey);

			if (!cachedResponse) {
				generatedContent = await generateContentByProvider(provider, config, promptArray);
				if (promptConfig.requestType === 'inline') {
					const filteredResponse = cleanSuggestion(documentDetails.content, documentDetails.cursorPosition, generatedContent.replace(REGEX.COMMENT, ''));
					generatedContent = filteredResponse;
					const updatedContent = incorporateSuggestion(documentDetails.content, documentDetails.cursorPosition, generatedContent);
					errors = await handleErrors(updatedContent, promptConfig, documentDetails, iteration);
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
