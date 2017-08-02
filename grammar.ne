@{%
function nth(index){
	return (d)=>{return d[index]};
}
function nthnth(index1, index2){
	return (d)=>{return d[index1][index2]};
}
function id2(data){
	return data[0][0];
}
function test(){
return "test";
}
function empty(){
	return null;
}
function obj(schema){
	return function(data){
		let output = {};
		Object.keys(schema).forEach(function(key) {
            output[key] = data[schema[key]];
        });
		return output;
	}
}
function obj2(schema){
	return function(data){
		let output = {};
		Object.keys(schema).forEach(function(key) {
            output[key] = data[schema[key]][0];
        });
		return output;
	}
}
function name(name){
	return function(data){
		return {
			name: name,
			data: data[0]
		}
	}
}
function makeString(data){
	data = data || "";
	if(data.constructor === Array){
		let output = "";
		data.forEach(function(x){output += makeString(x)});
		return output;
	}
	return data || "";
}
%}

sep[X, S] -> $X (($S):+ $X {%nthnth(1, 0)%}):* {% (d)=>{return [d[0][0]].concat(d[1])} %}
lineSep[X] -> sep[$X, NewLine] {% id %}
wsSep[X] -> sep[$X, WS]
pad[X, P] -> ($P):* $X ($P):*
paren[X] -> "(" _ $X _ ")"
exprChainAss[A, OP, B] ->  $A _ $OP _ $B {%(obj2({op: 2, left: 0, right: 4}))%}
                           | $B {%id2%}#Associative operations
exprChain[OP, X] -> $X _ $OP _ $X
                    | $X {%id%}#non-associative operations
optionalBlock[X] -> "{" pad[$X, WS] "}" | "{" (WS):* "}"
delimited[el, delim] -> $el ($delim $el {% nth(1) %}):* {%
    function(d) {
        return [d[0]].concat(d[1]);
    }
%}


Language -> sep[Statement, NewLine] _ {%id%}
Statement -> StatementDeclareVariable {% name("DeclareVariable") %}
             | IfStatement
			 | WhileLoop {% ()=>{return "statement"} %}
StatementDeclareVariable -> "var" __ LValue _ "=" _ Expr {% obj({left:2, right: 6}) %}
LValue -> VarName {% obj({name: 0}) %}

Expr -> ExprIf {%id%}

ExprIf -> IfStatement
		  | ExprOr {%id%}

ExprOr ->  exprChainAss[ExprOr, "|", ExprAnd] {%id%}
ExprAnd -> exprChainAss[ExprCompare, "&", ExprCompare] {%id%}
ExprCompare -> exprChain[OpCompare, ExprSum] {%id%}
ExprSum -> exprChainAss[ExprSum, OpSum, ExprMul] {%id%}
ExprMul -> exprChainAss[ExprMul, OpMul, ExprNegate] {%test%}
ExprNegate -> "!" ExprNegate {%id%}
              | ExprAtomic {%id%}
ExprAtomic -> paren[Expr] {%id%}
              | Constant {%id%}
			  | VarName {%id%}

OpBool -> "|" {%id%}| "&" {%id%}
OpCompare -> "<" {%id%} | ">" {%id%}| "<=" {%id%}| ">=" {%id%}| "==" {%id%}| "!=" {%id%}
OpSum -> "+" {%id%}| "-" {%id%}
OpMul -> "*" {%id%}| "/" {%id%}| "%" {%id%}

IfStatement -> IfSection (_ ElseIfSection):? (ElseSection):?

IfSection -> "if" _ ExprOr _ ReturnBlock
ElseIfSection -> "else" __ "if" _ ExprOr _ ReturnBlock
ElseSection -> "else" _ ReturnBlock

WhileLoop -> "while" _ ExprOr _ ReturnBlock

ReturnBlock -> optionalBlock[(
	lineSep[Statement] | lineSep[Expr] | lineSep[Statement] NewLineWhitespace Expr
)]

Constant -> IntegerConstant {%name("ConstantInteger")%}| FloatConstant {%name("ConstantFloat")%}
IntegerConstant -> "-":? [0-9]:+ {%makeString%}
FloatConstant -> "-":? [0-9]:+ "." [0-9]:+ {%makeString%}

VarName -> [a-z] [a-z0-9_]:* {% makeString %}

NewLine -> "\r":? "\n" {%empty%}
LineSpace -> " " {%empty%} | "\t" {%empty%}
WS -> NewLine {%empty%} | LineSpace {%empty%}
_ -> (WS):* {%empty%}
__ -> (WS):+ {%empty%}

#whitepsace with at least 1 newline
NewLineWhitespace -> (LineSpace):* NewLine (_ NewLine):? (LineSpace):* {%empty%}

PrimitiveType -> "bool" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "f64"
