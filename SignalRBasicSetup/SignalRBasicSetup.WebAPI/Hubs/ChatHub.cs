using System.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SignalRBasicSetup.WebAPI.Chat;

namespace SignalRBasicSetup.WebAPI.Hubs;

public class ChatHub : Hub
{


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