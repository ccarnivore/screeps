var REPAIR_RELEVANCE = [
    { 'spawn': 100 },
    { 'road': 10 },
    { 'tower': 75 },
    { 'rampart': 60 },
    { 'constructedWall': 60 },
    { 'extension': 70 },
    { 'container': 70 }
];

var sourceHandler = require('main.sourceHandling');
var roleBuilder = {

    _repair: function(creep, target, newTarget) {
        if (newTarget) {
            console.log('set new repair target');
            creep.memory.repairTargetId = target.id;
            creep.memory.repairTargetTime = Game.time;
        }

        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },

    /**
     * creeps repair routine
     *
     * @param creep
     * @returns {boolean}
     */
    repair: function(creep) {
        if (creep.memory.repairTargetId) {
            if (creep.memory.repairTargetTime && ((Game.time - creep.memory.repairTargetTime) < 50)) {
                var target = Game.getObjectById(creep.memory.repairTargetId);
                if (target && (target.hits < target.hitsMax)) {
                    this._repair(creep, target, false);
                    return true;
                }
            }
        }

        var repairTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {return structure.hits < structure.hitsMax}
        });

        if (repairTargets.length) {
            repairTargets.sort(function(a, b) {
                var valASource = a.hits,
                    valABase = a.hitsMax,
                    valBSource = b.hits,
                    valBBase = b.hitsMax;

                var diffFactor = a.hitsMax / b.hitsMax;
                return ((valASource * diffFactor) / valABase) - ((valBSource * diffFactor) / valBBase);
            });

            this._repair(creep, repairTargets[0], true);
            return true;
        }

        return false;
    },

    /**
     * creep build routine
     *
     * @param creep
     * @returns {boolean}
     */
    build: function(creep) {
        var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(buildTargets.length) {
            if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(buildTargets[0]);
            }

            return true;
        }

        return false;
    },

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
            if (creep.memory.canRepair) {
                if (this.repair(creep)) {
                    return;
                }
            }

            if (!this.build(creep)) {
                this.repair(creep);
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