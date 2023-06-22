
import { Db } from 'mongodb';
import { ItemOptions } from 'rss';

export async function getFeedItems(db: Db): Promise<ItemOptions[]> {
  try {
    const collection = await db.collection('RSSFeed');
    const items = await collection.aggregate().toArray();

    return items as ItemOptions[];
  } catch (error) {
    console.error(error);
    return [];
  }
}