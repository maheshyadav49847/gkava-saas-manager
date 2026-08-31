using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.SubscriberAuth.Commands.Register
{
    public class RegisterSubscriberCommandHandler : IRequestHandler<RegisterSubscriberCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public RegisterSubscriberCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(RegisterSubscriberCommand request, CancellationToken cancellationToken)
        {
            if (await _context.Tenants.AnyAsync(t => t.Email == request.Email, cancellationToken))
            {
                throw new InvalidOperationException("Email is already registered.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var tenant = new Tenant
            {
                Name = request.Name,
                Email = request.Email,
                PhoneCountryCode = request.PhoneCountryCode,
                Phone = request.Phone,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync(cancellationToken);

            return tenant.Id;
        }
    }
}
