var c = require('main.const');

var roleHarvester = require('role.harvester');
var roleDistributor = require('role.distributor');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var sourceHandler = require('main.sourceHandling');
var creepHandler = require('main.creepHandling');
var towerController = require('main.towerController');

module.exports.loop = function () {
    var spawn = Game.spawns['Spawn1'];
    if (!spawn) {
        return;
    }

    sourceHandler.globalLookUp(spawn);
    
    creepHandler.wipeDead();
    creepHandler.checkCreepPopulation(spawn);

    if (!towerController.defendRoom(spawn.room)) {
        if (!towerController.healCreeps(spawn.room)) {
            towerController.repairStructures(spawn.room);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case c.CREEP_ROLE_BUILDER: {
                roleBuilder.run(creep);
                break;
            }
            
            case c.CREEP_ROLE_UPGRADER: {
                roleUpgrader.run(creep);
                break;
            }

            case c.CREEP_ROLE_HARVESTER: {
                roleHarvester.run(creep);
                break;
            }

            case c.CREEP_ROLE_DISTRIBUTOR: {
                roleDistributor.run(creep);
                break;
            }

        }
    }
}