let binaryen = require('binaryen');
let type = require("./type");

/* STATEMENTS */

class Return{
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

class Let{
  constructor(name, expr, context){
    this.name = name;
    this.expr = expr;
    this.context = context;
    this.context.addVar(this.name, this.expr.getType())
  }
  compile(mod, context){
    let index = this.context.getVarByName(this.name).index;
    return mod.setLocal(index, this.expr.compile(mod, context));
    //throw new Error("not implemented");
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

class Constant{
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

 class Variable{
  constructor(name, context){
    this.name = name;
    this.context = context;
  }
  compile(mod){
    let info = this.context.getVarByName(this.name);
    console.log("Compile var info:", info);
    return mod.getLocal(info.index, info.type.getWasmType());
  }
  getType(){
    return this.context.getVarByName(this.name).type;
  }
  getFunctionReturnType(){
    return this.getType();
  }
}

class Block{
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

function parseAst(ast, context){
    if(ast.length > 1){
      let parsedChildren = [];
      ast.forEach((line)=>{
        parsedChildren.push(parseStatement(line, context));
      });
      return new Block(parsedChildren);
    }else if(ast.length == 1){
      let line = ast[0];
      return parseStatement(line, context);
      console.log("code ast:", line);
    }else{
      return null;
    }
}

function parseStatement(ast, context){
  if(ast.statementType == 'return'){
    return new Return(parseExpression(ast.value, context));
  }else if(ast.statementType == 'let'){
    let expr = parseExpression(ast.value, context);
    return new Let(ast.varName, expr, context);
  }else{
    throw new Error("Unknown statement: " + JSON.stringify(ast, null, 3));
  }
}

function parseExpression(ast, context){
  if(!ast){
    return null;
  }
  if(ast.expressionType == "constant"){
    return new Constant(ast.constantType, ast.value);
  }else if(ast.expressionType == "variable"){
    return new Variable(ast.name, context);
  }else{
    throw new Error("Unknown ast expression: " + JSON.stringify(ast));
  }
}

module.exports = {
  parseAst: parseAst,
  Let: Let,
  Block: Block,
  Variable: Variable,
  Constant: Constant,
  Return: Return
};