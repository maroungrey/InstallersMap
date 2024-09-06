const cache = require('../cache');

const cacheWrapper = (fn, prefix, ttl) => {
  return async (...args) => {
    const cacheKey = `${prefix}_${args.join('_')}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    const result = await fn(...args);
    cache.set(cacheKey, result, ttl);
    return result;
  };
};

module.exports = {
  cacheWrapper,
};