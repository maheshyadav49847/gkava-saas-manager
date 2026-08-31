using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System;

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
            if (await _context.Tenants.AnyAsync(t => t.Email.ToLower() == request.Email.ToLower() && t.Id != request.Id, cancellationToken))
            {
                throw new ArgumentException("Another tenant with this email already exists.");
            }

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
