using System.ComponentModel.DataAnnotations;

namespace crudInReact.Server.Models
{
    public class CourseModel
    {
        [Key]
        [Required]
        public int CourseId { get; set; }

        [Required]
        public string CourseName { get; set; }

        [Required]
        public string CourseCode { get; set; }

        [Required]
        public double CourseRating { get; set; }
    }
}
