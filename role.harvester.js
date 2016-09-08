var ENERGY_RELEVANCE = {
    'spawn': 100,
    'tower': 80,
    'extension': 75,
    'container': 70
};

var sourceHandler = require('main.sourceHandling');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var mySource = sourceHandler.findSource(creep);
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                }
            });

            if(targets.length > 0) {
                targets.sort(function(a, b) {
                    var relevanceA = ENERGY_RELEVANCE[a.structureType],
                        relevanceB = ENERGY_RELEVANCE[b.structureType];

                    if (Memory.invaderSpotted === true) {
                        if (a.structureType == STRUCTURE_TOWER) {
                            relevanceA += 1000;
                        }
                        if (b.structureType == STRUCTURE_TOWER) {
                            relevanceB += 1000;
                        }
                    }

                    return relevanceB - relevanceA;
                });
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                // nothing to do.. change role
                creep.say('morph');
                creep.memory.role = 'builder';
                creep.memory.canRepair = true;
                return;

            }
        }
    }

};

module.exports = roleHarvester;