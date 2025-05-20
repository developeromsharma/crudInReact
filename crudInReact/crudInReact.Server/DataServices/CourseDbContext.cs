using crudInReact.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace crudInReact.Server.DataServices
{
    public class CourseDbContext : DbContext
    {
        public CourseDbContext(DbContextOptions<CourseDbContext> opt) : base(opt)
        {
        }

        public DbSet<CourseModel> Courses { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<UserCourseModel> UserCoursesModel { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite key
            modelBuilder.Entity<UserCourseModel>()
                .HasKey(uc => new { uc.UserId, uc.CourseId });

            // Configure User -> UserCourses
            modelBuilder.Entity<UserCourseModel>()
                .HasOne(uc => uc.UserModel)
                .WithMany(u => u.UserCoursesModel)
                .HasForeignKey(uc => uc.UserId);

            // Configure Course -> UserCourses
            modelBuilder.Entity<UserCourseModel>()
                .HasOne(uc => uc.CourseModel)
                .WithMany(c => c.UserCoursesModel)
                .HasForeignKey(uc => uc.CourseId);

            // Seed data for Courses
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

            // Seed data for Users
            modelBuilder.Entity<UserModel>().HasData(
                new UserModel
                {
                    Id = 1,
                    Username = "admin",
                    Password = "admin@98",
                    IsAdmin = true
                },
                new UserModel
                {
                    Id = 2,
                    Username = "user",
                    Password = "user@98",
                    IsAdmin = false
                }
            );
        }
    }
}
