using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Features.WebsiteConfig.Commands;

public record UpdateWebsiteConfigCommand(string JsonData) : IRequest<string>;

public class UpdateWebsiteConfigCommandHandler : IRequestHandler<UpdateWebsiteConfigCommand, string>
{
    private readonly IAppDbContext _context;

    public UpdateWebsiteConfigCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(UpdateWebsiteConfigCommand request, CancellationToken cancellationToken)
    {
        var existingConfig = await _context.WebsiteConfigs
            .OrderByDescending(c => c.LastUpdated)
            .FirstOrDefaultAsync(cancellationToken);

        if (existingConfig == null)
        {
            var newConfig = new Domain.Entities.WebsiteConfig
            {
                Id = Guid.NewGuid(),
                JsonData = request.JsonData,
                LastUpdated = DateTime.UtcNow
            };
            _context.WebsiteConfigs.Add(newConfig);
        }
        else
        {
            existingConfig.JsonData = request.JsonData;
            existingConfig.LastUpdated = DateTime.UtcNow;
            _context.WebsiteConfigs.Update(existingConfig);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return "Configuration updated successfully";
    }
}
