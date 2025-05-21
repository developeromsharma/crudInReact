using crudInReact.Server.Models;

namespace crudInReact.Server.Services.IService
{
    public interface ICourseServices
    {
        bool SaveChanges();
        IEnumerable<CourseModel> GetAllCourses();
        CourseModel GetCourseById(int id);
        void AddCourse(CourseModel newCourse);
        void UpdateCourse(CourseModel newCourse);
        void DeleteCourse(CourseModel newCourse);
    }
}
