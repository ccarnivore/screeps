/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function HarvesterCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
HarvesterCreep.prototype._doWork = function() {
    var target = this.getRoom().getDestinationForHarvester(this);
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
        }
    } else {
        if (this._isFullyLoaded()) {
            console.log('harvesterCreep::doWork::', this.creep, this.getRole(), 'resting');
            return;
        }

        this._isHarvesting(true);
    }
};

module.exports = HarvesterCreep;
