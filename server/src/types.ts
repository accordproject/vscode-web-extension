import { ModelManager } from '@accordproject/concerto-core';
import { ScriptManager } from '@accordproject/ergo-compiler';
import { Command, Connection } from 'vscode-languageserver';
import { Diagnostics } from './diagnostics';

/**
 * Enumeration of file types. The types `File` and `Directory` can also be
 * a symbolic links, in that case use `FileType.File | FileType.SymbolicLink` and
 * `FileType.Directory | FileType.SymbolicLink`.
 */
export enum FileType {
	/**
	 * The file type is unknown.
	 */
	Unknown = 0,
	/**
	 * A regular file.
	 */
	File = 1,
	/**
	 * A directory.
	 */
	Directory = 2,
	/**
	 * A symbolic link to a file.
	 */
	SymbolicLink = 64
}

export type ReadDirectoryRecursiveResponse = {
	path: string;
	type: FileType;
}

export type LanguageServerState = {
	modelManager: ModelManager;
	diagnostics: Diagnostics;
	connection: Connection;
	isLoading: boolean;
	scriptManager?: ScriptManager;
}

export enum CommandType {
	CONCERTO_COMPILE,
}

export type CommandEvent = {
	command:CommandType;
}

export type ConcertoCompileEvent = CommandEvent & {
	payload: {
		target:string
	}
}

export type Commands = ConcertoCompileEvent;