import express from 'express';

import { generate } from 'short-uuid';
import { createClient } from 'redis';


const app = express();

app.use(express.json());


(async () => {
    const client = createClient();

    client.on('error', (err) => console.log("Redis client error: ", err))

    await client.connect();


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
})();

export default app;