using MediatR;
using System;

namespace SubscriptionManager.Application.Features.TeamMembers.Commands.UpdateTeamMember;

public class UpdateTeamMemberCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
