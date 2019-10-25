const controllerWatson={};
var documentos=require('../services/leerDocumento');
var validaciones=require('../services/validaciones');

controllerWatson.postEnviarMensajeWex =async(req,res)=>{  
  var json={"respuesta":await decisionWex(req.body)};
    res.send(json);
}

function decisionWex(data){
  switch (data.bandera) {
    case "AUTENTIFICACION":
      return validaciones.validarCedula(data.input);
    case "LISTA_CATEGORIAS":
       return documentos.leerReglasTecniseguros(data.input);
    default:
      break;
  }
}




module.exports=controllerWatson;