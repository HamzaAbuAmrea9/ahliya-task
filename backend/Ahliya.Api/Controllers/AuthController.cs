using System.Security.Claims;
using Ahliya.Api.Data;
using Ahliya.Api.Dtos;
using Ahliya.Api.Models;
using Ahliya.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ahliya.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly AppDbContext _db;

    public AuthController(AuthService auth, AppDbContext db)
    {
        _auth = auth;
        _db = db;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var res = await _auth.Login(req);
        if (res == null) return Unauthorized(new { message = "Email or password is wrong" });
        return Ok(res);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
    {
        var res = await _auth.Refresh(req.RefreshToken);
        if (res == null) return Unauthorized(new { message = "Invalid refresh token" });
        return Ok(new { accessToken = res.Value.access, refreshToken = res.Value.refresh });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest? req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _auth.Logout(req?.RefreshToken ?? "", userId);
        return Ok(new { message = "Logged out" });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var err = await _auth.ChangePassword(userId, req, ip);
        if (err != null) return BadRequest(new { message = err });
        return Ok(new { message = "Password changed" });
    }

    [Authorize]
    [HttpPost("enable-biometric")]
    public async Task<IActionResult> EnableBiometric(EnableBiometricRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var existing = await _db.UserDevices.FirstOrDefaultAsync(x => x.UserId == userId && x.DeviceId == req.DeviceId);
        if (existing == null)
        {
            _db.UserDevices.Add(new UserDevice { UserId = userId, DeviceId = req.DeviceId, BiometricEnabled = true });
        }
        else
        {
            existing.BiometricEnabled = true;
        }
        await _db.SaveChangesAsync();
        return Ok(new { message = "Biometric enabled" });
    }
}
