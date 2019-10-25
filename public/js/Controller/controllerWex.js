const controllerWatson={};



controllerWatson.postEnviarMensajeWex =async(req,res)=>{  
    res.send(decisionWex(req.body));
}

function decisionWex(data){
  switch (data.bandera) {
    case "AUTENTIFICACION":
      break;
    case "LISTA_CATEGORIAS":
       return listarCategoria(data);
    default:
      break;
  }
}

function listarCategoria(){
  var obj={"respuesta":"pruebas"};
  return obj;
}


module.exports=controllerWatson;