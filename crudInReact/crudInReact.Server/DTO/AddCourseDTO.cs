using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class AddCourseDTO
    {
        [Required(ErrorMessage = "Course name is required.")]
        public string CourseName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Course code is required.")]
        public string CourseCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Course rating is required.")]
        [Range(0, 5, ErrorMessage = "Course rating must be between 0 and 5.")]
        public double CourseRating { get; set; }
    }
}
