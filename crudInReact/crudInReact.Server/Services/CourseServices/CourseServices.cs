using crudInReact.Server.DataServices;
using crudInReact.Server.Models;

namespace crudInReact.Server.Services
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
            return (_courseContext.SaveChanges() >= 0);
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

        public void AssignCourseToUser(int userId, int courseId)
        {
            var user = _courseContext.Users.FirstOrDefault(u => u.Id == userId);
            var course = _courseContext.Courses.FirstOrDefault(c => c.CourseId == courseId);

            if (user == null || course == null)
                throw new InvalidOperationException("User or Course not found.");

            var alreadyAssigned = _courseContext.UserCoursesModel
                .Any(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (alreadyAssigned)
                throw new InvalidOperationException("Course is already assigned to this user.");

            var assignment = new UserCourseModel
            {
                UserId = userId,
                CourseId = courseId
            };

            _courseContext.UserCoursesModel.Add(assignment);
        }
        public IEnumerable<CourseModel> GetCoursesForUser(int userId)
        {
            var courseIds = _courseContext.UserCoursesModel
                .Where(uc => uc.UserId == userId)
                .Select(uc => uc.CourseId)
                .ToList();

            return _courseContext.Courses
                .Where(course => courseIds.Contains(course.CourseId))
                .ToList();
        }

        public void UnassignCourseFromUser(int userId, int courseId)
        {
            var userCourse = _courseContext.UserCoursesModel
                .FirstOrDefault(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (userCourse != null)
            {
                _courseContext.UserCoursesModel.Remove(userCourse);
            }
        }
    }
}

