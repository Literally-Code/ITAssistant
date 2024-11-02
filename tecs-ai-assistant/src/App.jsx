import Navbar from './components/Navbar'
import Conversation from './components/Conversation'
import { useState } from 'react'

const App = () => 
{
    return (
        <>
            <Navbar></Navbar>
            <div className="flex justify-center mt-14">
                <Conversation></Conversation>
            </div>
        </>
    )
}

export default App
