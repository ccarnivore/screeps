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
DistributorCreep.prototype._doWork = function() {
    var target = this.getRoom().getDistributionTarget(this);
    if (target) {
        switch(this.creep.transfer(target, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE: {
                this.walk(target);
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

module.exports = DistributorCreep;
