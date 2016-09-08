const ROLE_BUILDER = 'builder';
const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';

const REPAIR_RELEVANCE = [
    { 'spawn': 100 },
    { 'road': 10 },
    { 'tower': 75 },
    { 'rampart': 60 },
    { 'constructedWall': 60 },
    { 'extension': 70 },
    { 'container': 70 }
];

const ENERGY_RELEVANCE = [
    { 'spawn': 100 },
    { 'tower': 75 },
    { 'extension': 75 },
    { 'container': 70 }
];

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
            case ROLE_BUILDER: {
                roleBuilder.run(creep);
                break;
            }
            
            case ROLE_UPGRADER: {
                roleUpgrader.run(creep);
                break;
            }
            
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