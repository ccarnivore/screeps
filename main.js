require('main.const');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var sourceHandler = require('main.sourceHandling');
var creepHandler = require('main.creepHandling');

module.exports.loop = function () {
    sourceHandler.globalLookUp(Game.spawns['Spawn1']);
    
    creepHandler.wipeDead();
    creepHandler.checkCreepPopulation(Game.spawns['Spawn1']);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            //case 'builder': {
            case ROLE_BUILDER: {
                roleBuilder.run(creep);
                break;
            }
            
            //case 'upgrader': {
            case ROLE_UPGRADER: {
                roleUpgrader.run(creep);
                break;
            }
            
            //case 'harvester': {
            case ROLE_HARVESTER: {
                roleHarvester.run(creep);
                break;
            }

            default: {
                creep.say('no known role. suicide');
                console.log(creep.id + ' suicide - no role');
                creep.suicide();
            }

        }
    }
}