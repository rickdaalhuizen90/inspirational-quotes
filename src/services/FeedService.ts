import 'dotenv/config';
import { Feed, FeedOptions, Item } from 'feed';
import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { getFeedItems } from '../models/FeedModel';

const feedOptions: FeedOptions = {
  title: 'Inspirational Quotes',
  description: 'Embrace positivity and let inspiration guide your journey.',
  id: process.env.SITE_URL??'',
  link: `${process.env.SITE_URL}/feed`,
  copyright: '2023 Rick Daalhuizen',
  language: 'en'
}

export async function generateRSSFeed(req: Request, res: Response) {
  try {
    const db: Db = req.app.locals.db;
    const items: Item[] = await getFeedItems(db);
    const feed = new Feed(feedOptions);
    
    items.forEach((item: Item) => {
      item.date = new Date();
      feed.addItem(item);
    });

    res.set('Content-Type', 'application/xml');
    res.send(feed.rss2());
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).send('Internal Server Error');
  }
}