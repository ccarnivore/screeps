var c = require('main.const'),
    PlayRoomHandler = require('PlayRoomHandler');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function BuilderCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
BuilderCreep.prototype.doWork = function() {
    var room = PlayRoomHandler.getRoom(this.creep.room.name);

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isBuilding()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var target = room.getConstructionSite(this);
        console.log(this.creep, 'building', target);
        if (target) {
            switch(this.creep.build(target)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
            }
        } else {
            // nothing to do and fully charged
            if (this._isFullyLoaded()) {
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isHarvesting()) {
        if (!this._harvestEnergy(this)) {
            this._isBuilding(true);
        }

        if (this._isFullyLoaded()) {
            this._isBuilding(true);
        }
    }

};

module.exports = BuilderCreep;
