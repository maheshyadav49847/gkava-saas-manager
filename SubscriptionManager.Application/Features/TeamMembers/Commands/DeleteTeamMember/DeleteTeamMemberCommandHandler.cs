using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.TeamMembers.Commands.DeleteTeamMember;

public class DeleteTeamMemberCommandHandler : IRequestHandler<DeleteTeamMemberCommand, bool>
{
    private readonly IAppDbContext _context;

    public DeleteTeamMemberCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteTeamMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.TeamMembers.FindAsync(new object[] { request.Id }, cancellationToken);

        if (member == null)
            return false;

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
