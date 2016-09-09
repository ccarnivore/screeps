var REFILL_RELEVANCE_HARVESTER = {
    'spawn': 3000,
    'container': 100
};

var sourceHandler = require('main.sourceHandling');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.work = creep.memory.work || 'harvesting';

        if (creep.memory.work == 'transfering') {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (
                    structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity
                ) || (
                    structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                )}
            });

            if (targets.length > 0) {
                targets.sort(function (a, b) {
                    var refillRelevanceA = REFILL_RELEVANCE_HARVESTER[a.structureType],
                        refillRelevanceB = REFILL_RELEVANCE_HARVESTER[b.structureType];

                    if (a.structureType == STRUCTURE_CONTAINER) {
                        refillRelevanceA += a.store[RESOURCE_ENERGY]
                    } else {
                        refillRelevanceA += a.energy;
                    }

                    if (b.structureType == STRUCTURE_CONTAINER) {
                        refillRelevanceA += b.store[RESOURCE_ENERGY]
                    } else {
                        refillRelevanceA += b.energy;
                    }

                    return refillRelevanceA - refillRelevanceB;
                });

                switch(creep.transfer(targets[0], RESOURCE_ENERGY)) {
                    case ERR_NOT_IN_RANGE: {
                        creep.moveTo(targets[0]);
                        break;
                    }
                    case ERR_NOT_ENOUGH_RESOURCES: {
                        creep.memory.work = 'harvesting';
                        break;
                    }
                }

            } else {
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.work = 'harvesting';
                } else {
                    creep.say('resting');
                }
            }
        }

        if (creep.memory.work == 'harvesting') {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = 'transfering';
                    return;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    if (creep.carry.energy > 0) {
                        creep.memory.work = 'transfering';
                    }
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = 'transfering';
            }
        }
    }

};

module.exports = roleHarvester;