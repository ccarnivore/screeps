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
    CREEP_ROLE_REPAIRER: 'repairer',

    CREEP_WORK_HARVESTING: 'harvesting',
    CREEP_WORK_DISTRIBUTING: 'distributing',
    CREEP_WORK_UPGRADING: 'upgrading',
    CREEP_WORK_TRANSFERRING: 'transferring',

    CREEP_TASK_HARVESTING: 'harvesting',
    CREEP_TASK_DISTRIBUTING: 'distributing',
    CREEP_TASK_UPGRADING: 'upgrading',
    CREEP_TASK_BUILDING: 'building',
    CREEP_TASK_REPAIRING: 'repairing',
    CREEP_TASK_TRANSFERRING: 'transferring',
    CREEP_TASK_WORKING: 'working',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',

    LEVEL_DEFINITION: {
        LEVEL1: {
            minEnergy: 0,
            creepLimit: 2,
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
                harvester: 5,
                builder: 3,
                upgrader: 4,
                distributor: 2
            },
            maxRepairFactor: {
                'constructedWall': 3000,
                'rampart': 30,
                'road': 2
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
        'spawn': 300000,
        'container': 1000,
        'storage': 1000,
        'extension': 5000
    }

};