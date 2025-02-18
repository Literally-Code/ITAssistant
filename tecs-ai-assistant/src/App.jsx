import Login from './components/Login';
import Chat from './components/Chat';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => 
{
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/chat' element={<Chat />} />
            </Routes>
        </Router>
    );
};

export default App;
