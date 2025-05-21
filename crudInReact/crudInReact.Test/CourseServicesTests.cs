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
    public class CourseServicesTests
    {
        private CourseDbContext _context;
        private CourseServices _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<CourseDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new CourseDbContext(options);

            _context.Courses.AddRange(
                new CourseModel { CourseId = 1, CourseName = "Math", CourseCode = "M101", CourseRating = 4.5 },
                new CourseModel { CourseId = 2, CourseName = "Physics", CourseCode = "P102", CourseRating = 4.0 }
            );
            _context.SaveChanges();

            _service = new CourseServices(_context);
        }

        [Test]
        public void GetAllCourses_ReturnsAllCourses()
        {
            var result = _service.GetAllCourses().ToList();
            Assert.AreEqual(2, result.Count);
        }

        [Test]
        public void GetCourseById_ValidId_ReturnsCourse()
        {
            var result = _service.GetCourseById(1);
            Assert.NotNull(result);
            Assert.AreEqual("Math", result.CourseName);
        }

        [Test]
        public void GetCourseById_InvalidId_ReturnsNull()
        {
            var result = _service.GetCourseById(999);
            Assert.IsNull(result);
        }

        [Test]
        public void AddCourse_ValidCourse_AddsSuccessfully()
        {
            var newCourse = new CourseModel { CourseId = 3, CourseName = "Chemistry", CourseCode = "C103", CourseRating = 4.2 };
            _service.AddCourse(newCourse);
            _service.SaveChanges();

            var allCourses = _service.GetAllCourses().ToList();
            Assert.AreEqual(3, allCourses.Count);
            Assert.IsTrue(allCourses.Any(c => c.CourseName == "Chemistry"));
        }

        [Test]
        public void DeleteCourse_ValidCourse_DeletesSuccessfully()
        {
            var courseToDelete = _service.GetCourseById(1);
            _service.DeleteCourse(courseToDelete);
            _service.SaveChanges();

            var result = _service.GetCourseById(1);
            Assert.IsNull(result);
        }

        [Test]
        public void UpdateCourse_ValidCourse_UpdatesSuccessfully()
        {
            var updated = new CourseModel { CourseId = 1, CourseName = "Advanced Math", CourseCode = "M101", CourseRating = 4.8 };
            _service.UpdateCourse(updated);
            _service.SaveChanges();

            var result = _service.GetCourseById(1);
            Assert.AreEqual("Advanced Math", result.CourseName);
            Assert.AreEqual(4.8, result.CourseRating);
        }

        [Test]
        public void UpdateCourse_InvalidId_ThrowsException()
        {
            var invalidCourse = new CourseModel { CourseId = 999, CourseName = "Unknown", CourseCode = "X000", CourseRating = 0 };

            Assert.Throws<InvalidOperationException>(() => _service.UpdateCourse(invalidCourse));
        }

        [Test]
        public void AddCourse_NullCourse_ThrowsException()
        {
            Assert.Throws<ArgumentNullException>(() => _service.AddCourse(null));
        }

        [Test]
        public void DeleteCourse_NullCourse_ThrowsException()
        {
            Assert.Throws<ArgumentNullException>(() => _service.DeleteCourse(null));
        }

        [Test]
        public void UpdateCourse_NullCourse_ThrowsException()
        {
            Assert.Throws<ArgumentNullException>(() => _service.UpdateCourse(null));
        }
    }
}
