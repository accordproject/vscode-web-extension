import { Connection, Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

export type DiagnosticMap = Record<string, Set<Diagnostic>>;

// an empty range (this will highlight the first word in the document)
const FULL_RANGE = {
	start: { line: 0, character: 0 },
	end: { line: 0, character: 0 },
};

/**
 * Extract line numbers from exceptions
 * 
 * @param error the exception
 * @returns the range object
 */
function getRange(error: any) {
	if (error.fileLocation) {
		return {
			start: { line: error.fileLocation.start.line - 1, character: error.fileLocation.start.column },
			end: { line: error.fileLocation.end.line - 1, character: error.fileLocation.end.column }
		};
	}

	return FULL_RANGE;
}

export class Diagnostics {

	diagnosticMap:DiagnosticMap;

	public constructor() {
		this.diagnosticMap = {};
	}

	/**
	 * Declares that a file has no errors in the diagnostic map.
	   * We need to call this on all files that DO NOT have errors
	   * to ensure that error markers are removed.
	   * 
	   * @param fileName the uri of the file
	   */
	public clearErrors(fileName: string, type: string) {
		const errors = this.diagnosticMap[fileName];

		if (!errors) {
			this.diagnosticMap[fileName] = new Set();
		}
		else {
			errors.forEach(function (error) {
				if (error.source === type) {
					errors.delete(error);
				}
			});
		}
	}

	/**
	 * Converts an error (exception) to a VSCode Diagnostic and
	 * pushes it onto the diagnosticMap
	 * @param severity the severity level for the diagnostic
	 * @param textDocument the text document associated (the doc that has been modified)
	 * @param error the exception
	 * @param type the type of the exception
	 */
	public pushDiagnostic(severity: DiagnosticSeverity, textDocument: TextDocument, error: any, type: string) {

		let fileName = error.fileName;

		const diagnostic: Diagnostic = {
			severity,
			range: getRange(error),
			message: error.message,
			source: type
		};

		// last resort, we assume the error is related
		// to the document that was just changed
		if (!fileName) {
			fileName = textDocument.uri;
		}

		// add the diagnostic
		if (!this.diagnosticMap[fileName]) {
			this.diagnosticMap[fileName] = new Set<Diagnostic>();
		}

		this.diagnosticMap[fileName].add(diagnostic);
	}

	/**
	 * Sends the accumulated diagnostics to the language client
	 * @param connection 
	 */
	public send(connection:Connection) {
		// send all the diagnostics we have accumulated back to the client
		Object.keys(this.diagnosticMap).forEach((key) => {
			const fileDiagnostics: Set<Diagnostic> = this.diagnosticMap[key];
			connection.sendDiagnostics({ uri: key, diagnostics: [...fileDiagnostics] });
		});

	}
}