/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import { MapDeclaration, ModelFile, ModelManager } from '@accordproject/concerto-core';

export function getWordFromPosition(i: number, x: string): string | undefined {
	const result = RegExp(`\\w*(?<=.{${i}})`).exec(x);
	return result ? result[0] : undefined;
}

export type LinePosition = {
	start: number;
	end: number;
};

export function splitLines(text: string) {
	return text.split('\n');
}

export function getLine(i: number, text: string) {
	const lines = splitLines(text);
	if (i < lines.length) {
		return lines[i];
	}
	else {
		return undefined;
	}
}

export function getWordBoundary(i: number, text: string): LinePosition {
	const prevSpace = text.substring(0, i).lastIndexOf(' ');
	const start = prevSpace >= 0 ? prevSpace + 1 : 0;
	const selected = getWordFromPosition(i, text);
	return {
		start,
		end: selected ? (start + selected.length) : text.length
	}
}

export function getMapValueType(map: MapDeclaration) {
	const model = map.getModelFile();
	const type = (map as any).getModelFile().getType((map as unknown as MapDeclaration).getValue().getType());
	return typeof type === 'string' ? type : type.getFullyQualifiedName
}

export function getModelFileByUri(modelManager: ModelManager, uri: string) : ModelFile|undefined {
	return (modelManager as any).getModelFiles().find((model: ModelFile) => model.getName() === uri);
}