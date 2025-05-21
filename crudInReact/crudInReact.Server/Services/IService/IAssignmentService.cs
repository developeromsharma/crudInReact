using crudInReact.Server.Models;

namespace crudInReact.Server.Services.IService
{
    public interface IAssignmentService
    {
        void AssignCourseToUser(int userId, int courseId);
        IEnumerable<CourseModel> GetCoursesForUser(int userId);
        IEnumerable<CourseModel> GetCoursesForUser(string userName);
        void UnassignCourseFromUser(int userId, int courseId);
    }
}
