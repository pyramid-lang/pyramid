let binaryen = require('binaryen');

class Type{
  constructor(wasmType){
    this.wasmType = wasmType;
  }
  getWasmType(){
    return this.wasmType;
  }
}

Type.primitive = {};
Type.primitive.BOOL = new Type(binaryen.i32);
Type.primitive.U32 = new Type(binaryen.i32);
Type.primitive.VOID = new Type(binaryen.none);

module.exports = Type;