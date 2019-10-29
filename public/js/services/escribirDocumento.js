var fs=require("fs");
var escribir={};
var moment=require('moment');
var modelo=[
    {"TIPO":"RED", "RESULTADO":[
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"},
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"}
      ]},
      {"TIPO":"HARDWARE", "RESULTADO":[
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"},
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"}
      ]},
      {"TIPO":"SOFTWARE", "RESULTADO":[
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"},
        {"ci":"12345679890","numticket":"342564","descripcion":"descrip","solucion":"solucion","Gravedad":"gravedad"}
      ]}
  ]


escribir.crearTicket=function(datos){
    var gravedad="otro";
    if(datos.prioridad==10){
        gravedad="Impacto empresarial crítico (la producción o el servicio están inactivos)";
    }else if(datos.prioridad==7){
        gravedad="Impacto importante (algún sistema está inactivo)";
    }else if(datos.prioridad==4){
        gravedad="Impacto empresarial ";
    }else if(datos.prioridad==1){
        gravedad="Impacto mínimo (preguntas sobre procedimientos, problemas de menor importancia)";
    }

    try {
        var data=JSON.parse(fs.readFileSync("TICKETS.json", 'utf-8'));
        
    for(var i in data){
        if(data[i].TIPO==datos.tipo){
            
            data[i].RESULTADO.push(
                {
                "ci":datos.cedula.toString(),
                "numticket":"TICKET"+moment.now(),
                "descripcion":"descrip",
                "solucion":"solucion",
                "Gravedad":gravedad,
                "nivelGravedad":datos.prioridad.toString(),
                "fecha":moment().format("MMMM Do YYYY, h:mm:ss a")
            })
        }
    }
    //fs.writeFileSync("TICKETS.json",JSON.stringify(data))
    return data;
    } catch (error) {
    }
    

}

module.exports=escribir;