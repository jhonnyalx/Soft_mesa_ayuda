const controllerWatson={};



controllerWatson.postEnviarMensajeWex =async(req,res)=>{
  var mensaje=req.body.cedula;
  console.log(req);
console.log("IMPRESION POR CONSOLA");
  
    var respuesta={mensaje:""};
    if(mensaje=="1725002207"){
      respuesta="esta bien";
    }else{
      respuesta.mensaje="esta mal";
    }

    res.send({respuesta});
}



module.exports=controllerWatson;