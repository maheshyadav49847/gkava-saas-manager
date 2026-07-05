using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

public class GetApplicationsQueryHandler : IRequestHandler<GetApplicationsQuery, List<ApplicationDto>>
{
    private readonly IAppDbContext _context;

    public GetApplicationsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationDto>> Handle(GetApplicationsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Applications
            .AsNoTracking()
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                Name = a.Name,
                AppKey = a.AppKey,
                WebhookUrl = a.WebhookUrl,
                Description = a.Description,
                Icon = a.Icon,
                ImageUrl = a.ImageUrl,
                Badge = a.Badge,
                IsReady = a.IsReady
            })
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }
}
