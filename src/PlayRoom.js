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
    if (creep.remember('usedSourceId') && ((creep.remember('usedSourceSet') + 3600) > Game.time)) {
        var object = Game.getObjectById(creep.remember('usedSourceId'));
        if (object) {
            return object;
        }
    }

    if (cache.has('harvesterEnergyResourceCollection')) {
        var cachedResources = cache.get('harvesterEnergyResourceCollection');
        if (creep == undefined) {
            return cachedResources[0];
        }

        cache.setPersistence(true);
        var balance = cache.get('resourceBalancing') || {};

        cachedResources.sort(function(a, b) {
            balance[a.id] = balance[a.id] || [];
            balance[b.id] = balance[b.id] || [];

            var balanceFactorA = balance[a.id].length || 1,
                balanceFactorB = balance[b.id].length || 1;

            return creep.creep.pos.getRangeTo(a) * balanceFactorA - creep.creep.pos.getRangeTo(b) * balanceFactorB;
        });

        var resource = cachedResources[0];
        balance[resource.id] = balance[resource.id] || [];
        balance[resource.id].push(creep.creep.id);
        cache.set('resourceBalancing', balance);
        cache.setPersistence(false);

        console.log(creep.creep, 'set energy resource', resource, resource.pos);
        creep.remember('usedSourceSet', Game.time);
        creep.remember('usedSourceId', resource.id);

        return resource;
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
                return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                    && structure.store[RESOURCE_ENERGY] > 0)
                    && structure.id != creep.remember('usedTarget');
            }
        }
    );
};

PlayRoom.prototype.getDestinationForDistributor = function(creep) {
    if (creep.remember('distributionTargetId')) {
        var target = Game.getObjectById(creep.remember('distributionTargetId'));
        if (!target) {
            creep.forget('distributionTargetId');
        }

        if (target.structureType == STRUCTURE_CONTAINER || target.structureType == STRUCTURE_STORAGE) {
            if (target.store[RESOURCE_ENERGY] < target.storeCapacity) {
                return target;
            }
        } else {
            if (target.energy < target.energyCapacity) {
                return target;
            }
        }
    }

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

            creep.remember('distributionTargetId', cachedTargets[currentTarget].id);
            return cachedTargets[currentTarget];
        }

        return;
    }

    var targets = this.room.find(
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
    return this.getDestinationForDistributor(creep);
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
 * get repairable structures
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getRepairableStructure = function(creep) {
    if (creep.remember('repairStructureId') && ((creep.remember('repairStructureSet') + 100) > Game.time)) {
        var object = Game.getObjectById(creep.remember('repairStructureId'));
        if (object && object.hits < object.hitsMax) {
            return object;
        } else {
            creep.forget('repairStructureId');
        }
    }

    if (cache.has('repairStructureCollection')) {
        var cachedTargets = cache.get('repairStructureCollection');
        if (creep == undefined) {
            return cachedTargets[0];
        }

        if (cachedTargets.length == 0) {
            return false;
        }

        cachedTargets.sort(function(a, b) {
            var repairLevelA = c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][a.structureType] || 1,
                repairLevelB = c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][b.structureType] || 1;

            return (a.hits / (a.hitsMax / repairLevelA) - b.hits / (b.hitsMax / repairLevelB));
        });

        var structure = cachedTargets[0];
        creep.remember('repairStructureSet', Game.time);
        creep.remember('repairStructureId', structure.id);
        return structure;
    }

    var targets = this.room.find(FIND_STRUCTURES, {
        filter: function(structure) {
            return (
                structure.structureType != STRUCTURE_ROAD
                    && structure.structureType != STRUCTURE_WALL
                    && structure.structureType != STRUCTURE_CONTAINER
                    && structure.structureType != STRUCTURE_RAMPART
                    && structure.hits < structure.hitsMax
            ) || (
                structure.structureType == STRUCTURE_ROAD
                && structure.hits <= (structure.hitsMax / c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][STRUCTURE_ROAD])
            ) || (
                structure.structureType == STRUCTURE_CONTAINER
                && structure.hits <= (structure.hitsMax / c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][STRUCTURE_CONTAINER])
            ) || (
                structure.structureType == STRUCTURE_WALL
                && structure.hits <= (structure.hitsMax / c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][STRUCTURE_WALL])
            ) || (
                structure.structureType == STRUCTURE_RAMPART
                && structure.hits <= (structure.hitsMax / c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][STRUCTURE_RAMPART])
            )
        }
    });

    cache.set('repairStructureCollection', targets);
    return this.getRepairableStructure(creep);
};

/**
 * get nearest construction site for creep
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getConstructionSite = function(creep) {
    if (cache.has('constructionSiteCollection')) {
        var cachedTargets = cache.get('constructionSiteCollection');
        if (creep == undefined) {
            return cachedTargets[0];
        }

        cachedTargets.sort(function(a, b) {
            return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
        });

        if (cachedTargets[0]) {
            return cachedTargets[0]
        }
    }

    var targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if (!targets.length) {
        return false;
    }

    cache.set('constructionSiteCollection', targets);
    return this.getConstructionSite(creep);
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

            if (a.structureType == STRUCTURE_CONTAINER || a.structureType == STRUCTURE_STORAGE) {
                refillRelevanceA += a.store[RESOURCE_ENERGY] - (a.store[RESOURCE_ENERGY] * creep.creep.pos.getRangeTo(a));
            } else {
                refillRelevanceA += a.energy - (a.energy * creep.creep.pos.getRangeTo(a));
            }

            if (b.structureType == STRUCTURE_CONTAINER || b.structureType == STRUCTURE_STORAGE) {
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
                ) || (
                    structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                ) || (
                    structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                )
        }
    });

    cache.set('harvesterDestinationCollection', targets);
    return this.getDestinationForHarvester(creep);
};

module.exports = PlayRoom;