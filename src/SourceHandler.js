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

    energySource = this.room.getEnergyResource(creep);
    if (creep.remember('role') != c.CREEP_ROLE_HARVESTER) {
        var container;
        if (container = this.room.getContainer(creep)) {
            var containerRange = creep.creep.pos.getRangeTo(container);
            var sourceRange = creep.creep.pos.getRangeTo(energySource);

            if (containerRange <= sourceRange) {
                return this._getEnergy(creep, STRUCTURE_CONTAINER, container);
            }
        }
    }

    return this._getEnergy(creep, LOOK_SOURCES, energySource);
};



module.exports = SourceHandler;