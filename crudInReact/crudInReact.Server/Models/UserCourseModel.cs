using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace crudInReact.Server.Models
{
    public class UserCourseModel
    {
        [Key, Column(Order = 0)]
        public int UserId { get; set; }
        [Key, Column(Order = 1)]
        public int CourseId { get; set; }

        // Navigation properties marked as nullable to avoid EF warnings if using nullable reference types
        public UserModel? UserModel { get; set; }
        public CourseModel? CourseModel { get; set; }
    }
}
