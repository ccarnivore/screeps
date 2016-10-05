var c = require('Const');
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
        this.morphRole(c.CREEP_ROLE_HARVESTER);
    }
};

module.exports = RepairCreep;
