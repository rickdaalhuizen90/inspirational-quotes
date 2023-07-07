import { Db, Document } from "mongodb";
import { ObjectId } from "mongodb";

export async function getRandomQuote(db: Db): Promise<Document | null> {
  try {
    const collection = db.collection('Quotes');
    
    // Calculate the date 180 days ago
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - (180 * 24 * 60 * 60 * 1000));

    // Construct the query to exclude Quotes selected in the last 180 days
    const query = {
      $or: [
        { lastSelected: { $lt: pastDate } },
        { lastSelected: null }
      ],
      'quote': { '$type': 'string' },
      'author': { '$type': 'string' },
      $expr: {
        $and: [
          { $lte: [{ $strLenCP: '$quote' }, 200] },
          { $lte: [{ $strLenCP: '$author' }, 20] }
        ]
      }
    };

    // Retrieve a random Quote that meets the criteria
    const randomQuote = await collection.aggregate([
      { $match: query },
      { $sample: { size: 1 } }
    ]).next();

    return randomQuote;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateQuote(db: Db, quoteId: ObjectId): Promise<void> {
  try {
    const collection = db.collection('Quotes');
    const currentDate = new Date();

    // Update the lastSelected field with the current timestamp
    await collection.updateOne({ _id: quoteId }, { $set: { lastSelected: currentDate } });
  } catch (error) {
    console.error(error);
  }
}
