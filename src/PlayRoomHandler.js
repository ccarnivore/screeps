var PlayRoom = require('PlayRoom');
var cache = require('Cache');

/**
 * @type {{roomCollection: {}}}
 */
var PlayRoomHandler = {
    roomCollection: {},
    constructionSiteCollection: {},
    enemyCollection: {},
    repairStructureCollection: {},
    resourceCollection: {}
};

/**
 * measure our known screeps world
 */
PlayRoomHandler.measureWorld = function() {
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

/**
 * get discovered room
 *
 * @param name
 * @returns {*}
 */
PlayRoomHandler.getRoom = function(name) {
    return this.roomCollection[name];
};

module.exports = PlayRoomHandler;