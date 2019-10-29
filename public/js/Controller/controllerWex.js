const controllerWatson={};
var documentos=require('../services/leerDocumento');
var validaciones=require('../services/validaciones');
var watson = require('watson-developer-cloud');
var credencialesWex=require('../Conexion/credencialesWex');
const storage = require('node-sessionstorage')
var modelWatsonResultado=require('../Model/WatsonResultado');
const util = require('util');
var escribir=require('../services/escribirDocumento');

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
  var context=new modelWatsonResultado(null,null,null,null,null);
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
        var categorias = documentos.leerReglasTecniseguros(watsonResultado.context.tipo);
        var lista_categorias=[{response_type:"option",title:"Por favor seleccione una categoria 😉😉",options: []}];
        for(var i in categorias){
          lista_categorias[0].options.push(categorias[i]);
        }
      watsonResultado.output.generic=lista_categorias;
  }else if (watsonResultado.output.nodes_visited[0]=="node_3_1572367833504"||watsonResultado.output.nodes_visited[0]=="node_9_1572367888946") {
    for(var i in entidad){
      if(entidad[i].entity == "TipoConsulta"){
        var soluciones = documentos.listarSoluciones(entidad[i].value,watsonResultado.input.text);
        var lista_soluciones=[];
        for(var i in soluciones){
          lista_soluciones.push({response_type:"text", text:soluciones[i]});
        }      
        watsonResultado.context.soluciones = lista_soluciones; 
      }
    }
    if (watsonResultado.context.contador<watsonResultado.context.soluciones.length){
      watsonResultado.output.generic[0]=watsonResultado.context.soluciones[watsonResultado.context.contador];
      watsonResultado.output.generic.push({response_type:"text", text:"Se soluciono tu problema??"});
    }else{
      watsonResultado.output.generic[0]={response_type:"text", text:"GACIAS"};
    }  
  }
}

//ESCRIBIR DOCUMENTO

var jsonWatson={
  "watsonResultado": {
      "intents": [],
      "entities": [
          {
              "entity": "TipoConsulta",
              "location": [
                  0,
                  8
              ],
              "value": "hardware",
              "confidence": 1
          }
      ],
      "input": {
          "text": "hardware"
      },
      "output": {
          "generic": [
              {
                  "response_type": "text",
                  "text": "GACIAS"
              }
          ],
          "text": [],
          "nodes_visited": [
              "node_3_1572367833504"
          ],
          "log_messages": []
      },
      "context": {
          "cedula": 1725002206,
          "prioridad": "1 Impacto empresarial crítico (la producción o el servicio están inactivos)",
          "tipo": "HARDWARE",
          "problema": null,
          "soluciones": [],
          "conversation_id": "83e557ea-ee28-4ded-9b3b-b7d296245daa",
          "system": {
              "initialized": true,
              "dialog_stack": [
                  {
                      "dialog_node": "node_3_1572367833504"
                  }
              ],
              "dialog_turn_counter": 7,
              "dialog_request_counter": 7,
              "_node_output_map": {
                  "Bienvenido": {
                      "0": [
                          0
                      ]
                  },
                  "handler_1_1572285326655": {
                      "0": [
                          0
                      ]
                  },
                  "response_9_1572289552449": {
                      "0": [
                          0
                      ]
                  }
              }
          },
          "docs": "doc:doc",
          "validacionCedula": {
              "respuesta": "Cedula Correcta"
          },
          "contador": 0
      }
  }
}



controllerWatson.pruebas=async (req,res)=>{
    
    res.send(await escribir.crearTicket(jsonWatson.watsonResultado.context));
}


module.exports=controllerWatson;