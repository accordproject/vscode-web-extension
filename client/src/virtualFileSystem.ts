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

import * as vscode from "vscode";
const { fs } = vscode.workspace;
import { Uri } from "vscode";
import { LanguageClient } from 'vscode-languageclient/browser';

import { log } from './log';

export type ReadDirectoryRecursiveResponse = {
	path: string;
	type: vscode.FileType;
}

/**
 * Code heavily inspired by:
 * https://github.com/hirosystems/clarinet/blob/314f68590c043a2f03338553d74f81a91279003f/components/clarity-vscode/client/src/customVFS.ts#L25-L64
 */
export async function _readDirectoryRecursive(uri:Uri, results:ReadDirectoryRecursiveResponse[]) {
	const response = await fs.readDirectory(uri);
	for( let n=0; n < response.length; n++) {
		const item = response[n];
		const childUri = Uri.joinPath(uri, item[0]);
		if(item[1] === vscode.FileType.Directory) {
			const children = await _readDirectoryRecursive(childUri, results);
			results = results.concat(children);
		}
		results.push({
			path: childUri.toString(),
			type: item[1]
		});
		log(`Found '${childUri}' in workspace`);
	}

	return results;
}

export async function readDirectoryRecursive(uri:Uri) {
	const results:ReadDirectoryRecursiveResponse[] = [];
	return await _readDirectoryRecursive(uri, results);
}

export function fileArrayToString(bufferArray: Uint8Array) {
	return Array.from(bufferArray)
		.map((item) => String.fromCharCode(item))
		.join("");
}

export function stringToFileArray(str: string) {
	return Uint8Array.from(str.split("").map((s) => s.charCodeAt(0)));
}

function isValidReadEvent(e: any): e is { path: string } {
	return typeof e?.path === "string";
}

function isValidReadManyEvent(e: any): e is { paths: string[] } {
	return (
		Array.isArray(e?.paths) &&
		e.paths.every((s: unknown) => typeof s === "string")
	);
}

function isValidWriteEvent(e: any): e is { path: string; content: number[] } {
	return typeof e?.path === "string" && Array.isArray(e?.content);
}

export function initVFS(client: LanguageClient) {
	client.onRequest("vfs/exists", async (event: unknown) => {
		if (!isValidReadEvent(event)) throw new Error("invalid read event");
		try {
			await fs.stat(Uri.parse(event.path));
			return true;
		} catch {
			return false;
		}
	});

	client.onRequest("vfs/readFile", async (event: unknown) => {
		if (!isValidReadEvent(event)) throw new Error("invalid read event");
		return fileArrayToString(await fs.readFile(Uri.parse(event.path)));
	});

	client.onRequest("vfs/openFile", async (event: unknown) => {
		if (!isValidReadEvent(event)) throw new Error("invalid read event");
		log(`Opening document ${event.path}`);
		await vscode.workspace.openTextDocument(Uri.parse(event.path));
	});

	client.onRequest("vfs/readDirectoryRecursive", async (event: unknown) => {
		if (!isValidReadEvent(event)) throw new Error("invalid read event");
		return readDirectoryRecursive(Uri.parse(event.path));
	});

	client.onRequest("vfs/readFiles", async (event: any) => {
		if (!isValidReadManyEvent(event)) throw new Error("invalid read event");
		const files = await Promise.all(
			event.paths.map(async (p) => {
				try {
					const contract = await fs.readFile(Uri.parse(p));
					return contract;
				} catch (err) {
					console.warn(err);
					return null;
				}
			}),
		);
		return Object.fromEntries(
			files.reduce((acc, f, i) => {
				if (f === null) return acc;
				return acc.concat([[event.paths[i], fileArrayToString(f)]]);
			}, [] as [string, string][]),
		);
	});

	client.onRequest("vfs/writeFile", async (event: any) => {
		if (!isValidWriteEvent(event)) throw new Error("invalid write event");
		return fs.writeFile(Uri.parse(event.path), Uint8Array.from(event.content));
	});
}