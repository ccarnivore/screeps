
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

var ROLE_BUILDER = 'builder';
var ROLE_HARVESTER = 'harvester';
var ROLE_UPGRADER = 'upgrader';