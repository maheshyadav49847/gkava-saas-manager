using MediatR;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Applications.Commands.DeleteApplication;

public class DeleteApplicationCommandHandler : IRequestHandler<DeleteApplicationCommand, bool>
{
    private readonly IAppDbContext _context;

    public DeleteApplicationCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications.FindAsync(new object[] { request.Id }, cancellationToken);
        if (application == null)
            return false;

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
