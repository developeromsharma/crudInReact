using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace crudInReact.Server.Services
{
    public class UserService : IUserService
    {
        private readonly CourseDbContext _context;

        public UserService(CourseDbContext context)
        {
            _context = context;
        }

        public async Task<UserModel?> AuthenticateAsync(string username, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == username && u.Password == password); // Ideally, hash the password
        }

        public UserModel? GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }
    }
}
