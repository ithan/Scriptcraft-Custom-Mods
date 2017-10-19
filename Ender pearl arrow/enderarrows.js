/*
    @Author: Ithan lara 
    @github: https://github.com/ithan/Scriptcraft-Custom-Mods-
    @Version: Beta 0.1

    usage: type /enderArrow in the chat to activate it, you need 1 arrow and 1 ender pearl to make it work.
*/


// Module require;

var utiles = require('utils'),
    teleport = require('teleport'),
    bkArrow = org.bukkit.entity.Arrow,
    inventory = require('inventory'),
    items = require('items');

// translation for every message

    translation = {
        enderArrowActivated : "Modo enderArrow \u00A7aActivado",
        enderArrowDesactivated : "Modo enderArrow \u00A7cDesactivado",
        notEnoughEnderPearls: "No tienes\u00A7b ender pearls",
        onJoin: "\u00A7bEnderArrow \u00A7 esta \u00A7cDesactivado \u00A7 escribe\u00A7b /enderArrow\u00A7  para \u00A7aActivarlo"
    };

// Plugin variables
var playerStatus = {};
var onJoinMessage = true; // Message when someone join the server? true/false 


// Project hit hundler 

events.projectileHit( function( event ){
    var shooter = event.getEntity().getShooter();
    var loc = event.getEntity().getLocation();
    
  if ( event.getEntity() == "CraftArrow" && entities.player( event.getEntity().getShooter() ))
  {
    if(playerStatus[shooter.name] == true)
    {
        if(shooter.getInventory().containsAtLeast(items.enderPearl(1),1))
        {
            teleport(shooter, loc);
            inventory(shooter).remove(items.enderPearl(1));
        } else {
            echo(shooter, translation.notEnoughEnderPearls);
        }
    }
  }
});

// Function to activate/deshactivate de plugin
exports.enderArrow = function(player){
   if(playerStatus[player]){
       playerStatus[player] = !playerStatus[player];
   } else {
      playerStatus[player] = true; 
   }
    return !playerStatus[player];
}

// Command handler

events.playerCommandPreprocess(function(event){
    console.log(event.getMessage());
    if(event.getMessage() == "/enderArrow"){
        console.log(event.getPlayer().name);
        var result = enderArrow(event.getPlayer().name) ? translation.enderArrowDesactivated : translation.enderArrowActivated;
        echo(event.getPlayer(),result);
        event.setCancelled(true);
    };
})

// Onjoin message 

events.playerJoin(function(event){
    if(onJoinMessage){
         setTimeout(function(){echo( event.getPlayer(), translation.onJoin)},1000);
    }
})

