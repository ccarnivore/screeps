var sourceHandler = {

    globalLookUp: function(spawn) {
        Memory.sourceDict = Memory.sourceDict || [];
        var sourceCollection = spawn.room.find(FIND_SOURCES);

        for (var j = 0; j < sourceCollection.length; j++) {
            var currentSource = sourceCollection[j];
            var known = false;

            for (var i = 0; i < Memory.sourceDict.length; i++) {
                var knownSource = Memory.sourceDict[i];
                if (knownSource.sourceId == currentSource.id) {
                    known = true;
                    continue;
                }
            }

            if (!known) {
                Memory.sourceDict.push({sourceId: currentSource.id, creeps: []});
            }
        }
    },

    /**
     * inner mining function
     *
     * @param creep
     * @param type
     * @param target
     * @returns {*}
     * @private
     */
    _getEnergy: function(creep, type, target) {
        var res;
        switch (type) {
            case RESOURCE_ENERGY: {
                res = creep.pickup(target);
                break;
            }

            case STRUCTURE_CONTAINER: {
                res = creep.withdraw(target, RESOURCE_ENERGY);
                break;
            }

            case LOOK_SOURCES: {
                res = creep.harvest(target);
                break;
            }
        }

        if (res == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return true;
        }

        return res;
    },

    /**
     * find energy
     * @param creep
     */
    getEnergy: function(creep) {
        var energySource;
        if (energySource = this.findDroppedEnergy(creep)) {
            return this._getEnergy(creep, RESOURCE_ENERGY, energySource);
        }

        energySource = sourceHandler.findSource(creep);
        if (creep.memory.role != 'harvester') {
            var container;
            if (container = sourceHandler.findContainer(creep)) {
                var containerRange = creep.pos.getRangeTo(container);
                var sourceRange = creep.pos.getRangeTo(energySource);

                if (containerRange <= sourceRange) {
                    return this._getEnergy(creep, STRUCTURE_CONTAINER, container);
                }
            }
        }

        return this._getEnergy(creep, LOOK_SOURCES, energySource);
    },

    /**
     * find dropped energy in a very small range
     *
     * @param creep
     * @returns {*}
     */
    findDroppedEnergy: function(creep) {
        if (creep.memory.usedDroppedEnergyId) {
            if (!Game.getObjectById(creep.memory.usedDroppedEnergyId)) {
                creep.memory.usedDroppedEnergyId = null;
            } else {
                return Game.getObjectById(creep.memory.usedDroppedEnergyId);
            }
        }

        var droppedEnergyCollection = creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
        if (droppedEnergyCollection.length) {
            return droppedEnergyCollection[0];
        }

        return false;
    },

    /**
     * find source
     *
     * @param creep
     * @returns {*}
     */
    findSource: function(creep) {
        if (creep.memory.usedSourceId) {
            if (!Game.getObjectById(creep.memory.usedSourceId)) {
                creep.memory.usedSourceId = null;
            } else {
                return Game.getObjectById(creep.memory.usedSourceId);
            }
        }

        var lastAssigned = Memory.lastAssignedSourceId, chosenSource;
        creep.say('searching...');

        if (Memory.sourceDict.length > 1) {
            if (lastAssigned) {
                for (var currentSource in Memory.sourceDict) {
                    var source = Memory.sourceDict[currentSource];
                    if (source.sourceId == lastAssigned) {
                        continue;
                    }

                    chosenSource = source;
                    break;
                }
            } else {
                chosenSource = Memory.sourceDict[0];
            }

        } else if (Memory.sourceDict.length == 1) {
            chosenSource = Memory.sourceDict[0];
        } else {
            return undefined;
        }

        creep.memory.usedSourceId = chosenSource.sourceId;
        Memory.lastAssignedSourceId = chosenSource.sourceId;
        Memory.sourceDict[0].creeps.push(creep.id);

        return Game.getObjectById(chosenSource.sourceId);
    },

    findContainer: function(creep) {
        return creep.pos.findClosestByRange(
            FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 50);
            }
        });
    }

}

module.exports = sourceHandler;