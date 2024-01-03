async function cacheMiddleware(req, res, next) {
    const key = req.url; 
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData != null) {
        console.log('Cache hit');
        return res.json(JSON.parse(cachedData));
      } else {
        console.log('Cache miss');
        next();
      }
    } catch (error) {
      console.error('Redis error:', error);
      next();
    }
  }
  
  export { cacheMiddleware };
  