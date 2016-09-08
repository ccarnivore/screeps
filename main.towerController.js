var towerController = {

    /**
     * basic room defending
     * @param room
     */
    defendRoom: function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length == 0) {
            console.log('no hostile found');
            return;
        }

        if(hostiles.length > 0) {
            console.log('hostile creeps spotted');
            var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => { if (tower.energy >= 50) tower.attack(hostiles[0]) });
        }
    },

    healCreeps: function(room) {
        var injuredCreeps = room.find(FIND_CREEPS, {filter: (creep) => { return creep.hits < creep.hitsMax }});
        if (injuredCreeps.length == 0) {
            console.log('nobody hurt');
            return;
        }

        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => {if (tower.energy >= 100) tower.heal(injuredCreeps[0]) });
    },

    repairStructures: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    }
};

module.exports = towerController;