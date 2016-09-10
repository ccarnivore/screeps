var c = require('main.const');
var sourceHandler = require('main.sourceHandling');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.work = creep.memory.work || c.CREEP_WORK_HARVESTING;

        if (creep.memory.work == c.CREEP_WORK_TRANSFERRING) {
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (
                    structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity
                ) || (
                    structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                )}
            });

            if (targets.length > 0) {
                targets.sort(function (a, b) {
                    var refillRelevanceA = c.REFILL_ENERGY_RELEVANCE[a.structureType],
                        refillRelevanceB = c.REFILL_ENERGY_RELEVANCE[b.structureType];

                    if (a.structureType == STRUCTURE_CONTAINER) {
                        refillRelevanceA += a.store[RESOURCE_ENERGY] - (a.store[RESOURCE_ENERGY] * creep.pos.getRangeTo(a));
                    } else {
                        refillRelevanceA += a.energy - (a.energy * creep.pos.getRangeTo(a));
                    }

                    if (b.structureType == STRUCTURE_CONTAINER) {
                        refillRelevanceB += b.store[RESOURCE_ENERGY] - (b.store[RESOURCE_ENERGY] * creep.pos.getRangeTo(b));
                    } else {
                        refillRelevanceB += b.energy - (b.energy * creep.pos.getRangeTo(b));
                    }

                    return refillRelevanceA - refillRelevanceB;
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
                    creep.say('morphing!');
                    if (!creep.memory.formerRole) {
                        creep.memory.formerRole = c.CREEP_ROLE_HARVESTER;
                    }

                    creep.memory.role = c.CREEP_ROLE_BUILDER;
                    creep.memory.canRepair = true;
                }
            }
        }

        if (creep.memory.work == c.CREEP_WORK_HARVESTING) {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = c.CREEP_WORK_TRANSFERRING;
                    return;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    if (creep.carry.energy > 0) {
                        creep.memory.work = c.CREEP_WORK_TRANSFERRING;
                    }
                    break;
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = c.CREEP_WORK_TRANSFERRING;
            }
        }
    }

};

module.exports = roleHarvester;