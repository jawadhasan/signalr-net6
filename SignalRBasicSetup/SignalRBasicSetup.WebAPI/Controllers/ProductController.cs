using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRBasicSetup.WebAPI.Hubs;

namespace ModbusTCP.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController:ControllerBase
    {
        private readonly IHubContext<ProductHub> _hubContext;

        public ProductController(IHubContext<ProductHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //using hub inside a controller
            await _hubContext.Clients.All.SendAsync("methodOnClient", "product");

            return Ok();
        }
    }
}
