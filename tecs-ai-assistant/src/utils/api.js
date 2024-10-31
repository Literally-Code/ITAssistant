const API_BASE_URL = import.meta.env.VITE_API_URL

const handleResponseError = (error) => {
    console.error("An error occured when fetching from the server\n", error);
    return {message: 'Could not connect to the server. Check your internet connection and try again.', status: 'error'};
}

function setCookie(name, value, expirationDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

const getCookie = (name) => {
    const value = `;${document.cookie}`;
    const parts = value.split(`;${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}

export const fetchTest = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/test`);
        const json = await response.json();
        return json;
    } catch (error) {
        return handleResponseError(error);
    }
}

export const getAssistantResponse = async (conversation) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    conversation: conversation
                }
            )
        });
        const json = await response.json();
        return json
    } catch (error) {
        return handleResponseError(error)
    }
}

// TODO: Secure conversation thread IDs

const createConversation = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/loadconversation`)
        const data = await response.json()
        
        return data.thread_id
    } catch (error) {
        console.error("Cannot load conversation\n", error);
        return;
    }
}

const clearConversation = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/clearconversation`, 
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        thread_id: threadID,
                        message: prompt.value
                    }
                )
            }
        )
        const data = await response.json()
        
        return data.thread_id
    } catch (error) {
        console.error("Cannot load conversation\n", error);
        return;
    }
}