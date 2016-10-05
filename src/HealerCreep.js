var c = require('Const');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function HealerCreep(creep) {
    this.creep = creep;
    this.fight = false;
}

HealerCreep.prototype._positioning = function() {
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

HealerCreep.prototype._fight = function() {
    if (!this.fight) {
        return;
    }

    if (this.creep.hits <= (this.creep.hitsMax / 2)) {
        this.creep.heal(this.creep);
        return;
    }

    var healTargets = this.getRoom().room.find(FIND_MY_CREEPS, { filter: function(x) {
        return x.getActiveBodyparts(ATTACK) > 0 && x.hits < x.hitsMax;
    }});

    if (healTargets.length > 0) {
        var res;
        if(this.creep.pos.isNearTo(healTargets[0])) {
            res = this.creep.heal(healTargets[0]);
        }
        else {
            res = this.creep.rangedHeal(healTargets[0]);
        }

        if (res == ERR_NOT_IN_RANGE) {
            this.walk(healTargets[0]);
        }
    }

    console.log('fighting');
};


HealerCreep.prototype.playWar = function() {
    this._positioning();
    this._fight();
};


module.exports = HealerCreep;
