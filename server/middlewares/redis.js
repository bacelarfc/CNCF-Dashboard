import { redisClient } from '../server.js';

export function logPerformance(req, operation, timeTaken) {
  console.log(`${req.method} ${req.url} - ${operation}: ${timeTaken}ms`);
}

async function cacheMiddleware(req, res, next) {
  const key = req.url;
  const start = Date.now();

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData != null) {
      logPerformance(req, 'Cache hit', Date.now() - start);
      res.json(JSON.parse(cachedData));
    } else {
      logPerformance(req, 'Cache missed', Date.now() - start);
      next();
    }
  } catch (error) {
    console.error('Redis error:', error);
    next();
  }
}

export { cacheMiddleware };
