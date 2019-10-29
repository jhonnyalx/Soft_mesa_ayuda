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
  }else if (watsonResultado.output.nodes_visited[0]=="node_3_1572367833504") {
    for(var i in entidad){
      if(entidad[i].entity == "TipoConsulta"){
        var soluciones = documentos.listarSoluciones(entidad[i].value,watsonResultado.input.text);
        var lista_soluciones=[];
        for(var i in soluciones){
          lista_soluciones.push({response_type:"text", text:soluciones[i].text});
        }
        console.log(lista_soluciones);
        watsonResultado.output.generic=lista_soluciones[watsonResultado.context.contador];
      }
    }
  }
}

//ESCRIBIR DOCUMENTO

var jsonWatson={
  "watsonResultado": {
      "intents": [
          {
              "intent": "finConversacion",
              "confidence": 0.47068018913269044
          }
      ],
      "entities": [
          {
              "entity": "sys-number",
              "location": [
                  0,
                  2
              ],
              "value": "10",
              "confidence": 1,
              "metadata": {
                  "numeric_value": 10
              }
          }
      ],
      "input": {
          "text": "10"
      },
      "output": {
          "generic": [
              {
                  "title": "Para problemas de hadware conozco sobre:",
                  "options": [],
                  "response_type": "option"
              }
          ],
          "text": [],
          "nodes_visited": [
              "node_1_1572035571673"
          ],
          "log_messages": []
      },
      "context": {
          "cedula": 1725002206,
          "prioridad": "10",
          "tipo": "HARDWARE",
          "problema": null,
          "soluciones": null,
          "conversation_id": "a0592efb-f8ed-4df4-bb5b-1b402e98afa9",
          "system": {
              "initialized": true,
              "dialog_stack": [
                  {
                      "dialog_node": "root"
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
                  "response_5_1572301770131": {
                      "0": [
                          0
                      ]
                  },
                  "response_9_1572289552449": {
                      "0": [
                          0
                      ]
                  }
              },
              "branch_exited": true,
              "branch_exited_reason": "completed"
          },
          "docs": "doc:doc",
          "validacionCedula": {
              "respuesta": "Cedula Correcta"
          }
      }
  }
}




controllerWatson.pruebas=async (req,res)=>{
    
    res.send(await escribir.crearTicket(jsonWatson.watsonResultado.context));
}


module.exports=controllerWatson;