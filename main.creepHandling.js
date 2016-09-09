var level1 = 'level1',
    level2 = 'level2';

var levelDefinition = {
    level1: { minEnergy: 0 }, level2: { minEnergy: 400 }
};

var creepLimit = 10;
var minEnergyChunk = 50;
var minCreepEnergyLevel = 200;

var globalBuildPattern = {
    harvester: {
        extensionOrder: [CARRY, CARRY, WORK, MOVE],
        level1: {
            pattern: [WORK, CARRY, MOVE],
            cost: 200
        },
        level2: {
            pattern: [WORK, CARRY, MOVE],
            cost: 200
        },
    },
    upgrader: {
        extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
        level1: {
            pattern: [WORK, CARRY, MOVE],
            cost: 200
        },
        level2: {
            pattern: [WORK, WORK, CARRY, CARRY, MOVE],
            cost: 350
        }
    },
    builder: {
        extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
        level1: {
            pattern: [WORK, CARRY, MOVE],
            cost: 200
        },
        level2: {
            pattern: [WORK, WORK, CARRY, CARRY, MOVE],
            cost: 350
        }
    }
};

var limitation = {
    level1: {
        harvester: 2,
        builder: 1,
        upgrader: 1
    },
    level2: {
        harvester: 4,
        builder: 3,
        upgrader: 3
    },
};

var creepHandler = {

    /**
     * wipe out dead creeps memory
     *
     * @param creep
     */
    wipeDead: function(creep) {
        if (creep != undefined) {
            delete Memory.creeps[creep];
            return;
        }
        
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },

    /**
     * checks creeps population
     * to fixed limits
     *
     * @param spawn
     */
    checkCreepPopulation: function(spawn) {
        Memory.currentLevel = Memory.currentLevel || level1;
        this.checkLevel(spawn);

        var creepCount = 0;
        var creation = { harvester: 0, upgrader: 0, builder: 0 };
        var hasUpgrader = false;

        for (var creepName in Game.creeps) {
            creepCount ++;
            var creep = Game.creeps[creepName];

            if (!creep) {
                wipeDead(creepName);
            }

            creation[creep.memory.role] += 1;
            if (creep.memory.role == 'upgrader') {
                hasUpgrader = true;
            }
        }

        if (!this.creationPossible(spawn)) {
            return;
        }

        if (creepCount == 0) {
            this.createCreep(spawn, 'harvester');
            return;
        }

        if (!hasUpgrader) {
            this.createCreep(spawn, 'upgrader');
            return;
        }

        if (creepCount >= creepLimit) {
            return;
        }

        for (var role in limitation[Memory.currentLevel]) {
            if (creation[role] < limitation[Memory.currentLevel][role]) {
                this.createCreep(spawn, role);
                return;
            }
        }
    },

    /**
     * checks current creeps level depends on
     * available energy
     *
     * @param spawn
     */
    checkLevel: function(spawn) {
        var energy = this.getCreationEnergy(spawn);
        for (var level in levelDefinition) {
            if (level <= Memory.currentLevel) {
                continue;
            }

            if (energy >= levelDefinition[level].minEnergy) {
                console.log('upgrading level to ' + level);
                Memory.currentLevel = level;
            }
        }
    },

    /**
     * creates a creep
     *
     * @param spawn
     * @param role
     */
    createCreep: function(spawn, role) {
        console.log('try create ' + role);
        if (this.creationPossible(spawn, role)) {
            var creationEnergy = this.getCreationEnergy(spawn),
                generalGonstructionPlan = globalBuildPattern[role],
                levelConstructionPlan = globalBuildPattern[role][Memory.currentLevel],
                buildPattern = levelConstructionPlan.pattern.slice(0),
                extensionOrder = generalGonstructionPlan.extensionOrder.slice(0),
                diff = creationEnergy - levelConstructionPlan.cost;

            console.log('creationEnergy: ' + creationEnergy);
            console.log('buildPattern before: ' + JSON.stringify(buildPattern));

            if (diff >= minEnergyChunk) {
                var i = 0, part, cost;
                while (diff >= minEnergyChunk) {
                    if (i == extensionOrder.length) {
                        i = 0;
                    }

                    part = extensionOrder[i];
                    cost = BODYPART_COST[part];

                    if (diff - cost >= 0) {
                        buildPattern.push(part);
                        diff -= cost;
                    } else {
                        break;
                    }

                    i++;
                }
            }

            console.log('buildPattern after: ' + JSON.stringify(buildPattern));
            var creepArgs = {role: role, canRepair: false};
            if (role == 'builder') { Memory.isRepairBuilder = !Memory.isRepairBuilder; }
            creepArgs.canRepair = Memory.isRepairBuilder;

            spawn.createCreep(buildPattern, null, creepArgs);
        } else {
            console.log('create ' + role + ' failed - no energy');
        }
    },

    /**
     * spawn can create creep
     *
     * @param spawn
     * @param role
     * @returns {boolean}
     */
    creationPossible: function(spawn, role) {
        var energy = this.getCreationEnergy(spawn);
        if (role == undefined) {
            return energy >= minCreepEnergyLevel;
        }

        return this.getCreationEnergy(spawn) >= globalBuildPattern[role][Memory.currentLevel].cost;
    },

    /**
     *
     * @param spawn
     * @returns {number}
     */
    getCreationEnergy: function(spawn) {
        var energy = spawn.energy;
        var extensionCollection = spawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION) }
        });

        for (var extension in extensionCollection) {
            energy += extensionCollection[extension].energy;
        }

        return energy;
    }

    
}

module.exports = creepHandler;