var c = require('main.const');

var sourceHandler = require('main.sourceHandling');
var creepHandler = require('main.creepHandling');
var towerController = require('main.towerController');

var Util = require('Util'),
    AbstractCreep = require('AbstractCreep'),
    HarvesterCreep = require('HarvesterCreep'),
    DistributorCreep = require('DistributorCreep'),
    UpgraderCreep = require('UpgraderCreep'),
    BuilderCreep = require('BuilderCreep'),
    RepairCreep = require('RepairCreep'),
    PlayRoomHandler = require('PlayRoomHandler');



console.log('received tick');
PlayRoomHandler.measureWorld();

for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    if (!spawn) {
        return;
    }

    creepHandler.wipeDead();
    creepHandler.checkCreepPopulation(spawn);

    if (!towerController.defendRoom(spawn.room)) {
        if (!towerController.healCreeps(spawn.room)) {
            towerController.repairStructures(spawn.room);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var wrappedCreep;
        switch(creep.memory.role) {
            case c.CREEP_ROLE_BUILDER: {
                wrappedCreep = new BuilderCreep(creep);
                break;
            }
            case c.CREEP_ROLE_REPAIRER: {
                wrappedCreep = new RepairCreep(creep);
                break;
            }

            case c.CREEP_ROLE_UPGRADER: {
                wrappedCreep = new UpgraderCreep(creep);
                break;
            }

            case c.CREEP_ROLE_HARVESTER: {
                wrappedCreep = new HarvesterCreep(creep);
                break;
            }

            case c.CREEP_ROLE_DISTRIBUTOR: {
                wrappedCreep = new DistributorCreep(creep);
                break;
            }

            default: {
                continue;
            }
        }

        Util.inherit(AbstractCreep, wrappedCreep);
        wrappedCreep.doWork();
    }
}