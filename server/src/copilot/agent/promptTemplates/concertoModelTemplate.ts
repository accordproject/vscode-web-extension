import { ROLE_DESCRIPTION } from '../../utils/constants';
import { fetchRelevantNamespaces } from '../../utils/embeddingsUtils';
import { embeddings } from '../../utils/embeddings';
import { Documents } from '../../utils/types';

export function getConcertoModelTemplate(documents: Documents, promptEmbedding: any, provider: any): Array<{ content: string, role: string }> {
	const { contextDocuments } = documents;

	let grammarContent = contextDocuments?.find(doc => doc.fileName === 'grammar.tem.md')?.content;
	let packageContent = contextDocuments?.find(doc => doc.fileName === 'package.json')?.content;
	let requestContent = contextDocuments?.find(doc => doc.fileName === 'request.json')?.content;

	const relevantNamespaces = fetchRelevantNamespaces(embeddings, promptEmbedding, provider);

	
    let prompt = "Generate a model CTO file using the provided markdown grammar, request JSON, and useful namespaces. Below are the details:\n\n";
	prompt += "### Package JSON\n";
    prompt += "This file contains the information about the template. Below is the package.json file:\n\n";
    prompt += `${packageContent}\n\n`;

	prompt += "### Grammar Markdown\n";
    prompt += "This file provides information about the variables for the asset which extends <clause/contract or some other alias as per package json template information>. The asset will have all the variables mentioned within the {{ }} brackets. Below is the grammar.md file:\n\n";
    prompt += `${grammarContent}\n\n`;

	prompt += "### Request JSON\n";
    prompt += "This file includes information about the transaction extending the Request module. It specifies the structure and data types of the transaction fields. Below is request.json:\n\n";
    prompt += `${requestContent}\n\n`;

	prompt += "### Useful Namespaces and Their Objects\n";
    prompt += "These files define the types of data types, which can be imported into the final model.cto and are declared types of various variables in assets, concepts and transactions. Use these namespaces to assign the proper data type to the variables where deems suitable and if none suits then either use primitive property types or create asset or concept if new type to capture variable is needed. Some of the matching namespaces which could be useful for model.cto generation are below:\n\n";
    for (const namespace of relevantNamespaces) {
        prompt += `${namespace}\n\n`;
    }

	prompt += "### Instructions and Example Model CTO\n"
    prompt += "Here is an annotated example Concerto model:\n\n\`\`\`\nnamespace <name of the namespace>@<version number> // the namespace and semantic version for the model. Semantic versions must be <major>.<minor>.<patch>. E.g. 'org.acme@1.0.0'.\n// All types must be defined in a single namespace. Use imports, utilize useful namespaces each in new line.\n\n[abstract] concept/asset/transaction <name of concept/asset/transaction> identified by <identifying field name> { // defines a new concept/asset/transaction, with a name. A concept may be declared as abstract. A concept may have an identifying property.\n  o <property type>[] <property name> [optional] // add a property to a concept. For example, 'o String firstName optional' defines a property called 'firstName' of type 'String' that is optional. Add '[]' to the end of the type name to make the property an array. \n  // Primitive property types are: DateTime, String, Long, Double, Integer, Boolean\n  --> <relationship type> <relationship name> // adds a relationship to a concept. concept/asset/transaction used in a relationship must have an identifying property.\n}\n\nscalar <name of scalar> extends <primitive type> // defines a scalar, a reusable primitive property\n\nenum <name of enum> { // defines an enumeration of values\n  o <value 1> // defines an enumerated value. enum values must only contain the letter A-Za-z0-9. They must not start with a number. They may not contain quotes or spaces.\n  o <value 2>\n}\n\n[abstract] concept <concept name> extends <super class> { // defines a concept that extends another concept\n}\n\`\`\`\n\nConcept and enumeration names within a model must be unique.\n,};"

    prompt += "Follow the above instructions and refer to the example model CTO to generate the desired model CTO. Ensure to use the types defined in the namespaces and create a high-level contract model as demonstrated in the example. For example:\n\n"
    prompt += "namespace org.accordproject.helloworld\nimport org.accordproject.contract.* from https://models.accordproject.org/accordproject/contract.cto\nimport org.accordproject.runtime.* from https://models.accordproject.org/accordproject/runtime.cto\ntransaction MyRequest extends Request { o String input }\ntransaction MyResponse extends Response { o String output }\n/**\n * The template model\n */\nasset HelloWorldClause extends Clause {\n/**\n * The name for the clause\n */\no String name\n}\n// this is a change!\n\n";

    // Provide the output format and instructions for generating the model CTO
    prompt += "### Output Format\n";
    prompt += "Generate the model CTO file by creating appropriate concepts, transactions, assets, and relationships based on the provided information. Ensure to:\n";
    prompt += "- Utilize the grammar markdown for accessing the fields in contract/clause template. For all the variables in grammar file, we have one asset which extends <clause/contract or some other alias as per package json template information> which will translate to something <asset/concept> extends <clause/contract>{stick to variables in grammar.md only with appropriate types}.\n";
    prompt += "- Incorporate the request JSON data into transaction definitions. For example, it could have a structure like transaction Request {variables in request.json}.\n";
    prompt += "- Import and use types from the useful namespaces.\n";
    prompt += "- Follow the structure and conventions shown in the example model CTO.\n\n";

    prompt += "### Generate Model CTO\n";
    prompt += "Now, based on the provided information, generate the model CTO file. Avoid unnecessary comments in the generated model.";
	return [
		{
			content: ROLE_DESCRIPTION.CONCERTO_GENERATOR,
			role: "system"
		},
		{
			content: prompt,
			role: "user"
		}
	];
}
