var sourceHandler = require('main.sourceHandling');
var roleUpgrader = {

    /**
     *
     * @param creep
     */
    run: function(creep) {
        creep.memory.work = creep.memory.work || 'harvesting';

        if (creep.memory.work == 'upgrading') {
            var res = creep.upgradeController(creep.room.controller);
            switch (res) {
                case ERR_NOT_IN_RANGE: {
                    creep.moveTo(creep.room.controller);
                    return;
                }
                case ERR_NOT_ENOUGH_ENERGY: {
                    creep.memory.work = 'harvesting';
                    break;
                }
                default: return;
            }
        }

        if (creep.memory.work == 'harvesting') {
            switch (sourceHandler.getEnergy(creep)) {
                case ERR_FULL: {
                    creep.memory.work = 'upgrading';
                    return;
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = 'upgrading';
            }
        }
    }
};

module.exports = roleUpgrader;