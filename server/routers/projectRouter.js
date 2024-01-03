import express from 'express';
import dotenv from 'dotenv';
import {  fetchAndStoreCncfData, getCategoryDistribution} from '../queries/dbQueries.js';
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

router.get('/api/cncf-data', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      const data = await fetchAndStoreCncfData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;
