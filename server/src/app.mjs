import { configDotenv } from 'dotenv';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readSystemInstructions } from '../utils/fileio.mjs';
import express from 'express';
import cors from 'cors';

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const systemInstructionsLocation = join(__dirname, '../docs/SystemInstructions.txt');
const additionalInstructionsLocation = join(__dirname, '../docs/additional_sysinstr');
var systemInstructions = '';

const openAIClient = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Root route
app.use(express.static('tecs-ai-assistant/dist'));
app.use(express.json());
// For dev server
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/test', async (req, res) => {
    try {
        const apiResponse = { message: `API test successful`, status: 'success' };
        // Send the API response as JSON with a 2 second delay
        res.status(200).json(apiResponse);
    } catch {
        // Handle errors here
        res.status(500).json({ error: 'API error', message: 'Something went wrong on our end.', status: 'error' });
    }
});

app.post('/query', async (req, res) => {
    const requestData = req.body; // Get the data from the client
    const apiResponse = { message: "" };
    const conversation = requestData.conversation;
    let openAIQuery = {};

    try {
        openAIQuery = {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemInstructions }, 
                ...conversation
            ],
        };

        try {
            const completion = await openAIClient.chat.completions.create(openAIQuery);
            apiResponse.message = completion.choices[0].message.content;
            apiResponse.status = 'success';
        } catch (error) {
            apiResponse.message = 'Could not connect to the AI service.';
            apiResponse.status = 'error';
            console.error(error);
        }

        res.json(apiResponse);
    } catch (error) {
        apiResponse.message = 'Internal server error.';
        apiResponse.status = 'error';
        res.json(apiResponse);
        console.error(error);
    }
});

app.listen(port, async () => {
    systemInstructions = await readSystemInstructions(systemInstructionsLocation, additionalInstructionsLocation);
    console.log(`Server listening on port ${port}`);
});

exports 