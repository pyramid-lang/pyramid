let binaryen = require('binaryen');
let type = require("./type");

/* STATEMENTS */

module.exports.Return = class{
  constructor(value){
    this.value = value;
  }
  compile(mod){
    let retValue = null;
    if(this.value){
      retValue = this.value.compile(mod);
    }
    return mod.return(retValue);
  }
  getFunctionReturnType(){
    if(this.value){
      return this.value.getType();
    }else{
      return type.primitive.VOID;
    }
  }
}


/* EXPRESSIONS */

module.exports.Constant = class{
  constructor(type, value){
    this.type = type;
    this.value = value;
  }
  compile(mod){
    if(this.type == "bool"){
        return mod.i32.const(this.value);
    }if(this.type == "u32"){
      return mod.i32.const(this.value);
    }else{
      throw new Error("Unknown constant type: " + JSON.stringify(this));
    }
  }
  getType(){
    if(this.type == "bool"){
      return type.primitive.BOOL;
    }else if(this.type == "u32"){
      return type.primitive.U32;
    }else{
      throw new Error("Unknown constant type: " + JSON.stringify(this));
    }
  }
}



module.exports.Block = class{
  constructor(children){
    this.children = children;
  }
  compile(mod){
    let compiledChildren = [];
    this.children.forEach((child)=>{
      compiledChildren.push(child.compile(mod));
    });
    let label = null;
    let type = null;
    return mod.block(label, compiledChildren, type);
  }
}