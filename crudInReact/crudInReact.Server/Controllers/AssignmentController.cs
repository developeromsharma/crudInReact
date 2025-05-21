using AutoMapper;
using crudInReact.Server.DTO;
using crudInReact.Server.Helper;
using crudInReact.Server.Models;
using crudInReact.Server.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace crudInReact.Server.Controllers
{
    [Route("api/assignment")]
    [Authorize]
    public class AssignmentController : BaseController
    {
        private readonly IAssignmentService _assignmentService;
        private readonly ICourseServices _courseServices;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public AssignmentController(IAssignmentService assignmentService,ICourseServices courseServices, IMapper mapper, IUserService userService)
        {
            _assignmentService = assignmentService;
            _courseServices = courseServices;
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
                _assignmentService.AssignCourseToUser(dto.UserId, dto.CourseId);
                _courseServices.SaveChanges();
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
            var course = _courseServices.GetCourseById(courseId);

            if (user == null || course == null)
                return NotFoundResponse(Constants.UserNotFound);

            _assignmentService.UnassignCourseFromUser(userId, courseId);
            _courseServices.SaveChanges();

            return SuccessMessage(Constants.CourseUnassignedFromUserSuccessfully);
        }

        [HttpGet("my-courses")]
        public ActionResult<ApiResponse<IEnumerable<CourseModel>>> GetCoursesForUser(
            [FromQuery] int? userId = null,
            [FromQuery] string userName = null)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(isAdminClaim))
                return Unauthorized("Invalid user claims.");

            var currentUserId = int.Parse(userIdClaim);
            var isAdmin = bool.Parse(isAdminClaim);

            if (!isAdmin && (userId.HasValue || !string.IsNullOrWhiteSpace(userName)))
                return Unauthorized(Constants.YouAreNotAuthorizedToViewOtherUsersCourses);

            if (userId.HasValue)
                return SuccessResponse(_assignmentService.GetCoursesForUser(userId.Value), Constants.CoursesRetrievedForCurrentUser);

            if (!string.IsNullOrWhiteSpace(userName))
                return SuccessResponse(_assignmentService.GetCoursesForUser(userName), Constants.CoursesRetrievedForCurrentUser);

            return SuccessResponse(_assignmentService.GetCoursesForUser(currentUserId), Constants.CoursesRetrievedForCurrentUser);
        }
    }
}
