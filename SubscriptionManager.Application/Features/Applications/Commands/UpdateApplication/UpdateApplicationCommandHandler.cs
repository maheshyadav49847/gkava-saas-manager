using MediatR;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication;

public class UpdateApplicationCommandHandler : IRequestHandler<UpdateApplicationCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdateApplicationCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications.FindAsync(new object[] { request.Id }, cancellationToken);
        if (application == null)
            return false;

        application.Name = request.Name;
        application.WebhookUrl = request.WebhookUrl;
        application.Description = request.Description;
        application.Icon = request.Icon;
        application.ImageUrl = request.ImageUrl;
        application.Badge = request.Badge;
        application.IsReady = request.IsReady;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
