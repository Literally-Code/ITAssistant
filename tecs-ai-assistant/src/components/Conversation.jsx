import { useState, useEffect } from "react";
import { fetchTest } from "../utils/api";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";

function Conversation()
{
    const [messages, setMessages] = useState([]);

    const [isHoldingShift, setIsHoldingShift] = useState(false);
    const [content, setContent] = useState('');
    const [response, setResponse] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const placeholderText = 'Send a message...';

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
        if (response != '')
        {
            setMessages([...messages, {id: messages.length, agent: 'assistant', text: response}]);
            setResponse('');
        }
    }, [response])

    // Functions

    const handleReturn = () => {
        setMessages([...messages, {id: messages.length, agent: 'user', text: content}]); // Make two messages, have second message be the 'loading' message?
        setContent('');
        fetchTest(setResponse);
    }

    const isButtonDisabled = () => {
        return content.length === 0 || content === '\n';
    }

    // Event Handlers

    const addContent = (event) => {
        event.target.innerText = event.target.innerText === '' || event.target.innerText === '\n' ? placeholderText : event.target.innerText;
    }

    const removeContent = (event) => {
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
                    message.agent === 'user' ?
                    <UserMessage key={message.id} text={message.text === '' ? '...' : message.text} /> :
                    <AssistantMessage key={message.id} text={message.text === '' ? '...' : message.text} />
                ))}
                <div className={messages.length > 0 ? "hidden" : ""}>
                    <h1 className="text-3xl font-bold text-black">Citrus College AI Tech Support</h1>
                    <p className="text-black animate-pulse">Send a message to get started!</p>
                </div>
            </div>
            <div className={"flex items-end sticky bottom-5 rounded-xl p-2 h-max bg-blue-400"}>
                <div contentEditable="true" suppressContentEditableWarning={true} onBlur={addContent} onFocus={removeContent} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} data-placeholder={placeholderText} className="p-1 h-max max-h-32 overflow-auto resize-none flex-grow placeholder:text-slate-300 text-white text-lg bg-transparent rounded">{placeholderText}</div>
                <button onClick={handleReturn} disabled={isButtonDisabled()} className={`flex justify-center items-center text-3xl border p-2 ml-1 w-9 h-9 rounded ${isButtonDisabled() ? "bg-transparent text-blue-500" : "bg-blue-500 text-black"}`}>
                    <div>➤</div>
                </button>
            </div>
        </div>
    );
}

export default Conversation;