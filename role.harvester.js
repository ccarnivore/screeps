var ENERGY_RELEVANCE = {
    'spawn': 100,
    'tower': 75,
    'extension': 80,
    'container': 70
};

var sourceHandler = require('main.sourceHandling');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.work = creep.memory.work || 'harvesting';

        if (creep.memory.work == 'transfering') {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                }
            });

            if (targets.length > 0) {
                targets.sort(function (a, b) {
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

                var target = targets[0];

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

                /*creep.say('morph');
                 creep.memory.formerRole = 'harvester';
                 creep.memory.role = 'builder';
                 creep.memory.canRepair = true;
                 return;*/
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