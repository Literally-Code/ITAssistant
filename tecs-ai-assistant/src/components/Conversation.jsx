import { useState, useEffect } from "react";
import { getAssistantResponse } from "../utils/api";
import Message from "./Message";

// Status types: 'loading', 'success', 'error'
class MessageData
{
    constructor(id, agent, text, status) {
        this.id = id;
        this.agent = agent;
        this.text = text;
        this.status = status;
    }
}

class Response
{
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

function Conversation()
{
    const [messages, setMessages] = useState([]);
    const [responseLoaded, setResponseLoaded] = useState(false);
    const [content, setContent] = useState('');
    const [response, setResponse] = useState(new Response('', ''));

    const [isHoldingShift, setIsHoldingShift] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const placeholderText = 'Send a message...';
    const loadingText = 'Thinking...';

    useEffect(() => {
        // Check for iPhone or iPad in the user agent string
        const userAgent = navigator.userAgent;

        if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    useEffect(() => {
        if (!responseLoaded)
            return;

        let updatedMessages = [...messages];
        updatedMessages[updatedMessages.length-1] = new MessageData(updatedMessages.length-1, 'assistant', response.message, response.status)
        setMessages(updatedMessages);
        setResponse(new Response('', ''))
    }, [responseLoaded])

    // Functions

    const handleReturn = async () => {
        setContent('');
        setResponseLoaded(false);

        let currentMessages = messages.length > 0 && messages[messages.length - 1].status === 'success' ? messages : messages.slice(0, messages.length - 2);
        // Creates the next two messages: the user message and the assistant response skeleton
        // If the last assistant response was unsuccessful, then do not include the last two messages
        setMessages([...currentMessages, 
            new MessageData(currentMessages.length, 'user', content, 'success'), 
            new MessageData(currentMessages.length + 1, 'assistant', loadingText, 'loading')]);
        
        let fetchSauce = currentMessages.filter((messageData) => {
            return messageData.status === 'success'
        })
        
        fetchSauce = fetchSauce.map((messageData) => {
            return {role: messageData.agent, content: messageData.text};
        });
        fetchSauce = [...fetchSauce, {role: 'user', content: content}];
        console.log(fetchSauce)
        const fetchRes = await getAssistantResponse(fetchSauce);
        setResponse(fetchRes);
        setResponseLoaded(true);
    }

    const isButtonDisabled = () => {
        return content.length === 0 || content === '\n';
    }

    // Event Handlers

    const handleOnBlur = (event) => {
        if (event.target.innerText === '' || event.target.innerText === '\n')
            event.target.innerText = placeholderText;
        else
            event.target.innerText;
    }

    const handleOnFocus = (event) => {
        event.target.innerText = '';
    }

    const handleKeyDown = (event) => {
        if (event.key == 'Shift')
            {
                setIsHoldingShift(true);
            }
        if (event.key == 'Enter' && !isHoldingShift)
        {
            event.target.innerText = '';
            event.target.blur();
            handleReturn();
        }
    }

    const handleKeyUp = (event) => {
        setContent(event.target.innerText);
        if (event.key == 'Shift')
        {
            setIsHoldingShift(false);
        }
    }

    return (
        <div className="flex flex-col flex-grow h-screen m-3 w-11/12 h-11/12">
            <div className="flex-grow bottom-0 p-4 bg-transparent">
                {messages.map((message) => (
                    <Message key={message.id} agent={message.agent} status={message.status} text={message.text} />
                ))}
                <div className={messages.length > 0 ? "hidden" : ""}>
                    <h1 className="text-3xl font-bold text-black">Citrus College AI Tech Support</h1>
                    <p className="text-black animate-bounce pt-1">Send a message to get started!</p>
                </div>
            </div>
            <div className={"flex items-end sticky bottom-5 rounded-xl p-2 h-max bg-blue-400"}>
                <div contentEditable="true" suppressContentEditableWarning={true} onBlur={handleOnBlur} onFocus={handleOnFocus} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} data-placeholder={placeholderText} className="p-1 h-max max-h-32 overflow-auto resize-none flex-grow placeholder:text-slate-300 text-white text-lg bg-transparent rounded">{placeholderText}</div>
                <button onClick={handleReturn} disabled={isButtonDisabled()} className={`flex justify-center items-center text-3xl border p-2 ml-1 w-9 h-9 rounded ${isButtonDisabled() ? "bg-transparent text-blue-500" : "bg-blue-500 text-black"}`}>
                    <div>➤</div>
                </button>
            </div>
        </div>
    );
}

export default Conversation;