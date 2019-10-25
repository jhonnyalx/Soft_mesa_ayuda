var fs=require("fs");
var validaciones={};

  validaciones.leerReglasTecniseguros= function(watsonResultado){
    var marca=watsonResultado.context.MARCA_VEHICILO
    var modelo=watsonResultado.context.MODELO_VEHICULO
    var monto=parseInt(watsonResultado.context.Monto_Vehiculo);
    console.log("monto "+monto)

    var datos=JSON.parse(fs.readFileSync("REGLAS_TECNI.json", 'utf-8'));
    var jsonResult=[]
    for(var i in datos){
    if(datos[i].Marca==marca){
    for(var j in datos[i].Aseguradoras){
    var json={"Marca":marca,"Modelo":modelo,"Aseguradora":null,"MontoMaximo":0, "tasa":0 , "cuotas":0 , "primaNeta": 0,
    "primaAnual": 0, "Coberturas":null, "Exclusiones":null}
    json.Aseguradora=datos[i].Aseguradoras[j].Nombre
    for(var k in datos[i].Aseguradoras[j].Resultado){
      let result=null;
      for(var z in datos[i].Aseguradoras[j].Resultado[k].Modelos){
        if(datos[i].Aseguradoras[j].Resultado[k].Modelos[z]==modelo){
          result=datos[i].Aseguradoras[j].Resultado[k].Modelos[z];
        }
      }
     
    if(result!=undefined && result!=null && result==modelo){
    json.MontoMaximo=datos[i].Aseguradoras[j].Resultado[k].MontoMaximo;
    json.tasa=datos[i].Aseguradoras[j].Resultado[k].tasa;
    json.cuotas=datos[i].Aseguradoras[j].Resultado[k].cuotas;
    json.Coberturas=datos[i].Aseguradoras[j].Resultado[k].Coberturas;
    json.Exclusiones=datos[i].Aseguradoras[j].Resultado[k].Exclusiones;
    //calculos
    json.primaNeta=(monto*datos[i].Aseguradoras[j].Resultado[k].tasa)/100;
    json.primaAnual=json.primaNeta*json.cuotas;
    jsonResult.push(json);
     
                }
              }
     
            }
     
          }
        }
    return jsonResult;
}

module.exports=validaciones