import express, { Application } from 'express';
import { generateRSSFeed } from './services/FeedService';
import { generateRandomQuote } from './services/QuoteService';
import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';

export const app: Application = express();
const port: number = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'LocalDB';//process.env.DB_NAME;

MongoClient.connect(url)
  .then(async (client: MongoClient) => {
    const db: Db = await client.db(dbName);
    console.log('Connected to MongoDB');

    app.locals.db = db;
    app.get('/feed', generateRSSFeed);
    app.get('/generate', generateRandomQuote);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error('Failed to connect to MongoDB', error);
  });