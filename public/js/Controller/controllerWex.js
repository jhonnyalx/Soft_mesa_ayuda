const controllerWatson={};
var documentos=require('../services/leerDocumento');


controllerWatson.postEnviarMensajeWex =async(req,res)=>{  
  var json={"respuesta":await decisionWex(req.body)};
    res.send(json);
}

function decisionWex(data){
  switch (data.bandera) {
    case "AUTENTIFICACION":
      break;
    case "LISTA_CATEGORIAS":
       return documentos.leerReglasTecniseguros();
    default:
      break;
  }
}




module.exports=controllerWatson;