using System;

namespace SubscriptionManager.Domain.Entities;

public class TeamMember : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "Viewer";
    public string Bio { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
