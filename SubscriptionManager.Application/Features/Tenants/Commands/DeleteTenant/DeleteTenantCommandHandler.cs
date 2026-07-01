using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Tenants.Commands.DeleteTenant
{
    public class DeleteTenantCommandHandler : IRequestHandler<DeleteTenantCommand, bool>
    {
        private readonly IAppDbContext _context;

        public DeleteTenantCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteTenantCommand request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.FindAsync(new object[] { request.Id }, cancellationToken);
            if (tenant == null)
                return false;

            _context.Tenants.Remove(tenant);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
