var c = require('Const');

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

        case STRUCTURE_LINK:
        case STRUCTURE_CONTAINER: {
            res = creep.creep.withdraw(target, RESOURCE_ENERGY);
            break;
        }

        case LOOK_SOURCES: {
            res = creep.creep.harvest(target);
            if (res == ERR_NOT_ENOUGH_RESOURCES) {
                if (creep.creep.pos.getRangeTo(target) > 1) {
                    res = ERR_NOT_IN_RANGE;
                }
            }

            break;
        }
    }

    if (res == ERR_NOT_IN_RANGE) {
        creep.walk(target);
        return true;
    }

    return res;
};

SourceHandler.prototype.getEnergy = function(creep) {
    var energySource, resource, alternateEnergySource, res;
    if (creep.getRole() != c.CREEP_ROLE_MINER && creep.getRole() != c.CREEP_ROLE_DEVELOPMENT_AID_WORKER) {
        if (energySource = this.room.getDroppedEnergy(creep)) {
            if (res = this._getEnergy(creep, RESOURCE_ENERGY, energySource) != ERR_INVALID_TARGET) {
                return res;
            }
        }
    }

    if (creep.getRole() == c.CREEP_ROLE_MINER
        || creep.getRole() == c.CREEP_ROLE_HARVESTER
        || creep.getRole() == c.CREEP_ROLE_DEVELOPMENT_AID_WORKER) {
        resource = this.room.getEnergySource(creep);
        return this._getEnergy(creep, LOOK_SOURCES, resource);
    }

    if (creep.getRole() == c.CREEP_ROLE_DISTRIBUTOR) {
        var usedContainer = this.room.getDistributionSource(creep);
        if (!usedContainer) {
            return ERR_INVALID_ARGS;
        }

        creep.remember('usedEnergyContainer', usedContainer.id);
        return this._getEnergy(creep, STRUCTURE_CONTAINER, usedContainer);
    }

    if (creep.getRole() == c.CREEP_ROLE_UPGRADER) {
        var link = this.room.getTargetLink(creep);
        if (link) {
            return this._getEnergy(creep, STRUCTURE_LINK, link);
        }
    }

    energySource = this.room.getEnergyStorageCollection(creep);
    if (!energySource && creep.getRole() == c.CREEP_ROLE_UPGRADER) {
        if (alternateEnergySource = this.room.getAlternateEnergySource(creep)) {
            return this._getEnergy(creep, RESOURCE_ENERGY, alternateEnergySource);
        }
    }

    return this._getEnergy(creep, STRUCTURE_CONTAINER, energySource);
};



module.exports = SourceHandler;