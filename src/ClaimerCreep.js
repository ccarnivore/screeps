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
ClaimerCreep.prototype._doWork = function() {
    var remoteFlag = Game.flags['REMOTE'];
    if (!remoteFlag) {
        return;
    }

    if (this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this.walk(remoteFlag);
        return;
    }

    // claim controller
    var controller = this.creep.room.controller,
        res;

    if (Memory.roomCount < Game.gcl.level) {
        res = this.creep.claimController(controller);
    } else {
        res = this.creep.reserveController(controller);
    }

    if (res == ERR_NOT_IN_RANGE) {
        this.walk(controller);
    }
};

module.exports = ClaimerCreep;
