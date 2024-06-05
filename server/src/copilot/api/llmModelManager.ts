import { preparePrompt, DocumentDetails, PromptConfig } from '../utils/preparePrompt';
import { generateContent as generateGeminiContent } from './gemini';
import { generateContent as generateOpenAIContent } from './openai';
import { generateContent as generateAnthropicContent } from './anthropic';
import { generateContent as generateHuggingfaceContent } from './huggingface';
import { getPromptFromCache, setPromptToCache } from '../utils/promptCache';
import { commentRegex } from '../agent/promptTemplates/inlineTemplate';
import { generateCacheKey } from '../utils/cacheKeyGenerator';
import { cleanSuggestion } from '../utils/provider';
import { agentPlanner } from '../agent/agentPlanner';
import { ModelConfig } from '../utils/types';
import { Lock } from '../utils/lock';
import { log } from '../../state';


const lock = new Lock();

export async function generateContent(config: ModelConfig, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string> {

	await lock.acquire();

	try {
		const { provider } = config;

		let generatedContent: any;
		log('Generating content for model:' + provider);

		const promptArray = await agentPlanner({ documentDetails, promptConfig });

		const cacheKey = generateCacheKey(documentDetails, promptConfig);

		// Check if prompt is already in cache
		const cachedResponse = getPromptFromCache(cacheKey);

		if (!cachedResponse) {
			switch (provider) {
				case 'gemini':
					generatedContent = await generateGeminiContent(config, promptArray);
					break;
				case 'openai':
					generatedContent = await generateOpenAIContent(config, promptArray);
					break;
				case 'anthropic':
					generatedContent = await generateAnthropicContent(config, promptArray);
					break;
				case 'huggingface':
					generatedContent = await generateHuggingfaceContent(config, promptArray);
					break;

				default:
					throw new Error('Invalid model name specified in config');
			}

			if (promptConfig.requestType === 'inline') {
				const filteredResponse = cleanSuggestion(documentDetails.content, documentDetails.cursorPosition, generatedContent.replace(commentRegex, ''));
				generatedContent = filteredResponse;
			}

			// Store the response in cache
			setPromptToCache(cacheKey, generatedContent);
		}
		else {
			generatedContent = cachedResponse;
		}

		return generatedContent;

	} catch (error) {
		log('Error generating content:');

		console.error('Error generating content:', error);
		throw error;
	} finally {
		lock.release(); // Release the lock after the operation is complete
	}

}
