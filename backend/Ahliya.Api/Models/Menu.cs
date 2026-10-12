namespace Ahliya.Api.Models;

public class Menu
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public Menu? Parent { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<RoleMenu> RoleMenus { get; set; } = new();
}
