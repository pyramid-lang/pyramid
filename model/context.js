class Context{
  constructor(){
    this.localVars = [];
  }
  addVar(name, type){
    if(this.getVarByName(name)){
      throw new Error("Local variable '" + name + "' is already defined");
    }
    let newIndex = this.localVars.length;
    this.localVars.push({
      name: name,
      type: type
    });
    return newIndex;
  }

  getVarByIndex(index){
    return this.localVars[index];
  }

  getVarByName(name){
    for(let a=0; a<this.localVars.length; a++){
      let localVar = this.getVarByIndex(a);
      if(localVar.name == name){
        return {
          name: name,
          type: localVar.type,
          index: a
        };
      }
    }
    return null;
  }

  length(){
    return this.localVars.length;
  }
}

module.exports = Context;