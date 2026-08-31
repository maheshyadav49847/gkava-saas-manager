using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SubscriptionManager.Application.Common.Interfaces;

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

        public SuspendTenantCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(SuspendTenantCommand request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.FindAsync(new object[] { request.Id }, cancellationToken);
            if (tenant == null) return false;

            tenant.IsSuspended = request.Suspend;
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
