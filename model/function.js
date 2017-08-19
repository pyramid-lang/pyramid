let binaryen = require('binaryen');
let code = require("./code");
let type = require("./type");
let Context = require("./context");

class Function{
  constructor(name, body, context){
    this.name = name;
    this.body = body || new code.Block([]);
    this.context = context;
  }

  getName(){
    return this.name;
  }

  getReturnType(){
    return this.body.getFunctionReturnType();
  }

  // getParams(){
  //   let output = [];
  //   for(let index=0; index<this.params.length; index++){
  //     output.push(this.context.getVarByIndex(index));
  //   }
  //   return output;
  // }
  getLocals(){
    let output = [];
    for(let index=0; index<this.context.length(); index++){
      output.push(this.context.getVarByIndex(index));
    }
    return output;
  }

  compile(mod){
    console.log("Compiling function:", this);
    let returnType = this.getReturnType();

    // let paramTypes = this.getParams();
    let funcType = mod.addFunctionType(this.name, returnType.getWasmType(), []);
    let code = this.body.compile(mod, this.context);
    let locals = this.getLocals().map((local)=>{
      return local.type.getWasmType();
    });
    let func = mod.addFunction(this.name, funcType, locals, code);
    mod.addExport(this.name, this.name);
    console.log("funcType:", funcType);
  }

  static parseAst(ast, module){
    let context = new Context();
    let codeModel = code.parseAst(ast.body, context);
    return new Function(ast.name, codeModel, context);
  }
}

module.exports = Function;