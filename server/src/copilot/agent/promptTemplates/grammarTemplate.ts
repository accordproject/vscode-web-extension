import { Documents } from '../../utils/types';
import { fetchRelevantGrammar } from '../../utils/embeddingsUtils';
import { templateEmbeddings } from '../../utils/embeddings';
import { ROLE_DESCRIPTION, DOCUMENTATION } from './guide';

export function getGrammarTemplate(documents: Documents, promptEmbedding: any, provider: any): Array<{ content: string; role: string }> {
    const { contextDocuments } = documents;
    const sampleContent = contextDocuments?.find(doc => doc.fileName === 'sample.md')?.content;

    // Fetch relevant grammar templates based on embeddings
    const relevantTemplates = fetchRelevantGrammar(templateEmbeddings, promptEmbedding, provider, 3);

    const systemMessage = ROLE_DESCRIPTION.GRAMMAR_GENERATOR;

    let userMessage = `We need to convert the provided sample markdown content into a grammar template file by identifying and replacing specific values with placeholders. `;
    userMessage += `Consider nouns, proper nouns, unique numerical values, and context-specific terms as potential placeholders. Use double curly braces {{}} for placeholders, and provide meaningful names based on the context.\n\n`;

    userMessage += DOCUMENTATION.TEMPLATE_PROCESSING;
    userMessage += DOCUMENTATION.GRAMMAR_TEMPLATE_GUIDELINES;

    userMessage += `### Example Grammar Templates\n`;
    for (const example of relevantTemplates) {
        userMessage += `Example:\n\`\`\`\n${example}\n\`\`\`\n\n`;
    }

    userMessage += `### Sample Markdown Content\n`;
    userMessage += `Here is the sample markdown file content for which we need to generate a grammar template:\n\n`;
    userMessage += `\`\`\`\n${sampleContent}\n\`\`\`\n\n`;

    userMessage += `Now, based on the information provided above, provide the grammar template from the sample markdown content by replacing specific values with placeholders. Only output the grammar template content.`;

    return [
        { 
            content: systemMessage, 
            role: "system" 
        },
        { 
            content: userMessage, 
            role: "user" 
        }
    ];
}
