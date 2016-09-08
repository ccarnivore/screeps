var ENERGY_RELEVANCE = [
    { 'spawn': 100 },
    { 'tower': 75 },
    { 'extension': 75 },
    { 'container': 70 }
];

var sourceHandler = require('main.sourceHandling');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var mySource = sourceHandler.findSource(creep);
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                }
            });

            targets.sort(function(a, b) {
                console.log(a, b);
            });

            if(targets.length > 0) {
                var target = undefined;
                for (var currentTarget in targets) {
                    if (targets[currentTarget].structureType == STRUCTURE_SPAWN) {
                        target = currentTarget;
                        break;
                    }

                    if (targets[currentTarget].structureType == STRUCTURE_EXTENSION) {
                        target = currentTarget;
                        break;
                    }

                    if (targets[currentTarget].structureType == STRUCTURE_TOWER) {
                        target = currentTarget;
                        break;
                    }

                    target = currentTarget;
                }

                if(creep.transfer(targets[target], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[target]);
                }
            } else {
                // nothing to do.. change role
                creep.say('morph');
                creep.memory.role = 'builder';
                creep.memory.canRepair = true;
                return;

            }
        }
    }

};

module.exports = roleHarvester;