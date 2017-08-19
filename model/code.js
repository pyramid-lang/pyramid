let binaryen = require('binaryen');
let type = require("./type");

/* STATEMENTS */

module.exports.Return = class{
  constructor(value){
    this.value = value;
  }
  compile(mod, context){
    let retValue = null;
    if(this.value){
      retValue = this.value.compile(mod, context);
    }
    return mod.return(retValue);
  }
  getType(){
    if(this.value){
      return this.value.getFunctionReturnType();
    }else{
      return type.VOID;
    }
  }
  getFunctionReturnType(){
    return this.getType();
  }
}

module.exports.Let = class{
  constructor(name, expr){
    this.name = name;
    this.expr = expr;
  }
  compile(mod, context){
    let index = context.addVar(this.name, this.expr.getType())
    return mod.setLocal(index, this.expr.compile(mod, context));
    // throw new Error("not implemented");
    //setLocal(index, value)

  }
  getType(){
    return type.VOID;
  }
  getFunctionReturnType(){
    return this.getType();
  }
}


/* EXPRESSIONS */

module.exports.Constant = class{
  constructor(type, value){
    this.type = type;
    this.value = value;
  }
  compile(mod, context){
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
      return type.BOOL;
    }else if(this.type == "u32"){
      return type.U32;
    }else{
      throw new Error("Unknown constant type: " + JSON.stringify(this));
    }
  }
  getFunctionReturnType(){
    return this.getType();
  }
}



module.exports.Block = class{
  constructor(children){
    this.children = children;
  }
  compile(mod, context){
    let compiledChildren = [];
    this.children.forEach((child)=>{
      compiledChildren.push(child.compile(mod, context));
    });
    let label = null;
    let type = null;
    return mod.block(label, compiledChildren, type);
  }

  getType(){
    let block_type = type.VOID;
    this.children.forEach((child)=>{
      if(block_type != type.UNREACHABLE){
        block_type = child.getType();
      }
    });
    return block_type;
  }

  getFunctionReturnType(){
    let return_type = this.getType();
    this.children.forEach((child)=>{
      if(child.getType() == type.UNREACHABLE){
        return_type = type.combine(return_type, child.getFunctionReturnType());
      }
    });
    return return_type;
  }
}