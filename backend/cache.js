const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes by default

const set = (key, data, ttl = 600) => {
  cache.set(key, data, ttl);
};

const get = (key) => {
  return cache.get(key);
};

const del = (key) => {
  cache.del(key);
};

const flush = () => {
  cache.flushAll();
};

module.exports = {
  set,
  get,
  del,
  flush
};