import * as ts from "typescript";
import { log } from '../state';
import { createSystem } from "./system";
// import { libs } from "./tsLibs";

const compilerOptions: ts.CompilerOptions = {
	...ts.getDefaultCompilerOptions(),
	jsx: ts.JsxEmit.React,
	strict: false,
	target: ts.ScriptTarget.Latest,
	esModuleInterop: true,
	module: ts.ModuleKind.ES2015,
	suppressOutputPathCheck: true,
	skipLibCheck: true,
	skipDefaultLibCheck: true,
	moduleResolution: ts.ModuleResolutionKind.Node16
};

export const typecheck = (code: string) => {
	const dummyFilename = "file.ts";
	const files: { [name: string]: string } = {
		[dummyFilename]: code
	};

	const sys = createSystem({
		...files
	});

	const sourceFiles: { [name: string]: ts.SourceFile } = {};
	for (const name of Object.keys(files)) {
		sourceFiles[name] = ts.createSourceFile(
			name,
			files[name],
			compilerOptions.target || ts.ScriptTarget.Latest
		);
	}

	const compilerHost: ts.CompilerHost = {
		...sys,
		getCanonicalFileName: fileName => fileName,
		getDefaultLibFileName: () => "/lib.es2015.d.ts",
		getDirectories: () => [],
		getNewLine: () => sys.newLine,
		getSourceFile: filename => sourceFiles[filename],
		useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames
	};

	const languageServiceHost: ts.LanguageServiceHost = {
		...compilerHost,
		getCompilationSettings: () => compilerOptions,
		getScriptFileNames: () => Object.keys(files),
		getScriptSnapshot: filename => {
			const contents = sys.readFile(filename);
			if (contents) {
				return ts.ScriptSnapshot.fromString(contents);
			}

			return undefined;
		},
		getScriptVersion: fileName => "0",
		writeFile: sys.writeFile
	};

	const program = ts.createProgram([dummyFilename], compilerOptions, compilerHost);
	program.emit();

	const languageService = ts.createLanguageService(languageServiceHost);

	const diagnostics = languageService.getSemanticDiagnostics(dummyFilename);
	diagnostics.forEach( d => log(`${d.code} ${d.messageText}`));
	return diagnostics;
};
