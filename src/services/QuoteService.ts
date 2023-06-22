import { Document } from 'mongodb';
import { ImageGenerator } from '../utils/ImageUtils';
import { backgrounds } from '../models/ImageModel';
import { getRandomQuote } from '../models/QuoteModel';
import { getCurrentDate } from '../utils/DateUtils';
import { Db } from 'mongodb';
import { Request, Response } from 'express';

const generator = new ImageGenerator({author: '@foobar'});
const startTime = performance.now();
const endTime = performance.now();
const executionTime = endTime - startTime;

export async function generateRandomQuote(req: Request, res: Response) {
  try {
    const db: Db = req.app.locals.db;
    const quote: Document|null = await getRandomQuote(db);

    if (!quote) {
      res.status(404).send('Quote not found');
      return;
    }

    const backgroundIndex = Math.floor(Math.random() * backgrounds.length);
    const filename = await generator.generateImage(backgrounds[backgroundIndex], quote.quote, quote.author);

    const feedItem = {
      title: quote.author.trim(),
      description: quote.quote.trim(),
      date: getCurrentDate(),
      url: filename,
      enclosure: { url: filename, type: 'image/png' },
      categories: quote.category.split(',').map((category: string) => category.trim())
    };

    await db.collection('RSSFeed').insertOne(feedItem);
    res.sendStatus(200);

    console.log('All tasks completed successfully:', quote);
    console.log('Execution time:', executionTime, 'milliseconds');
  } catch (error) {
    console.error('Error generating random quote:', error);
    res.status(500).send('Internal Server Error');
  }
}