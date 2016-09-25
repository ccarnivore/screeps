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
    if (this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this.walk(remoteFlag);
        return;
    }

    // claim controller
    var controller = this.creep.room.controller;
    if (this.creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
        this.walk(controller);
    }
};

module.exports = ClaimerCreep;
