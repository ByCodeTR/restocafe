const Redis = require('redis');
const config = require('../config');

const redisClient = Redis.createClient({
  url: config.redis.url,
  password: config.redis.password
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const cache = {
  async set(key, value, expireTime = 3600) {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expireTime
    });
  },

  async get(key) {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },

  async del(key) {
    await redisClient.del(key);
  },

  async flush() {
    await redisClient.flushAll();
  }
};

module.exports = cache; 