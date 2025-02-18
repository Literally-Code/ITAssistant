const API_BASE_URL = import.meta.env.VITE_API_URL;

const handleResponseError = (error) => 
{
    console.error("An error occured when fetching from the server\n", error);
    return {
        message: 'Could not connect to the server. Check your internet connection and try again.', 
        status: 'error'
    };
};

export const fetchTest = async () => 
{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/test`);
        const json = await response.json();
        return json;
    } 
    catch (error) 
    {
        return handleResponseError(error);
    }
};

export const getAssistantResponse = async (conversation) => 
{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/query`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    conversation: conversation
                }
            )
        });
        const json = await response.json();
        return json;
    } 
    catch (error) 
    {
        return handleResponseError(error);
    }
};

export const postAuth = async (username, password) => 
{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/login`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password
                }
            )
        });
        const json = await response.json();
        return json;
    } 
    catch (error) 
    {
        return handleResponseError(error);
    }
};

export const checkAuth = async () => 
{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/check-auth`, 
        {
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        return json;
    } 
    catch (error) 
    {
        return handleResponseError(error);
    }
}

export const postLogout = async () => 
{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/logout`, 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        return json;
    } 
    catch (error) 
    {
        return handleResponseError(error);
    }
};