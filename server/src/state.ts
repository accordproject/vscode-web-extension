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

import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';

import { ModelManager } from '@accordproject/concerto-core';
import { Diagnostics } from './diagnostics';
import { LanguageServerState } from './types';
import { ScriptManager } from '@accordproject/ergo-compiler';

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

/**
 * Globals maintained by the language server
 */
export const GLOBAL_STATE:LanguageServerState = {
	modelManager: new ModelManager({strict: true}),
	diagnostics: new Diagnostics(),
	connection: createConnection(messageReader, messageWriter),
	isLoading: false
};

GLOBAL_STATE.scriptManager = new ScriptManager('es6', GLOBAL_STATE.modelManager);

/**
 * Log a message to the connection, sending it back to the
 * Language Server Client, for display in an output window.
 * @param message 
 */
export function log(message:string) {
	if(GLOBAL_STATE.connection) {
		GLOBAL_STATE.connection.console.log(message);
	}
	else {
		console.log(message);
	}
}
