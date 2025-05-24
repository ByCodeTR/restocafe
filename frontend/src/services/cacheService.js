class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
  }

  setTTL(milliseconds) {
    this.ttl = milliseconds;
  }

  set(key, value) {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: Date.now() + this.ttl
    };
    this.cache.set(key, item);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clean expired items periodically
  startCleanup(interval = 60000) { // Default cleanup every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          this.cache.delete(key);
        }
      }
    }, interval);
  }
}

export const cacheService = new CacheService();
cacheService.startCleanup();

export default cacheService; 