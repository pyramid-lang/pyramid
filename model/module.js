let binaryen = require('binaryen');

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
}

module.exports = Module;