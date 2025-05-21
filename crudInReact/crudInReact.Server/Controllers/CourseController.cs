using AutoMapper;
using crudInReact.Server.DTO;
using crudInReact.Server.Helper;
using crudInReact.Server.Models;
using crudInReact.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace crudInReact.Server.Controllers
{
    [Route("api/courses")]
    [Authorize]
    public class CourseController : BaseController
    {
        private readonly ICourseServices _courseService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public CourseController(ICourseServices courseService, IMapper mapper, IUserService userService)
        {
            _courseService = courseService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpGet("GetAll")]
        public ActionResult<ApiResponse<IEnumerable<CourseModel>>> GetAllCourse()
        {
            var courses = _courseService.GetAllCourses();
            return SuccessResponse(courses, Constants.CoursesRetrieved);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<CourseModel>> GetSingleCourse(int id)
        {
            var course = _courseService.GetCourseById(id);
            return course == null
                ? NotFoundResponse<CourseModel>(Constants.CourseNotFound)
                : SuccessResponse(course, Constants.CourseRetrieved);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<CourseModel>> AddCourse(AddCourseDTO addCourseDTO)
        {
            if (addCourseDTO == null)
                return ErrorResponse<CourseModel>(Constants.CourseDataIsNull);

            var course = _mapper.Map<CourseModel>(addCourseDTO);
            _courseService.AddCourse(course);
            _courseService.SaveChanges();

            return SuccessResponse(course, Constants.CourseAdded);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> PatchCourse(int id, [FromBody] UpdateCourseDto updateDto)
        {
            if (updateDto == null)
                return ErrorMessage(Constants.InvalidCourseData);

            var course = _courseService.GetCourseById(id);
            if (course == null)
                return NotFoundResponse(Constants.CourseNotFound);

            course.CourseName = updateDto.CourseName ?? course.CourseName;
            course.CourseCode = updateDto.CourseCode ?? course.CourseCode;
            course.CourseRating = updateDto.CourseRating ?? course.CourseRating;

            _courseService.UpdateCourse(course);
            _courseService.SaveChanges();

            return SuccessMessage(Constants.CourseUpdated);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> DeleteCourses(int id)
        {
            var course = _courseService.GetCourseById(id);
            if (course == null)
                return NotFoundResponse(Constants.CourseNotFound);

            _courseService.DeleteCourse(course);
            _courseService.SaveChanges();

            return SuccessMessage(Constants.CourseDeleted);
        }
    }
}
