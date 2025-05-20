using crudInReact.Server.DTO;
using crudInReact.Server.Models;

namespace crudInReact.Server.Services
{
    public interface IUserService
    {
        Task<UserModel?> AuthenticateAsync(string username, string password);
        UserModel? GetUserById(int id);

        Task<List<NonAdminUserDto>> GetNonAdminUsersAsync();
    }
}
