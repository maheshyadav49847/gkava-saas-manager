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
            Subtitle = request.Subtitle,
            WebhookUrl = request.WebhookUrl,
            AppKey = Guid.NewGuid().ToString("N"),
            Description = request.Description,
            ImageBase64 = request.ImageBase64,
            DisplayOrder = request.DisplayOrder,
            Modules = request.Modules?.Select(m => new ApplicationModule
            {
                Name = m.Name,
                Description = m.Description,
                Icon = m.Icon,
                DisplayOrder = m.DisplayOrder
            }).ToList() ?? new List<ApplicationModule>()
        };

        _context.Applications.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
