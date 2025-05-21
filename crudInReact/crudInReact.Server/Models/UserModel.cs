using System.Collections.Generic;

namespace crudInReact.Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }

        // Use non-nullable string with init-only setters (if your project targets C# 9+)
        public string Username { get; set; } = string.Empty;

        // Consider hashing passwords; but for now keep string, maybe nullable if needed
        public string Password { get; set; } = string.Empty;

        public bool IsAdmin { get; set; }

        // Initialize collection to avoid null reference exceptions
        public ICollection<UserCourseModel> UserCoursesModel { get; set; } = new List<UserCourseModel>();
    }
}
