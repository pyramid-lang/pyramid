let binaryen = require('binaryen');
let Function = require('./function')

class Module{
  constructor(){
    this.imports = {};
    this.functions = {};
  }

  addFunction(func){
    let name = func.getName();
    if(this.functions[name]){
      throw new Error("Function already exists");
    }
    this.functions[name] = func;
  }
  getFunction(name){
    return this.functions[name];
  }
  compile(){
    let wasmMod = new binaryen.Module();
    Object.values(this.functions).forEach((func)=>{
      func.compile(wasmMod);
    });

    return wasmMod;
  }
  static parseAst(ast){
    let mod = new Module();

    for(let a=0; a<ast.length; a++){
      let node = ast[a];
      if(node.type == "function"){
        let func = Function.parseAst(node, mod);
        mod.addFunction(func);
      }else{
        console.log("unknown ast in module:", node);
      }
    }
    return mod;
  }
}

module.exports = Module;