import { configDotenv } from 'dotenv';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readSystemInstructions } from '../utils/fileio.mjs';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

configDotenv({path: '../.env'});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const systemInstructionsLocation = join(__dirname, '../docs/SystemInstructions.txt');
const additionalInstructionsLocation = join(__dirname, '../docs/additional_sysinstr');
var systemInstructions = '';

// Test user database
const mockUsers = {
    'testuser': 'password123'
};

if (!process.env.OPENAI_API_KEY)
{
    throw Error("No API key");
}

const openAIClient = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Root route
app.use(express.static('tecs-ai-assistant/dist'));
app.use(express.json());
// For dev server
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(session({
    secret: 'supersecretkey',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        sameSite: 'lax'
    }
}))


app.get('/check-auth', async (req, res) => {
    const apiResponse = {success: false, user: null};

    try {
        if (req.session.user)
        {
            apiResponse.success = true;
            apiResponse.user = req.session.user;
            res.status(200);
        }
        else
        {
            res.status(401);
        }

        res.json(apiResponse);
    } catch (error) {
        console.log(error);
    }
})

app.get('/test', async (req, res) => {
    try {
        const apiResponse = { message: `API test successful`, status: 'success' };
        res.status(200).json(apiResponse);
    } catch {
        res.status(500).json({ error: 'API error', message: 'Something went wrong on our end.', status: 'error' });
    }
});


app.post('/query', async (req, res) => {
    if (!req.session.user)
    {
        return res.status(401).json({message: "nuh uh uh"});
    }

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const apiResponse = {success: false, user: null, message: null};
    if (mockUsers[username] && mockUsers[username] === password) {
        req.session.user = { username };
        apiResponse.success = true;
        apiResponse.user = username;
        apiResponse.message = "Login success";
        res.status(200);
    }
    else
    {
        apiResponse.success = false;
        apiResponse.user = null;
        apiResponse.message = "Invalid credentials";
        res.status(401);
    }


    res.json(apiResponse);
});

app.post('/logout', (req, res) => {
    const apiResponse = {success: true};
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json(apiResponse);
    });
});

app.get('/chat', (req, res) => {
    const apiResponse = {success: false};

    if (req.session.user) {
        apiResponse.success = false;
        res.status(200)
    }
    else
    {
        apiResponse.success = false;
        res.status(401)
    }
    res.json(apiResponse);
});

app.listen(port, async () => {
    systemInstructions = await readSystemInstructions(systemInstructionsLocation, additionalInstructionsLocation);
    console.log(`Server listening on port ${port}`);
});
