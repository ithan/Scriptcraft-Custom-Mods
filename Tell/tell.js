/*
   @Author: Ithan lara 
   @Github: https://github.com/ithan/Scriptcraft-Custom-Mods-
   @version:  0.1
*/

var utils = require("utils"),
    slash = require("slash"),
    conversaciones = [];

var traducciones = {
	terminada: "\u00A76La conversacion ha sido terminada con exito.",
    creadaConExito: "\u00A76Has iniciado una conversacion con\u00A7c $player\u00A76.\n\u00A7aEscribe /tell para terminarla.",
    noEncontrado: "\u00A77No se puede encontrar a $player",
    desconectado: "\u00A77No se puede encontrar al jugador\nConversacion terminada.",
    sender: "\u00A76[\u00A7cyo \u00A76-> \u00A7c$target\u00A76] \u00A7f$message",
    target: "\u00A76[\u00A7cyo \u00A76-> \u00A7c$target\u00A76] \u00A7f$message"
};

events.playerCommandPreprocess(function(event){
    if(event.getMessage().split(" ")[0].toLowerCase() == "/tell")
    {
      if(event.getMessage().split(" ")[2] == undefined){
      var sts = conversaciones.filter(function(val){ return val.player.name == event.getPlayer().name});
      if(event.getMessage().split(" ")[1] == undefined){
          if(sts.length > 0){
              conversaciones.splice(conversaciones.indexOf(sts[0]),1);
              echo(event.getPlayer(), traducciones.terminada);  
             
          }
      }  else {
        if(utils.player(event.getMessage().split(" ")[1]) != undefined){
            if(sts.length > 0){
              sts[0].target = event.getMessage().split(" ")[1];
              echo(event.getPlayer(), traducciones.creadaConExito.replace("$player", event.getMessage().split(" ")[1]));  
             
            } else {
              conversaciones.push(new nuevaConversacion(event.getPlayer(),event.getMessage().split(" ")[1]));
              echo(event.getPlayer(), traducciones.creadaConExito.replace("$player", event.getMessage().split(" ")[1]));  
            }
        } else {
              echo(event.getPlayer(), traducciones.noEncontrado.replace("$player", event.getMessage().split(" ")[1]));
            if(sts.length > 0){
              conversaciones.splice(conversaciones.indexOf(sts[0]),1);
              echo(event.getPlayer(), traducciones.terminada);  
             
            }
        }
       
      }
      event.setCancelled(true);
      return false;
        }else{
            return false;
        }
    }
     
   
});
 
events.playerCommandPreprocess(function(event){
    if(event.getMessage().split(" ")[0] == "/all")
    {
        slash("say "+ event.getMessage().split("/all ")[1], event.getPlayer());
        event.setCancelled(true);
    }
});
 
function nuevaConversacion(player,target){
    this.player = player;
 		this.target = target;
 
}
events.asyncPlayerChat(function(event){
   var sts = conversaciones.filter(function(val){ return val.player.name == event.getPlayer().name});
   if(sts.length > 0){
       if(utils.player(sts[0].target) != undefined){
               var mapObj = {
               "$message": event.getMessage(),
               "$player": event.getPlayer().name,
               "$target":sts[0].target
               };
                slash("msg "+sts[0].target+" "+event.getMessage(),event.getPlayer());
            //echo(utils.player(sts[0].target), traducciones.sender.replace(/\$message|\$player|\$target/gi, function(matched){  return mapObj[matched];}));
            //echo(event.getPlayer(), traducciones.target.replace(/\$message|\$player|\$target/gi, function(matched){  return mapObj[matched];}));
            event.setCancelled(true);
       } else {
           conversaciones.splice(conversaciones.indexOf(sts[0]),1);
           echo(event.getPlayer(), traducciones.terminada);  
           event.setCancelled(true);
       }
       
      return false;
   }
});