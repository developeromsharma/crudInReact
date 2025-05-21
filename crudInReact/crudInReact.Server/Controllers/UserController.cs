using crudInReact.Server.DTO;
using crudInReact.Server.Helper;
using crudInReact.Server.Models;
using crudInReact.Server.Services;
using crudInReact.Server.Services.JwtService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace crudInReact.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : BaseController
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

            var user = await _userService.AuthenticateAsync(loginDto.Username, loginDto.Password);

            if (user == null)
                return Unauthorized("Invalid username or password.");

            var token = _jwtService.GenerateToken(user);

            return Ok(new { Token = token, IsAdmin = user.IsAdmin });
        }

        [HttpGet("non-admin")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<NonAdminUserDto>>>> GetNonAdminUsers()
        {
            var users = await _userService.GetNonAdminUsersAsync();
            return SuccessResponse(users, Constants.UserCoursesRetrieved);
        }
    }
}
