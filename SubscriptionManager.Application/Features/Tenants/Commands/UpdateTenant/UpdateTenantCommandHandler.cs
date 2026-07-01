using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Tenants.Commands.UpdateTenant
{
    public class UpdateTenantCommandHandler : IRequestHandler<UpdateTenantCommand, bool>
    {
        private readonly IAppDbContext _context;

        public UpdateTenantCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateTenantCommand request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.FindAsync(new object[] { request.Id }, cancellationToken);
            if (tenant == null)
                return false;

            tenant.Name = request.Name;
            tenant.Email = request.Email;
            tenant.Phone = request.Phone;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
