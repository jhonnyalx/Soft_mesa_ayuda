var fs=require("fs");
var validaciones={};

  validaciones.leerReglasTecniseguros= function(){
    return JSON.parse(fs.readFileSync("CATEGORIAS.json", 'utf-8'));
}

module.exports=validaciones