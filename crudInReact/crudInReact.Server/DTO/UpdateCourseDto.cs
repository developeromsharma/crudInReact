using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class UpdateCourseDto
    {
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Course name must be between 2 and 100 characters.")]
        public string? CourseName { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Course code must be between 2 and 50 characters.")]
        public string? CourseCode { get; set; }

        [Range(0, 5, ErrorMessage = "Course rating must be between 0 and 5.")]
        public double? CourseRating { get; set; }
    }
}
