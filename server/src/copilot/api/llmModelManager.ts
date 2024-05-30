import { preparePrompt, DocumentDetails, PromptConfig } from '../utils/preparePrompt';
import { generateContent as generateGeminiContent } from './gemini';
import { generateContent as generateOpenAIContent } from './openai';
import { generateContent as  generateAnthropicContent } from './anthropic';
import { generateContent as generateHuggingfaceContent } from './huggingface';
import { cleanSuggestion } from '../utils/provider';
import { getPromptFromCache, setPromptToCache } from '../utils/promptCache';
import { Lock } from '../utils/lock';
import {log} from '../../state';
const lock = new Lock();

export async function generateContent(config: any, documentDetails: DocumentDetails, promptConfig: PromptConfig): Promise<string> {

	await lock.acquire();

    try {
		const { modelName } = config;

    	let generatedContent: any;
		console.log('Generating content for model:', modelName);
        const prompt = preparePrompt(documentDetails, promptConfig);

		// Check if prompt is already in cache
		const cachedResponse = getPromptFromCache(prompt);
		
		if (!cachedResponse) {
			switch (modelName) {
				case 'gemini':
					generatedContent = await generateGeminiContent(config, prompt);
					break;
				case 'openai':
					generatedContent = await generateOpenAIContent(config, prompt);
					break;
				case 'anthropic':
					generatedContent = await generateAnthropicContent(config, prompt);
					break;
				case 'huggingface':
					generatedContent = await generateHuggingfaceContent(config, prompt);
					break;

				default:
					throw new Error('Invalid model name specified in config');
			}

			if (promptConfig.requestType === 'inline') {
				const filteredResponse = cleanSuggestion(documentDetails.content, documentDetails.cursorPosition, generatedContent);
				generatedContent = filteredResponse;
			}

			// Store the response in cache
			setPromptToCache(prompt, generatedContent);
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
