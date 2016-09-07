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
            return Game.getObjectById(creep.memory.usedSourceId);
        }

        creep.say('searching...');
        var mySource = Memory.sourceDict[0];

        console.log(mySource.sourceId);

        creep.memory.usedSourceId = mySource.sourceId;
        Memory.sourceDict[0].creeps.push(creep.id);

        return Game.getObjectById(mySource.sourceId);
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
        var rangeToSource = creep.pos.getRangeTo(container);

        if (rangeToSource < closest) {
            return undefined;
        }

    }

}

module.exports = sourceHandler;