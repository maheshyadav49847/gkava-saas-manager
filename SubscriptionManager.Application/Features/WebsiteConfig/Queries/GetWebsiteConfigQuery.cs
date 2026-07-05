using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.WebsiteConfig.Queries;

public record GetWebsiteConfigQuery : IRequest<string?>;

public class GetWebsiteConfigQueryHandler : IRequestHandler<GetWebsiteConfigQuery, string?>
{
    private readonly IAppDbContext _context;

    public GetWebsiteConfigQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<string?> Handle(GetWebsiteConfigQuery request, CancellationToken cancellationToken)
    {
        var config = await _context.WebsiteConfigs
            .OrderByDescending(c => c.LastUpdated)
            .FirstOrDefaultAsync(cancellationToken);

        return config?.JsonData;
    }
}
