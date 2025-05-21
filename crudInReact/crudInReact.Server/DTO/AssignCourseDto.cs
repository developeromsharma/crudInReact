using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class AssignCourseDto
    {
        [Required(ErrorMessage = "UserId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive integer.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "CourseId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "CourseId must be a positive integer.")]
        public int CourseId { get; set; }
    }
}
