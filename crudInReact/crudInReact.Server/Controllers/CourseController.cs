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

        public CourseController(ICourseServices courseService, IMapper mapper)
        {
            _courseService = courseService;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public ActionResult<ApiResponse<IEnumerable<CourseModel>>> GetAllCourse()
        {
            var coursesList = _courseService.GetAllCourses();
            return SuccessResponse(coursesList, Constants.CoursesRetrieved);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<CourseModel>> GetSingleCourse(int id)
        {
            var courseItem = _courseService.GetCourseById(id);
            if (courseItem == null)
                return NotFoundResponse<CourseModel>(Constants.CourseNotFound);

            return SuccessResponse(courseItem, Constants.CourseRetrieved);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<CourseModel>> AddCourse(AddCourseDTO addCourseDTO)
        {
            if (addCourseDTO == null)
                return ErrorResponse<CourseModel>(Constants.CourseDataIsNull);

            var newCourse = _mapper.Map<CourseModel>(addCourseDTO);
            _courseService.AddCourse(newCourse);
            _courseService.SaveChanges();

            return SuccessResponse(newCourse, Constants.CourseAdded);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> PatchCourse(int id, [FromBody] UpdateCourseDto updateDto)
        {
            if (updateDto == null)
                return ErrorMessage(Constants.InvalidCourseData);

            var existingCourse = _courseService.GetCourseById(id);
            if (existingCourse == null)
                return NotFoundResponse(Constants.CourseNotFound);

            // Only update fields that are provided
            if (updateDto.CourseName != null)
                existingCourse.CourseName = updateDto.CourseName;

            if (updateDto.CourseCode != null)
                existingCourse.CourseCode = updateDto.CourseCode;

            if (updateDto.CourseRating.HasValue)
                existingCourse.CourseRating = updateDto.CourseRating.Value;

            _courseService.UpdateCourse(existingCourse);
            _courseService.SaveChanges();

            return SuccessMessage(Constants.CourseUpdated);
        }


        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<ApiResponse<object>> DeleteCourses(int id)
        {
            var courseDetails = _courseService.GetCourseById(id);
            if (courseDetails == null)
                return NotFoundResponse(Constants.CourseNotFound);

            _courseService.DeleteCourse(courseDetails);
            _courseService.SaveChanges();

            return SuccessMessage(Constants.CourseDeleted);
        }
    }
}
