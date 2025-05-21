using NUnit.Framework;
using crudInReact.Server.Services.Service;
using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace crudInReact.Tests
{
    [TestFixture]
    public class UserServiceTests
    {
        private CourseDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<CourseDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            var context = new CourseDbContext(options);

            context.Users.AddRange(
                new UserModel { Id = 1, Username = "admin", Password = "admin123", IsAdmin = true },
                new UserModel { Id = 2, Username = "john", Password = "pass123", IsAdmin = false },
                new UserModel { Id = 3, Username = "jane", Password = "pass456", IsAdmin = false }
            );

            context.SaveChanges();
            return context;
        }

        [Test]
        public async Task AuthenticateAsync_WithValidCredentials_ReturnsUser()
        {
            var context = GetInMemoryDbContext();
            var service = new UserService(context);

            var result = await service.AuthenticateAsync("john", "pass123");

            Assert.IsNotNull(result);
            Assert.AreEqual("john", result.Username);
        }

        [Test]
        public async Task AuthenticateAsync_WithInvalidCredentials_ReturnsNull()
        {
            var context = GetInMemoryDbContext();
            var service = new UserService(context);

            var result = await service.AuthenticateAsync("john", "wrongpass");

            Assert.IsNull(result);
        }

        [Test]
        public void GetUserById_WithExistingId_ReturnsUser()
        {
            var context = GetInMemoryDbContext();
            var service = new UserService(context);

            var result = service.GetUserById(2);

            Assert.IsNotNull(result);
            Assert.AreEqual("john", result.Username);
        }

        [Test]
        public void GetUserById_WithNonExistingId_ReturnsNull()
        {
            var context = GetInMemoryDbContext();
            var service = new UserService(context);

            var result = service.GetUserById(999);

            Assert.IsNull(result);
        }

        [Test]
        public async Task GetNonAdminUsersAsync_ReturnsOnlyNonAdmins()
        {
            var context = GetInMemoryDbContext();
            var service = new UserService(context);

            var result = await service.GetNonAdminUsersAsync();

            Assert.AreEqual(2, result.Count);
            Assert.IsFalse(result.Any(u => u.Username == "admin"));
        }
    }
}
