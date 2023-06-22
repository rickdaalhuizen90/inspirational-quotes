import RSS, { ItemOptions } from 'rss';
import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { getFeedItems } from '../models/FeedModel';

const feed = new RSS({
  title: 'Inspirational Quotes',
  description: '',
  site_url: '',
  feed_url: '/feed',
  copyright: '2023 Rick Daalhuizen',
  language: 'en',
  categories: ['Quotes','Motivation','Inspirational'],
  pubDate: new Date().toDateString(),
});

export async function generateRSSFeed(req: Request, res: Response) {
  try {
    const db: Db = req.app.locals.db;

    const items: ItemOptions[] = await getFeedItems(db);
    items.forEach((item: ItemOptions) => feed.item(item));
  
    const feedXML = feed.xml();
    res.set('Content-Type', 'application/xml');
    res.send(feedXML);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).send('Internal Server Error');
  }
}