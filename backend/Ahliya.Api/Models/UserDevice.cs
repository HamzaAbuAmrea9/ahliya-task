namespace Ahliya.Api.Models;

public class UserDevice
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string DeviceId { get; set; } = string.Empty;
    public bool BiometricEnabled { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
