var PlayRoomHandler = require('PlayRoomHandler'),
    cache = require('Cache'),
    c = require('main.const');

var AbstractCreep = {};

/**
 * units memory access
 *
 * @param key
 * @param value
 * @returns {*}
 */
AbstractCreep.remember = function(key, value) {
    if (value == undefined) {
        return this.creep.memory[key];
    }

    this.creep.memory[key] = value;
    return value;
};

/**
 * remove units memory key
 *
 * @param key
 */
AbstractCreep.forget = function(key) {
    delete this.creep.memory[key];
};

/**
 * indicates the unit carries energy
 *
 * @returns {boolean}
 * @private
 */
AbstractCreep._hasEnergy = function() {
    return this.creep.carry.energy > 0;
};

/**
 * indicates the unit cannot harvest/carry more energy
 *
 * @returns {boolean}
 * @private
 */
AbstractCreep._isFullyLoaded = function() {
    return this.creep.carry.energy == this.creep.carryCapacity;
};

/**
 * indicates the unit is transferring energy
 *
 * @param startTransferring let the unit start working
 * @returns {boolean}
 * @private
 */
AbstractCreep._isTransferring = function(startTransferring) {
    if (startTransferring == undefined) {
        return this.remember('task') == c.CREEP_TASK_TRANSFERRING;
    }

    return this.remember('task', c.CREEP_TASK_TRANSFERRING);
};

/**
 * indicates the unit needs energy and is harvesting
 *
 * @param startHarvesting let the unit start harvesting
 * @returns {boolean}
 * @private
 */
AbstractCreep._isHarvesting = function(startHarvesting) {
    if (startHarvesting == undefined) {
        return this.remember('task') == c.CREEP_TASK_HARVESTING;
    }

    return this.remember('task', c.CREEP_TASK_HARVESTING);
};

/**
 * indicates the unit is upgrading
 *
 * @param startUpgrading let the unit start upgrading
 * @returns {boolean}
 * @private
 */
AbstractCreep._isUpgrading = function(startUpgrading) {
    if (startUpgrading == undefined) {
        return this.remember('task') == c.CREEP_TASK_UPGRADING;
    }

    return this.remember('task', c.CREEP_TASK_UPGRADING);
};

/**
 * indicates the unit is building
 *
 * @param startBuilding let the unit start upgrading
 * @returns {boolean}
 * @private
 */
AbstractCreep._isBuilding = function(startBuilding) {
    if (startBuilding == undefined) {
        return this.remember('task') == c.CREEP_TASK_BUILDING;
    }

    return this.remember('task', c.CREEP_TASK_BUILDING);
};

/**
 * indicates the unit is repairing
 *
 * @param startRepairing let the unit start repairing
 * @returns {boolean}
 * @private
 */
AbstractCreep._isRepairing = function(startRepairing) {
    if (startRepairing == undefined) {
        return this.remember('task') == c.CREEP_TASK_REPAIRING;
    }

    return this.remember('task', c.CREEP_TASK_REPAIRING);
};

/**
 * harvesting energy
 *
 * @param creep
 * @returns {boolean}
 * @private
 */
AbstractCreep._harvestEnergy = function(creep) {
    var room = PlayRoomHandler.getRoom(creep.creep.room.name),
        sourceHandler = room.sourceHandler;

    switch (sourceHandler.getEnergy(creep)) {
        case ERR_FULL: {
            return false;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return !this._hasEnergy();
        }
        case ERR_INVALID_ARGS: {
            return !this._hasEnergy();
        }
    }

    return true;
};

/**
 * move creep to target
 * if on swamp, collect the info
 *
 * @param target
 * @private
 */
AbstractCreep._walk = function(target) {
    this.creep.moveTo(target);
};

module.exports = AbstractCreep;
