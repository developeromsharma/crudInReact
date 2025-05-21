using crudInReact.Server.DataServices;
using crudInReact.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using crudInReact.Server.DTO;
using crudInReact.Server.Services.IService;

namespace crudInReact.Server.Services.Service
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

        // New method to get all non-admin users
        public async Task<List<NonAdminUserDto>> GetNonAdminUsersAsync()
        {
            return await _context.Users
                .Where(u => !u.IsAdmin)
                .Select(u => new NonAdminUserDto
                {
                    Id = u.Id,
                    Username = u.Username
                })
                .ToListAsync();
        }
    }
}
