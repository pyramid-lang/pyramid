
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
start = _* x1:function HS* x2:(VS HS* x:function {return x})* _* {return [x1].concat(x2)}

function = "func" _+ name:funcName _* "(" _* params:funcParams _* ")" _* "{" _* body:funcBody _* "}" {
  return {
    name: name,
    params: params,
    body: body
  }
}

funcParams = ""
funcBody = _* x1:statement? HS* x2:(VS HS* x:statement {return x})* _* {return concat(x1, x2)}

statement = x:statementReturn

statementReturn = "return" _+ expr:expr {
  return {
    type: "Return",
    value: expr
  }
}

statementDeclareVariable = "var" _+ name:varName _* "=" _* expr:expr

expr = exprAtom

/*exprBool = exprAtom _* opBool _* exprBool / exprAtom*/
exprAtom = x:constantInteger {
  return {
    type: "ConstantInteger",
    value: x
  }
}

constantInteger = $("-"? [0-9]+)

opBool = "|" / "&"
opCompare = "<" / ">"/ "<="/ ">="/ "=="/ "!="
opSum = "+"/ "-"
opMul = "*"/ "/"/ "%"

funcName = $(varName)
varName = $([a-z]*)

HS = ' ' / '\t'
VS = '\r' / '\n'
_ = HS / VS