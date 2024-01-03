import { getDb, connectToDb } from '../databases/connection.js';
import https from 'https';

async function getCategoryDistribution() {
  await connectToDb();
  const db = getDb();
  const projects = await db.collection('cncf').find().toArray();

  const categoryDistribution = projects.reduce((acc, project) => {
    const category = project.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return categoryDistribution;
}

async function fetchAndStoreCncfData() {
  return new Promise((resolve, reject) => {
    https.get('https://landscape.cncf.io/data/items.json', (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', async () => {
        try {
          await connectToDb();
          const jsonData = JSON.parse(data);
          const db = getDb();
          const collection = db.collection('cncf');

          await collection.deleteMany({});
          await collection.insertMany(jsonData);

          resolve(jsonData);
        } catch (error) {
          console.error('Error processing CNCF data:', error);
          reject(error);
        }
      });

    }).on('error', (error) => {
      console.error('Error fetching CNCF data:', error);
      reject(error);
    });
  });
}

export { fetchAndStoreCncfData, getCategoryDistribution };