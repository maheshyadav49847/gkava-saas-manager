using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenantDetails
{
    public class GetTenantDetailsQueryHandler : IRequestHandler<GetTenantDetailsQuery, TenantProfileDto?>
    {
        private readonly IAppDbContext _context;

        public GetTenantDetailsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<TenantProfileDto?> Handle(GetTenantDetailsQuery request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants
                .Include(t => t.Subscriptions)
                    .ThenInclude(s => s.Plan)
                        .ThenInclude(p => p.Application)
                .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

            if (tenant == null) return null;

            return new TenantProfileDto
            {
                Id = tenant.Id,
                Name = tenant.Name,
                Email = tenant.Email,
                PhoneCountryCode = tenant.PhoneCountryCode,
                Phone = tenant.Phone,
                CreatedAt = tenant.CreatedAt,
                PaymentProviderCustomerId = tenant.PaymentProviderCustomerId,
                Subscriptions = tenant.Subscriptions.Select(s => new TenantSubscriptionDto
                {
                    Id = s.Id,
                    ApplicationName = s.Plan.Application.Name,
                    PlanName = s.Plan.Name,
                    PlanPrice = s.Plan.MonthlyPrice,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Status = s.Status.ToString(),
                    CancelAtPeriodEnd = s.CancelAtPeriodEnd,
                    PaymentMethod = s.PaymentMethod,
                    PaymentDetails = s.PaymentDetails
                }).OrderByDescending(s => s.StartDate).ToList()
            };
        }
    }
}
