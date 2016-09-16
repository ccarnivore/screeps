var c = require('main.const');

function SourceHandler(playRoom) {
    this.room = playRoom;
}

/**
 * inner mining function
 *
 * @param creep
 * @param type
 * @param target
 * @returns {*}
 * @private
 */
SourceHandler.prototype._getEnergy = function(creep, type, target) {
    var res;
    switch (type) {
        case RESOURCE_ENERGY: {
            res = creep.creep.pickup(target);
            break;
        }

        case STRUCTURE_CONTAINER: {
            res = creep.creep.withdraw(target, RESOURCE_ENERGY);
            break;
        }

        case LOOK_SOURCES: {
            res = creep.creep.harvest(target);
            break;
        }
    }

    if (res == ERR_NOT_IN_RANGE) {
        creep._walk(target);
        return true;
    }

    return res;
};

SourceHandler.prototype.getEnergy = function(creep) {
    var energySource;
    if (energySource = this.room.getDroppedEnergy(creep)) {
        return this._getEnergy(creep, RESOURCE_ENERGY, energySource);
    }

    if (creep.remember('role') == c.CREEP_ROLE_DISTRIBUTOR) {
        var usedContainer = this.room.getContainer(creep);
        if (!usedContainer) {
            return ERR_INVALID_ARGS;
        }

        creep.remember('usedEnergyContainer', usedContainer.id);
        return this._getEnergy(creep, STRUCTURE_CONTAINER, usedContainer);
    }

    if (creep.remember('role') == c.CREEP_ROLE_MINER || creep.remember('role') == c.CREEP_ROLE_HARVESTER) {
        var resource = this.room.getEnergyResource(creep);
        return this._getEnergy(creep, LOOK_SOURCES, resource);
    }

    energySource = this.room.getEnergyStorageCollection(creep);
    return this._getEnergy(creep, STRUCTURE_CONTAINER, energySource);
};



module.exports = SourceHandler;