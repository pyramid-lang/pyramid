let Module = require('../model/module');
let Function = require('../model/function');
let code = require('../model/code');

class AstParser{
  static parse(ast){
    let mod = new Module();

    for(let a=0; a<ast.length; a++){
      let node = ast[a];
      // console.log("Function ast:", JSON.stringify(node));
      if(node.type == "function"){
        let codeModel = AstParser.parseCode(node.body);
        let func = new Function(node.name, codeModel);
        mod.addFunction(func);
      }else{
        console.log("other:", node);
      }
    }
    return mod;
  }

  static parseCode(ast){
    if(ast.length > 1){
      let parsedChildren = [];
      ast.forEach((line)=>{
        parsedChildren.push(AstParser.parseStatement(line));
      });
      return new code.Block(parsedChildren);
    }else if(ast.length == 1){
      let line = ast[0];
      return AstParser.parseStatement(line);
      console.log("code ast:", line);
    }else{
      return null;
    }
  }

  static parseStatement(ast){
    if(ast.statementType == 'return'){
      return new code.Return(AstParser.parseExpression(ast.value));
    }else if(ast.statementType == 'let'){
      return new code.Let(ast.varName, AstParser.parseExpression(ast.value));
    }else{
      throw new Error("Unknown statement: " + JSON.stringify(ast, null, 3));
    }
  }
  static parseExpression(ast){
    if(!ast){
      return null;
    }
    if(ast.expressionType == "constant"){
      return new code.Constant(ast.constantType, ast.value);
    }else{
      throw new Error("Unknown ast expression: " + JSON.stringify(ast));
    }
  }
}

module.exports = AstParser;