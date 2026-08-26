using System;

namespace SubscriptionManager.Application.Features.TeamMembers.Queries.GetTeamMembers;

public class TeamMemberDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
