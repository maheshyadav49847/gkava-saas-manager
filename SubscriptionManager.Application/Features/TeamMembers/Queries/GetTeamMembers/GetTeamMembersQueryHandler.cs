using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SubscriptionManager.Application.Features.TeamMembers.Queries.GetTeamMembers;

public class GetTeamMembersQueryHandler : IRequestHandler<GetTeamMembersQuery, List<TeamMemberDto>>
{
    private readonly IAppDbContext _context;

    public GetTeamMembersQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TeamMemberDto>> Handle(GetTeamMembersQuery request, CancellationToken cancellationToken)
    {
        var members = await _context.TeamMembers
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new TeamMemberDto
            {
                Id = m.Id,
                Name = m.Name,
                Role = m.Role,
                Bio = m.Bio,
                Initials = m.Initials,
                DisplayOrder = m.DisplayOrder
            })
            .ToListAsync(cancellationToken);

        return members;
    }
}
