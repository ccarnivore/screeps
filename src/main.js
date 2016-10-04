var c = require('Const'),
    PlayRoom = require('PlayRoom'),
    TowerController = require('TowerController'),
    LinkController = require('LinkController'),
    CreepController = require('CreepController');

console.log('receive tick');

Memory.roomCount = 0;
Memory.currentLevel = Memory.currentLevel || {};
Memory.linkHandling = Memory.linkHandling || {};
Memory.invaderSpotted = Memory.invaderSpotted || {};
Memory.developmentAidWorkerCount = 0;
Memory.claimerCount = 0;
Memory.linkHandling.sourceLinkCollection = Memory.linkHandling.sourceLinkCollection || {};
Memory.linkHandling.targetLinkCollection = Memory.linkHandling.targetLinkCollection || {};

for (var creepName in Game.creeps) {
    if (Game.creeps[creepName].memory.role == c.CREEP_ROLE_DEVELOPMENT_AID_WORKER) {
        Memory.developmentAidWorkerCount = Memory.developmentAidWorkerCount + 1;
    }
    if (Game.creeps[creepName].memory.role == c.CREEP_ROLE_CLAIMER) {
        Memory.claimerCount = Memory.claimerCount + 1;
    }
}

var myRoomCollection = [],
    spareRoomCollection = [];

for (var roomName in Game.rooms) {
    var playRoom = new PlayRoom(Game.rooms[roomName]);
    console.log('main::measuring room', playRoom.getName());
    playRoom.measure();

    if (playRoom.isMyRoom()) {
        myRoomCollection.push(playRoom);
        Memory.roomCount = Memory.roomCount + 1;
    } else {
        spareRoomCollection.push(playRoom);
    }
}

myRoomCollection.sort(function(roomA, roomB) {
    return roomB.getPlayRoomLevel() - roomA.getPlayRoomLevel();
});

spareRoomCollection.forEach(function(playRoom) {
    /*playRoom.energySourceCollection.forEach(function(energySource) {
        myRoomCollection[0].energySourceCollection.push(energySource);
    });*/
    playRoom.constructionSiteCollection.forEach(function(energySource) {
        myRoomCollection[0].constructionSiteCollection.push(energySource);
    });

    new CreepController(playRoom).run();
});

myRoomCollection.forEach(function(playRoom) {
    new CreepController(playRoom).run();
    new TowerController(playRoom).run();
    new LinkController(playRoom).run();
});

console.log('tick ends');