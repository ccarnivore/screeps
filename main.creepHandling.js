/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('main.creepHandling');
 * mod.thing == 'a thing'; // true
 */
 
// W25N58

var weight = {
    WORK: 100,
    CARRY: 50,
    MOVE: 50,
};

var limitation = {
    harvester: 2,
    upgrader: 1,
    builder: 2
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
        var creepCount = 0;
        var creation = { harvester: 0, upgrader: 0, builder: 0 };

        for (var creepName in Game.creeps) {
            creepCount ++;
            var creep = Game.creeps[creepName];

            if (!creep) {
                wipeDead(creepName);
            }

            creation[creep.memory.role] += 1;
        }

        if (creepCount == 0) {
            this.createCreep(spawn, 'harvester');
            return;
        }

        if (!this.creationPossible(spawn)) {
            return;
        }

        for (var role in limitation) {
            if (creation[role] < limitation[role]) {
                this.createCreep(spawn, role);
                return;
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
        console.log('try create ' + role);
        if (this.creationPossible(spawn)) {
            spawn.createCreep([WORK,CARRY,MOVE], null, {role: role});
        } else {
            console.log('create ' + role + ' failed - no energy');
        }
    },

    /**
     * spawn can create creep
     *
     * @param spawn
     * @returns {boolean}
     */
    creationPossible: function(spawn) {
        return spawn.energy >= 200;
    }
    
}

module.exports = creepHandler;