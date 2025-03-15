import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth, postAuth, postLogout } from "../utils/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => 
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginAttempted, setLoginAttempted] = useState(false);

    const handleAuthResponse = (response) => {
        if (response.success)
        {
            setUser(response.user);
        }
        else
        {
            setUser(null);
        }

        setLoading(false);
        return response;
    }

    const login = async (username, password) => {
        let response = await postAuth(username, password);
        setLoginAttempted(true);

        return handleAuthResponse(response);
    }

    const logout = async () => {
        let response = await postLogout();
        setLoginAttempted(false);

        return handleAuthResponse(response);
    }

    const authEffect = async () => {
        let response = await checkAuth();
        handleAuthResponse(response);
    }

    useEffect(() => {
        authEffect();
    }, []);

    return <AuthContext.Provider value={{ user, login, logout, loginAttempted }}>
        {loading ? "Loading..." : children}
    </AuthContext.Provider>
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);