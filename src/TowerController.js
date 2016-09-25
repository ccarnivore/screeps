var c = require('Const');

function TowerController(playRoom) {
    this.playRoom = playRoom;
}

TowerController.prototype.run = function() {
    if (!this._defendRoom() && !this._healCreeps()) {
        this._repairStructures();
    }
};

TowerController.prototype._defendRoom = function() {
    Memory.invaderSpotted[this.playRoom.getName()] = this.playRoom.invaderCollection.length > 0;
    if (!Memory.invaderSpotted[this.playRoom.getName()]) {
        return false;
    }

    this.playRoom.towerCollection.forEach(function (tower) {
        if (!tower) {
            return;
        }

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        tower.attack(target);
    });

    return true;
};

TowerController.prototype._healCreeps = function() {
    if (this.playRoom.healableCollection.length == 0) {
        return false;
    }

    this.playRoom.healableCollection.sort(function (a, b) {
        return a.hits / a.hitsMax - b.hits / b.hitsMax;
    });

    this.playRoom.towerCollection.forEach(function (tower) {
        if (!tower) {
            return;
        }

        tower.heal(this.playRoom.healableCollection[0]);
    }.bind(this));

    return true;
};

TowerController.prototype._repairStructures = function() {
    this.playRoom.towerCollection.forEach(function (tower) {
        if (!tower) {
            return;
        }

        if (tower.energy <= 100) {
            return;
        }

        tower.repair(this.playRoom.getRepairTarget());
    }.bind(this));

    return true;
};


module.exports = TowerController;
