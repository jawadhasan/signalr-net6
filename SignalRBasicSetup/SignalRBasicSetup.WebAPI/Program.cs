using SignalRBasicSetup.WebAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddSignalR();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(cp => cp
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true) //allow any origin
    .AllowCredentials()
);
app.MapHub<ProductHub>("/productHub");
app.MapControllers();

app.Run();
