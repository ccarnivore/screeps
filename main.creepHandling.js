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
    repair: 1,
    builder: 2,
    upgrader: 1,
    harvester: 1
};

var creepHandler = {

    /**
     * wipe out dead creeps memory
     *
     * @param creep
     */
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

    /**
     * checks creeps population
     * to fixed limits
     *
     * @param spawn
     */
    checkCreepPopulation: function(spawn) {
        var creation = limitation;
        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];

            if (!creep) {
                wipeDead(creepName);
            }

            creation[creep.memory.role] -= 1;
        }

        var weightedRole = ['harvester', 'upgrader', 'builder', 'repair'];
        for (var i = 0; i < weightedRole.length; i++) {
            var role = weightedRole[i];
            console.log('check role ' + role + ' (' + creation[role] + ')');
            if (creation[role] > 0 && spawn.energy >= 200) {
                console.log('create creep role ' + role);
                this.createCreep(spawn, role);
            }
        }

    },

    /**
     * creates a creep
     *
     * @param spawn
     * @param role
     */
    createCreep: function(spawn, role) {
        if (spawn.energy >= 200) {
            spawn.createCreep([WORK,CARRY,MOVE], null, {role: role});
        }
    }
    
}

module.exports = creepHandler;