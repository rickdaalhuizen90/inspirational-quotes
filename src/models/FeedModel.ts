
import { Db } from 'mongodb';
import { Item } from 'feed';

export async function getFeedItems(db: Db): Promise<Item[]> {
  try {
    const collection = await db.collection('RSSFeed');
    const items = await collection.aggregate().toArray();

    return items as Item[];
  } catch (error) {
    console.error(error);
    return [];
  }
}