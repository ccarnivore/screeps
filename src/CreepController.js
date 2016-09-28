var Util = require('Util'),
    c = require('Const'),
    AbstractCreep = require('AbstractCreep'),
    HarvesterCreep = require('HarvesterCreep'),
    MinerCreep = require('MinerCreep'),
    ClaimerCreep = require('ClaimerCreep'),
    DistributorCreep = require('DistributorCreep'),
    UpgraderCreep = require('UpgraderCreep'),
    BuilderCreep = require('BuilderCreep'),
    DevelopmentAidWorkerCreep = require('DevelopmentAidWorkerCreep'),
    WarriorCreep = require('WarriorCreep'),
    HealerCreep = require('HealerCreep'),
    RepairCreep = require('RepairCreep');

/**
 * creep controller
 *
 * @param playRoom
 * @constructor
 */
function CreepController(playRoom) {
    this.playRoom = playRoom;
    this.creepCount = 0;

    this.creepStats = {
        harvester: 0, miner: 0, upgrader: 0,
        builder: 0, repairer: 0, distributor: 0,
        claimer: 0, developmentAidWorker: 0, warrior: 0,
        healer: 0
    };

    this.hasUpgrader = false;
    this.hasHarvester = false;
    this.hasBuilder = false;
    this.hasRepairer = false;
    this.hasMiner = false;

    this.wrappedCreepCollection = [];
}

/**
 * main function
 */
CreepController.prototype.run = function() {
    this._censusCreepPopulation();
    if (this.playRoom.isMyRoom()) {
        this._populateRoom();
    }

    this._doWork();
    this._buryDead();

    console.log('creepsStats', this.playRoom.getName(), this.creepCount, JSON.stringify(this.creepStats));
};

/**
 * let the creeps doing their work
 *
 * @private
 */
CreepController.prototype._doWork = function() {
    this.wrappedCreepCollection.forEach(function(wrappedCreep) {
        switch (wrappedCreep.getRole()) {
            case c.CREEP_ROLE_HARVESTER:
            case c.CREEP_ROLE_MINER:
            case c.CREEP_ROLE_CLAIMER:
            case c.CREEP_ROLE_DISTRIBUTOR:
            case c.CREEP_ROLE_BUILDER:
            case c.CREEP_ROLE_DEVELOPMENT_AID_WORKER:
            case c.CREEP_ROLE_UPGRADER:
            case c.CREEP_ROLE_REPAIRER: {
                wrappedCreep.doWork();
                break;
            }
            case c.CREEP_ROLE_WARRIOR:
            case c.CREEP_ROLE_HEALER: {
                console.log(wrappedCreep.creep, 'playing war');
                wrappedCreep.playWar();
                break;
            }
        }
    });
};

/**
 * as the history told us
 * check the creeps population
 *
 * @private
 */
CreepController.prototype._censusCreepPopulation = function() {
    this.playRoom.creepCollection.forEach(function (creep) {
        if (!creep) {
            this._buryDead(name);
            return;
        }

        var wrappedCreep;
        switch (creep.memory.role) {
            case c.CREEP_ROLE_BUILDER: {
                wrappedCreep = new BuilderCreep(creep);
                this.hasBuilder = true;
                break;
            }
            case c.CREEP_ROLE_REPAIRER: {
                wrappedCreep = new RepairCreep(creep);
                this.hasRepairer = true;
                break;
            }

            case c.CREEP_ROLE_UPGRADER: {
                wrappedCreep = new UpgraderCreep(creep);
                this.hasUpgrader = true;
                break;
            }

            case c.CREEP_ROLE_HARVESTER: {
                wrappedCreep = new HarvesterCreep(creep);
                this.hasHarvester = true;
                break;
            }

            case c.CREEP_ROLE_DISTRIBUTOR: {
                wrappedCreep = new DistributorCreep(creep);
                break;
            }

            case c.CREEP_ROLE_MINER: {
                wrappedCreep = new MinerCreep(creep);
                this.hasMiner = true;
                break;
            }

            case c.CREEP_ROLE_DEVELOPMENT_AID_WORKER: {
                wrappedCreep = new DevelopmentAidWorkerCreep(creep);
                break;
            }

            case c.CREEP_ROLE_CLAIMER: {
                wrappedCreep = new ClaimerCreep(creep);
                break;
            }

            case c.CREEP_ROLE_WARRIOR: {
                wrappedCreep = new WarriorCreep(creep);
                break;
            }

            case c.CREEP_ROLE_HEALER: {
                wrappedCreep = new HealerCreep(creep);
                break;
            }

            default: {
                return;
            }
        }

        Util.inherit(AbstractCreep, wrappedCreep);
        wrappedCreep.setPlayRoom(this.playRoom);
        wrappedCreep.revertMorph();

        if (wrappedCreep.remember('formerRole')) {
            switch (wrappedCreep.remember('formerRole')) {
                case c.CREEP_ROLE_BUILDER: {
                    this.hasBuilder = true;
                    break;
                }
                case c.CREEP_ROLE_REPAIRER: {
                    this.hasRepairer = true;
                    break;
                }
            }
        }

        this._discoverCreep(wrappedCreep);
        this.wrappedCreepCollection.push(wrappedCreep);

    }.bind(this));
};

