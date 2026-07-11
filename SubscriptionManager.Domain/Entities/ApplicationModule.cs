namespace SubscriptionManager.Domain.Entities;

public class ApplicationModule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "Layers"; // default icon from lucide-react
    public int DisplayOrder { get; set; }

    public Application Application { get; set; } = null!;
}
