using System.Security.Claims;
using Ahliya.Api.Data;
using Ahliya.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ahliya.Api.Controllers;

[ApiController]
[Route("api/menu")]
[Authorize]
public class MenuController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly AppDbContext _db;

    public MenuController(AuthService auth, AppDbContext db)
    {
        _auth = auth;
        _db = db;
    }

    [HttpGet("my-menu")]
    public async Task<IActionResult> MyMenu()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return Unauthorized();
        var menus = await _auth.GetMenusForRole(user.RoleId);
        return Ok(menus);
    }
}
