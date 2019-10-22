const controllerWatson={};



controllerWatson.postEnviarMensajeWex =async(req,res)=>{
  var mensaje=req.body.cedula;

  
    var respuesta={mensaje:""};
    if(mensaje=="1725002206"){
      respuesta="esta bien";
    }else{
      respuesta.mensaje="esta mal";
    }

    res.send({respuesta});
}



module.exports=controllerWatson;