var sourceHandler = require('main.sourceHandling');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER );
                    }
            });

            if (containers.length) {
                var closest = undefined;
                var target = undefined;
                for (var i = 0; i < containers.length; i++) {
                    var container = containers[i];
                    if (container.store[RESOURCE_ENERGY] < 50) {
                        continue;
                    }

                    var range = creep.pos.getRangeTo(container);
                    if (closest == undefined || range < closest) {
                        target = container;
                        closest = range;
                    }
                }

                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                var mySource = sourceHandler.findSource(creep);
                if (creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mySource);
                }
            }
        }
    }
};

module.exports = roleUpgrader;