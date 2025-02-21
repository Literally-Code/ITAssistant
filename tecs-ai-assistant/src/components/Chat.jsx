import Navbar from './Navbar';
import Conversation from './Conversation';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { checkAuth } from '../utils/api';

const Chat = () => 
{
    return <>
        <Navbar></Navbar>
        <div className="flex justify-center mt-14">
            <Conversation></Conversation>
        </div>
    </>
};

export default Chat;
