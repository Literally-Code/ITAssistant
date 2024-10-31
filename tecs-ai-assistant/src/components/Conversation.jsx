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

const processConversationData = (messages, userContent) => {
    let onlySuccessfulResponses = messages.filter((messageData) => {
        return messageData.status === 'success'
    })

    let mappedToAPIFormat = onlySuccessfulResponses.map((messageData) => {
        return {role: messageData.agent, content: messageData.text};
    });

    return [...mappedToAPIFormat, {role: 'user', content: userContent}];
}

function Conversation()
{
    const [messages, setMessages] = useState([]);
    const [responseLoaded, setResponseLoaded] = useState(false);
    const [userContent, setUserContent] = useState('');
    const [response, setResponse] = useState(new Response('', ''));

    const [isHoldingShift, setIsHoldingShift] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const placeholderText = 'Send a message...';
    const loadingText = 'Thinking...';

    // Check if the user is on mobile
    useEffect(() => {
        const userAgent = navigator.userAgent;

        if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    // Update the response state when a response from the server is loaded
    useEffect(() => {
        if (!responseLoaded)
            return;

        let updatedMessages = [...messages];
        updatedMessages[updatedMessages.length-1] = new MessageData(updatedMessages.length-1, 'assistant', response.message, response.status)
        setMessages(updatedMessages);
        setResponse(new Response('', ''))
    }, [responseLoaded])

    // Returns true if the button should be disabled, false if not
    const isButtonDisabled = () => {
        return userContent.length === 0 || userContent === '\n';
    }

    // Event Handlers

    // Handles the process for when the user submits a message
    // Creates the next two messages: the user message and the assistant response skeleton while waiting for a response
    // If the last assistant response was unsuccessful, then it will override the unsuccessful response and user message that prompted it
    const handleReturn = async () => {
        setUserContent('');
        setResponseLoaded(false);

        let currentMessages = messages.length > 0 && messages[messages.length - 1].status === 'success' ? messages : messages.slice(0, messages.length - 2);
        setMessages([...currentMessages, 
            new MessageData(currentMessages.length, 'user', userContent, 'success'), 
            new MessageData(currentMessages.length + 1, 'assistant', loadingText, 'loading')]);
        
        let processedConversationData = processConversationData(currentMessages, userContent) 
        const fetchRes = await getAssistantResponse(processedConversationData);
        setResponse(fetchRes);
        setResponseLoaded(true);
    }

    // Handles the onBlur event for the input field, updating the placeholder and text accordingly
    const handleOnBlur = (event) => {
        if (event.target.innerText === '' || event.target.innerText === '\n')
            event.target.innerText = placeholderText;
        else
            event.target.innerText;
    }

    // Handles the onFocus event for the input field. Intended for clearing the placeholder text upon focusing
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
        setUserContent(event.target.innerText);
        if (event.key == 'Shift')
        {
            setIsHoldingShift(false);
        }
    }

    return (
        <>
            <div className="flex flex-col flex-grow m-3 w-11/12 h-11/12">
                <div className="flex-grow bottom-0 p-4 bg-transparent">
                    {messages.map((message) => (
                        <Message key={message.id} agent={message.agent} status={message.status} text={message.text} />
                    ))}
                    <div className={messages.length > 0 ? "hidden" : ""}>
                        <h1 className="text-3xl font-bold text-black">Citrus College AI Tech Support</h1>
                        <p className="text-gray-900">*This service is intended only for assistance regarding Citrus College. We kindly ask that you avoid any other topics!</p>
                        <p className="text-black animate-bounce pt-1 font-medium">Send a message to get started!</p>
                    </div>
                </div>
            </div>
            <div className="fixed w-full bottom-2">
                <div className={"flex items-end rounded-xl p-2 flex-grow ml-1 mr-1 h-max bg-blue-400"}>
                    <div contentEditable="true" suppressContentEditableWarning={true} onBlur={handleOnBlur} onFocus={handleOnFocus} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} data-placeholder={placeholderText} className="p-1 h-max max-h-32 overflow-auto resize-none flex-grow placeholder:text-slate-300 text-white text-lg bg-transparent rounded">{placeholderText}</div>
                    <button onClick={handleReturn} disabled={isButtonDisabled()} className={`flex justify-center items-center text-3xl border p-2 ml-1 w-9 h-9 rounded ${isButtonDisabled() ? "bg-transparent text-blue-500" : "bg-blue-500 text-black"}`}>
                        <div>➤</div>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Conversation;