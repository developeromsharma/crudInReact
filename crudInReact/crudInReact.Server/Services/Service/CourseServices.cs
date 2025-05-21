using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using crudInReact.Server.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace crudInReact.Server.Services.Service
{
    public class CourseServices : ICourseServices
    {
        private readonly CourseDbContext _courseContext;
        public CourseServices(CourseDbContext courseContext)
        {
            _courseContext = courseContext;
        }
        public bool SaveChanges()
        {
            return _courseContext.SaveChanges() >= 0;
        }

        public void AddCourse(CourseModel newCourse)
        {
            if (newCourse == null)
            {
                throw new ArgumentNullException(nameof(newCourse));
            }

            _courseContext.Courses.Add(newCourse);
        }


        public void DeleteCourse(CourseModel newCourse)
        {
            if (newCourse == null)
            {
                throw new ArgumentNullException(nameof(newCourse));
            }
            _courseContext.Courses.Remove(newCourse);
        }

        public IEnumerable<CourseModel> GetAllCourses()
        {
            return _courseContext.Courses.ToList();
        }

        public CourseModel GetCourseById(int id)
        {
            return _courseContext.Courses.FirstOrDefault(p => p.CourseId == id);
        }


        public void UpdateCourse(CourseModel updatedCourse)
        {
            if (updatedCourse == null)
            {
                throw new ArgumentNullException(nameof(updatedCourse));
            }

            var existingCourse = _courseContext.Courses.FirstOrDefault(x => x.CourseId == updatedCourse.CourseId);

            if (existingCourse == null)
            {
                throw new InvalidOperationException($"Course with ID {updatedCourse.CourseId} not found.");
            }

            existingCourse.CourseName = updatedCourse.CourseName;
            existingCourse.CourseCode = updatedCourse.CourseCode;
            existingCourse.CourseRating = updatedCourse.CourseRating;
        }
    }
}

