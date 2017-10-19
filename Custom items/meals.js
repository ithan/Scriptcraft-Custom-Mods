/*
   @Author: Ithan lara 
   @Github: https://github.com/ithan/Scriptcraft-Custom-Mods-
   @version: Alpha 0.1
   
   WIP, still need some commands for interaction.
*/

// Directories 
var mealsDirectory = 'scriptcraft/meals.json';

// Messages
var config = {
    itemCreated: 'El objeto se a registrado correctamente',
    itemAlreadyExist: 'Ya existe un objeto con ese nombre',
    menuName: "Menu Custom meals",
    foodtag: "Custom meal"
    
};

// Modules
var inventory   = require('inventory'),
    items       =     require('items'),
    utils       =     require('utils'),
    slash       =     require('slash');

// Data load
var meals = scload(mealsDirectory);                                                    
  
//Virtual inventory 
var inv;
createVirtualInventory();
/* newMeals function, expects : 
player:     string,
name:       string,
*/
exports.newMeal = function(player,name){
    //Check if the items already exist 
    var exist = false;
    meals.forEach(
        function(val){ 
            if(val.name == name)
            {
                  exist = true 
            }
        }
    );
    if(!exist)
    {
        var id = utils.player(player).getInventory().getItemInHand().getType().toString();
        var mealspecial = new customMeal(id,name);
        meals.push(mealspecial);
        console.log(meals[meals.length-1].id);
        exports.exportMeals();
        echo(utils.player(player), config.itemCreated);
        createVirtualInventory();
    } else 
    {
        echo(utils.player(player), config.itemAlreadyExist);
    }
}

exports.test = function(player,name,ammount)
{
     ammount = ammount || 1;
     var state = false;
     data = meals.filter(function(val){
         if(val.name == name)
         {
             state = true 
         };
         return val.name == name;

     })[0];
     if(state)
     {
         slash('give '+player+' '+data.id+' '+ammount+' 0 {display:{Name:"'+data.name+'",Lore:["'+data.lore.join('","')+'"]}}',utils.player(player));
     } else 
     {
         return false;
     }
 
}

exports.exportMeals = function()
{
    scsave(meals, mealsDirectory);
}
exports.reloadMeals = function()
{
    meals = scload(mealsDirectory);
}

exports.openMealsInv = function(player)
{
    utils.player(player).openInventory(inv);
}

// Constructor 

function customMeal(idx,name,lore, pEffect,nEffect,pp,pn)
{
   
    this.id =          idx;  //string
    this.name =        name;  //string
    this.lore =        lore || ["Custom meal"];  //array
    this.pEffect =  pEffect ||  '';  //string
    this.nEffect =  nEffect ||  '';  //string
    this.pp =            pp || 100;  //int
    this.pn =            pn || 0;  //int
    
}




// Event listeners

events.playerItemConsume(function (event)
{
    if(event.getPlayer(), event.getItem().getItemMeta().lore[0] == config.foodtag)
    {
        var element = meals.filter(function(val){ return val.name == event.getItem().getItemMeta().displayName})[0],
            number = Math.floor(Math.random()*100);
        console.log("test");
        
        if(number < element.pp)
        {
            slash('effect '+event.getPlayer().name+' '+element.pEffect);
        } else 
        {
            slash('effect '+event.getPlayer().name+' '+element.nEffect);
        }
    };
    
});

events.inventoryClick(function(event)
{
    if(event.getClickedInventory().getName() == config.menuName)
    {
        var clicked = event.getCurrentItem();
        
        event.setCancelled(true);
        clicked.setAmount(64);
        event.getWhoClicked().getInventory().addItem(clicked);
    }

});

events.inventoryMoveItem(function(event)
{
    if(event.getDestination().getName() == config.menuName)
    {
        event.setCancelled(true);
    }

});

events.inventoryDrag(function(event)
{
    if(event.getInventory().getName() == config.menuName)
    {
        event.setCancelled(true);
    }

});

function createVirtualInventory(){
    inv = server.createInventory(null,Math.ceil(meals.length/9)*9, config.menuName);  
    meals.forEach(function(val,id)
    {
        var citem = items[val.id.toLowerCase().replace(/_([a-z])/,function(v){
    //v.replace("/_([a-z])/","$1"); return v.toUpperCase()
	z = v.replace("_","");
    return z.toUpperCase()
})](1),
            im = citem.getItemMeta();

        im.setLore(val.lore);
        im.setDisplayName(val.name);
        citem.setItemMeta(im);
        inv.setItem(id,citem);
    });
    
}




