var REPAIR_RELEVANCE = {
    'spawn': 100,
    'tower': 90,
    'rampart': 80,
    'extension': 70,
    'container': 70,
    'constructedWall': 10,
    'road': 50
};

var sourceHandler = require('main.sourceHandling');
var roleBuilder = {

    _repair: function(creep, target, newTarget) {
        if (newTarget) {
            console.log('set new repair target ' + target + ' (' + target.pos + ')');
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
            filter: (structure) => { return (structure.structureType != STRUCTURE_ROAD
                && structure.structureType != STRUCTURE_WALL
                && structure.hits < structure.hitsMax
            ) || (
                structure.structureType == STRUCTURE_ROAD && structure.hits < (structure.hitsMax / 2)
            ) || (
                structure.structureType == STRUCTURE_WALL && structure.hits < (structure.hitsMax / 3000)
            )
             }
        });


        if (repairTargets.length) {
            repairTargets.sort(function(a, b) {
                var valASource = a.hits,
                    valABase = a.hitsMax,
                    valBSource = b.hits,
                    valBBase = b.hitsMax,
                    defaultFactor = 2;

                var factorA = defaultFactor;
                if (a.hitsMax >= 100000000) {
                    factorA = defaultFactor * 20000;
                } else if (a.hitsMax >= 1000000) {
                    factorA = defaultFactor * 200;
                } else if (a.hitsMax >= 100000) {
                    factorA = defaultFactor * 20;
                }

                var factorB = defaultFactor;
                if (b.hitsMax >= 100000000) {
                    factorB = defaultFactor * 20000;
                } else if (b.hitsMax >= 1000000) {
                    factorB = defaultFactor * 200;
                } else if (b.hitsMax >= 100000) {
                    factorB = defaultFactor * 2;
                }

                var minA = Math.abs(valASource / (valABase / factorA)),
                    minB = Math.abs(valBSource / (valBBase / factorB));

                return minA - minB;
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

    /**
     *
     * @param creep
     */
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

            var source = sourceHandler.findSource(creep);
            var sourceRange = creep.pos.getRangeTo(source);

            if (container != undefined) {
                var containerRange = creep.pos.getRangeTo(container);

                if (containerRange <= sourceRange) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }

                    return;
                }
            }

            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                if (creep.pos.lookFor(LOOK_TERRAIN) == 'swamp') {
                    creep.pos.createConstructionSite(STRUCTURE_ROAD);
                }
            }
        }
    }
};

module.exports = roleBuilder;