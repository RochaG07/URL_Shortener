import express from 'express';
import { generate } from 'short-uuid';

interface storedURLs{
    originalURL: string,
    shortnedURL: string
}

const app = express();

app.use(express.json());


const inMemoryURLs: storedURLs[] = [];

app.post('/create_shortened_url', (request, response) => {
    const {originalURL} = request.body;

    const shortnedURL = `${generate()}`;

    // Temp Storing
    inMemoryURLs.push({
        originalURL,
        shortnedURL
    });


    return response.status(201).json({shortnedURL});
})

app.get("/:URL", (request, response) => {
    const {URL} = request.params;

    const foundURL = inMemoryURLs.find(inMemoryURL => inMemoryURL.shortnedURL === URL);

    if(!foundURL) {
        response.status(404).json({message: "Not found"});

    } else {
        response.redirect(foundURL.originalURL);
    }
})

export default app;