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
        var res = this.creep.build(target);
        switch(res) {
            case ERR_NOT_IN_RANGE: {
                this.walk(target);
                break;
            }
            case ERR_INVALID_TARGET: {
                this.forget('constructionSiteId');
                break;
            }
        }
    }
};

module.exports = BuilderCreep;