/**
 * checks creeps population
 * to fixed limits
 *
 */
CreepController.prototype._populateRoom = function() {
    var levelDefinition = c.LEVEL_DEFINITION[this.playRoom.getPlayRoomLevel()];
    if (this.creepCount == 0 || !this.hasHarvester || this.creepStats[c.CREEP_ROLE_HARVESTER] < 2) {
        this._createCreep(c.CREEP_ROLE_HARVESTER);
        return;
    }

    if (!this.hasMiner || this.creepStats[c.CREEP_ROLE_MINER] < 2) {
        this._createCreep(c.CREEP_ROLE_MINER);
        return;
    }

    if (!this.hasUpgrader) {
        this._createCreep(c.CREEP_ROLE_UPGRADER);
        return;
    }


    if (this.creepCount >= c.GLOBAL_CREEP_LIMIT || this.creepCount >= levelDefinition.creepLimit) {
        // occupation in progress
        if (Game.flags['REMOTE'] && Memory.developmentAidWorkerCount < 2) {
            this._createCreep(c.CREEP_ROLE_DEVELOPMENT_AID_WORKER);
        }

        return;
    }

    if (!this.hasBuilder) {
        this._createCreep(c.CREEP_ROLE_BUILDER);
        return;
    }

    if (!this.hasRepairer) {
        this._createCreep(c.CREEP_ROLE_REPAIRER)
        return;
    }

    for (var role in levelDefinition.creepInstances) {
        if (this.creepStats[role] < levelDefinition.creepInstances[role]) {
            this._createCreep(role);
            return;
        }
    }

    if (Game.flags['REMOTE'] && Memory.developmentAidWorkerCount < 2) {
        this._createCreep(c.CREEP_ROLE_DEVELOPMENT_AID_WORKER);
    }
};

/**
 * creates a creep
 *
 * @param role
 */
CreepController.prototype._createCreep = function(role) {
    console.log('creepCtrl::_createCreep', this.playRoom.getName(), role);
    if (role == c.CREEP_ROLE_DISTRIBUTOR) {
        if (this.playRoom.extensionCollection.length == 0 || (!this.playRoom.storage && this.playRoom.containerCollection.length == 0)) {
            return;
        }
    }

    if (role == c.CREEP_ROLE_CLAIMER) {
        if (!Game.flags['REMOTE']) {
            return;
        }
    }

    if (this._creationPossible(role)) {
        var creationEnergy = this.playRoom.getSpawnEnergyTotal(),
            generalConstructionPlan = c.GLOBAL_BUILD_PATTERN[role],
            levelConstructionPlan = c.GLOBAL_BUILD_PATTERN[role][this.playRoom.getPlayRoomLevel()],
            buildPattern = levelConstructionPlan.pattern.slice(0),
            extensionOrder = generalConstructionPlan.extensionOrder.slice(0),
            diff = creationEnergy - levelConstructionPlan.cost;

        console.log('creepController::_createCreep::creation energy', creationEnergy);
        console.log('creepController::_createCreep::build pattern default', JSON.stringify(buildPattern));

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

        console.log('creepController::_createCreep::build pattern used', JSON.stringify(buildPattern));
        var spawn = this.playRoom.getSpawn();
        var spawnResult = spawn.createCreep(buildPattern, null, {role: role, birthRoom: spawn.room.name});
        console.log('creepController::_createCreep::spawn result', spawnResult);

        return spawnResult;
    } else {
        console.log('creepController::_createCreep::spawning failed - no energy', role);
    }
};

/**
 * spawn can create creep
 *
 * @param role
 * @returns {boolean}
 */
CreepController.prototype._creationPossible = function(role) {
    var energy = this.playRoom.getSpawnEnergyTotal();
    if (role == undefined) {
        return energy >= c.MIN_CREEP_ENERGY_LEVEL;
    }

    return energy >= c.GLOBAL_BUILD_PATTERN[role][this.playRoom.getPlayRoomLevel()].cost;
};

/**
 * discovers the creep
 *
 * @param creep
 * @private
 */
CreepController.prototype._discoverCreep = function(creep) {
    this.creepCount += 1;
    this.creepStats[creep.getRole()] += 1;
    if (creep.remember('formerRole')) {
        this.creepStats[creep.remember('formerRole')] += 1;
    }
};

/**
 * bury our dead
 *
 * @param creepToBury
 * @private
 */
CreepController.prototype._buryDead = function(creepToBury) {
    if (creepToBury != undefined) {
        delete Memory.creeps[creepToBury];
        return;
    }

    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

module.exports = CreepController;
