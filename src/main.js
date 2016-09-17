var WorldController = require('WorldController'),
    CreepController = require('CreepController'),
    TowerController = require('TowerController');

module.exports.loop = function() {
    console.log('received tick');
    WorldController.measureWorld();

    new TowerController(WorldController).run();
    new CreepController(WorldController).run();
};