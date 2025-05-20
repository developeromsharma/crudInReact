using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NuGet.Configuration;

namespace crudInReact.Server.Helper
{
    public class Constants
    {
        public const string CourseNotFound = "Course not found.";
        public const string CourseRetrieved = "Course retrieved successfully.";
        public const string CoursesRetrieved = "Courses retrieved successfully.";
        public const string CourseAdded = "Course added successfully.";
        public const string InvalidCourseData = "Invalid course data.";
        public const string CourseDeleted = "Course deleted successfully.";
        public const string CourseUpdated = "Course updated successfully.";
        public const string CourseDataIsNull = "Course data is null.";
        public const string InvalidAssignmentData = "Invalid assignment data.";
        public const string CourseAssignedToUserSuccessfully = "Course assigned to user successfully.";
        public const string CourseUnassignedFromUserSuccessfully = "Course unassigned from user successfully.";
        public const string UserNotFound = "User not found.";
        public const string UserIdNotFound = "User ID not found in token.";
        public const string CoursesRetrievedForCurrentUser = "Courses retrieved for current user.";
        public const string UserCoursesRetrieved = "User courses retrieved successfully.";
        public const string YouAreNotAuthorizedToViewOtherUsersCourses = "You are not authorized to view other users' courses.";
    }
}
