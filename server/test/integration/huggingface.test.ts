import { generateContent } from '../../src/copilot/api/llmModelManager'; 
import { expect } from 'chai';
import 'dotenv/config';
import { getTestCases } from '../testcases';

// Load config from environment variable
const configString = process.env.HUGGINGFACE_CONFIG;
const config = configString ? JSON.parse(configString) : null;

// Load test cases
const testCases = getTestCases(config);

describe('Hugging Face API', function() {
    this.timeout(10000); // Set timeout to 10 seconds

    testCases.forEach(testCase => {
        it(`should generate content for: ${testCase.description}`, async function() {
            const generatedContent = await generateContent(config, testCase.documentDetails, testCase.promptConfig);
            expect(generatedContent).to.be.a('string');
        });
    });
});
