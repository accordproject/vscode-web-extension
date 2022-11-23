
declare module "@accordproject/ergo-compiler" {
	import { ModelManager } from '@accordproject/concerto-core';
	export class ScriptManager {
		constructor(target:string,modelManager:ModelManager, options?:any)
		createScript(identifier:string,language:string,contents:string) : any
		addScript(script:any) : void
		compileLogic(force?:boolean) : any
		getCombinedScripts() : string
		deleteScript(identifier:string) : void
		updateScript(script:any) : any
		getScript(identifier:string) : any | undefined
	}
  }