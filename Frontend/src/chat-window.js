import React from 'react';

import Message from './message';

const ChatWindow = (props) => {
    const chat = props.chat
        .map(m => <Message 
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.text}/>);

    return(
        <div>
            {chat}
        </div>
    )
};

export default ChatWindow;