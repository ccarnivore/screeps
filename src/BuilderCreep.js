var c = require('Const');

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
BuilderCreep.prototype._doWork = function() {
    var target = this.getRoom().getConstructionSite(this);
    if (target) {
        switch(this.creep.build(target)) {
            case ERR_NOT_IN_RANGE: {
                this.walk(target);
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

        this._isHarvesting(true);
    }
};

module.exports = BuilderCreep;
