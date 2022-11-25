using Microsoft.AspNetCore.SignalR;

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
        }

    }
}
