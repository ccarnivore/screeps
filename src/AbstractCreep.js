var c = require('Const');

var AbstractCreep = {
    playRoom: null
};

AbstractCreep.setPlayRoom = function(playRoom) {
    this.playRoom = playRoom;
};

/**
 * gets the creeps role
 *
 * @returns {*}
 */
AbstractCreep.getRole = function() {
    return this.remember('role');
};

/**
 * gets the current room
 *
 * @returns room
 */
AbstractCreep.getRoom = function() {
    return this.playRoom;
};

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
    return _.sum(this.creep.carry) == this.creep.carryCapacity;
};

/**
 * handling creeps harvesting
 *
 * @private
 */
AbstractCreep._handleHarvesting = function() {
    if (!this._hasEnergy()) {
        this._isHarvesting(true);
    }

    if (!this._isHarvesting()) {
        return;
    }

    if (this._isFullyLoaded() || !this._harvestEnergy(this)) {
        this._isWorking(true);
    }
};

/**
 * checks if the creep has anything to do
 *
 * @returns {*}
 * @private
 */
AbstractCreep._isEmployed = function() {
    return this.remember('task');
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
 * indicates the unit
 *
 * @param startWorking let the unit start their work
 * @returns {boolean}
 * @private
 */
AbstractCreep._isWorking = function(startWorking) {
    if (startWorking == undefined) {
        return this.remember('task') == c.CREEP_TASK_WORKING;
    }

    return this.remember('task', c.CREEP_TASK_WORKING);
};

AbstractCreep.doWork = function() {
    if (!this._isEmployed()) {
        this._isHarvesting(true);
    }

    this._handleHarvesting();
    if (this._isWorking()) {
        this._doWork();
    }
};

/**
 * harvesting energy
 *
 * @param creep
 * @returns {boolean}
 * @private
 */
AbstractCreep._harvestEnergy = function(creep) {
    var res = this.playRoom.sourceHandler.getEnergy(creep);
    switch (res) {
        case ERR_FULL: {
            return false;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return !this._hasEnergy();
        }
        case ERR_INVALID_ARGS: {
            return !this._hasEnergy();
        }
        case ERR_INVALID_TARGET: {
            return false;
        }
    }

    return true;
};

/**
 * move creep to target
 *
 * @param target
 * @private
 */
AbstractCreep.walk = function(target) {
    this.creep.moveTo(target, {reusePath: 10});
};

module.exports = AbstractCreep;
