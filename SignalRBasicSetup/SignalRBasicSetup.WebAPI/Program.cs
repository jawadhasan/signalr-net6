using Microsoft.AspNetCore.SignalR;
using SignalRBasicSetup.WebAPI.Chat;
using SignalRBasicSetup.WebAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // to listen for incoming http connection on port 5000
    //options.ListenAnyIP(7001, configure => configure.UseHttps()); // to listen for incoming https connection on port 7001
});

// Add services to the container.
builder.Services.AddCors();


//builder.Services.AddSignalR();

//signalr with hubfilter on chathub.
builder.Services
    .AddSignalR()
    .AddHubOptions<ChatHub>(options =>
{
    options.AddFilter<ChatHubLogFilter>();
});
builder.Services.AddSingleton(new ChatRoom());

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(cp => cp
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true) //allow any origin
    .AllowCredentials()
);
app.MapHub<ProductHub>("/productHub");
app.MapHub<ChatHub>("/chatHub");
app.MapControllers();

app.Run();