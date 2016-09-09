/*const REPAIR_RELEVANCE = [
    {'spawn': 100},
    {'road': 10},
    {'tower': 75},
    {'rampart': 60},
    {'constructedWall': 60},
    {'extension': 70},
    {'container': 70}
];

const ENERGY_RELEVANCE = [
    {'spawn': 100},
    {'tower': 75},
    {'extension': 75},
    {'container': 70}
];
};*/

module.exports = {
    GLOBAL_CREEP_LIMIT: 30,

    CREEP_ROLE_HARVESTER: 'harvester',
    CREEP_ROLE_DISTRIBUTOR: 'distributor',
    CREEP_ROLE_BUILDER: 'builder',
    CREEP_ROLE_UPGRADER: 'upgrader',

    CREEP_WORK_HARVESTING: 'harvesting',
    CREEP_WORK_DISTRIBUTING: 'distributing',
    CREEP_WORK_UPGRADING: 'upgrading',
    CREEP_WORK_TRANSFERRING: 'transferring',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',

    LEVEL_DEFINITION: {
        LEVEL1: {
            minEnergy: 0,
            creepLimit: 5,
            creepInstances: {
                harvester: 2,
                builder: 1,
                upgrader: 1,
                distributor: 1
            },
            maxRepairFactor: {
                // repair disabled in level 1
            }
        },
        LEVEL2: {
            minEnergy: 400,
            creepLimit: 14,
            creepInstances: {
                harvester: 4,
                builder: 3,
                upgrader: 3,
                distributor: 4
            },
            maxRepairFactor: {
                'wall': 300,
                'rampart': 30,
                'road': 4
            }
        }
    },

    MIN_ENERGY_CHUNK: 50,
    MIN_CREEP_ENERGY_LEVEL: 200,

    GLOBAL_BUILD_PATTERN: {
        distributor: {
            extensionOrder: [CARRY, CARRY, CARRY, MOVE],
            LEVEL1: {
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                cost: 300
            },
        },
        harvester: {
            extensionOrder: [CARRY, CARRY, WORK, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
        },
        upgrader: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE],
                cost: 350
            }
        },
        builder: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE],
                cost: 350
            }
        }
    },

    DISTRIBUTION_ENERGY_RELEVANCE: {
        'spawn': 10000000,
        'extension': 8000000,
        'storage': 7700000,
        'tower': 7500000,
        'container': 7000000
    },

    REFILL_ENERGY_RELEVANCE: {
        'spawn': 3000,
        'container': 100
    }

};