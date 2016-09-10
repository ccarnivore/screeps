var c = require('main.const');
var sourceHandler = require('main.sourceHandling');
var roleUpgrader = {

    /**
     *
     * @param creep
     */
    run: function(creep, room) {
        creep.memory.work = creep.memory.work || c.CREEP_WORK_HARVESTING;

        if (creep.memory.work == c.CREEP_WORK_UPGRADING) {
            var res = creep.upgradeController(room.controller);
            switch (res) {
                case ERR_NOT_IN_RANGE: {
                    creep.moveTo(room.controller);
                    return;
                }
                case ERR_NOT_ENOUGH_ENERGY: {
                    creep.memory.work = c.CREEP_WORK_HARVESTING;
                    break;
                }
                default: return;
            }
        }

        if (creep.memory.work == c.CREEP_WORK_HARVESTING) {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = c.CREEP_WORK_UPGRADING;
                    return;
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = c.CREEP_WORK_UPGRADING;
            }
        }
    }
};

module.exports = roleUpgrader;