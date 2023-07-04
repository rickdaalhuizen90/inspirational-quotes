import 'dotenv/config'
import { ImageGenerator, ImageGeneratorOptions } from "./utils/ImageUtils";
import { imagePath, scanImageDirectory } from './models/ImageModel';

// Example usage
async function generateExampleImage() {
  const generatorOptions: ImageGeneratorOptions = {
    author: 'Your Name',
    fontFamily: 'Lora',
    output: process.env.OUTPUT_DIR??'./'
  };

  const generator = new ImageGenerator(generatorOptions);

  const images = await scanImageDirectory(imagePath);
  const path = images[Math.floor(Math.random() * images.length)];
  const quote = 'Your quote goes here.';
  const additionalText = 'Additional text goes here.';

  try {
    const generatedImagePath = await generator.generateImage(path, quote, additionalText);
    console.log('Image generated:', generatedImagePath);
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generateExampleImage();
