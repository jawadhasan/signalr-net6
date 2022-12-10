using System.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SignalRBasicSetup.WebAPI.Chat;

namespace SignalRBasicSetup.WebAPI.Hubs;

public class ChatHub : Hub
{
    private readonly PresenceTracker _presenceTracker;

    public ChatHub(PresenceTracker presenceTracker)
    {
        _presenceTracker = presenceTracker;
    }

    public override async Task OnConnectedAsync()
    {
        var user = Context.User.Identity.Name ?? Context.ConnectionId;
        var result = await _presenceTracker.ConnectionOpened(user);
        if (result.UserJoined)
        {
            //send notice to caller only.
            var connectedEvent = new ChatEvent(user, EventType.SignalRConnected, "OnConnectedAsync");
            await Clients.Caller.SendAsync("signalRConnected", connectedEvent);

            //send notice to everyone.
            var systemMsg = new ChatEvent("system", EventType.MESSAGE, $"{user} connected.");
            await Clients.All.SendAsync("chatMsgReceived", systemMsg);

            //broadcast online users to everyone
            var currentUsers = await _presenceTracker.GetOnlineUsers();
            await Clients.All.SendAsync("onlineUsers", currentUsers);
        }
        await base.OnConnectedAsync();
    }


    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var user = Context.User.Identity.Name ?? Context.ConnectionId;
        var result = await _presenceTracker.ConnectionClosed(user);
        if (result.UserLeft)
        {
            var systemMsg = new ChatEvent("system", EventType.MESSAGE, $"{user} left");
            await Clients.All.SendAsync("chatMsgReceived", systemMsg);
        }

        //broadcast online users to everyone
        var currentUsers = await _presenceTracker.GetOnlineUsers();
        await Clients.All.SendAsync("onlineUsers", currentUsers);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task Join(string user, string connectionId)
    {
        var nickName = user;

        var nickAvailable = await _presenceTracker.NickNameAvailable(user);

        if (!nickAvailable)
        {
            nickName = $"{user}_{Guid.NewGuid().ToString("N").Substring(0, 6)}";
        }

        //weird logic for now, until user identity is wired-up.
        //as now  nickname is provided, so remove connection entry [connection is now 'nickname']
        await _presenceTracker.ConnectionClosed(connectionId);

        var result = await _presenceTracker.ConnectionOpened(nickName);

        //this will help on-disconnected
        await _presenceTracker.SetupNickConnection(connectionId, nickName);

        var systemMsg = new ChatEvent("system", EventType.MESSAGE, $"{connectionId} is now {nickName}");
        await Clients.All.SendAsync("chatMsgReceived", systemMsg);
        
        if (result.UserJoined)
        {
            var joinEvent = new ChatEvent(nickName, EventType.JOIN);

            //Store to ChatRoom EventHistory
            ChatRoom.GetInstance().AddEvent(joinEvent);//may pass Security.getSessionUser()


            await Clients.Caller.SendAsync("setNickName", nickName);//notify caller to setup itself

            await Clients.All.SendAsync("userJoined", joinEvent); //broadcast to all clients
        }

        //broadcast online users to All.
        var currentUsers = await _presenceTracker.GetOnlineUsers();
        await Clients.All.SendAsync("onlineUsers", currentUsers);
    }

    public async Task Say(string user, string text)
    {
        var msgEvent = new ChatEvent(user, EventType.MESSAGE, text);

        //Store to ChatRoom EventHistory
        ChatRoom.GetInstance().AddEvent(msgEvent);
        await Clients.All.SendAsync("chatMsgReceived", msgEvent);
    }

    public async Task GetChatHistory()
    {
        var hist = ChatRoom.GetInstance().GetChatHistory();
        await Clients.All.SendAsync("chatHistReceived", hist);
    }



    public async Task SendMessageToAll(string user, string msg)
    {
        await Clients.All.SendAsync("ReceiveMessage", user,msg);
    }



}



//HubFilters can be applied globally or tied to a specific hub, see startup.cs for register hubfilter.
//HubFilters works similar way of middlewares.

/*
 * HubFilters Allow custom code to be executed before and after Hub methods are invoked.
 * HubFilters provide an easy way to plug into every message.
 * Example Usecases: Logging conversations in a chat app. | filtering and validating incoming data.
 */
public class ChatHubLogFilter : IHubFilter
{

    //main function of HubFilter and will execute everytime data is sent to associated hub.
    public async ValueTask<object> InvokeMethodAsync(
        HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object>> next)
    {
        var messageText = JsonConvert.SerializeObject(invocationContext.HubMethodArguments);
        Debug.WriteLine($"Conversation Log {messageText}"); //log to db

        Debug.WriteLine($"Before Method Execution");

        var nextRun = await next(invocationContext);

        Debug.WriteLine($"After Method Execution");

        return nextRun;
    }
}

