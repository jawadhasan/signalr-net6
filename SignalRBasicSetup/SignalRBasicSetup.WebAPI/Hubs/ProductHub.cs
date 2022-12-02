using Microsoft.AspNetCore.SignalR;
using SignalRBasicSetup.WebAPI.Chat;

namespace SignalRBasicSetup.WebAPI.Hubs
{
    public class ProductHub : Hub
    {
        public async Task SendMessageToAll(string msg)
        {
            await Clients.All.SendAsync("methodOnClient", $"{msg}-ProductHub- ");
        }

        //Other methods
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("methodOnClient", message);
            // await Clients.User(user).SendAsync("userJoined", joinEvent);
        }


        //Method can be moved to ChatHub
        public async Task Join(string user)
        {
            var joinEvent = new ChatEvent(user, EventType.JOIN);

            //Store to ChatRoom EventHistory
            ChatRoom.GetInstance().AddEvent(joinEvent);//may pass Security.getSessionUser()
            await Clients.All.SendAsync("userJoined", joinEvent);
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
        

    }
}
