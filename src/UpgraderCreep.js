var PlayRoomHandler = require('PlayRoomHandler');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function UpgraderCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
UpgraderCreep.prototype.doWork = function() {
    var room = PlayRoomHandler.getRoom(this.creep.room.name),
        sourceHandler = room.sourceHandler;

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isUpgrading()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var controller = room.getRoomController();
        if (controller) {
            switch(this.creep.upgradeController(controller)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(controller);
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
                this._isUpgrading(true);
                return;
            }
            case ERR_NOT_ENOUGH_RESOURCES: {
                if (this._hasEnergy()) {
                    this._isUpgrading(true);
                }
                break;
            }
            case ERR_INVALID_ARGS: {
                if (this._hasEnergy()) {
                    this._isUpgrading(true);
                }
                break;
            }
        }

        if (this._isFullyLoaded()) {
            this._isUpgrading(true);
        }
    }

};

module.exports = UpgraderCreep;
