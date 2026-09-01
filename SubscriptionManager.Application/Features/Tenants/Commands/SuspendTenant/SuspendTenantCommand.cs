using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace SubscriptionManager.Application.Features.Tenants.Commands.SuspendTenant
{
    public class SuspendTenantCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public bool Suspend { get; set; }
    }

    public class SuspendTenantCommandHandler : IRequestHandler<SuspendTenantCommand, bool>
    {
        private readonly IAppDbContext _context;
        private readonly IWebhookService _webhookService;

        public SuspendTenantCommandHandler(IAppDbContext context, IWebhookService webhookService)
        {
            _context = context;
            _webhookService = webhookService;
        }

        public async Task<bool> Handle(SuspendTenantCommand request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.FindAsync(new object[] { request.Id }, cancellationToken);
            if (tenant == null) return false;

            tenant.IsSuspended = request.Suspend;
            
            // Handle App Subscriptions
            var activeSubscriptions = await _context.Subscriptions
                .Include(s => s.Plan)
                    .ThenInclude(p => p.Application)
                .Where(s => s.TenantId == request.Id && 
                            (s.Status == Domain.Enums.SubscriptionStatus.Active || s.Status == Domain.Enums.SubscriptionStatus.Paused))
                .ToListAsync(cancellationToken);

            foreach (var sub in activeSubscriptions)
            {
                if (request.Suspend)
                {
                    sub.Status = Domain.Enums.SubscriptionStatus.Paused;
                }
                else
                {
                    sub.Status = Domain.Enums.SubscriptionStatus.Active;
                }

                if (sub.Plan?.Application != null && !string.IsNullOrWhiteSpace(sub.Plan.Application.WebhookUrl))
                {
                    string eventType = request.Suspend ? "tenant_suspended" : "tenant_restored";
                    _ = _webhookService.NotifySubscriptionStatusChangedAsync(sub.Plan.Application.WebhookUrl, eventType, tenant, sub, sub.SubscriptionKey);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
