import { Db, Document } from "mongodb";

export async function getRandomQuote(db: Db): Promise<Document | null> {
  try {
    const collection = db.collection('Quotes');

    return await collection.aggregate([
      {
        $match: {
          'quote': { '$type': 'string' },
          'author': { '$type': 'string' },
          $expr: {
            $and: [
              { $lte: [{ $strLenCP: '$quote' }, 200] },
              { $lte: [{ $strLenCP: '$author' }, 20] }
            ]
          }
        }
      },
      { $sample: { size: 1 } }
    ]).next();
  } catch (error) {
    console.error(error);
    return null;
  }
}