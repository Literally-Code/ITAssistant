import { checkAuth, getAssistantResponse, postAuth } from "../utils/api";
import { postLogout } from "../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "./Navbar";

const Auth = () => 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login, loginAttempted, user } = useAuth();

    const handleLogin = async (element) => {
        element.preventDefault();
        await login(username, password);
        await navigate("/chat");
    };

    return <>
        <Navbar></Navbar>
        <form className="flex flex-col space-y-4 p-4 ml-5 mr-5 h-full mt-32" onSubmit={handleLogin}>
            {loginAttempted && !user ? <p className="text-red-500">Invalid username or password</p> : null}
            <input className="bg-gray-200 p-2" type="text" placeholder="Username" onChange={(element) => {setUsername(element.target.value)}} value={username} required />
            <input className="bg-gray-200 p-2" type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
            <button className="bg-citrus-blue text-white p-2" type="submit">Log In</button>
        </form>
    </>
};

export default Auth;
