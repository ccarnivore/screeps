/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('main.creepHandling');
 * mod.thing == 'a thing'; // true
 */
 
// W25N58
 
var limitation = {
    harvester: 1,
    builder: 2,
    upgrader: 1,
    repair: 1,
};

var creepHandler = {
    
    wipeDead: function(creep) {
        if (creep != undefined) {
            delete Memory.creeps[creep];
            return;
        }
        
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
  
    checkCreepPopulation: function(spawn) {
        // initial start
        if (Game.creeps.length == 0) {
            if (spawn.energy >= 200) {
                    spawn.createCreep([WORK,CARRY,MOVE], null, {role: 'harvester'});
            }
        }
        
        var exists = limitation;
        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            
            if (!creep) {
                wipeDead(creepName);
            }
        
            exists[creep.memory.role] -= 1;
        }
        
        
        for (var role in exists) {
            for (var i = 0; i < exists[role]; i++) {
                if (spawn.energy >= 200) {
                    spawn.createCreep([WORK,CARRY,MOVE], null, {role: role});
                }
            }
        }
        
    }
    
}

module.exports = creepHandler;