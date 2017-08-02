let grammar = require('./grammar.js');
let binaryen = require('binaryen');
let fs = require('fs');

let outputFile = "hello_world.wasm";

require('get-stdin')().then((str)=>{
  let ast = grammar.parse(str);
  let module = generateWasmModule(ast);
  let binary = module.emitBinary();
  runWasm(binary);
  // fs.writeFile(outputFile, new Buffer(binary), 'binary', function(err){
  //   if(err){
  //     console.log("Error:", err);
  //   }else{
  //     console.log("DONE");
  //   }
  // });
}).catch(err=>{
  console.log("Err:", err);
});

function generateWasmModule(ast){
  let mod = new binaryen.Module();
  for(let i=0; i<ast.length; i++){
    let info = ast[i];
    addFunction(mod, info);
  }
  return mod;
}

function addFunction(mod, info){
  console.log("Add function:", info);
  let name = info.name;

  let funcType = mod.addFunctionType(name, binaryen.i32, []);
  let func = mod.addFunction(name, funcType, [], [
    mod.return(mod.i32.const(1234)),
  ]);
  mod.addExport(name, name);
  console.log("funcType:", funcType);
}

function runWasm(binary){
  let imports = {};
  WebAssembly.instantiate(binary, imports).then((result)=>{
    let instance = result.instance;
    let mainFunc = instance.exports.main;
    if(mainFunc){
      mainFunc();
      console.log("Finished running.");
    }else{
      console.log("No 'main' function found");
    }
  });

}