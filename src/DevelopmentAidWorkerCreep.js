var c = require('Const');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function DevelopmentAidWorkerCreep(creep) {
    this.creep = creep;
}

/**
 * move creep over to the new world
 *
 * @private
 */
DevelopmentAidWorkerCreep.prototype._preHarvesting = function() {
    var remoteFlag = Game.flags['REMOTE'];
    if (remoteFlag && this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this.walk(remoteFlag);
        return;
    }
};

/**
 * units main routing
 */
DevelopmentAidWorkerCreep.prototype._doWork = function() {
    var remoteFlag = Game.flags['REMOTE'];
    if (remoteFlag && this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this.walk(remoteFlag);
        return;
    }

    var controller = this.getRoom().getRoomController();
    if (controller.ticksToDowngrade <= 1000) {
        if (this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            this.walk(controller);
        }
    }

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

module.exports = DevelopmentAidWorkerCreep;
