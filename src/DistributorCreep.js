var PlayRoomHandler = require('PlayRoomHandler');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function DistributorCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
DistributorCreep.prototype.doWork = function() {
    var room = PlayRoomHandler.getRoom(this.creep.room.name),
        sourceHandler = room.sourceHandler;

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isTransferring()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var target = room.getDestinationForHarvester(this);
        if (target) {
            this.remember('usedTarget', target.id);
            switch(this.creep.transfer(target, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    this._isHarvesting(true);
                    break;
                }
                case ERR_FULL: {
                    return;
                }
            }
        } else {
            if (this._isFullyLoaded()) {
                console.log(this.creep, 'resting');
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isHarvesting()) {
        switch (sourceHandler.getEnergy(this)) {
            case ERR_FULL: {
                this._isTransferring(true);
                return;
            }
            case ERR_NOT_ENOUGH_RESOURCES: {
                if (this._hasEnergy()) {
                    this._isTransferring(true);
                }
                break;
            }
            case ERR_INVALID_ARGS: {
                if (this._hasEnergy()) {
                    this._isTransferring(true);
                }
                break;
            }
        }

        if (this._isFullyLoaded()) {
            this._isTransferring(true);
        }
    }

};

module.exports = DistributorCreep;
