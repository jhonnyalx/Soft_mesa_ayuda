const controllerWatson={};
var documentos=require('../services/leerDocumento');
var validaciones=require('../services/validaciones');
var watson = require('watson-developer-cloud');
var credencialesWex=require('../Conexion/credencialesWex');
const storage = require('node-sessionstorage')
var modelWatsonResultado=require('../Model/WatsonResultado');
const util = require('util');

var assistant = new watson.AssistantV1({
  iam_apikey: credencialesWex.principal.wconv_apikey,
  version: credencialesWex.principal.wconv_version_date,
  url: credencialesWex.principal.wconv_url
});

//llamada watson
controllerWatson.postllamadaWatson =async(req,res)=>{
  var mensaje=req.body.texto;
  var id=req.body.id;
  //console.log(storage.getItem(id));
  var context=new modelWatsonResultado(null);
    if(storage.getItem(id)!=undefined){
      context=storage.getItem(id);
    };
    
    var resWatson=await consultaWatson(mensaje,context,req,id);
    console.log(resWatson.context.system.dialog_stack);
    //await decisionDialogos(resWatson,req);
    //await telegram.enviarTexto(resWatson);
    res.send({resWatson});
}
async function consultaWatson(mensaje,contexto,req,id){
  var watsonPromise = util.promisify(assistant.message.bind(assistant));
  var conversacion = await watsonPromise.call(assistant, {
    workspace_id: credencialesWex.principal.wconv_workspaceId,
    input: {'text': mensaje},
    context:contexto
  }); 
  storage.setItem(id, conversacion.context)
  //req.session.context=conversacion.context;

  
  return conversacion;
}
///webhook
controllerWatson.postEnviarMensajeWex =async(req,res)=>{  
  console.log(req.body)
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