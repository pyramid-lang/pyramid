// pegjs grammar.pegjs ; cat test_input.pmd | node pegtest.js

require('get-stdin')().then((str)=>{
  let output = require('./grammar.js').parse(str);
  console.log(output);
}).catch(err=>{
  console.log("Err:", err);
});
