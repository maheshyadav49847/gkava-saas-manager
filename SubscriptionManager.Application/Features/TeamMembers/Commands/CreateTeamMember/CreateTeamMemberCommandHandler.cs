using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.TeamMembers.Commands.CreateTeamMember;

public class CreateTeamMemberCommandHandler : IRequestHandler<CreateTeamMemberCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateTeamMemberCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTeamMemberCommand request, CancellationToken cancellationToken)
    {
        var member = new TeamMember
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Role = request.Role,
            Bio = request.Bio,
            Initials = request.Initials,
            DisplayOrder = request.DisplayOrder
        };

        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync(cancellationToken);

        return member.Id;
    }
}
