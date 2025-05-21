using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.Models
{
    public class UserCourseModel
    {
        [Key, Column(Order = 0)]
        public int UserId { get; set; }

        [Key, Column(Order = 1)]
        public int CourseId { get; set; }

        public UserModel UserModel { get; set; }    
        public CourseModel CourseModel { get; set; }
    }
}
