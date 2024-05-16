import * as vscode from 'vscode';

export function getDummySuggestion(prompt: string): string {

	const config = vscode.workspace.getConfiguration('cicero-vscode-extension');
    const apiKey = config.get<string>('apiKey');
    const apiUrl = config.get<string>('apiUrl');
    const modelName = config.get<string>('modelName');
    const maxTokens = config.get<number>('maxTokens');
    const temperature = config.get<number>('temperature');
    const topP = config.get<number>('topP');
    const additionalParams = config.get<any>('additionalParams');

    // // Construct the API call using the user-provided configuration
    // const response = await fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${apiKey}`
    //     },
    //     body: JSON.stringify({
    //         model: modelName,
    //         prompt: prompt,
    //         max_tokens: maxTokens,
    //         temperature: temperature,
    //         top_p: topP,
    //         ...additionalParams
    //     })
    // });

    // const data = await response.json();
    // return data.choices[0].text.trim();

	// For now, return a dummy suggestion
	// In the future, this function will call the corresponding LLM's API
	return 'This is a dummy suggestion';
}