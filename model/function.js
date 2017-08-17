let binaryen = require('binaryen');
let code = require("./code");
let type = require("./type");

class Function{
  constructor(name, body){
    this.name = name;
    this.body = body || new code.Block([]);
  }

  getName(){
    return this.name;
  }

  getReturnType(){
    return this.body.getFunctionReturnType();
  }

  compile(mod){
    console.log("Compiling function:", this);
    let returnType = this.getReturnType();
    let funcType = mod.addFunctionType(this.name, returnType.getWasmType(), []);
    let code = this.body.compile(mod);
    // console.log("Compiled code:", code);
    // let code = mod.return(mod.i32.const(1234));
    let func = mod.addFunction(this.name, funcType, [], code);
    mod.addExport(this.name, this.name);
    console.log("funcType:", funcType);
  }
}

module.exports = Function;