let binaryen = require('binaryen');

class Type{
  constructor(wasmType){
    this.wasmType = wasmType;
  }
  getWasmType(){
    return this.wasmType;
  }

  static combine(a, b){
    if(a == Type.UNREACHABLE){
      return b;
    }else if(b == Type.UNREACHABLE){
      return a;
    }else if(a === b){
      return a;
    }else{
      throw new Error("");
    }
  }
}

Type.BOOL = new Type(binaryen.i32);
Type.U32 = new Type(binaryen.i32);
Type.VOID = new Type(binaryen.none);
Type.UNREACHABLE = new Type(binaryen.none);

module.exports = Type;