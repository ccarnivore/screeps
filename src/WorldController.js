var ConstructionController = require('ConstructionController'),
    PlayRoom = require('PlayRoom');

var WorldController = {
    roomCollection: {},
    constructionSiteCollection: {},
    enemyCollection: {},
    repairStructureCollection: {},
    resourceCollection: {}
};

WorldController.init = function() {

}

WorldController.measureWorld = function() {
    var discoveredRoomCollection = cache.get('discoveredRoomCollection') || {};

    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (discoveredRoomCollection[room.name]) {
            continue;
        }

        discoveredRoomCollection[room.name] = new PlayRoom(room);
    }

    cache.set('discoveredRoomCollection', discoveredRoomCollection);
    this.roomCollection = discoveredRoomCollection;
};

WorldController.measureRoom = function(room) {
    var discoveredRoomCollection = cache.get('discoveredRoomCollection') || {};

    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (discoveredRoomCollection[room.name]) {
            continue;
        }

        discoveredRoomCollection[room.name] = new PlayRoom(room);
    }

    cache.set('discoveredRoomCollection', discoveredRoomCollection);
    this.roomCollection = discoveredRoomCollection;
};


WorldController.discoverConstructionSites = function(room) {
    console.log(this.constructionController);
}

module.exports = WorldController;