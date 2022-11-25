const signalR = require("@microsoft/signalr");          //npm install microsoft/signalr

let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5229/productHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

//method wiring which server will call
connection.on("methodOnClient", data => { 
    handleMethodOnClient(data);
});

// handler
function handleMethodOnClient(msg){   
    console.log(`${msg} -handler-method`);
}

//start and sending message to signalRHub
connection.start()
    .then(() => {
        console.log(`on-start`);
        connection.invoke("SendMessageToAll", "Hello")
    });