import React, {useState} from "react";

const ChatInput = (props) => {

    const [message, setMessage] = useState('');

    const onMessageUpdate = (e) => {
        setMessage(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const isMessageProvided = message && message !== '';

        if (isMessageProvided) {
            props.sendMessage(message);
            setMessage("");//clear
        }
        else {
            alert('Please insert a message.');
        }
    }

    return (
        <div>
            <form className="form-inline" id="inputForm" onSubmit={onSubmit}>

                <input
                    type="text"
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Type your message here"
                    value={message}
                    onChange={onMessageUpdate} />

                <input className="btn btn-primary" type="submit" value="Send"/>                
            </form>
          
        </div>
    );
}

export default ChatInput;