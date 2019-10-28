var fs=require("fs");
var validaciones={};






  validaciones.leerReglasTecniseguros= function(tipo){
    var data=JSON.parse(fs.readFileSync("CATEGORIAS.json", 'utf-8'));
    var obj=[]
    for(var i in data){
      
      if(data[i].TIPO==tipo.toUpperCase()){
        for(var j in data[i].SOLUCIONES){
          //console.log(data[i].SOLUCIONES)
          obj.push({"label":data[i].SOLUCIONES[j].PROBLEMA, "value": {
            "input": {
              "text": data[i].SOLUCIONES[j].PROBLEMA
            }
          }
         })
         //console.log(obj);
        }
        
      }
    }
    return obj;

}

validaciones.listarSoluciones= function(tipo,problema){
  var data=JSON.parse(fs.readFileSync("CATEGORIAS.json", 'utf-8'));
  var obj=[]
  for(var i in data){
    if (data[i].TIPO == tipo.toUpperCase()) {
      for(var j in data[i].SOLUCIONES){
        if (data[i].SOLUCIONES[j].PROBLEMA==problema) {
          obj.push(data[i].SOLUCIONES[j].soluciones)
        }
      }
    }
  }
  return obj;
}

module.exports=validaciones