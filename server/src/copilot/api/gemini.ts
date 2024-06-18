import axios from 'axios';
import { integer } from 'vscode-languageserver';
import {log} from '../../state';
import { LLM_ENDPOINTS } from '../utils/constants';
import { ModelConfig } from '../utils/types';

/*
	API request to generate content using the Gemini model: 
	Sample Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
	Documentation: https://ai.google.dev/api/rest/v1beta/models/generateContent 
	based on the API documentation, these interfaces are used to generate content using the Gemini models
*/

interface GenerateContentRequest {
	contents: {
	  parts: { text: string }[];
	}[];
	generationConfig?: {
	  temperature?: number;
	  maxOutputTokens?: number;
	  topP?: number;
	  topK?: integer;
	};
}

function createGenerateContentRequest(promptArray: { content: string; role: string }[], config: ModelConfig): GenerateContentRequest {
	const { additionalParams } = config;

	const generationConfig: { 
		temperature?: number;
		maxOutputTokens?: number;
		topP?: number;
		topK?: integer;
	} = {};

	if (additionalParams?.temperature !== undefined) generationConfig.temperature = additionalParams.temperature;
    if (additionalParams?.maxTokens !== undefined) generationConfig.maxOutputTokens = additionalParams.maxTokens;
    if (additionalParams?.topP !== undefined) generationConfig.topP = additionalParams.topP;
    if (additionalParams?.topK !== undefined) generationConfig.topK = additionalParams.topK;

	const contents = promptArray.map(item => ({
        parts: [{ text: item.content }],
        role: item.role === 'user' ? 'user' : 'model'
    }));

	const request: GenerateContentRequest = {
		contents: contents,
		generationConfig: generationConfig
	};

	return request;
}

function replaceModelInApiUrl(apiUrl: string, llmModel: string): string {
	const regex = /\/models\/[^:]+/;
	return apiUrl.replace(regex, `/models/${llmModel}`);
}

// API call to generate content using the Gemini model
export async function generateContent(config: any, promptArray: { content: string; role: string }[] ): Promise<string> {

	let { apiUrl, accessToken, llmModel } = config;

	if(!apiUrl) 
		apiUrl = LLM_ENDPOINTS.GEMINI;

	const updatedApiUrl = replaceModelInApiUrl(apiUrl, llmModel);
	const request: GenerateContentRequest = createGenerateContentRequest(promptArray, config);

	try {
		const response = await axios.post<any>(
		`${updatedApiUrl}?key=${accessToken}`,
		request,
		{
			headers: {
			'Content-Type': 'application/json'
			}
		}
		);

		if (response.status === 200 && response.data.candidates.length > 0) {

			let generatedContent = response.data?.candidates[0]?.content;
			let text = generatedContent?.parts[0]?.text;
			return text;
		} else {
			log('Error: Invalid status code or no candidates returned');
			log('Response Status: ' + response.status + ', Response Data: '+ response.data);
			throw new Error('Failed to generate content');
		}
	} catch (error: any) {
		log('Error generating content: ' + error?.message + ', for the request:' + request);
		log('Response Data: ' + JSON.stringify(error?.response?.data));
		throw new Error('Failed to generate content due to an error');
	}
}

