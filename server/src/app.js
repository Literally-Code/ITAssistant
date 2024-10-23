require('dotenv').config()

const openAI = require('openai')
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const yargs = require('yargs')
const app = express()
const bodyParser = require('body-parser')
const { setTimeout } = require('timers/promises')
const port = 3000
var testCount = 0;

const openAIClient = new openAI.OpenAI({apiKey: process.env.OPENAI_API_KEY})
const assistant = openAIClient.beta.assistants.retrieve("asst_FVaaTMv8M23SvADtsU6yL4WC")

const functions = {
    "password_reset": (call, arguments) => {
        arguments = JSON.parse(arguments)
        const result = { tool_call_id: call.id, output: "" }
        const studentID = arguments.student_id
        const birthdate = arguments.birthdate
        const contact_info = arguments.contact_info ? arguments.contact_info : "Not provided"
        const summary = arguments.summary ? arguments.summary : "Not provided"

        console.log("PWR submission:", studentID, birthdate, contact_info, summary)
        result.output = "Password reset request submitted."
        return result
    }
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
        const apiResponse = { message: `API test successful. Test count: ${++testCount}` }
        // Send the API response as JSON
        res.json(apiResponse)
    } catch (error) {
        // Handle errors here
        res.status(500).json({ error: 'Internal Server Error' })
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

// Clear any threads

const threads = []

for (let thread of threads) {
    openAIClient.beta.threads.del(thread)
}