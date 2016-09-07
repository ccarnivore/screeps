var sourceHandler = require('main.sourceHandling');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }   
        if(!creep.memory.working && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => { return (structure.hits < structure.hitsMax); }
            });

            if (repairTargets.length) {
                if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            }

            var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildTargets.length) {
                if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[0]);
                }
            }
        }
        else {
            var mySource = sourceHandler.findSource(creep);
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource);
            }
        }
    }
};

module.exports = roleBuilder;