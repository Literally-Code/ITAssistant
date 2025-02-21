import Login from './components/Login';
import AuthProvider from './components/AuthProvider';
import Chat from './components/Chat';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

const App = () => 
{
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Navigate to='/login' />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
