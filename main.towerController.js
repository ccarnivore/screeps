var towerController = {

    /**
     * basic room defending
     *
     * defend until no energy left
     *
     * @param room
     */
    defendRoom: function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length == 0) {
            return false;
        }

        Game.notify('hostile creeps spotted');
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => { tower.attack(hostiles[0]) });

        return true;
    },

    /**
     * basic creeps healing
     * heal creeps if there is a basic energy (for defend purposes) is given
     *
     * @param room
     * @returns {boolean}
     */
    healCreeps: function(room) {
        var injuredCreeps = room.find(FIND_CREEPS, {filter: (creep) => { return creep.hits < creep.hitsMax }});
        if (injuredCreeps.length == 0) {
            return false;
        }

        injuredCreeps.sort(function (a, b) {
            return a.hits / a.hitsMax - b.hits / b.hitsMax;
        });

        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => {if (tower.energy >= 100) tower.heal(injuredCreeps[0]) });

        return true;
    },

    /**
     * basic structure repairing
     * repair structures if a basic energy is given
     *
     * @param room
     * @returns {boolean}
     */
    repairStructures: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => { if (tower.energy <= 100) { return };
            var repairTarget;
            Memory.tower = Memory.tower || {};
            var towerData = Memory.tower[tower.id];
            if (towerData && towerData.repairObjectId && ((Game.time - towerData.repairObjectTime) < 50)) {
                repairTarget = Game.getObjectById(towerData.repairObjectId);
                if (repairTarget) {
                    tower.repair(repairTarget);

                    return true;
                }
            }

            var repairTargets = tower.pos.findInRange(
                FIND_MY_STRUCTURES, 5, {filter: (structure) => { return structure.structureType != STRUCTURE_WALL
                && structure.hits < structure.hitsMax }
            });
            if (repairTargets.length == 0) {
                return false;
            }

            repairTargets.sort(function (a, b) {
                return a.hits / a.hitsMax - b.hits / b.hitsMax;
            });

            repairTarget = repairTargets[0];
            Memory.tower[tower.id].repairObjectId = repairTarget.id;
            Memory.tower[tower.id].repairObjectTime = Game.time;

            tower.repair(repairTarget);
        });

        return true;
    }
};

module.exports = towerController;