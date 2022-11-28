import * as ts from "typescript";
import * as tsvfs from "@typescript/vfs";
import * as lzstring from "lz-string";

import { log } from "../state";
import { ModuleKind } from '@ts-morph/common';

export async function compile(code: string) {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2015,
    module: ModuleKind.CommonJS,
    allowJs: false,
    strict: true
  };

  const fsMap = await tsvfs.createDefaultMapFromCDN(
    compilerOptions,
    ts.version,
    false, // do not cache as localStore doesn't exist inside VSCode language server
    ts,
    lzstring
  );
  const auxCode = `// this is a file.
  export type Thing = {
      name:string;
  }

  export function print(thing:Thing) {
    console.log(JSON.stringify(thing));
  }`;
  fsMap.set('index.ts', code);
  fsMap.set('util.ts', auxCode);

  const system = tsvfs.createSystem(fsMap);
  const env = tsvfs.createVirtualTypeScriptEnvironment(system, ["index.ts"], ts, compilerOptions);

  // const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts);

  // const auxSourceFile = ts.createSourceFile('foo.ts', auxCode, ts.ScriptTarget.ES2015, /*setParentNodes */ true);
  // host.updateFile(auxSourceFile);

  // const program = ts.createProgram({
  //   rootNames: [...fsMap.keys()],
  //   options: compilerOptions,
  //   host: host.compilerHost
  // });

  // This will update the fsMap with new files
  // for the .d.ts and .js files
  const out = env.languageService.getEmitOutput('index.ts');
  out.outputFiles.forEach( f => log(`${f.name}: ${f.text}`));

  // const emitResult = program.emit();

  // const allDiagnostics = ts
  //   .getPreEmitDiagnostics(program)
  //   .concat(emitResult.diagnostics);

  // allDiagnostics.forEach(diagnostic => {
  //   if (diagnostic.file) {
  //     if (!diagnostic.file.fileName.startsWith('/lib.')) {
  //       const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
  //       const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  //       log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  //     } else {
  //       log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  //     }
  //   }
  // });

  // const exitCode = emitResult.emitSkipped ? 1 : 0;
  // log(`Emit exiting with code '${exitCode}'.`);

  // // Now I can look at the AST for the .ts file too
  // // const index = program.getSourceFile("index.ts");
  // log(`${fsMap.get('index.js')}`);
  // log(`${fsMap.get('util.js')}`);
}
