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
 * gets the current level of the play room
 * level depends on available energy
 *
 * @returns {*}
 */
PlayRoom.prototype.getPlayRoomLevel = function() {
    Memory.currentLevel[this.getName()] = Memory.currentLevel[this.getName()] || c.LEVEL1;

    var energy = this.getSpawnEnergyTotal();
    for (var level in c.LEVEL_DEFINITION) {
        if (level <= Memory.currentLevel[this.getName()]) {
            continue;
        }

        if (energy >= c.LEVEL_DEFINITION[level].minEnergy) {
            console.log('upgrading level to ' + level);
            Memory.currentLevel[this.getName()] = level;
        }
    }


    return Memory.currentLevel[this.getName()];
};

/**
 * get the current room spawn energy
 * @returns {number}
 */
PlayRoom.prototype.getSpawnEnergyTotal = function() {
    if (this.spawnEnergy == 0) {
        this.spawnEnergy += this.getSpawn().energy;

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
};

/**
 * find a tower to bring energy to
 *
 * @returns {*}
 */
PlayRoom.prototype.getTowerForRefill = function() {
    for (var towerId in this.towerCollection) {
        if (this.towerCollection[towerId].energy < this.towerCollection[towerId].energyCapacity) {
            return this.towerCollection[towerId];
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
    if (Memory.invaderSpotted) {
        var tower = this.getTowerForRefill();
        if (tower) {
            return tower;
        }
    }

    var spawn = this.getSpawn();
    if (spawn.energy < spawn.energyCapacity) {
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

    return this.getTowerForRefill();
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
        var droppedEnergy = this.droppedEnergyCollection[droppedEnergyId];
        if (creep.creep.pos.findPathTo(droppedEnergy).length <= maxRange) {
            creep.remember('usedDroppedEnergyId', droppedEnergy.id);

            return droppedEnergy;
        }
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
    if (this.constructionSiteCollection.length > 0) {
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

    for (var extensionId in this.extensionCollection) {
        if (this.extensionCollection[extensionId].energy < this.extensionCollection[extensionId].energyCapacity) {
            return this.extensionCollection[extensionId];
        }
    }

    for (var linkId in this.linkCollection) {
        var link = this.linkCollection[linkId];
        if (link.energy < (link.energyCapacity / 2) && Memory.linkHandling.sourceLinkCollection[link.id]) {
            return link;
        }
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
    for (var containerId in this.containerCollection) {
        if (this.containerCollection[containerId].store[RESOURCE_ENERGY]) {
            return this.containerCollection[containerId];
        }
    }

    for (var extensionId in this.extensionCollection) {
        if (this.extensionCollection[extensionId].energy > 0) {
            return this.extensionCollection[extensionId];
        }
    }

    if (this.storage && this.storage.store[RESOURCE_ENERGY] > 0) {
        return this.storage;
    }

    var spawn = this.getSpawn();
    if (spawn.energy == spawn.energyCapacity) {
        return spawn;
    }
};

module.exports = PlayRoom;