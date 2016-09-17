/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function DistributorCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
DistributorCreep.prototype.doWork = function() {
    var room = this.worldController.getRoom(this.creep.room.name);

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isTransferring()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var target = room.getDestinationForDistributor(this);
        console.log(this.creep, 'distribution target', target);
        if (target) {
            this.remember('usedTarget', target.id);
            switch(this.creep.transfer(target, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    this._isHarvesting(true);
                    break;
                }
                case ERR_FULL: {
                    return;
                }
            }
        } else {
            if (this._isFullyLoaded()) {
                console.log(this.creep, this.remember('role'), 'resting');
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isHarvesting()) {
        if (!this._harvestEnergy(this)) {
            this._isTransferring(true);
        }

        if (this._isFullyLoaded()) {
            this._isTransferring(true);
        }
    }

};

module.exports = DistributorCreep;
