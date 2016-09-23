/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function MinerCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
MinerCreep.prototype._doWork = function() {
    this._harvestEnergy(this);
};

module.exports = MinerCreep;
