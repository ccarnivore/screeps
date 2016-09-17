/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function ScouterCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
ScouterCreep.prototype.doWork = function() {
    var resourceFlag = Game.flags['R1'];
    if (!resourceFlag) {
        console.log('no scouting target');
        return;
    }

    if (resourceFlag.pos.roomName != this.creep.pos.roomName) {
        this._walk(resourceFlag);
        return;
    }

    // claim controller
    var controller = this.creep.room.controller;
    if (this.creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
        this._walk(controller);
    }
};

module.exports = ScouterCreep;
