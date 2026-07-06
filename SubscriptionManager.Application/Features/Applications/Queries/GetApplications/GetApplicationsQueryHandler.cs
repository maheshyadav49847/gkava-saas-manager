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
            })
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }
}
