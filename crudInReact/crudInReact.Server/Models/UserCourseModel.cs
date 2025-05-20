namespace crudInReact.Server.Models
{
    public class UserCourseModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }

        public UserModel UserModel { get; set; }    
        public CourseModel CourseModel { get; set; }
    }
}
