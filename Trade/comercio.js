/*// Modules
//                      WIP! There are a few bugs that need to be solved before release

var items = require('items'),
utils = require('utils')

// Variables
var maxRange = 15;

var mensajes = {
    outOfRange : 'El jugador esta demasiado lejos',
    donstExist: 'No se puede encontrar al jugador',
    success: 'El comercio con %s se a realizado correctamente',
    canceled: 'Comercio Cancelado',
    alreadyTrading: '%s no puede comerciar en estos momentos',
    self : 'No puedes comerciar contigo mismo' 
};

var separator = ' - ';
// Objetos iniciales
var invts = {},
openinvs = [],
invtsn = {},
state = {};

// Lista de slots
var a = [0,1,2,3,9,10,11,12,18,19,20,21,27,28,29,30],
    b = [5,6,7,8,14,15,16,17,23,24,25,26,32,33,34,35],
    bedrockSlot= [4,13,22,31,40],
    blackGlass = [36,37,38,41,42,43],
    greenGlass = [39,44];

var cItems = {
    bedrock: items.bedrock(1),
    blackGlassPane : new Packages.org.bukkit.inventory.ItemStack(Packages.org.bukkit.Material['STAINED_GLASS_PANE'],1,15),
    greenGlassPane : new Packages.org.bukkit.inventory.ItemStack(Packages.org.bukkit.Material['STAINED_GLASS_PANE'],1,13)
};

exports.comerciar = function(self,target)
{
    //check if the target exist
    if(utils.player(target))
    {
        // store the players in variables
        var cSelf = utils.player(self);
        var cTarget = utils.player(target);
        var name = cSelf.name +separator+ cTarget.name;
        // push the trade to the trades array
        openinvs.push(cSelf.name +separator+ cTarget.name);
        //check the distance
        if(cSelf.getLocation().distance(cTarget.getLocation()) < maxRange)
        {
            //Create a new inventory and show it to both players
            createInventory(name);
            utils.player(cSelf).openInventory(invts[name]);
            utils.player(cTarget).openInventory(invts[name]);
        } else {
            echo(utils.player(self),mensajes.outOfRange);
        }
        
    } else {
        echo(utils.player(self),mensajes.donstExist);
    }
    
};

function createInventory(name)
{
    invts[name] = server.createInventory(null,45, name);
    invtsn[name] = {};
    state[name] = false;
    invtsn[name][name.split(separator)[0]] = 0;
    invtsn[name][name.split(separator)[1]] = 0;
    
    bedrockSlot.forEach(function(val)
    {
        invts[name].setItem(val,cItems.bedrock);
    });
    
    blackGlass.forEach(function(val)
    {
        invts[name].setItem(val,cItems.blackGlassPane);
    });
    greenGlass.forEach(function(val)
    {
        invts[name].setItem(val,cItems.greenGlassPane);
    });

}

function accept(name,player)
{
    if(openinvs.indexOf(name) >= 0)
    {        
        if(player)
        {
            invts[name].setItem(36,cItems.greenGlassPane);
            invts[name].setItem(37,cItems.greenGlassPane);
            invts[name].setItem(38,cItems.greenGlassPane);
            invtsn[name][name.split(separator)[0]]++;
        } else {
            invts[name].setItem(41,cItems.greenGlassPane);
            invts[name].setItem(42,cItems.greenGlassPane);
            invts[name].setItem(43,cItems.greenGlassPane);
            invtsn[name][name.split(separator)[1]]++;
        }
    }
    
     if(invtsn[name][name.split(separator)[0]]  >= 1 && invtsn[name][name.split(separator)[1]] >= 1)
    {
        invtsn[name][name.split(separator)[0]] = 0;
        invtsn[name][name.split(separator)[1]] = 0;
        name.split(separator).forEach(function(val,i,arr)
        {
            utils.player(val).closeInventory();
            echo(utils.player(val),mensajes.success.replace('%s', arr[((arr.indexOf(val)+1)%arr.length)]));
        });
        trader(name);
    }
}

events.inventoryClick(function(event)
{
    if(openinvs.indexOf(event.getClickedInventory().getName()) >= 0)
    {
        var whos = (event.getWhoClicked().name == event.getClickedInventory().getName().split(separator)[0]) ? 0 : 1;
        
        
        if(!whos && a.indexOf(event.getRawSlot()) < 0) 
        {
                event.setCancelled(true);
        } 
        
        if(whos && b.indexOf(event.getRawSlot()) < 0) 
        {
                event.setCancelled(true);
        }
        

        if(event.getRawSlot() == 39){
            if(whos == 0){
                accept(event.getClickedInventory().getName(),true);
            }
            event.setCancelled(true);
        }
        if(event.getRawSlot() == 44){
            if(whos == 1){
                accept(event.getClickedInventory().getName(),false);
            }
            event.setCancelled(true);
        }
        if(event.getRawSlot() > 35) {
            event.setCancelled(true);
        }
    }
    if(event.isShiftClick()){
        event.setCancelled(true);
    }

});

events.inventoryDrag(function(event)
{
    
    if(openinvs.indexOf(event.getInventory().getName()) >= 0)
    {
        var whos = (event.getWhoClicked().name == event.getInventory().getName().split(separator)[0]) ? 0 : 1;
        if(!whos && check(a,event.getRawSlots())) 
        {
            event.setCancelled(true);
        } 
        if(whos && check(b,event.getRawSlots()))
        {
            event.setCancelled(true);
        }
        
        if(event.getRawSlots() > 35) 
        {
            event.setCancelled(true);
        }
    }

});


events.inventoryClose(function(event)
{
    
    if(openinvs.indexOf(event.getInventory().getName()) >= 0)
    {
        close(event.getInventory().getName());
    }
});

function check(arr,arre)
        {
    var s = false;
    arre.forEach(function(val)
        {
        if(arr.indexOf(val)< 0)
        {
            s = true;
        }
    });
    return s;
}

function trader(name)
{   
    var playerA = name.split(separator)[0],
        playerB = name.split(separator)[1];
    a.forEach(function(val)
    {
        if(invts[name].getItem(val) != null)
        {
            utils.player(playerB).getInventory().addItem(invts[name].getItem(val));
        }
    });

    b.forEach(function(val)
    {
        if(invts[name].getItem(val) != null)
        {
            utils.player(playerA).getInventory().addItem(invts[name].getItem(val));
        }
    });

}

function close(name)
{
    if(!state[name] == 'undefined')
    {
            state[name] = false;
    } else {
        state[name] = !state[name];
    }
    if(!state[name])
    {
         name.split(separator).forEach(function(val)
        {
             utils.player(val).closeInventory();
             echo(utils.player(val),mensajes.canceled);
         });
    } 
}


events.entityDamage(function(event)
{
    if(openinvs.indexOf(utils.player(event.getEntity()).getOpenInventory().getTitle()) >= 0)
    {
         close(utils.player(event.getEntity()).getOpenInventory().getTitle());
    }
   
});


        
        */
