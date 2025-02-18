import { postAuth } from "../utils/api";
import { postLogout } from "../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (element) => {
        let result = await postAuth(username, password);
        console.log(result)
        if (result.success)
        {
            navigate("/chat");
        }
        else
        {
            navigate("/");
        }
    };
    const handleLogout = async (element) => {
        let result = await postLogout(username, password);
        console.log(result)
    };

    return <>
        <div>
            <h2>Mock SSO Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" onChange={(element) => {setUsername(element.target.value)}} value={username} required />
                <input type="password" placeholder="Password" onChange={(element) => {setPassword(element.target.value)}} value={password} required />
                <button type="submit">Login</button>
            </form>
        </div>
        <button onClick={handleLogin}>|test login|</button>
        <button onClick={handleLogout}>|test logout|</button>
    </>
};

export default Auth;
