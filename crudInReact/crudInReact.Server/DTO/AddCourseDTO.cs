using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.DTO
{
    public class AddCourseDTO
    {
        [Required]
        public string CourseName { get; set; }

        [Required]
        public string CourseCode { get; set; }

        [Required]
        public double CourseRating { get; set; }
    }
}
