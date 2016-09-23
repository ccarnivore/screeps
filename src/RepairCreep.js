/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function RepairCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
RepairCreep.prototype._doWork = function() {
    var target = this.playRoom.getRepairTarget();
    if (target) {
        switch(this.creep.repair(target)) {
            case ERR_NOT_IN_RANGE: {
                this.walk(target);
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
};

module.exports = RepairCreep;
