var c = require('Const'),
    PlayRoom = require('PlayRoom'),
    TowerController = require('TowerController'),
    LinkController = require('LinkController'),
    CreepController = require('CreepController');

console.log('receive tick');

Memory.currentLevel = Memory.currentLevel || {};
Memory.linkHandling = Memory.linkHandling || {};
Memory.linkHandling.sourceLinkCollection = Memory.linkHandling.sourceLinkCollection || {};
Memory.linkHandling.targetLinkCollection = Memory.linkHandling.targetLinkCollection || {};

for (var roomName in Game.rooms) {
    var playRoom = new PlayRoom(Game.rooms[roomName]);
    console.log('start processing', playRoom.getName());

    // temporary ignore rooms
    if (!playRoom.isMyRoom()) {
        console.log('room not under control');
        continue;
    }

    playRoom.measure();
    new CreepController(playRoom).run();
    new TowerController(playRoom).run();
    new LinkController(playRoom).run();

    console.log('processing ended');
}

console.log('tick ends');