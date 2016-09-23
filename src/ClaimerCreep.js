/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function ClaimerCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
ClaimerCreep.prototype.doWork = function() {
    if (!Memory.remoteFlag || Memory.remoteFlag.mine) {
        this.creep.suicide();
    }

    var remoteFlag = Game.getObjectById(Memory.remoteFlag.id);
    if (!remoteFlag) {
        return;
    }

    if (this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this._walk(remoteFlag);
        return;
    }


    // claim controller
    var controller = this.creep.room.controller;
    if (this.creep.ticksToLive <= 40) {
        if (this.creep.claimController(controller) == ERR_NOT_IN_RANGE) {
            this._walk(controller);
        }
    }

    if (this.creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
        this._walk(controller);
    }
};

module.exports = ClaimerCreep;
