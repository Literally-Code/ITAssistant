const API_BASE_URL = import.meta.env.VITE_API_URL

export const fetchTest = (setResult) => {
    fetch(`${API_BASE_URL}/test`)
        .then((response) => response.json())
        .then((data) => {
            setResult(data.message)
        })
        .catch(error => {
            console.error('Error connecting to the API')
        })
}

export const getAssistantResponse = (prompt, threadID) => {
    fetch(`${API_BASE_URL}/getresponse`, {
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
        })
        .then(response => response.json())
        .then(data => {
            // Result message
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

// TODO: Make this work. Cookies n stuff ykwim
const initConversation = async () => {
    const cookie = getCookie("thread_id")
    if (cookie != undefined && cookie != "") {
        return cookie
    }
    const response = await fetch(`${API_BASE_URL}/loadconversation`)

    if (!response.ok) {
        errorOccur()
        return
    }

    const data = await response.json()
    setCookie("thread_id", data.thread_id, 7)
    return data.thread_id
}