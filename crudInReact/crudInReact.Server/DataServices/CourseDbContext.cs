using crudInReact.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace crudInReact.Server.DataServices
{
    public class CourseDbContext : DbContext
    {
        public CourseDbContext(DbContextOptions<CourseDbContext> opt) : base(opt)
        {

        }
        public DbSet<CourseModel> Courses { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CourseModel>().HasData(
                new CourseModel
                {
                    CourseId = 1,
                    CourseName = "ASP.NET Core Web API",
                    CourseCode = "NET101",
                    CourseRating = 4.5
                },
                new CourseModel
                {
                    CourseId = 2,
                    CourseName = "React with TypeScript",
                    CourseCode = "REACT201",
                    CourseRating = 4.8
                },
                new CourseModel
                {
                    CourseId = 3,
                    CourseName = "SQL Server Basics",
                    CourseCode = "SQL301",
                    CourseRating = 4.2
                }
            );
        }
    }
}
