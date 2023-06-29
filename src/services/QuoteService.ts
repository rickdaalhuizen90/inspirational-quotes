import 'dotenv/config';
import { Document } from 'mongodb';
import { ImageGenerator } from '../utils/ImageUtils';
import { scanImageDirectory, imagePath } from '../models/ImageModel';
import { getRandomQuote } from '../models/QuoteModel';
import { Db } from 'mongodb';
import { Request, Response } from 'express';
import { Item } from 'feed';
import * as fs from 'fs';

const generator = new ImageGenerator({author: process.env.AUTHOR??''});
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

    const backgrounds = await scanImageDirectory(imagePath);
    const backgroundIndex = Math.floor(Math.random() * backgrounds.length);
    const filename = await generator.generateImage(backgrounds[backgroundIndex], quote.quote, quote.author);
    const url = `${process.env.SITE_URL}/images/${filename.replace(/^.*[\\\/]/, '')}`;
    const size = await fs.statSync(filename).size;

    const feedItem: Item = {
      title: quote.author.trim(),
      description: quote.quote.trim(),
      date: new Date(),
      link: url,
      enclosure: { url: url, length: size, type: 'image/png'},
      content: quote.category
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