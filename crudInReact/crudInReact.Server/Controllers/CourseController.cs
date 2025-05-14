using AutoMapper;
using crudInReact.Server.DTO;
using crudInReact.Server.Models;
using crudInReact.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace crudInReact.Server.Controllers
{
    [ApiController]
    [Route("api/courses")]
    [Authorize]  // This ensures that only authenticated users can access this controller
    public class CourseController : ControllerBase
    {
        private readonly ICourseServices _courseService;
        private readonly IMapper _mapper;

        public CourseController(ICourseServices courseService, IMapper mapper)
        {
            _courseService = courseService;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<CourseModel>> GetAllCourse()
        {
            // Non-admins can access this route
            var coursesList = _courseService.GetAllCourses();
            return Ok(coursesList);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOnly")]  // Only admins can access this
        public ActionResult GetSingleCourse(int id)
        {
            var courseItem = _courseService.GetCourseById(id);
            if (courseItem != null)
            {
                return Ok(courseItem);
            }
            return NotFound();
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]  // Only admins can add courses
        public ActionResult<AddCourseDTO> AddCourse(AddCourseDTO addCourseDTO)
        {
            if (addCourseDTO == null)
            {
                return BadRequest("Course data is null.");
            }

            var newCourse = _mapper.Map<CourseModel>(addCourseDTO);
            _courseService.AddCourse(newCourse);
            _courseService.SaveChanges();
            return Ok(newCourse);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]  // Only admins can update courses
        public ActionResult UpdateCourse(int id, CourseModel updatedCourse)
        {
            if (updatedCourse == null || id != updatedCourse.CourseId)
            {
                return BadRequest("Invalid course data.");
            }

            var existingCourse = _courseService.GetCourseById(id);
            if (existingCourse == null)
            {
                return NotFound();
            }

            // Manually update fields
            existingCourse.CourseName = updatedCourse.CourseName;
            existingCourse.CourseCode = updatedCourse.CourseCode;
            existingCourse.CourseRating = updatedCourse.CourseRating;

            _courseService.UpdateCourse(existingCourse);
            _courseService.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]  // Only admins can delete courses
        public IActionResult DeleteCourses(int id)
        {
            var courseDetails = _courseService.GetCourseById(id);
            if (courseDetails == null)
            {
                return NotFound();
            }
            _courseService.DeleteCourse(courseDetails);
            _courseService.SaveChanges();
            return NoContent();
        }
    }
}
