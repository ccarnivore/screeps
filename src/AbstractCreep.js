var cache = require('Cache'),
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
 * indicates the unit needs energy and is upgrading
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
 * move creep to target
 * if on swamp, collect the info
 *
 * @param target
 * @private
 */
AbstractCreep._walk = function(target) {
    this.creep.moveTo(target);
    if (this.creep.pos.lookFor(LOOK_TERRAIN) == 'swamp') {
        cache.setPersistence(true);
        var possibleRoad = cache.get('possibleRoadConstruction') || {};
        possibleRoad[target] += 1;
        cache.set('possibleRoadConstruction', possibleRoad);
        cache.setPersistence(false);
    }
};

module.exports = AbstractCreep;
