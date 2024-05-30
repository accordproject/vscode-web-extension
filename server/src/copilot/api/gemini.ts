import axios from 'axios';
import { integer } from 'vscode-languageserver';
import {log} from '../../state';
import { stringify } from 'querystring';
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

function createGenerateContentRequest(prompt: string, config: any): GenerateContentRequest {
	const { maxTokens, topP, topK, temperature } = config;

	const generationConfig: { 
	temperature?: number;
	maxOutputTokens?: number;
	topP?: number;
	topK?: integer;
	} = {};

	if (temperature !== undefined) generationConfig.temperature = temperature;
	if (maxTokens !== undefined) generationConfig.maxOutputTokens = maxTokens;
	if (topP !== undefined) generationConfig.topP = topP;
	if (topK !== undefined) generationConfig.topK = topK;

	const request: GenerateContentRequest = {
		contents: [
			{
			parts: [{ text: prompt }]
			}
		],
		generationConfig: generationConfig
	};

	return request;
}

// API call to generate content using the Gemini model
export async function generateContent(config: any, prompt: string): Promise<string> {

	const { apiUrl, accessToken } = config;
	const request: GenerateContentRequest = createGenerateContentRequest(prompt, config);

	try {
		const response = await axios.post<any>(
		`${apiUrl}?key=${accessToken}`,
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
			log('Error generating content:');
			log(stringify(response.data));
			log(response.data);
			console.error('Error: Invalid status code or no candidates returned');
			console.error('Response Status:', response.status, 'Response Data:', response.data);
			throw new Error('Failed to generate content');
		}
	} catch (error: any) {
		log('Error generating content:');
		log(error?.message);
		console.error('Error generating content:', error?.message, 'for the request:', request);
		throw new Error('Failed to generate content due to an error');
	}
}

