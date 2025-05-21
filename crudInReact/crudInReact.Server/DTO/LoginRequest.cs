using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username is required.")]
        [MinLength(2, ErrorMessage = "Username must be at least 2 characters long.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(2, ErrorMessage = "Password must be at least 2 characters long.")]
        public string Password { get; set; } = string.Empty;
    }
}
