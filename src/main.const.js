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
    CREEP_ROLE_MINER: 'miner',
    CREEP_ROLE_WARRIOR: 'warrior',
    CREEP_ROLE_DISTRIBUTOR: 'distributor',
    CREEP_ROLE_BUILDER: 'builder',
    CREEP_ROLE_UPGRADER: 'upgrader',
    CREEP_ROLE_REPAIRER: 'repairer',

    CREEP_TASK_HARVESTING: 'harvesting',
    CREEP_TASK_MINING: 'mining',
    CREEP_TASK_UPGRADING: 'upgrading',
    CREEP_TASK_BUILDING: 'building',
    CREEP_TASK_REPAIRING: 'repairing',
    CREEP_TASK_TRANSFERRING: 'transferring',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',

    LEVEL_DEFINITION: {
        LEVEL1: {
            minEnergy: 0,
            creepLimit: 9,
            creepInstances: {
                harvester: 2,
                miner: 2,
                distributor: 1,
                warrior: 0,
                repairer: 1,
                builder: 1,
                upgrader: 1
            },
            maxRepairFactor: {
                'constructedWall': 30000,
                'rampart': 300,
                'road': 4,
                'container': 10
            }
        },
        LEVEL2: {
            minEnergy: 400,
            creepLimit: 18,
            creepInstances: {
                miner: 4,
                harvester: 4,
                distributor: 2,
                builder: 2,
                upgrader: 4,
                repairer: 2
            },
            maxRepairFactor: {
                'constructedWall': 1000,
                'rampart': 10,
                'road': 2,
                'container': 5
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
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
        },
        harvester: {
            extensionOrder: [CARRY, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, CARRY, CARRY, CARRY, MOVE],
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
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            }
        },
        builder: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            }
        },
        repairer: {
            extensionOrder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK],
            LEVEL1: {
                pattern: [WORK, WORK, CARRY, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, MOVE],
                cost: 300
            }
        },
        miner: {
            extensionOrder: [WORK, WORK, WORK, WORK],
            LEVEL1: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            },
            LEVEL2: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            }
        },
        warrior: {
            extensionOrder: [ATTACK, ATTACK, TOUGH, TOUGH, TOUGH],
            LEVEL1: {
                pattern: [ATTACK, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [MOVE, MOVE, ATTACK, ATTACK],
                cost: 400
            }
        }
    },

    DISTRIBUTION_ENERGY_RELEVANCE: {
        'spawn':        10000000,
        'extension':    7700000,
        'tower':        7600000,
        'storage':      7500000,
        'container':    7000000
    },

    REFILL_ENERGY_RELEVANCE: {
        'spawn':        300000,
        'extension':    5000,
        'container':    1000,
        'storage':      1000
    }

};