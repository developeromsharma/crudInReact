using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using crudInReact.Server.Services.IService;

namespace crudInReact.Server.Services.Service
{
    public class AssignmentService : IAssignmentService
    {

        private readonly CourseDbContext _context;
        public AssignmentService(CourseDbContext context)
        {
            _context = context;
        }

        public void AssignCourseToUser(int userId, int courseId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            var course = _context.Courses.FirstOrDefault(c => c.CourseId == courseId);

            if (user == null || course == null)
                throw new InvalidOperationException("User or Course not found.");

            var alreadyAssigned = _context.UserCoursesModel
                .Any(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (alreadyAssigned)
                throw new InvalidOperationException("Course is already assigned to this user.");

            var assignment = new UserCourseModel
            {
                UserId = userId,
                CourseId = courseId
            };

            _context.UserCoursesModel.Add(assignment);
        }
        public IEnumerable<CourseModel> GetCoursesForUser(int userId)
        {
            var courseIds = _context.UserCoursesModel
                .Where(uc => uc.UserId == userId)
                .Select(uc => uc.CourseId)
            .ToList();

            return _context.Courses
                .Where(course => courseIds.Contains(course.CourseId))
                .ToList();
        }

        public IEnumerable<CourseModel> GetCoursesForUser(string userName)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == userName);
            if (user == null) return new List<CourseModel>();

            return GetCoursesForUser(user.Id);
        }


        public void UnassignCourseFromUser(int userId, int courseId)
        {
            var userCourse = _context.UserCoursesModel
                .FirstOrDefault(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (userCourse != null)
            {
                _context.UserCoursesModel.Remove(userCourse);
            }
        }
    }
}

