import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

let dbConnection;

const connectToDb = async () => {
    try {
      const client = await MongoClient.connect("mongodb://localhost:27017/cncf");
      // const client = await MongoClient.connect("mongodb://host.docker.internal:27017/cncf");

      dbConnection = client.db();
      console.log('Database connection established');
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