using Ahliya.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ahliya.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "SuperAdmin,Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users.Include(u => u.Role)
            .Select(u => new { u.Id, u.FullName, u.Email, role = u.Role!.Name, u.IsActive, u.CreatedAt })
            .ToListAsync();
        return Ok(users);
    }
}
