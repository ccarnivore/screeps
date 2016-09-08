/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('main.creepHandling');
 * mod.thing == 'a thing'; // true
 */
 
// W25N58

var creepLimit = 10;
var defaultCreationEnergy = 200;
var minEnergyChunk = 50;

var globalBuildPattern = {
    harvester: {
        pattern: [WORK, CARRY, MOVE],
        extensionOrder: [CARRY, CARRY, WORK, MOVE],
        cost: 200
    },
    upgrader: {
        pattern: [WORK,CARRY,MOVE],
        extensionOrder: [WORK, WORK, CARRY, MOVE],
        cost: 200
    },
    builder: {
        pattern: [WORK,CARRY,MOVE],
        extensionOrder: [WORK, WORK, CARRY, CARRY, MOVE],
        cost: 200
    }
};

var limitation = {
    harvester: 3,
    upgrader: 1,
    builder: 6
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

        if (creepCount >= creepLimit) {
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
            var creationEnergy = this.getCreationEnergy(spawn),
                constructionPlan = globalBuildPattern[role],
                buildPattern = constructionPlan.pattern.slice(0),
                buildOrder = constructionPlan.extensionOrder.slice(0),
                diff = creationEnergy - defaultCreationEnergy;

            console.log('creationEnergy: ' + creationEnergy);
            console.log('buildPattern before: ' + JSON.stringify(buildPattern));

            if (diff >= minEnergyChunk) {
                var i = 0, part, cost;
                while (diff >= minEnergyChunk) {
                    if (i == buildOrder.length) {
                        i = 0;
                    }

                    part = buildOrder[i];
                    cost = BODYPART_COST[part];

                    if (diff - cost >= 0) {
                        buildPattern.push(part);
                        diff -= cost;
                    } else {
                        break;
                    }

                    i++;
                }
            }

            console.log('buildPattern after: ' + JSON.stringify(buildPattern));
            var creepArgs = {role: role, canRepair: false};
            if (role == 'builder') { Memory.isRepairBuilder = !Memory.isRepairBuilder; }
            creepArgs.canRepair = Memory.isRepairBuilder;

            spawn.createCreep(buildPattern, null, creepArgs);
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
        return spawn.energy >= defaultCreationEnergy;
    },

    /**
     *
     * @param spawn
     * @returns {number}
     */
    getCreationEnergy: function(spawn) {
        var energy = spawn.energy;
        var extensionCollection = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION) }
        });

        for (var extension in extensionCollection) {
            energy += extensionCollection[extension].energy;
        }

        return energy;
    }

    
}

module.exports = creepHandler;