var c = require('main.const'),
    cache = require('Cache'),
    SourceHandler = require('SourceHandler');

function PlayRoom(room) {
    this.room = room;
    this.sourceHandler = new SourceHandler(this);
}

/**
 * find dropped energy in room
 *
 * @param creep
 * @param maxRange
 * @returns {*}
 */
PlayRoom.prototype.getDroppedEnergy = function(creep, maxRange) {
    if (creep.remember('usedDroppedEnergyId')) {
        var target = Game.getObjectById(creep.remember('usedDroppedEnergyId'));
        if (!target) {
            creep.forget('usedDroppedEnergyId');
        }

        return target;
    }

    maxRange = maxRange || 2;
    if (cache.has('droppedEnergyCollection')) {
        var cachedResources = cache.get('droppedEnergyCollection');
        if (creep == undefined) {
            return cachedResources[0];
        }

        cachedResources.sort(function(a, b) {
            return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
        });

        if (creep.creep.pos.getRangeTo(cachedResources[0]) <= maxRange) {
            creep.remember('usedDroppedEnergyId', cachedResources[0].id);
            return cachedResources[0];
        }

        return;
    }

    var targets = this.room.find(FIND_DROPPED_ENERGY);
    cache.set('droppedEnergyCollection', targets);
    return this.getDroppedEnergy(creep);
};

/**
 * rooms energy resources
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getEnergyResource = function(creep) {
    if (cache.has('harvesterEnergyResourceCollection')) {
        var cachedResources = cache.get('harvesterEnergyResourceCollection');
        if (creep == undefined) {
            return cachedResources[0];
        }

        cachedResources.sort(function(a, b) {
            return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
        });

        return cachedResources[0];
    }

    var targets = this.room.find(FIND_SOURCES);
    cache.set('harvesterEnergyResourceCollection', targets);
    return this.getEnergyResource(creep);
};

/**
 * finds a container for getting energy from
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getContainer = function(creep) {
    return creep.creep.pos.findClosestByRange(
        FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_CONTAINER
                    && structure.store[RESOURCE_ENERGY] > 50)
                    && structure.id != creep.remember('usedTarget');
            }
        }
    );
};

PlayRoom.prototype.getDestinationForDistributor = function(creep) {
    if (cache.has('distributorDestinationCollection')) {
        var cachedTargets = cache.get('distributorDestinationCollection');
        if (creep == undefined) {
            return cachedTargets[0];
        }

        cachedTargets.sort(function(a, b) {
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

        for (var currentTarget in cachedTargets) {
            if (cachedTargets[currentTarget].id == creep.remember('usedEnergyContainer')) {
                continue;
            }

            return cachedTargets[currentTarget];
        }

        return;
    }

    var targets = creep.room.find(
        FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
                    || (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
                    || (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
                    || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                    || (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)

            }
        }
    );

    cache.set('distributorDestinationCollection', targets);
    return this.getDestinationForHarvester(creep);
};

/**
 * gets the room controller
 *
 * @returns {undefined|StructureController}
 */
PlayRoom.prototype.getRoomController = function() {
    return this.room.controller;
};

/**
 * target for harvester to transfer energy to
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getDestinationForHarvester = function(creep) {
    if (cache.has('harvesterDestinationCollection')) {
        var cachedTargets = cache.get('harvesterDestinationCollection');
        if (creep == undefined) {
            return cachedTargets[0];
        }

        cachedTargets.sort(function(a, b) {
            var refillRelevanceA = c.REFILL_ENERGY_RELEVANCE[a.structureType],
                refillRelevanceB = c.REFILL_ENERGY_RELEVANCE[b.structureType];

            if (a.structureType == STRUCTURE_CONTAINER) {
                refillRelevanceA += a.store[RESOURCE_ENERGY] - (a.store[RESOURCE_ENERGY] * creep.creep.pos.getRangeTo(a));
            } else {
                refillRelevanceA += a.energy - (a.energy * creep.creep.pos.getRangeTo(a));
            }

            if (b.structureType == STRUCTURE_CONTAINER) {
                refillRelevanceB += b.store[RESOURCE_ENERGY] - (b.store[RESOURCE_ENERGY] * creep.creep.pos.getRangeTo(b));
            } else {
                refillRelevanceB += b.energy - (b.energy * creep.creep.pos.getRangeTo(b));
            }

            return refillRelevanceB - refillRelevanceA;
        });

        return cachedTargets[0];
    }

    var targets = this.room.find(FIND_STRUCTURES, {
        filter: function(structure) {
            return (
                    structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity
                ) ||(
                    structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
                ) || (
                    structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                )
        }
    });

    cache.set('harvesterDestinationCollection', targets);
    return this.getDestinationForHarvester(creep);
};

module.exports = PlayRoom;