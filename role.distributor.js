var c = require('main.const');
var sourceHandler = require('main.sourceHandling');

var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.work = creep.memory.work || c.CREEP_WORK_HARVESTING;

        if (creep.memory.work == c.CREEP_WORK_DISTRIBUTING) {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER
                    && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) ||
                    (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                }
            });

            if (targets.length > 0 && targets[0].id != creep.memory.usedEnergyContainer) {
                targets.sort(function (a, b) {
                    var relevanceA = c.DISTRIBUTION_ENERGY_RELEVANCE[a.structureType],
                        relevanceB = c.DISTRIBUTION_ENERGY_RELEVANCE[b.structureType];

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
                        creep.memory.work = c.CREEP_WORK_HARVESTING;
                        break;
                    }
                }

            } else {
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.work = c.CREEP_WORK_HARVESTING;
                } else {
                    // morphing to worker drone
                    creep.say('resting');
                    return;
                }
            }
        }

        if (creep.memory.work == c.CREEP_WORK_HARVESTING) {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = c.CREEP_WORK_DISTRIBUTING;
                    return;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    if (creep.carry.energy > 0) {
                        creep.memory.work = c.CREEP_WORK_DISTRIBUTING;
                    }
                    break;
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = c.CREEP_WORK_DISTRIBUTING;
            }
        }
    }

};

module.exports = roleDistributor;