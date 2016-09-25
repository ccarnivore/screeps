module.exports = {
    GLOBAL_CREEP_LIMIT: 30,

    CREEP_ROLE_HARVESTER: 'harvester',
    CREEP_ROLE_MINER: 'miner',
    CREEP_ROLE_CLAIMER: 'claimer',
    CREEP_ROLE_DISTRIBUTOR: 'distributor',
    CREEP_ROLE_BUILDER: 'builder',
    CREEP_ROLE_UPGRADER: 'upgrader',
    CREEP_ROLE_REPAIRER: 'repairer',

    CREEP_TASK_HARVESTING: 'harvesting',
    CREEP_TASK_WORKING: 'working',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',

    LEVEL_DEFINITION: {
        LEVEL1: {
            minEnergy: 0,
            creepLimit: 12,
            creepInstances: {
                harvester: 4,
                miner: 2,
                distributor: 1,
                repairer: 1,
                builder: 2,
                upgrader: 2
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
                miner: 2,
                harvester: 4,
                distributor: 2,
                builder: 2,
                upgrader: 4,
                repairer: 2,
            },
            maxRepairFactor: {
                'constructedWall': 1000,
                'rampart': 10,
                'road': 2,
                'container': 5
            }
        },
        LEVEL3: {
            minEnergy: 700,
            creepLimit: 30,
            creepInstances: {
                miner: 4,
                harvester: 8,
                distributor: 3,
                builder: 1,
                upgrader: 4,
                repairer: 2,
                claimer: 2,
            },
            maxRepairFactor: {
                'constructedWall': 500,
                'rampart': 5,
                'road': 2,
                'container': 2
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
            LEVEL3: {
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
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL3: {
                pattern: [WORK, CARRY, MOVE, CARRY, MOVE],
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
            },
            LEVEL3: {
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
            },
            LEVEL3: {
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
            },
            LEVEL3: {
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
            },
            LEVEL3: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            }
        },
        claimer: {
            extensionOrder: [MOVE, CLAIM, CLAIM],
            LEVEL1: {
                pattern: [MOVE, CLAIM, CLAIM],
                cost: 1250
            },
            LEVEL2: {
                pattern: [MOVE, CLAIM, CLAIM],
                cost: 1250
            },
            LEVEL3: {
                pattern: [MOVE, CLAIM, CLAIM],
                cost: 1250
            }
        },
    },

    DISTRIBUTION_ENERGY_RELEVANCE: {
        'spawn':        10000000,
        'extension':    7700000,
        'link':         7600000,
        'tower':        7500000,
        'container':    7400000,
        'storage':      7300000
    },

    REFILL_ENERGY_RELEVANCE: {
        'tower':        800000,
        'spawn':        300000,
        'storage':      100000,
        'container':    50000
    }
};
