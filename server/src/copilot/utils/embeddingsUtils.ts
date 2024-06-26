import * as math from 'mathjs';
import { Documents, TypesEmbeddings } from './types';
import { log } from 'console';

function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = math.dot(vec1, vec2);
    const normVec1:any = math.norm(vec1);
    const normVec2:any = math.norm(vec2);
    return dotProduct / (normVec1 * normVec2);
}

export function fetchRelevantNamespaces(ctoFiles: { [key: string]: TypesEmbeddings }, promptEmbedding: number[], provider: string, topN = 4): string[] {
    log('Fetching relevant namespaces' + promptEmbedding );
    const namespaceSimilarities: [number, string, string][] = [];

    for (const [file, obj] of Object.entries(ctoFiles)) {
        let embeddings: number[] | undefined;

        if (provider === 'gemini' && obj.gemini?.embeddings?.embedding) {
            embeddings = obj.gemini.embeddings.embedding;
        } else if (provider === 'openai' && obj.openai?.embeddings) {
            embeddings = obj.openai.embeddings;
        }

        if (embeddings && Array.isArray(embeddings)) {
            const similarity = cosineSimilarity(promptEmbedding, embeddings);
            namespaceSimilarities.push([similarity, file, obj.fileName]);
        }
    }

    const topNamespaces = namespaceSimilarities.sort((a, b) => b[0] - a[0]).slice(0, topN);

    const relevantNamespaces = topNamespaces.map(([similarity, file, fileName]) => {
        return `${file}\n${fileName}\n`;
    });

    return relevantNamespaces;
}

export function generateEmbeddingPrompt(documents: Documents): string {
	const { contextDocuments } = documents;
  
	const grammarContent = contextDocuments?.find(doc => doc.fileName === 'grammar.tem.md')?.content;
	const packageContent = contextDocuments?.find(doc => doc.fileName === 'package.json')?.content;
	const requestContent = contextDocuments?.find(doc => doc.fileName === 'request.json')?.content;
  
	if (!grammarContent || !requestContent || !packageContent) {
	  throw new Error("Required documents are missing");
	}
  
	return `${grammarContent} ${requestContent} ${packageContent}`;
}
