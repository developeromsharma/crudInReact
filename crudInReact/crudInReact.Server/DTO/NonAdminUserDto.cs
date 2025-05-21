using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class NonAdminUserDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(100, MinimumLength =2, ErrorMessage = "Username must be between 2 and 100 characters.")]
        public string Username { get; set; } = string.Empty;
    }
}
