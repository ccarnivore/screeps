var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repair');
var sourceHandler = require('main.sourceHandling');
var creepHandler = require('main.creepHandling');

module.exports.loop = function () {

    sourceHandler.globalLookUp(Game.spawns['Spawn1']);
    
    creepHandler.wipeDead();
    creepHandler.checkCreepPopulation(Game.spawns['Spawn1']);

    /*var tower = Game.getObjectById('b94effd8265d4ad18cc18e12');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'builder': {
                roleBuilder.run(creep);
                break;
            }
            
            case 'upgrader': {
                roleUpgrader.run(creep);
                break;
            }
            
            case 'repair': {
                roleRepairer.run(creep);
                break;
            }
            
            case 'harvester': {
                roleHarvester.run(creep);
                break;
            }

            default: {
                creep.say('no role. suicide');
                console.log(creep.id + ' suicide - no role');
                creep.suicide();
            }

        }
    }
}