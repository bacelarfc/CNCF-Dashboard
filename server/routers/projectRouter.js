import express from 'express';
import dotenv from 'dotenv';
import { redisClient } from '../server.js';
import { fetchAndStoreCncfData, getCategoryDistribution } from '../queries/dbQueries.js';
import { cacheMiddleware, logPerformance } from '../middlewares/redis.js';
import passport from 'passport'
import passportConfig from '../middlewares/passport.js'

dotenv.config();
const router = express.Router();
passportConfig(passport);

router.get('/api/category-distribution', async (req, res) => {
  try {
    const distribution = await getCategoryDistribution();
    res.json(distribution);
  } catch (error) {
    console.error('Error in /api/category-distribution:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/cncf-data', passport.authenticate("jwt", { session: false }), cacheMiddleware, async (req, res, next) => {
  const start = Date.now();

  try {
    const cachedData = await redisClient.get(req.url);
    if (cachedData) {
      logPerformance(req, 'Cache hit in router', Date.now() - start);
      res.json(JSON.parse(cachedData));
    } else {
      logPerformance(req, 'Cache miss in router', Date.now() - start);
      const data = await fetchAndStoreCncfData();
      res.json(data);
      await redisClient.set(req.url, JSON.stringify(data), { EX: 3600 });
      console.log(`Data fetched and sent. Time taken: ${Date.now() - start}ms`);
    }
  } catch (error) {
    logPerformance(req, 'Error', Date.now() - start);
    next(error);
  }
});

export default router;
