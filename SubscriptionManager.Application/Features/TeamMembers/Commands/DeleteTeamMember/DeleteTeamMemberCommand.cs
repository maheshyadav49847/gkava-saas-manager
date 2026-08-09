using MediatR;
using System;

namespace SubscriptionManager.Application.Features.TeamMembers.Commands.DeleteTeamMember;

public class DeleteTeamMemberCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
