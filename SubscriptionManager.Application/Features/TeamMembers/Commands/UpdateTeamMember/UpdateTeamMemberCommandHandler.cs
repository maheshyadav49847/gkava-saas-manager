using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.TeamMembers.Commands.UpdateTeamMember;

public class UpdateTeamMemberCommandHandler : IRequestHandler<UpdateTeamMemberCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdateTeamMemberCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTeamMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.TeamMembers.FindAsync(new object[] { request.Id }, cancellationToken);

        if (member == null)
            return false;

        member.Name = request.Name;
        member.Role = request.Role;
        member.Bio = request.Bio;
        member.Initials = request.Initials;
        member.DisplayOrder = request.DisplayOrder;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
