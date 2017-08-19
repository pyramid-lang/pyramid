
{
  function name(name, x){
    return {
      name: name,
      data: x
    }
  }
  function concat(x1, x2){
    if(x1 == null){
      return []
    }else{
      return [x1].concat(x2);
    }
  }
}


/*debug = output:start {return JSON.stringify(output, null, 2);}*/
start = functionList?

importList = _* x1:import HS* x2:(VS1 x:import {return x})* _* {return [x1].concat(x2)}

import = "import" _+ importName

functionList = _* x1:function HS* x2:(VS1 x:function {return x})* _* {return [x1].concat(x2)}

function = "func" _+ name:funcName _* "(" _* params:funcParams _* ")" _* "{" _* body:funcBody _* "}" {
  return {
    type: "function",
    name: name,
    params: params,
    body: body
  }
}

funcParams = ""
funcBody = _* x1:statement? HS* x2:(VS HS* x:statement {return x})* _* {return concat(x1, x2)}

statement = (statementReturn / statementDeclareVariable)

statementReturn = "return" _+ expr:expr? {
  return {
    statementType: "return",
    value: expr
  }
}

statementDeclareVariable = "let" _+ name:varName _* "=" _* expr:expr {
  return {
    statementType: "let",
    varName: name,
    value: expr
  }
}

expr = exprAtom

/*exprBool = exprAtom _* opBool _* exprBool / exprAtom*/
exprAtom = constantBoolean / constantU32

constantBoolean = x:("true" / "false"){
  return {
    expressionType: "constant",
    constantType: "bool",
    value: x == "true"
  }
}

constantU32 = x:$([0-9]+){
  return {
    expressionType: "constant",
    constantType: "u32",
    value: parseInt(x)
  }
}

opBool = "|" / "&"
opCompare = "<" / ">"/ "<="/ ">="/ "=="/ "!="
opSum = "+"/ "-"
opMul = "*"/ "/"/ "%"

primitiveType = "bool"

importName = $(varName)
funcName = $(varName)
varName = $([a-z]*)

VS1 = HS* VS+ _*
HS = ' ' / '\t'
VS = '\r' / '\n'
_ = HS / VS