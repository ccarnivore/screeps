var c = require('Const');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function WarriorCreep(creep) {
    this.creep = creep;
    this.fight = false;
}

WarriorCreep.prototype._positioning = function() {
    var stagingAreaFlag = Game.flags['STAGING'];
    var targetFlag = Game.flags['TARGET'];

    if (targetFlag) {
        if (targetFlag.pos.roomName != this.getRoom().getName()) {
            this.walk(targetFlag);
            return;
        }

        this.fight = true;
    } else if (stagingAreaFlag) {
        if (this.creep.pos.getRangeTo(stagingAreaFlag) > 2) {
            this.walk(stagingAreaFlag);
            return;
        }
    }
};

WarriorCreep.prototype._fight = function() {
    if (!this.fight) {
        return;
    }

    var defense = this.getRoom().room.find(FIND_HOSTILE_STRUCTURES, {filter: function(x) {
        return x.structureType == STRUCTURE_TOWER;
    }});
    if (defense.length > 0) {
        if (this.creep.attack(defense[0]) == ERR_NOT_IN_RANGE) {
            this.walk(defense[0]);
        }
    }

    var enemies = this.getRoom().room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length > 0) {
        if (this.creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
            this.walk(enemies[0]);
        }
    }

    console.log('fighting');
};


WarriorCreep.prototype.playWar = function() {
    this._positioning();
    this._fight();
};


module.exports = WarriorCreep;
