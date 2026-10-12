using Ahliya.Api.Data;
using Ahliya.Api.Dtos;
using Ahliya.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ahliya.Api.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthService(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<LoginResponse?> Login(LoginRequest req)
    {
        var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !user.IsActive) return null;
        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash)) return null;

        var roleName = user.Role!.Name;
        var access = _jwt.CreateAccessToken(user, roleName);
        var refresh = _jwt.CreateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refresh,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            DeviceInfo = req.DeviceInfo
        });
        await _db.SaveChangesAsync();

        var menus = await GetMenusForRole(user.RoleId);

        return new LoginResponse
        {
            AccessToken = access,
            RefreshToken = refresh,
            FullName = user.FullName,
            Email = user.Email,
            Role = roleName,
            Menus = menus
        };
    }

    public async Task<List<MenuDto>> GetMenusForRole(int roleId)
    {
        return await _db.RoleMenus
            .Where(x => x.RoleId == roleId && x.Menu!.IsActive)
            .OrderBy(x => x.Menu!.SortOrder)
            .Select(x => new MenuDto
            {
                Id = x.Menu!.Id,
                Title = x.Menu.Title,
                Icon = x.Menu.Icon,
                Route = x.Menu.Route
            }).ToListAsync();
    }

    public async Task<(string access, string refresh)?> Refresh(string refreshToken)
    {
        var old = await _db.RefreshTokens.Include(x => x.User).ThenInclude(u => u!.Role)
            .FirstOrDefaultAsync(x => x.Token == refreshToken && !x.IsRevoked);

        if (old == null || old.ExpiresAt < DateTime.UtcNow) return null;

        old.IsRevoked = true;

        var access = _jwt.CreateAccessToken(old.User!, old.User!.Role!.Name);
        var refresh = _jwt.CreateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = old.UserId,
            Token = refresh,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            DeviceInfo = old.DeviceInfo
        });
        await _db.SaveChangesAsync();

        return (access, refresh);
    }

    public async Task<bool> Logout(string refreshToken, int userId)
    {
        var tokens = await _db.RefreshTokens
            .Where(x => x.UserId == userId && !x.IsRevoked)
            .ToListAsync();

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var one = tokens.FirstOrDefault(x => x.Token == refreshToken);
            if (one != null) one.IsRevoked = true;
            else tokens.ForEach(t => t.IsRevoked = true);
        }
        else
        {
            tokens.ForEach(t => t.IsRevoked = true);
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string?> ChangePassword(int userId, ChangePasswordRequest req, string? ip)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return "User not found";
        if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, user.PasswordHash)) return "Old password is wrong";
        if (req.NewPassword.Length < 6) return "New password must be at least 6 characters";

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        _db.PasswordChangeLogs.Add(new PasswordChangeLog { UserId = userId, Ip = ip });
        await _db.SaveChangesAsync();
        return null;
    }
}
