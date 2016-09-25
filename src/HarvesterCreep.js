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
    var target = this.getRoom().getDestinationForHarvester();
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
            if (this.getRoom().getName() != this.remember('birthRoom')) {
                var exitDir = this.getRoom().room.findExitTo(this.remember('birthRoom'));
                var exit = this.creep.pos.findClosestByRange(exitDir);
                this.walk(exit);
            }

            return;
        }
    }
};

module.exports = HarvesterCreep;
