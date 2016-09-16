var c = require('main.const');
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
        Memory.currentLevel = Memory.currentLevel || c.LEVEL1;
        this.checkLevel(spawn);

        var creepCount = 0;
        var creation = { harvester: 0, miner: 0, upgrader: 0, builder: 0, distributor: 0, repairer: 0 };
        var hasUpgrader = false,
            hasHarvester = false,
            hasBuilder = false,
            hasRepairer = false,
            hasDistributor = false,
            hasMiner = false;

        for (var creepName in Game.creeps) {
            creepCount ++;
            var creep = Game.creeps[creepName];

            if (!creep) {
                this.wipeDead(creepName);
            }

            creation[creep.memory.role] += 1;
            switch (creep.memory.role) {
                case c.CREEP_ROLE_HARVESTER: {
                    hasHarvester = true;
                    break;
                }
                case c.CREEP_ROLE_UPGRADER: {
                    hasUpgrader = true;
                    break;
                }
                case c.CREEP_ROLE_BUILDER: {
                    hasBuilder = true;
                    break;
                }
                case c.CREEP_ROLE_REPAIRER: {
                    hasRepairer = true;
                    break;
                }
                case c.CREEP_ROLE_DISTRIBUTOR: {
                    hasDistributor = true;
                    break;
                }
                case c.CREEP_ROLE_MINER: {
                    hasMiner = true;
                    break;
                }
            }
        }

        if (!this.creationPossible(spawn)) {
            return;
        }

        if (creepCount == 0 || !hasHarvester || creation.harvester < 2) {
            this.createCreep(spawn, c.CREEP_ROLE_HARVESTER);
            return;
        }

        if (!hasMiner) {
            this.createCreep(spawn, c.CREEP_ROLE_MINER);
            return;
        }

        if (!hasUpgrader) {
            this.createCreep(spawn, c.CREEP_ROLE_UPGRADER);
            return;
        }

        var levelDefinition = c.LEVEL_DEFINITION[Memory.currentLevel];
        if (creepCount >= c.GLOBAL_CREEP_LIMIT || creepCount >= levelDefinition.creepLimit) {
            return;
        }

        if (!hasBuilder) {
            this.createCreep(spawn, c.CREEP_ROLE_BUILDER);
            return;
        }

        if (!hasRepairer) {
            this.createCreep(spawn, c.CREEP_ROLE_REPAIRER);
            return;
        }

        if (!hasDistributor) {
            this.createCreep(spawn, c.CREEP_ROLE_DISTRIBUTOR);
            return;
        }

        for (var role in levelDefinition.creepInstances) {
            if (creation[role] < levelDefinition.creepInstances[role]) {
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
        for (var level in c.LEVEL_DEFINITION) {
            if (level <= Memory.currentLevel) {
                continue;
            }

            if (energy >= c.LEVEL_DEFINITION[level].minEnergy) {
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
                generalConstructionPlan = c.GLOBAL_BUILD_PATTERN[role],
                levelConstructionPlan = c.GLOBAL_BUILD_PATTERN[role][Memory.currentLevel],
                buildPattern = levelConstructionPlan.pattern.slice(0),
                extensionOrder = generalConstructionPlan.extensionOrder.slice(0),
                diff = creationEnergy - levelConstructionPlan.cost;

            console.log('creationEnergy: ' + creationEnergy);
            console.log('buildPattern before: ' + JSON.stringify(buildPattern));

            if (diff >= c.MIN_ENERGY_CHUNK) {
                var i = 0, x = 0, part, cost;
                while (diff >= c.MIN_ENERGY_CHUNK) {
                    if (x > 12) {
                        break;
                    }

                    if (i == extensionOrder.length) {
                        i = 0;
                    }

                    part = extensionOrder[i];
                    cost = BODYPART_COST[part];

                    if (diff - cost >= 0) {
                        x++;
                        buildPattern.push(part);
                        diff -= cost;
                    } else {
                        break;
                    }

                    i++;
                }
            }

            console.log('buildPattern after: ' + JSON.stringify(buildPattern));
            var creepArgs = {role: role, canRepair: false, birthRoom: spawn.room.name};
            creepArgs.canRepair = Memory.isRepairBuilder;
            if (role == c.CREEP_ROLE_BUILDER) {
                Memory.isRepairBuilder = !Memory.isRepairBuilder;
            }

            console.log(spawn.createCreep(buildPattern, null, creepArgs));
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
            return energy >= c.MIN_CREEP_ENERGY_LEVEL;
        }

        return this.getCreationEnergy(spawn) >= c.GLOBAL_BUILD_PATTERN[role][Memory.currentLevel].cost;
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