using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using crudInReact.Server.Services.Service;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace crudInReact.Tests
{
    public class AssignmentServiceTests
    {
        private CourseDbContext _context;
        private AssignmentService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<CourseDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new CourseDbContext(options);

            // Seed Users
            _context.Users.AddRange(
                new UserModel { Id = 1, Username = "john", Password = "pass123", IsAdmin = false },
                new UserModel { Id = 2, Username = "jane", Password = "pass456", IsAdmin = false }
            );

            // Seed Courses
            _context.Courses.AddRange(
                new CourseModel { CourseId = 1, CourseName = "Math", CourseCode = "M101", CourseRating = 4.5 },
                new CourseModel { CourseId = 2, CourseName = "Physics", CourseCode = "P102", CourseRating = 4.0 }
            );

            // Seed Assignments
            _context.UserCoursesModel.Add(
                new UserCourseModel { UserId = 1, CourseId = 1 }
            );

            _context.SaveChanges();

            _service = new AssignmentService(_context);
        }

        [Test]
        public void AssignCourseToUser_NewAssignment_AddsSuccessfully()
        {
            _service.AssignCourseToUser(1, 2);
            _context.SaveChanges();

            var assignments = _context.UserCoursesModel.Where(uc => uc.UserId == 1).ToList();
            Assert.AreEqual(2, assignments.Count);
            Assert.IsTrue(assignments.Any(a => a.CourseId == 2));
        }

        [Test]
        public void AssignCourseToUser_UserNotFound_ThrowsException()
        {
            var ex = Assert.Throws<InvalidOperationException>(() => _service.AssignCourseToUser(999, 1));
            Assert.That(ex.Message, Is.EqualTo("User or Course not found."));
        }

        [Test]
        public void AssignCourseToUser_CourseNotFound_ThrowsException()
        {
            var ex = Assert.Throws<InvalidOperationException>(() => _service.AssignCourseToUser(1, 999));
            Assert.That(ex.Message, Is.EqualTo("User or Course not found."));
        }

        [Test]
        public void AssignCourseToUser_AlreadyAssigned_ThrowsException()
        {
            var ex = Assert.Throws<InvalidOperationException>(() => _service.AssignCourseToUser(1, 1));
            Assert.That(ex.Message, Is.EqualTo("Course is already assigned to this user."));
        }

        [Test]
        public void GetCoursesForUser_ByUserId_ReturnsCourses()
        {
            var courses = _service.GetCoursesForUser(1).ToList();

            Assert.AreEqual(1, courses.Count);
            Assert.AreEqual("Math", courses[0].CourseName);
        }

        [Test]
        public void GetCoursesForUser_ByUserName_ReturnsCourses()
        {
            var courses = _service.GetCoursesForUser("john").ToList();

            Assert.AreEqual(1, courses.Count);
            Assert.AreEqual("Math", courses[0].CourseName);
        }

        [Test]
        public void GetCoursesForUser_ByUserName_NotFound_ReturnsEmptyList()
        {
            var courses = _service.GetCoursesForUser("unknown").ToList();
            Assert.IsEmpty(courses);
        }

        [Test]
        public void UnassignCourseFromUser_ExistingAssignment_RemovesAssignment()
        {
            _service.UnassignCourseFromUser(1, 1);
            _context.SaveChanges();

            var assignments = _context.UserCoursesModel.Where(uc => uc.UserId == 1 && uc.CourseId == 1).ToList();
            Assert.IsEmpty(assignments);
        }

        [Test]
        public void UnassignCourseFromUser_NonExistingAssignment_DoesNothing()
        {
            // No exception, no error
            _service.UnassignCourseFromUser(1, 999);
            _context.SaveChanges();

            var assignments = _context.UserCoursesModel.Where(uc => uc.UserId == 1).ToList();
            Assert.AreEqual(1, assignments.Count);
        }
    }
}
