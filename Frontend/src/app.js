import React from "react";


import Navbar from './nav-bar'
import ChatContainer from "./chat-container";


const App = () => {
    
    return (

        <div className="container-fluid">
            <Navbar />           
            <ChatContainer />
        </div>
    );
}

export default App;