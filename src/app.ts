import express from 'express';

import { generate } from 'short-uuid';
import { createClient, RedisClientType } from 'redis';

const app = express();

app.use(express.json());

let client: RedisClientType;
(async () => {
    client = createClient();

    client.on('error', (err) => console.log("Redis client error: ", err));

    await client.connect();

    return client;
})();


app.post('/create_shortened_url', async (request, response) => {
    const {originalURL} = request.body;

    const shortnedURL = `${generate()}`;

    await client.set(shortnedURL, originalURL);

    return response.status(201).json({shortnedURL});
});

app.get("/:URL", async (request, response) => {
    const {URL} = request.params;

    const originalURL = await client.get(URL);

    if(!originalURL) {
        response.status(404).json({message: "Not found"});

    } else {
        response.redirect(originalURL);
    }
});


export default app;