using crudInReact.Server.Models;

namespace crudInReact.Server.Services
{
    public interface ICourseServices
    {
        bool SaveChanges();
        IEnumerable<CourseModel> GetAllCourses();
        CourseModel GetCourseById(int id);
        void AddCourse(CourseModel newCourse);
        void UpdateCourse(CourseModel newCourse);
        void DeleteCourse(CourseModel newCourse);
        void AssignCourseToUser(int userId, int courseId);
        IEnumerable<CourseModel> GetCoursesForUser(int userId);
        void UnassignCourseFromUser(int userId, int courseId);
    }
}
