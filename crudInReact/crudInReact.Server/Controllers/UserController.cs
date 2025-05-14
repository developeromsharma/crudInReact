using crudInReact.Server.DTO;
using crudInReact.Server.Services;
using crudInReact.Server.Services.JwtService;
using Microsoft.AspNetCore.Mvc;

namespace crudInReact.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;

        public UserController(IUserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginDto)
        {
            if (loginDto == null)
                return BadRequest("Login data is null.");

            // Authenticate the user based on the provided credentials
            var user = await _userService.AuthenticateAsync(loginDto.Username, loginDto.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            // Generate JWT token after successful authentication
            var token = _jwtService.GenerateToken(user);

            // Send back the token and the isAdmin claim
            return Ok(new { Token = token, IsAdmin = user.IsAdmin });
        }
    }
}
