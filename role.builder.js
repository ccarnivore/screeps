var sourceHandler = require('main.sourceHandling');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = undefined;
        }   
        if(!creep.memory.working && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => { return (structure.hits < structure.hitsMax); }
            });

            if (repairTargets.length) {
                creep.say('repairing');
                if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            }

            var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length) {
                creep.say('building');
                if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0]);
                }
            }
        }
        else {
            var container = sourceHandler.findContainer(creep);
            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }

                return;
            }

            var mySource = sourceHandler.findSource(creep);
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource);
            }
        }
    }
};

module.exports = roleBuilder;