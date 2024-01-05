import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL_DOCKER = process.env.DATABASE_URL_DOCKER;

let dbConnection;

const connectToDb = async () => {
    try {
      const client = await MongoClient.connect(DATABASE_URL_DOCKER);

      dbConnection = client.db();
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    }
  };  

const getDb = () => {
  if (!dbConnection) {
    throw new Error('Error connecting to database.');
  }
  return dbConnection;
};

const getConnection = () => {
  if (!dbConnection) {
    throw new Error('Error connecting to database.');
  }
  return dbConnection.client;
};

export { connectToDb, getDb, getConnection };