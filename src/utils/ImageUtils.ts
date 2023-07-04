import * as fs from 'fs';
import * as crypto from 'crypto';
import { createCanvas, loadImage, CanvasRenderingContext2D, Image, registerFont} from 'canvas';

export interface ImageGeneratorOptions {
  author: string;
  fontFamily?: string;
  output?: string;
}

export class ImageGenerator {
  private author: string;
  private fontFamily: string;
  private output: string;

  constructor(options: ImageGeneratorOptions) {
    registerFont('./src/assets/fonts/Lora-Medium.ttf', { family: 'Lora' });

    this.author = options.author;
    this.fontFamily = options.fontFamily ?? 'Lora';
    this.output = options.output ?? './dist';
  }

  public async generateImage(path: string, quote: string, additionalText: string): Promise<string> {
    const margin = 50; // Margin around the text
    const maxImageWidth = 1800; // Maximum width for the background image

    const backgroundImage = await loadImage(path);
    const { imageWidth, imageHeight } = this.calculateImageSize(backgroundImage, maxImageWidth);

    const canvas = createCanvas(imageWidth, imageHeight);
    const context = canvas.getContext('2d');

    this.drawBackground(context, backgroundImage, imageWidth, imageHeight);
    this.drawText(context, quote, additionalText, imageWidth, imageHeight, margin);

    // Make sure there are no duplicate images
    const hash = crypto.createHash('md5').update(path + quote).digest("hex");

    const filename = `${this.output}/${hash}.png`;

    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream(filename);
      const stream = canvas.createPNGStream();

      stream.pipe(outputStream);
      outputStream.on('finish', () => resolve(filename));
      outputStream.on('error', reject);
    });
  }

  private calculateImageSize(backgroundImage: Image, maxImageWidth: number): { imageWidth: number; imageHeight: number } {
    const imageAspectRatio = backgroundImage.width / backgroundImage.height;
    let imageWidth = maxImageWidth;
    let imageHeight = maxImageWidth / imageAspectRatio;

    if (imageHeight > imageWidth) {
      imageHeight = imageWidth;
      imageWidth = imageHeight * imageAspectRatio;
    }

    return { imageWidth, imageHeight };
  }

  private drawBackground(context: CanvasRenderingContext2D, backgroundImage: Image, imageWidth: number, imageHeight: number): void {
    context.drawImage(backgroundImage, 0, 0, imageWidth, imageHeight);

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, imageWidth, imageHeight);

    context.drawImage(context.canvas, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
  }

  private drawText(context: CanvasRenderingContext2D, quote: string, additionalText: string, imageWidth: number, imageHeight: number, margin: number): void {
    const fontSize = 64;
    const additionalFontSize = 34;
    const bottomFontSize = 24;

    context.font = `${fontSize}px ${this.fontFamily}`;
    context.fillStyle = 'white';
    context.textAlign = 'center';

    const maxTextWidth = imageWidth - 2 * margin;
    const wrappedLines = this.wrapText(context, quote, maxTextWidth);

    const lineHeight = fontSize * 1.2;
    const totalTextHeight = wrappedLines.length * lineHeight;
    const textY = (imageHeight - totalTextHeight) / 2;

    wrappedLines.forEach((line, index) => {
      const textX = imageWidth / 2;
      const textYPos = textY + index * lineHeight;
      context.fillText(line, textX, textYPos);
    });

    context.font = `${additionalFontSize}px Arial`;
    context.fillText(additionalText, imageWidth / 2, textY + totalTextHeight + 20);

    context.font = `${bottomFontSize}px Arial`;
    context.fillText(this.author, imageWidth / 2, imageHeight - margin);
  }

  private wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const wrappedLines: string[] = [];
    let line = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        wrappedLines.push(line.trim());
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }

    wrappedLines.push(line.trim());
    return wrappedLines;
  }
}
