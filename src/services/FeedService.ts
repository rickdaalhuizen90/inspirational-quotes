import 'dotenv/config';
import RSS, { ItemOptions } from 'rss';
import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { getFeedItems } from '../models/FeedModel';

const feed = new RSS({
  title: 'Inspirational Quotes',
  description: 'Embrace positivity and let inspiration guide your journey.',
  site_url: process.env.SITE_URL??'',
  feed_url: `${process.env.SITE_URL}/feed`,
  copyright: '2023 Rick Daalhuizen',
  language: 'en',
  categories: ['Quotes', 'Motivation', 'Inspirational', 'Inspiration', 'Motivation',
  'QuoteOfTheDay', 'Inspire', 'PositiveVibes', 'DreamBig', 'BelieveInYourself',
  'SuccessQuotes', 'Mindset', 'GoalGetter'],
  pubDate: new Date().toDateString(),
  ttl: 120
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