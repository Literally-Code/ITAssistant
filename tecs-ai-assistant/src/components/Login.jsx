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
        <div className="flex justify-center align-middle">
            <form className="shadow-black flex flex-col gap-4 p-4 w-[80vw] h-full mt-32" onSubmit={handleLogin}>
                <h1 className="p-2 text-2xl text-black">Sign In</h1>
                <input className="bg-gray-300 p-2" type="text" placeholder="Username" onChange={(element) => {setUsername(element.target.value)}} value={username} required />
                <input className="bg-gray-300 p-2" type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <p className={`text-red-500 ${loginAttempted && !user ? "visible" : "invisible"}`}>Invalid username or password</p>
                <button className="bg-citrus-blue text-white p-2" type="submit">Log In</button>
            </form>
        </div>
    </>
};

export default Auth;
