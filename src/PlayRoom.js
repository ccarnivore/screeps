var c = require('Const'),
    CreepController = require('CreepController'),
    SourceHandler = require('SourceHandler');

/**
 * room wrapper
 *
 * @param room
 * @constructor
 */
function PlayRoom(room) {
    this.room = room;
    this.sourceHandler = new SourceHandler(this);
    this.spawnEnergy = 0;

    this.storage = null;

    this.spawnCollection = [];
    this.creepCollection = [];
    this.healableCollection = [];
    this.invaderCollection = [];

    this.droppedEnergyCollection = [];
    this.alternateEnergySourceCollection = [];
    this.energySourceCollection = [];
    this.containerCollection = [];
    this.constructionSiteCollection = [];
    this.extensionCollection = [];
    this.linkCollection = [];
    this.towerCollection = [];

    this.repairableStructureCollection = [];
}

/**
 * get the rooms name
 *
 * @returns {*}
 */
PlayRoom.prototype.getName = function() {
    return this.room.name;
};

PlayRoom.prototype.getStats = function() {
    return this.energySourceCollection;
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
 * indicates the rooms controller is our
 *
 * @returns {boolean}
 */
PlayRoom.prototype.isMyRoom = function() {
    return this.room.controller.my;
};

/**
 * checks the current playroom level
 * and upgrades it if necessary
 *
 */
PlayRoom.prototype.checkPlayRoomLevel = function() {
    var energy = this.getSpawnEnergyTotal();
    for (var level in c.LEVEL_DEFINITION) {
        if (energy >= c.LEVEL_DEFINITION[level].minEnergy) {
            console.log('upgrading level to ' + level);
            Memory.currentLevel[this.getName()] = level;
        }
    }
};

/**
 * gets the current level of the play room
 * level depends on available energy
 *
 * @returns {*}
 */
PlayRoom.prototype.getPlayRoomLevel = function() {
    Memory.currentLevel[this.getName()] = Memory.currentLevel[this.getName()] || c.LEVEL1;
    return Memory.currentLevel[this.getName()];
};

/**
 * get the current room spawn energy
 * @returns {number}
 */
PlayRoom.prototype.getSpawnEnergyTotal = function() {
    if (this.spawnEnergy == 0) {
        var spawn = this.getSpawn();
        if (spawn) {
            this.spawnEnergy += spawn.energy;
        }

        this.extensionCollection.forEach(function(extension) {
            this.spawnEnergy += extension.energy;
        }.bind(this));
    }

    return this.spawnEnergy;
};

/**
 * get a spawn
 *
 * todo get next spawn ready to work
 * @returns {*}
 */
PlayRoom.prototype.getSpawn = function() {
    if (!this.spawnCollection || this.spawnCollection.length == 0) {
        return;
    }

    return this.spawnCollection[0];
};

/**
 * measures the room
 */
PlayRoom.prototype.measure = function() {
    var creepCollection = this.room.find(FIND_CREEPS);
    creepCollection.forEach(function(creep) {
        if (creep.my) {
            this.creepCollection.push(creep);
        } else {
            this.invaderCollection.push(creep);
        }

        if (creep.hits < creep.hitsMax) {
            this.healableCollection.push(creep);
        }
    }.bind(this));

    this.droppedEnergyCollection = this.room.find(FIND_DROPPED_ENERGY);
    this.droppedEnergyCollection.forEach(function (energy) {
        if (energy.amount >= 1000) {
            this.alternateEnergySourceCollection.push(energy);
        }
    }.bind(this));

    this.energySourceCollection = this.room.find(FIND_SOURCES);
    this.constructionSiteCollection = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (this.constructionSiteCollection.length == 0) {
        this.room.find(FIND_CONSTRUCTION_SITES);
    }

    var repairTmp = [];
    var structureCollection = this.room.find(FIND_STRUCTURES);
    structureCollection.forEach(function(structure) {
        switch (structure.structureType) {
            case STRUCTURE_SPAWN: {
                this.spawnCollection.push(structure);
                break;
            }
            case STRUCTURE_TOWER: {
                this.towerCollection.push(structure);
                break;
            }
            case STRUCTURE_LINK: {
                this.linkCollection.push(structure);
                break;
            }
            case STRUCTURE_EXTENSION: {
                this.extensionCollection.push(structure);
                break;
            }
            case STRUCTURE_STORAGE: {
                this.storage = structure;
                break;
            }
            case STRUCTURE_CONTAINER: {

                this.containerCollection.push(structure);
                if (structure.hits < structure.hitsMax) {
                    repairTmp.push(structure);
                }
                break;
            }
            case STRUCTURE_ROAD: {
                if (structure.hits < structure.hitsMax) {
                    repairTmp.push(structure);
                }
                break;
            }
            case STRUCTURE_WALL: {
                if (structure.hits < structure.hitsMax) {
                    repairTmp.push(structure);
                }
                break;
            }
            case STRUCTURE_RAMPART: {
                if (structure.hits < structure.hitsMax) {
                    repairTmp.push(structure);
                }
                break;
            }
        }
    }.bind(this));

    repairTmp.forEach(function(structure) {
        if (structure.hits <= (structure.hitsMax / c.LEVEL_DEFINITION[this.getPlayRoomLevel()]['maxRepairFactor'][structure.structureType])) {
            this.repairableStructureCollection.push(structure);
        }
    }.bind(this));

    this.repairableStructureCollection.sort(function(a,b) {
        var repairLevelA = c.LEVEL_DEFINITION[this.getPlayRoomLevel()]['maxRepairFactor'][a.structureType] || 1,
            repairLevelB = c.LEVEL_DEFINITION[this.getPlayRoomLevel()]['maxRepairFactor'][b.structureType] || 1;

        return (a.hits / (a.hitsMax / repairLevelA) - b.hits / (b.hitsMax / repairLevelB));
    }.bind(this));

    if (this.isMyRoom()) {
        this.checkPlayRoomLevel();
    }
};

/**
 * find a tower to bring energy to
 *
 * @returns {*}
 */
PlayRoom.prototype.getTowerForRefill = function(factor) {
    factor = factor || 1;
    for (var towerId in this.towerCollection) {
        if (this.towerCollection[towerId].energy < (this.towerCollection[towerId].energyCapacity / factor)) {
            return this.towerCollection[towerId];
        }
    }
};

/**
 * find a tower to bring energy to
 *
 * @returns {*}
 */
PlayRoom.prototype.getLinkForRefill = function(factor) {
    factor = factor || 1;
    for (var linkId in this.linkCollection) {
        var link = this.linkCollection[linkId];
        if (link.energy < (link.energyCapacity / factor) && Memory.linkHandling.sourceLinkCollection[link.id]) {
            return link;
        }
    }
};

/**
 * find a target to repair
 *
 * @returns {*}
 */
PlayRoom.prototype.getRepairTarget = function() {
    for (var repairTargetId in this.repairableStructureCollection) {
        if (this.repairableStructureCollection[repairTargetId].hits < this.repairableStructureCollection[repairTargetId].hitsMax) {
            return this.repairableStructureCollection[repairTargetId];
        }
    }
};

/**
 * find a energy target for harvester creeps
 *
 * @returns {*}
 */
PlayRoom.prototype.getDestinationForHarvester = function() {
    if (Memory.invaderSpotted[this.getName()]) {
        var tower = this.getTowerForRefill();
        if (tower) {
            return tower;
        }
    }

    var spawn = this.getSpawn();
    if (spawn && spawn.energy < spawn.energyCapacity) {
        return spawn;
    }

    if (this.storage && _.sum(this.storage.store) < this.storage.storeCapacity) {
        return this.storage;
    }

    for (var containerId in this.containerCollection) {
        var container = this.containerCollection[containerId];
        if (_.sum(container.store) < container.storeCapacity) {
            return container;
        }
    }

    return this.getTowerForRefill(2);
};

/**
 * get dropped energy in the room
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getDroppedEnergy = function(creep) {
    if (creep.remember('usedDroppedEnergyId')) {
        var target = Game.getObjectById(creep.remember('usedDroppedEnergyId'));
        if (target) {
            return target;
        }

        creep.forget('usedDroppedEnergyId');
    }

    var maxRange = 4;
    for (var droppedEnergyId in this.droppedEnergyCollection) {
        var droppedEnergy = this.droppedEnergyCollection[droppedEnergyId],
            path = creep.creep.pos.findPathTo(droppedEnergy);

        if (path.length <= maxRange && path.length > 0 && (droppedEnergy.amount > 100 || creep.remember('role') == c.CREEP_ROLE_HARVESTER)) {
            creep.remember('usedDroppedEnergyId', droppedEnergy.id);

            return droppedEnergy;
        }
    }
};

PlayRoom.prototype.getAlternateEnergySource = function(creep) {
    this.alternateEnergySourceCollection.sort(function (a, b) {
        return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
    });

    if (this.alternateEnergySourceCollection[0]) {
        return this.alternateEnergySourceCollection[0];
    }
};

/**
 * find energy source in room
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getEnergySource = function(creep) {
    if (creep.remember('usedEnergySourceId')) {
        var target = Game.getObjectById(creep.remember('usedEnergySourceId'));
        if (target) {
            return target;
        }

        creep.forget('usedEnergySourceId');
    }

    Memory.sourceBalance = Memory.sourceBalance || {};
    Memory.sourceBalance[creep.getRole()] = Memory.sourceBalance[creep.getRole()] || {};

    var sourceCount = 0, sourceTarget;
    for (var energySourceId in this.energySourceCollection) {
        var energySource = this.energySourceCollection[energySourceId];
        Memory.sourceBalance[creep.getRole()][energySource.id] = Memory.sourceBalance[creep.getRole()][energySource.id] || 0;

        if (Memory.sourceBalance[creep.getRole()][energySource.id] == 0) {
            creep.remember('usedEnergySourceId', energySource.id);
            Memory.sourceBalance[creep.getRole()][energySource.id] += 1;

            return energySource;
        }

        if (sourceCount == 0 || Memory.sourceBalance[creep.getRole()][energySource.id] <= sourceCount) {
            sourceCount = Memory.sourceBalance[creep.getRole()][energySource.id];
            sourceTarget = energySource;
        }
    }

    creep.remember('usedEnergySourceId', sourceTarget.id);
    Memory.sourceBalance[creep.getRole()][sourceTarget.id] += 1;
    return sourceTarget;
};

/**
 * get construction target
 *
 * todo more logic
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getConstructionSite = function(creep) {
    if (creep.remember('constructionSiteId')) {
        var target = Game.getObjectById(creep.remember('constructionSiteId'));
        if (target) {
            return target;
        } else {
            creep.forget('constructionSiteId');
        }
    }

    if (this.constructionSiteCollection.length > 0) {
        this.constructionSiteCollection.sort(function(a, b) {
            return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
        });

        creep.remember('constructionSiteId', this.constructionSiteCollection[0].id)
        return this.constructionSiteCollection[0];
    }
};

/**
 * find a energy source for distributor creeps
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getDistributionSource = function(creep) {
    if (this.storage) {
        return this.storage;
    }

    for (var containerId in this.containerCollection) {
        if (this.containerCollection[containerId].store[RESOURCE_ENERGY]) {
            return this.containerCollection[containerId];
        }
    }
};

/**
 * checks distribution targets validity
 *
 * @param target
 * @returns {boolean|*}
 * @private
 */
PlayRoom.prototype._checkDistributionTarget = function(target) {
    return (
            target.structureType == STRUCTURE_CONTAINER
            && target.store[RESOURCE_ENERGY] < target.storeCapacity
        ) || (
            (target.structureType == STRUCTURE_TOWER
            && target.energy < target.energyCapacity)
            || (target.structureType == STRUCTURE_EXTENSION
            && target.energy < target.energyCapacity)
            || (target.structureType == STRUCTURE_SPAWN
            && target.energy < target.energyCapacity)
            || (target.structureType == STRUCTURE_LINK
                && target.energy < target.energyCapacity
                && Memory.linkHandling.sourceLinkCollection[target.id]
            )
        );
};

/**
 * get the distributor creeps target
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getDistributionTarget = function(creep) {
    if (creep.remember('usedTarget')) {
        var target = Game.getObjectById(creep.remember('usedTarget'));
        if (!target) {
            creep.forget('usedTarget');
        } else {
            if (this._checkDistributionTarget(target)) {
                return target;
            } else {
                creep.forget('usedTarget');
            }
        }
    }

    var spawn = this.getSpawn();
    if (spawn && spawn.energy < spawn.energyCapacity) {
        return spawn;
    }

    for (var extensionId in this.extensionCollection) {
        if (this.extensionCollection[extensionId].energy < this.extensionCollection[extensionId].energyCapacity) {
            return this.extensionCollection[extensionId];
        }
    }

    var tower = this.getTowerForRefill(2);
    if (tower) {
        return tower;
    }

    var link = this.getLinkForRefill(2);
    if (link) {
        return link;
    }

    if (this.storage) {
        for (var containerId in this.containerCollection) {
            if (this.containerCollection[containerId].store[RESOURCE_ENERGY] < (this.containerCollection[containerId].storeCapacity / 2)) {
                return this.containerCollection[containerId];
            }
        }
    }

    var tower = this.getTowerForRefill();
    if (tower) {
        return tower;
    }

    var link = this.getLinkForRefill();
    if (link) {
        return link;
    }

    if (this.storage) {
        for (var containerId in this.containerCollection) {
            if (this.containerCollection[containerId].store[RESOURCE_ENERGY] < this.containerCollection[containerId].storeCapacity) {
                return this.containerCollection[containerId];
            }
        }
    }
};

/**
 * get a link to get energy from
 *
 * todo logical
 *
 * @param creep
 */
PlayRoom.prototype.getTargetLink = function(creep) {
    for (var linkId in this.linkCollection) {
        var link = this.linkCollection[linkId];
        if (link.energy > 0 && Memory.linkHandling.targetLinkCollection[link.id]) {
            return link;
        }
    }
};

/**
 * where to get energy for working creeps
 *
 * todo logical
 *
 * @param creep
 * @returns {*}
 */
PlayRoom.prototype.getEnergyStorageCollection = function(creep) {
    if (creep.remember('cachedEnergySource')) {
        var cachedEnergySource = Game.getObjectById(creep.remember('cachedEnergySource'));
        if (cachedEnergySource && cachedEnergySource.store[RESOURCE_ENERGY]) {
            return cachedEnergySource;
        }

        creep.forget('cachedEnergySource');
    }

    var targetCollection = [];
    if (this.storage && this.storage.store[RESOURCE_ENERGY] > 0) {
        targetCollection.push(this.storage);
    }

    for (var containerId in this.containerCollection) {
        if (this.containerCollection[containerId].store[RESOURCE_ENERGY]) {
            targetCollection.push(this.containerCollection[containerId]);
        }
    }

    if (targetCollection.length > 0) {
        if (targetCollection.length == 1) {
            return this._cacheEnergyStorage(creep, targetCollection[0]);
        }

        targetCollection.sort(function (a, b) {
            return creep.creep.pos.getRangeTo(a) - creep.creep.pos.getRangeTo(b);
        });

        return this._cacheEnergyStorage(creep, targetCollection[0]);
    }

    for (var extensionId in this.extensionCollection) {
        if (this.extensionCollection[extensionId].energy > 0) {
            return this.extensionCollection[extensionId];
        }
    }

    var spawn = this.getSpawn();
    if (spawn && spawn.energy == spawn.energyCapacity) {
        return spawn;
    }
};

PlayRoom.prototype._cacheEnergyStorage = function(creep, target) {
    creep.remember('cachedEnergySource', target.id);
    return target;
};

module.exports = PlayRoom;