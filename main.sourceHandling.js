var sourceHandler = {
    
    globalLookUp: function(spawn) {
        Memory.sourceDict = Memory.sourceDict || [];
        
        var sourceCollection = spawn.room.find(FIND_SOURCES);
        var mySource = sourceCollection[0];
        
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

    findSource: function(creep) {
        if (creep.memory.usedSourceId) {
            var source = Game.getObjectById(creep.memory.usedSourceId);
            if (!source || source == undefined) {
                creep.memory.usedSourceId = null;
            } else {
                return source;
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
        var mySource = this.findSource(creep);
        var containerCollection = creep.room.find(
            FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER ); }
        });

        var target = undefined;
        var closest = undefined;
        if (containerCollection.length) {
            for (var i = 0; i < containerCollection.length; i++) {
                var container = containerCollection[i];
                if (container.store[RESOURCE_ENERGY] < 50) {
                    continue;
                }

                var range = creep.pos.getRangeTo(container);
                if (closest == undefined || range < closest) {
                    target = container;
                    closest = range;
                }
            }
        }

        if (target == undefined) {
            return target;
        }

        var source = this.findSource(creep);
        if (creep.pos.getRangeTo(source) < closest) {
            return undefined;
        }

        return target;
    }

}

module.exports = sourceHandler;