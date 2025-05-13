using AutoMapper;
using crudInReact.Server.DTO;
using crudInReact.Server.Models;
using crudInReact.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace crudInReact.Server.Controllers
{
    [ApiController]
    [Route("api/courses")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseServices _courseService;
        private readonly IMapper _mapper;
        public CourseController(ICourseServices courseservice, IMapper mapper)
        {
            _courseService = courseservice;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<CourseModel>> GetAllCourse()
        {
            //return Ok(_courseService.GetAllCourses());
            var CoursesList = _courseService.GetAllCourses();
            return Ok(CoursesList);
        }

        [HttpGet("{id}")]
        public ActionResult GetSingleCourse(int id)
        {
            //return Ok(_courseService.GetCourseById(id));
            var courseItem = _courseService.GetCourseById(id);
            if (courseItem != null)
            {
                return Ok(courseItem);
            }
            return NotFound();
        }

        //KEPT THIS POST METHOD AS IT IS WORKING CODE
        //COMMENTED THIS TO DEMONSTATE DTO

        //[HttpPost]
        //public ActionResult<CourseModel> AddCourse(CourseModel newCourse)
        //{
        //    if (newCourse == null)
        //    {
        //        return BadRequest("Course data is null.");
        //    }

        //    _courseService.AddCourse(newCourse);
        //    _courseService.SaveChanges();

        //    return CreatedAtAction(nameof(GetSingleCourse), new { id = newCourse.CourseId }, newCourse);
        //}

        [HttpPost]
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
        public IActionResult DeleteCourses(int id)
        {
            //return Ok(_courseService.DeleteCourse(id));
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
