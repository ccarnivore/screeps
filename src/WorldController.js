var ConstructionController = require('ConstructionController'),
    cache = require('Cache');
    PlayRoom = require('PlayRoom');

var WorldController = {
    roomCollection: {},
    constructionSiteCollection: {},
    enemyCollection: {},
    repairStructureCollection: {},
    resourceCollection: {},
    energyCollection: {},
    towerCollection: {},

    storage: null
};

WorldController.getRoom = function(roomName) {
    return this.roomCollection[roomName];
};

WorldController.measureWorld = function() {
    var discoveredRoomCollection = cache.get('discoveredRoomCollection') || {};

    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (discoveredRoomCollection[room.name]) {
            continue;
        }

        if (!discoveredRoomCollection[i]) {
            console.log('discovering room', i);
            var playRoom = new PlayRoom(room);
            this.measureRoom(playRoom);

            discoveredRoomCollection[i] = playRoom;
        }
    }

    cache.set('discoveredRoomCollection', discoveredRoomCollection);
    this.roomCollection = discoveredRoomCollection;
};

WorldController.measureRoom = function(room) {
    //this.storage = this.storage || room.getStorage();

    //this.energyCollection[room.getName()] = room.getDroppedEnergyCollection();
    //this.resourceCollection[room.getName()] = room.getEnergyResourceCollection();

    //this.enemyCollection[room.getName()] = room.getInvaderCollection();
    this.towerCollection[room.getName()] = room.getTowerCollection();

    //this.constructionSiteCollection[room.getName()] = room.getConstructionSiteCollection();
    //this.repairStructureCollection[room.getName()] = room.getRepairableStructureCollection();
};

WorldController.debugInfo = function() {
    console.log('constructionSites', JSON.stringify(this.constructionSiteCollection));
    console.log('enemies', JSON.stringify(this.enemyCollection));
    console.log('resourceCollection', JSON.stringify(this.resourceCollection));
    console.log('repairStructureCollection', JSON.stringify(this.repairStructureCollection));
    console.log('energyCollection', JSON.stringify(this.energyCollection));
};

module.exports = WorldController;