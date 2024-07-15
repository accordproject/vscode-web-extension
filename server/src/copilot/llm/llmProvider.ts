import { LargeLanguageModel } from './providers/largeLanguageModel';

class LargeLanguageModelProvider {
    private models: Map<string, LargeLanguageModel> = new Map();

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