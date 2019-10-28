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

//llamada watson decicionNodos
controllerWatson.postllamadaWatson =async(req,res)=>{
  var mensaje=req.body.texto;
  var id=req.body.id;
  //console.log(storage.getItem(id));
  var context=new modelWatsonResultado(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,false,null);
    if(storage.getItem(id)!=undefined){
      context=storage.getItem(id);
    };
    var resWatson=await consultaWatson(mensaje,context,req,id);
    await decisionNodos(resWatson);
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

///webhook Assistant
controllerWatson.postEnviarMensajeWex =async(req,res)=>{  
  //console.log(req.body)
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

function decisionNodos(watsonResultado){
  var entidad=watsonResultado.entities;
  var intencion=watsonResultado.intents;
  console.log("=======");
  console.log(watsonResultado.context.system.dialog_stack);
  console.log(watsonResultado.output.nodes_visited[0]);
  //console.log(watsonResultado);
  console.log("=======");
  //RECONOCE HARDWARE
  if (watsonResultado.output.nodes_visited[0]=="node_1_1572035571673") {
    var categorias = documentos.leerReglasTecniseguros(watsonResultado.input.text);
    var lista_categorias=[{response_type:"option",title:"Por favor seleccione una categoria 😉😉",options: []}];
    for(var i in categorias){
      lista_categorias[0].options.push(categorias[i]);
    }
    watsonResultado.output.generic=lista_categorias;
  }else if (watsonResultado.output.nodes_visited[0]=="node_7_1572302557648") {
    
  }
}

module.exports=controllerWatson;