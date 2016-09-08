
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