import Navbar from './Navbar';
import Conversation from './Conversation';

const Chat = () => 
{
    useEffect(() => {
        axios.get("http://localhost:5000/chat", { withCredentials: true })
            .then(response => setMessage(response.data.message))
            .catch(() => navigate("/"));
    }, [navigate]);

    return <>
        <Navbar></Navbar>
        <div className="flex justify-center mt-14">
            <Conversation></Conversation>
        </div>
    </>
};

export default Chat;
