using AutoMapper;
using crudInReact.Server.DTO;
using crudInReact.Server.Helper;
using crudInReact.Server.Models;
using crudInReact.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace crudInReact.Server.Controllers
{
    [Route("api/assignment")]
    [Authorize]
    public class AssignmentController : BaseController
    {
        private readonly ICourseServices _courseService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public AssignmentController(ICourseServices courseService, IMapper mapper, IUserService userService)
        {
            _courseService = courseService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost("assign")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> AssignCourseToUser([FromBody] AssignCourseDto dto)
        {
            if (dto == null || dto.UserId <= 0 || dto.CourseId <= 0)
                return ErrorMessage(Constants.InvalidAssignmentData);

            try
            {
                _courseService.AssignCourseToUser(dto.UserId, dto.CourseId);
                _courseService.SaveChanges();
                return SuccessMessage(Constants.CourseAssignedToUserSuccessfully);
            }
            catch (InvalidOperationException ex)
            {
                return ErrorMessage(ex.Message);
            }
        }
       
        [HttpDelete("unassign")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> UnassignCourseFromUser([FromQuery] int userId, [FromQuery] int courseId)
        {
            var user = _userService.GetUserById(userId);
            var course = _courseService.GetCourseById(courseId);

            if (user == null || course == null)
                return NotFoundResponse(Constants.UserNotFound);

            _courseService.UnassignCourseFromUser(userId, courseId);
            _courseService.SaveChanges();

            return SuccessMessage(Constants.CourseUnassignedFromUserSuccessfully);
        }


        [HttpGet("my-courses")]
        public ActionResult<ApiResponse<IEnumerable<CourseModel>>> GetCoursesForUser(
    [FromQuery] int? userId = null,
    [FromQuery] string userName = null)
        {
            // Get the current user's ID and IsAdmin flag from JWT claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin");

            if (userIdClaim == null || isAdminClaim == null)
                return Unauthorized("Invalid user claims.");

            var currentUserId = int.Parse(userIdClaim.Value);
            var isAdmin = bool.Parse(isAdminClaim.Value);

            // If the user is not an admin but trying to fetch someone else's courses
            if (!isAdmin && (userId != null || !string.IsNullOrEmpty(userName)))
            {
                return Unauthorized(Constants.YouAreNotAuthorizedToViewOtherUsersCourses);
            }

            // Admin user can query by userId or userName
            if (userId != null)
            {
                var courses = _courseService.GetCoursesForUser(userId.Value);
                return SuccessResponse(courses, Constants.CoursesRetrievedForCurrentUser);
            }

            if (!string.IsNullOrEmpty(userName))
            {
                var coursesByName = _courseService.GetCoursesForUser(userName);
                return SuccessResponse(coursesByName, Constants.CoursesRetrievedForCurrentUser);
            }

            // Non-admin or fallback to current user's courses
            var userCourses = _courseService.GetCoursesForUser(currentUserId);
            return SuccessResponse(userCourses, Constants.CoursesRetrievedForCurrentUser);
        }


    }
}
