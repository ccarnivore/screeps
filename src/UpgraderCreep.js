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
UpgraderCreep.prototype._doWork = function() {
    var controller = this.getRoom().getRoomController();
    if (controller) {
        switch(this.creep.upgradeController(controller)) {
            case ERR_NOT_IN_RANGE: {
                this.walk(controller);
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
            console.log(this.creep, this.remember('role'), 'resting');
            return;
        }

        this._isHarvesting(true);
    }
};

module.exports = UpgraderCreep;
