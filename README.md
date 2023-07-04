# text-image-gen

text-image-gen is a Node.js library that enables generating images with text overlays using the HTML5 Canvas and Node.js's fs module. It provides a simple interface to create visually appealing images with customizable text, suitable for various use cases such as generating motivational quotes, social media posts, and more.

## Installation

You can install text-image-gen using npm:

```bash
npm install text-image-gen
```

## Usage

Here's a basic example of how to use the library to generate an image with text overlay:

```javascript
const { ImageGenerator, ImageGeneratorOptions } = require('text-image-gen');

const generatorOptions = {
  author: 'Your Name',
  fontFamily: 'Lora',
  output: './dist',
};

const generator = new ImageGenerator(generatorOptions);

const path = './path/to/background/image.jpg';
const quote = 'Your quote goes here.';
const additionalText = 'Additional text goes here.';

generator.generateImage(path, quote, additionalText)
  .then(generatedImagePath => {
    console.log('Image generated:', generatedImagePath);
  })
  .catch(error => {
    console.error('Error generating image:', error);
  });
```

Please refer to the library's documentation for detailed usage instructions and available options.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This library is licensed under the Proprietary License. See the [LICENSE](./LICENSE) file for more information.