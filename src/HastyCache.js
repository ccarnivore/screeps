var HastyCache = {
    _cache: {},
    _persistence: false
};

HastyCache.setPersistence = function(state) {
    this._persistence = state;
};

HastyCache.has = function(key) {
    return this._cache[key] !== undefined;
};

HastyCache.set = function(key, value, useMemory) {
    if (useMemory) {
        Memory[key] = value;
    } else {
        this._cache[key] = value;
    }

    return this;
};

HastyCache.get = function(key, useMemory) {
    if (useMemory) {
        return Memory[key];
    }

    return this._cache[key];
};

HastyCache.remove = function(key, useMemory) {
    if (useMemory) {
        return delete Memory[key];
    }

    return delete this._cache[key];
};

module.exports = HastyCache;