import 'dotenv/config';
import * as fs from 'fs/promises';

export const imagePath: string = process.env.MEDIA_DIR??'./media';

export async function scanImageDirectory(directoryPath: string) {
  try {
    const files = await fs.readdir(directoryPath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    return imageFiles.map(file => `${directoryPath}/${file}`);
  } catch (err) {
    console.error('Error scanning image directory:', err);
    return [];
  }
}