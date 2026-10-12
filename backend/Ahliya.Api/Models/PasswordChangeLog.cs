namespace Ahliya.Api.Models;

public class PasswordChangeLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? Ip { get; set; }
}
