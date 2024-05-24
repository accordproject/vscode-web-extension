interface ProviderResponse {
    content: string;
}

function extractCodeFromResponse(response: any): string {
	const text = response;
	const codeBlockMatch = text.match(/```[a-z]*\n([\s\S]*?)\n```/);
	if (codeBlockMatch) {
		return codeBlockMatch[1].trim();
	}
	return text.trim();    
}

export function filterInlineSuggestion(response: any): ProviderResponse {
    const content = extractCodeFromResponse(response);
    return { content };
}
