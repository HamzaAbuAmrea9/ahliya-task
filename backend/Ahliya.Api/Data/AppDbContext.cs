using Ahliya.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ahliya.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<RoleMenu> RoleMenus => Set<RoleMenu>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();
    public DbSet<PasswordChangeLog> PasswordChangeLogs => Set<PasswordChangeLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<RoleMenu>().HasKey(x => new { x.RoleId, x.MenuId });

        b.Entity<User>().HasIndex(x => x.Email).IsUnique();

        b.Entity<Role>().HasData(
            new Role { Id = 1, Name = "SuperAdmin" },
            new Role { Id = 2, Name = "Admin" },
            new Role { Id = 3, Name = "User" }
        );

        b.Entity<Menu>().HasData(
            new Menu { Id = 1, Title = "Home", Icon = "home", Route = "/home", SortOrder = 1, IsActive = true },
            new Menu { Id = 2, Title = "Scan QR", Icon = "qr-code", Route = "/qr-scanner", SortOrder = 2, IsActive = true },
            new Menu { Id = 3, Title = "Dashboard", Icon = "grid", Route = "/dashboard", SortOrder = 3, IsActive = true },
            new Menu { Id = 4, Title = "Users", Icon = "people", Route = "/users", SortOrder = 4, IsActive = true },
            new Menu { Id = 5, Title = "Reports", Icon = "document-text", Route = "/reports", SortOrder = 5, IsActive = true },
            new Menu { Id = 6, Title = "Change Password", Icon = "lock-closed", Route = "/change-password", SortOrder = 6, IsActive = true },
            new Menu { Id = 7, Title = "Settings", Icon = "settings", Route = "/settings", SortOrder = 7, IsActive = true }
        );

        b.Entity<RoleMenu>().HasData(
            new RoleMenu { RoleId = 1, MenuId = 1 },
            new RoleMenu { RoleId = 1, MenuId = 2 },
            new RoleMenu { RoleId = 1, MenuId = 3 },
            new RoleMenu { RoleId = 1, MenuId = 4 },
            new RoleMenu { RoleId = 1, MenuId = 5 },
            new RoleMenu { RoleId = 1, MenuId = 6 },
            new RoleMenu { RoleId = 1, MenuId = 7 },
            new RoleMenu { RoleId = 2, MenuId = 1 },
            new RoleMenu { RoleId = 2, MenuId = 2 },
            new RoleMenu { RoleId = 2, MenuId = 3 },
            new RoleMenu { RoleId = 2, MenuId = 4 },
            new RoleMenu { RoleId = 2, MenuId = 6 },
            new RoleMenu { RoleId = 2, MenuId = 7 },
            new RoleMenu { RoleId = 3, MenuId = 1 },
            new RoleMenu { RoleId = 3, MenuId = 2 },
            new RoleMenu { RoleId = 3, MenuId = 6 },
            new RoleMenu { RoleId = 3, MenuId = 7 }
        );
    }
}
