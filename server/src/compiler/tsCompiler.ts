import * as ts from "typescript";
import * as tsvfs from "@typescript/vfs";
import * as lzstring from "lz-string";

import { log } from "../state";

export async function compile(code: string) {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2016,
    esModuleInterop: true,
  };

  const fsMap = await tsvfs.createDefaultMapFromCDN(
    compilerOptions,
    ts.version,
    false, // do not cache in localStorage
    ts,
    lzstring
  );
  fsMap.set("index.ts", code);

  const system = tsvfs.createSystem(fsMap);
  const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts);

  const program = ts.createProgram({
    rootNames: [...fsMap.keys()],
    options: compilerOptions,
    host: host.compilerHost,
  });

  // This will update the fsMap with new files
  // for the .d.ts and .js files
  program.emit();

  // Now I can look at the AST for the .ts file too
  // const index = program.getSourceFile("index.ts");

  const js = fsMap.get('index.js');

  if (js) {
    log(js);
  }
  else {
    log('Failed to compile');
  }
}
