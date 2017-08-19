/*
pegjs grammar.pegjs>grammar.js ; cat test_input.pmd | node pmd_runner.js
*/

let grammar = require('./grammar.js');
let binaryen = require('binaryen');
let fs = require('fs');
let Module = require('./model/module.js');

let outputFile = "hello_world.wasm";

require('get-stdin')().then((str)=>{
  let ast = grammar.parse(str);
  let module = Module.parseAst(ast);
  let wasmModule = module.compile();
  // console.log("Module:", module);
  // let wasmModule = generateWasmModule(ast);
  let binary = wasmModule.emitBinary();

  fs.writeFile(outputFile, new Buffer(binary), 'binary', function(err){
    if(err){
      console.log("Error writing WASM file:", err);
    }else{
      console.log("Wrote WASM file to disk");
      runWasm(binary);
    }
  });
}).catch(err=>{
  console.log(err);
});

function runWasm(binary){
  let imports = {};
  WebAssembly.instantiate(binary, imports).then((result)=>{
    let instance = result.instance;
    let mainFunc = instance.exports.main;
    if(mainFunc){
      let ret = mainFunc();
      console.log("Finished running: ", ret);
    }else{
      console.log("No 'main' function found");
    }
  }).catch(err=>{
    console.log(err);
  });
}