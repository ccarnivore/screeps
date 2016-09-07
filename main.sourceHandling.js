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
	}
    
    
}

module.exports = sourceHandler;