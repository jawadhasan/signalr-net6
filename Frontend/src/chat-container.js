import React, { useState, useEffect, useRef } from "react";
// import { HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr'

import PageAlert from "./page-alert"
import OnlineUsers from "./online-users";
import ChatMessages from "./chat-messages"

import ChatWindow from "./chat-window"
import JoinForm from "./join-form";
import ChatInput from "./chat-input";

const ChatContainer = () => {

    const [connectionId, setConnectionId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [infoMsg, setInfoMsg] = useState();
    const [connection, setConnection] = useState();

    const [user, setUser] = useState({
        nick: "",
        firstName: ""
    });
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);
    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            //.withUrl("http://localhost:5000/chatHub") //when testing locally
            .withUrl('https://signalrbasicsetup.r8lru52odt8au.eu-central-1.cs.amazonlightsail.com/chatHub')
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);


    }, []);

    useEffect(() => {

        if (connection) {

            console.log('useeffect called.')

            // connection.on('signalRConnected', data => {
            //     console.log('server:signalRConnected', data);              
            //     handleConnected(data);
            // });

            connection.on("signalRConnected", (e) => handleConnected(e));

            connection.on("onlineUsers", data => {
                console.log('onlineUsers', data);
                setUsers(data);
            });

            connection.on("chatMsgReceived", (e) => handleChatMsgRcvd(e));

            connection.on("chatHistReceived", (e) => handleChatHistRcvd(e));

            connection.on("userJoined", (e) => handleUserJoined(e));

            connection.on("setNickName", data => {
                console.log('setNickName', data);
                setUser({ nick: data, firstName: "" });
                setIsJoined(true);
                localStorage.setItem("localnick", data);
            });



            //start connection
            connection.start(() => {
                console.log(`connection started.`);
            }).then(() => {
                console.log(`SignalR connected.`);

                setIsConnected(true);
                setInfoMsg("SignalR connected.");

            }).catch(e => {
                console.log('Connection failed: ', e)
            });

            // Load the stuff from local storage
            let localNick = localStorage.getItem("localnick");
            if (localNick) { // undefined if there is nothing in local storage
                setUser({
                    nick: localNick,
                    firstName: ""
                })
            }
        }
    }, [connection]);


    const handleConnected = (data) => {
        const notice = `${data.user} is connected`;
        setConnectionId(data.user);
        setInfoMsg(notice)
    }

    const handleUserJoined = (data) => {
        console.log('handleUserJoined', data);
        updateChatMsgs(data);

    }

    const handleChatMsgRcvd = (data) => {
        console.log('handleChatMsgRcvd', data);
        updateChatMsgs(data);

    }

    const handleChatHistRcvd = (data) => {
        clearChat();
        setChat(data);
    }

    const updateChatMsgs = (data) => {
        const updatedChat = [...latestChat.current];
        updatedChat.unshift(data);
        setChat(updatedChat);

    }
    //Actions triggered from UI Buttons
    const onJoin = (usr) => {
        console.log('join handler', usr);
        connection.invoke("Join", usr.nick, connectionId);
    }

    const say = (message) => {

        console.log(message);
        connection.invoke("Say", user.nick, message) //manually passing username
        //this.messageText("");//clear
    }

    const clearChat = () => {
        console.log('clear-chat action');
        setChat([]);
    }
    const getChatHistory = () => {
        connection.invoke("GetChatHistory");
    }

    return (
        <div className="row">

            <div className="col col-md-12">
                <PageAlert message={infoMsg} />
            </div>

            <div className="col col-md-6">

                {isConnected && !isJoined && <JoinForm user={user} onJoin={onJoin} />}

                {isJoined &&

                    <div>
                        <h4 className="bg-dark text-white">Welcome, {user.nick}</h4>
                    </div>
                }

                <ChatMessages messages={chat} mynick={user.nick} />

                {isJoined &&

                    <div>
                        <ChatInput sendMessage={say} /> 
                        <hr />
                        <button className="btn btn-warning" onClick={clearChat}>Clear</button>
                        <button className="btn btn-info" onClick={getChatHistory}>Chat-History</button>

                    </div>
                }

            </div>


            <div className="col col-md-6 bg-light">
                <OnlineUsers users={users} />
            </div>

            {/* <ChatWindow chat={chat} /> */}

        </div>
    );
}

export default ChatContainer;