var ENERGY_RELEVANCE = {
    'spawn': 10000000,
    'extension': 8000000,
    'storage': 7700000,
    'tower': 7500000,
    'container': 7000000
};

var sourceHandler = require('main.sourceHandling');
var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.work = creep.memory.work || 'collecting';

        if (creep.memory.work == 'distributing') {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) ||
                    (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                }
            });

            if (targets.length > 0) {
                targets.sort(function (a, b) {
                    var relevanceA = ENERGY_RELEVANCE[a.structureType],
                        relevanceB = ENERGY_RELEVANCE[b.structureType];

                    if (Memory.invaderSpotted === true) {
                        if (a.structureType == STRUCTURE_TOWER) {
                            relevanceA += 100000000;
                        }
                        if (b.structureType == STRUCTURE_TOWER) {
                            relevanceB += 100000000;
                        }
                    }

                    if (a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE) {
                        relevanceA += a.store[RESOURCE_ENERGY]
                    } else {
                        relevanceA += a.energy;
                    }

                    if (b.structureType == STRUCTURE_CONTAINER || b.structureType == STRUCTURE_STORAGE) {
                        relevanceB += b.store[RESOURCE_ENERGY]
                    } else {
                        relevanceB += b.energy;
                    }

                    return relevanceB - relevanceA;
                });

                switch(creep.transfer(targets[0], RESOURCE_ENERGY)) {
                    case ERR_NOT_IN_RANGE: {
                        creep.moveTo(targets[0]);
                        break;
                    }
                    case ERR_NOT_ENOUGH_RESOURCES: {
                        creep.memory.work = 'collecting';
                        break;
                    }
                }

            } else {
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.work = 'collecting';
                } else {
                    creep.say('resting');
                }
            }
        }

        if (creep.memory.work == 'collecting') {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = 'distributing';
                    return;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    if (creep.carry.energy > 0) {
                        creep.memory.work = 'distributing';
                    }
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = 'distributing';
            }
        }
    }

};

module.exports = roleDistributor;