namespace crudInReact.Server.Models
{
    public class UserCourseModel
    {
        public int UserId { get; set; }
        public UserModel UserModel { get; set; }

        public int CourseId { get; set; }
        public CourseModel CourseModel { get; set; }
    }
}
