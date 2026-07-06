using MediatR;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;

public class CreateApplicationCommandHandler : IRequestHandler<CreateApplicationCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateApplicationCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateApplicationCommand request, CancellationToken cancellationToken)
    {
        var entity = new SubscriptionManager.Domain.Entities.Application
        {
            Name = request.Name,
            WebhookUrl = request.WebhookUrl,
            AppKey = Guid.NewGuid().ToString("N"),
        };

        _context.Applications.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
