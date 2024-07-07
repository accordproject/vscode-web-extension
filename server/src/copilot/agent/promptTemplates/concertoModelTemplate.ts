import { fetchRelevantNamespaces, fetchRelevantTemplates, getNamespaceMappings } from '../../utils/embeddingsUtils';
import { modelEmbeddings, templateEmbeddings } from '../../utils/embeddings';
import { Documents } from '../../utils/types';
import { ROLE_DESCRIPTION, DOCUMENTATION, MODEL_GENERATION_INSTRUCTIONS } from './guide';

export function getConcertoModelTemplate(documents: Documents, promptEmbedding: any, provider: any, promptConfig: any): Array<{ content: string, role: string }> {
    const { contextDocuments } = documents;
    const { previousContent, previousError } = promptConfig;

    let grammarContent = contextDocuments?.find(doc => doc.fileName === 'grammar.tem.md')?.content;
    let packageContent = contextDocuments?.find(doc => doc.fileName === 'package.json')?.content;

    const relevantNamespaces = fetchRelevantNamespaces(modelEmbeddings, promptEmbedding, provider, 3);
    const relevantTemplates = fetchRelevantTemplates(templateEmbeddings, promptEmbedding, provider, 2);
    const namespaceMappings = getNamespaceMappings(modelEmbeddings);

    let prompt = "Generate a model CTO file using the provided markdown grammar and package.json. Utilize the example templates of grammar-model pairs and the useful namespaces given below. Here are the details:\n\n";

    prompt += DOCUMENTATION.NAMESPACES;
    prompt += "### Correct Namespaces for Import\n";
    prompt += "Here are the correct namespaces that can be imported. Use these namespaces with the appropriate version as shown in the format below:\n";
    prompt += `\`\`\`\n${namespaceMappings}\n\`\`\`\n\n`;

    prompt += DOCUMENTATION.NAMESPACE_IMPORTS;

    prompt += "### Relevant Namespaces\n";
    prompt += "Some of the relevant namespaces that can be used in the model CTO are:\n";
    for (const namespace of relevantNamespaces) {
        prompt += `- ${namespace}\n`;
    }

    prompt += "### Example of Grammar and their corresponding Model CTO\n";
    prompt += "Here are some examples from relevant templates, after removing their imports:\n\n";
    for (const example of relevantTemplates) {
        prompt += `Example:\n\`\`\`\n${example}\n\`\`\`\n\n`;
    }
    
    prompt += DOCUMENTATION.NAMESPACE_INFORMATION;
    prompt += DOCUMENTATION.TRANSACTIONS;
    prompt += DOCUMENTATION.PACKAGE_JSON_INFO;
    prompt += "Below is the package.json file for which we need to generate model cto:\n\n";
    prompt += `\`\`\`\n${packageContent}\n\`\`\`\n\n`;

    prompt += DOCUMENTATION.GRAMMAR_MARKDOWN_DESCRIPTION;
    prompt += `\`\`\`\n${grammarContent}\n\`\`\`\n\n`;

    prompt += DOCUMENTATION.PROPERTY_DECLARATION_DESCRIPTION;
    prompt += MODEL_GENERATION_INSTRUCTIONS.INSTRUCTIONS;
    prompt += MODEL_GENERATION_INSTRUCTIONS.FINAL_CHECKLIST;

    prompt += "Generate the CTO file, ensuring all checklist items are met. Avoid comments in the model code and don't do any analysis. Just output the model CTO code.\n\n";

    let messageArray: Array<{ content: string, role: string }> = [
        {
            content: ROLE_DESCRIPTION.CONCERTO_GENERATOR,
            role: "system"
        },
        {
            content: prompt,
            role: "user"
        }
    ];

    if (previousContent) {
        messageArray.push({
            content: previousContent,
            role: "system"
        });
    }

    if (previousError) {
        let userMessage = `Fix the following errors in previously outputed cto model: ${previousError.map((e: any) => e.message).join('. ')}. Don't put comments in the code and remove all the previous comments present in the code.`;
        messageArray.push({
            content: userMessage,
            role: "user"
        });
    }

    return messageArray;
}
