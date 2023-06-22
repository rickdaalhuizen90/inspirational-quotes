# Inspirational Quotes

This is a Node.js application that generates and publishes inspirational quote images. It utilizes the `node-canvas` package for image generation and the `rss` package to create an RSS feed.

## Getting Started
To run the application, follow these steps:

1. Install the necessary dependencies by running the command:
   ```bash
   npm install
   ```

2. Start MongoDB by running the command:
   ```bash
   docker run --rm --name default -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 -e MONGO_INITDB_DATABASE=test -v /tmp/mongo-data:/data/db mongo
   ```

3. Start the application by running the command:
   ```bash
   npm start
   ```

## Routes
- `/feed` - Retrieves the RSS feed.
- `/generate` - Generates new quote images. You can use `curl -XGET http://localhost:3000/generate` to trigger the generation.

## Installation and Setup
To set up the application, perform the following steps:

1. **Environment Setup:**
   - Run `npm install` to install the necessary dependencies, including the `node-canvas` package for image generation.

2. **Prepare the Database:**
   - Set up a MongoDB database with a collection of motivational quotes. You can use the provided Docker command to start a MongoDB instance.

## Image Generation
The image generation process in the application involves the following steps:

1. Utilizing the `node-canvas` package, a canvas and context are created.
2. Random selection of a quote, background image, and font.
3. Drawing the quote on the canvas using the chosen font and background.
4. Saving the canvas as an image file.

## Instagram Posting
@todo

## Twitter Posting
@todo

## TODO
- Implement authentication to protect the `/generate` route.
- Implement a mechanism to track already posted quotes.
- Implement automated social media posting using the RSS feed.

## Resources
- [Instagram API - Content Publishing Guide](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Quotes 500K](https://www.kaggle.com/datasets/manann/quotes-500k?resource=download)