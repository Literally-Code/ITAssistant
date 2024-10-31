import { configDotenv } from 'dotenv'
import { OpenAI } from 'openai'
import { setTimeout } from 'timers/promises'
import * as bodyParser from 'body-parser'
import * as fs from 'fs/promises'
import * as path from 'path'
import express from 'express'
import cors from 'cors'

configDotenv()
const app = express()
const port = 3000
const systemInstructionsLocation = '../docs/SystemInstructions.txt'
const additionalInstructionsLocation = '../docs/additional_sysinstr'
var systemInstructions = '';

const openAIClient = new OpenAI() /*new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    organization: 'org-7dwV2PNPW9mS7h9IabMCDJs0', 
    project: 'proj_lULP9PLKPUcatb9hOHJ5Rns0'
})*/
// const assistant = openAIClient.beta.assistants.retrieve("asst_FVaaTMv8M23SvADtsU6yL4WC")

const functions = {
    "password_reset": (call, args) => {
        args = JSON.parse(args)
        const result = { tool_call_id: call.id, output: "" }
        const studentID = args.student_id
        const birthdate = args.birthdate
        const contact_info = args.contact_info ? args.contact_info : "Not provided"
        const summary = args.summary ? args.summary : "Not provided"

        console.log("PWR submission:", studentID, birthdate, contact_info, summary)
        result.output = "Password reset request submitted."
        return result
    }
}

const readSystemInstructions = async () => { 
    let instructions = await fs.readFile(systemInstructionsLocation, 'utf-8');
    const files = await fs.readdir(additionalInstructionsLocation, 'utf-8');

    for (let file of files) {
        const filePath = path.join(additionalInstructionsLocation, file);
        let fileContent =  await fs.readFile(filePath, 'utf-8', );
        instructions += '\n' + fileContent;
    }

    return instructions;
}

function processTools(toolCalls) {
    const toolOutputs = []
    for (call of toolCalls) {
        try {
            if (call.type == "function") {
                toolOutputs.push(functions[call.function.name](call, call.function.arguments))
            }
        } catch (error) {
            toolOutputs.push({
                tool_call_id: call.id,
                success: "false",
                output: "An error occured"
            })
        }
    }
    return toolOutputs
}

// Root route
app.use(express.static('tecs-ai-assistant/dist'))
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/', async (req, res) => {
    console.log("Connection from: ", req.ip)
})

app.get('/servercheck', async (req, res) => {
    try {
        console.log("Success")
    } catch (error) {
        console.log("Fail")
    }
})

app.get('/test', async (req, res) => {
    try {
        const apiResponse = { message: `API test successful`, status: 'success' }
        // Send the API response as JSON with a 2 second delay
        res = await setTimeout(2000, res)
        res.json(apiResponse)
    } catch (error) {
        // Handle errors here
        res.status(500).json({ error: 'API error', message: 'Something went wrong on our end.', status: 'error' })
    }
})

app.get('/loadconversation', async (req, res) => {
    try {
        const apiResponse = { thread_id: "" }
        const thread = await openAIClient.beta.threads.create()
        apiResponse.thread_id = thread.id

        res.json(apiResponse)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
        console.error(error)
    }
})

app.post('/getresponse', async (req, res) => {
    try {
        const requestData = req.body // Get the data from the client
        const apiResponse = { message: "" }
        const threadID = requestData.thread_id
        const messageIn = requestData.message

        await openAIClient.beta.threads.messages.create(threadID, {
            role: "user", 
            content: messageIn
        })

        let run = await openAIClient.beta.threads.runs.create(threadID, {
            assistant_id: (await assistant).id
        })

        while (run.status != "completed") {
            run = await openAIClient.beta.threads.runs.retrieve(threadID, run.id)
            if (run.status == "requires_action" && run.required_action.type == "submit_tool_outputs") {
                const toolOutputs = processTools(run.required_action.submit_tool_outputs.tool_calls)
                run = await openAIClient.beta.threads.runs.submitToolOutputs(threadID, run.id, {
                    tool_outputs: toolOutputs
                })
            }
            
            console.log(run.status)
            await setTimeout(1000)
        }

        const messageResponse = await openAIClient.beta.threads.messages.list(threadID)
        const messages = messageResponse.data
        const latestMessage = messages[0]

        apiResponse.message = latestMessage.content[0].text.value
        res.json(apiResponse)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
        console.log(error)
    }
})

app.post('/query', async (req, res) => {
    const requestData = req.body // Get the data from the client
    const apiResponse = { message: "" }
    const conversation = requestData.conversation
    let openAIQuery = {}

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
            apiResponse.message = completion.choices[0].message.content
            apiResponse.status = 'success'
        } catch (error) {
            apiResponse.message = 'Could not connect to the AI service.'
            apiResponse.status = 'error'
            console.error(error)
        }

        res.json(apiResponse)
    } catch (error) {
        apiResponse.message = 'Internal server error.'
        apiResponse.status = 'error'
        res.json(apiResponse)
        console.error(error)
    }
})

app.listen(port, async () => {
    systemInstructions = await readSystemInstructions()
    console.log(`Server listening on port ${port}`)
})

// Clear any threads

// const threads = []

// for (let thread of threads) {
//     openAIClient.beta.threads.del(thread)
// }