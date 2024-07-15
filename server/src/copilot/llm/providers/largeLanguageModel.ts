import { Embedding } from '../../utils/types';

export interface LargeLanguageModel {

    getIdentifier(): string;

    generateContent(config: any, promptArray: { content: string; role: string }[]): Promise<string>;
	
    generateEmbeddings(config: any, text: string): Promise<Embedding[]>;
}