import { LargeLanguageModel } from './providers/largeLanguageModel';
import gemini from './providers/gemini';
import mistral from './providers/mistral';
import openai from './providers/openai';
import ollama from './providers/ollama'; 

class LargeLanguageModelProvider {
    private models: Map<string, LargeLanguageModel> = new Map();

    constructor() {
        this.register(gemini);
        this.register(openai);
        this.register(mistral);
        this.register(ollama); 
    }
    
    register(model: LargeLanguageModel) {
        this.models.set(model.getIdentifier(), model);
    }

    unregister(id: string) {
        this.models.delete(id);
    }

    get(id: string): LargeLanguageModel | undefined {
        return this.models.get(id);
    }
}

export default LargeLanguageModelProvider;