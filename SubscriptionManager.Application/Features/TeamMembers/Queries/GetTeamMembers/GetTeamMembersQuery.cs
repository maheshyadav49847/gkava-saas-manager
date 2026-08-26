using MediatR;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.TeamMembers.Queries.GetTeamMembers;

public class GetTeamMembersQuery : IRequest<List<TeamMemberDto>>
{
}
