import React from "react";

const ChatMessages = ({ messages, mynick }) => {

    return (
        <div id="messages">

            {messages.map((msg, i) => (
                <div key={Date.now() * Math.random()}>

                    <span className="fa fa-clock"></span>
                    <span className="date" data-bind="text: displayDate">{msg.displayDate}</span>


                    {msg.eventType == 2 &&
                        <span className="message" data-bind="if: eventType == 2">
                            <span className={mynick == msg.user ? "user you": "user"} data-bind="text: user, css: { you: user == `${$parent.nick()}` }">{msg.user}</span>&gt;
                            <span className="text" data-bind="text: text">{msg.text}</span>
                        </span>
                    }

                    {msg.eventType == 0 &&
                        <span className="join" data-bind="if: eventType == 0">
                            <span className="user" data-bind="text: user">{msg.user}</span> joins the room.
                        </span>
                    }

                    {msg.eventType == 1 &&
                        <span className="leave" data-bind="if: eventType == 1">
                            <span className="user" data-bind="text: user">{msg.user}</span> leaves the room.
                        </span>
                    }

                </div>
            ))}
        </div>
    );
}

export default ChatMessages;