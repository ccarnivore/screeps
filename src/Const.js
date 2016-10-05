module.exports = {
    GLOBAL_CREEP_LIMIT: 30,

    CREEP_ROLE_HARVESTER: 'harvester',
    CREEP_ROLE_MINER: 'miner',
    CREEP_ROLE_CLAIMER: 'claimer',
    CREEP_ROLE_DISTRIBUTOR: 'distributor',
    CREEP_ROLE_BUILDER: 'builder',
    CREEP_ROLE_DEVELOPMENT_AID_WORKER: 'developmentAidWorker',
    CREEP_ROLE_UPGRADER: 'upgrader',
    CREEP_ROLE_REPAIRER: 'repairer',
    CREEP_ROLE_WARRIOR: 'warrior',
    CREEP_ROLE_HEALER: 'healer',

    CREEP_TASK_HARVESTING: 'harvesting',
    CREEP_TASK_WORKING: 'working',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',
    LEVEL4: 'LEVEL4',

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
                'constructedWall': 150000,
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
                upgrader: 2,
                repairer: 1,
                claimer: 0
            },
            maxRepairFactor: {
                'constructedWall': 15000,
                'rampart': 10,
                'road': 2,
                'container': 4
            }
        },
        LEVEL3: {
            minEnergy: 1000,
            creepLimit: 30,
            creepInstances: {
                miner: 4,
                harvester: 4,
                distributor: 2,
                builder: 2,
                upgrader: 2,
                repairer: 2,
                warrior: 0,
                healer: 0
            },
            maxRepairFactor: {
                'constructedWall': 1500,
                'rampart': 20,
                'road': 2,
                'container': 2
            }
        },
        LEVEL4: {
            minEnergy: 1500,
            creepLimit: 30,
            creepInstances: {
                miner: 4,
                harvester: 4,
                distributor: 2,
                builder: 2,
                upgrader: 2,
                repairer: 2,
                warrior: 0,
                healer: 0
            },
            maxRepairFactor: {
                'constructedWall': 1500,
                'rampart': 20,
                'road': 2,
                'container': 2
            }
        }
    },

    MIN_ENERGY_CHUNK: 50,
    MIN_CREEP_ENERGY_LEVEL: 200,

    GLOBAL_BUILD_PATTERN: {
        miner: {
            LEVEL1: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            },
            LEVEL2: {
                pattern: [WORK, WORK, WORK, MOVE, MOVE],
                cost: 450
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                cost: 700
            },
            LEVEL4: {
                pattern: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                cost: 900
            }
        },
        distributor: {
            LEVEL1: {
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                cost: 400
            },
            LEVEL3: {
                pattern: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                cost: 600
            },
            LEVEL4: {
                pattern: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                cost: 800
            }
        },
        harvester: {
            LEVEL1: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                cost: 500
            },
            LEVEL3: {
                pattern: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                cost: 700
            },
            LEVEL4: {
                pattern: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                cost: 900
            },
        },
        upgrader: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 400
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                cost: 550
            },
            LEVEL4: {
                pattern: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                cost: 1200
            }
        },
        builder: {
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 400
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                cost: 550
            },
            LEVEL4: {
                pattern: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                cost: 650
            }
        },
        repairer: {
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 400
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                cost: 550
            },
            LEVEL4: {
                pattern: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                cost: 750
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
            },
            LEVEL4: {
                pattern: [MOVE, CLAIM, CLAIM],
                cost: 1250
            }
        },
        developmentAidWorker: {
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 400
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                cost: 550
            },
            LEVEL4: {
                pattern: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                cost: 550
            }
        },
        warrior: {
            extensionOrder: [MOVE, ATTACK, TOUGH, TOUGH],
            LEVEL3: {
                pattern: [
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE,
                    ATTACK
                ],
                cost: 300
            }
        },
        healer: {
            extensionOrder: [MOVE, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL],
            LEVEL3: {
                pattern: [MOVE, HEAL, HEAL],
                cost: 550
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
