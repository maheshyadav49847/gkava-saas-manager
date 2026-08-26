using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SubscriptionManager.Application.Features.PlatformSettings.Commands.UpdatePlatformSettings;

public class UpdatePlatformSettingsCommandHandler : IRequestHandler<UpdatePlatformSettingsCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdatePlatformSettingsCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePlatformSettingsCommand request, CancellationToken cancellationToken)
    {
        var settings = await _context.PlatformSettings.FirstOrDefaultAsync(cancellationToken);

        if (settings == null)
        {
            settings = new PlatformSetting
            {
                Id = Guid.NewGuid(),
                SupportEmail = request.SupportEmail,
                PrivacyEmail = request.PrivacyEmail,
                LegalEmail = request.LegalEmail,
                ContactPhone = request.ContactPhone,
                CashfreeAppId = request.CashfreeAppId,
                CashfreeSecretKey = request.CashfreeSecretKey,
                CashfreeEnvironment = request.CashfreeEnvironment ?? "SANDBOX",
                UpdatedAt = DateTime.UtcNow
            };
            _context.PlatformSettings.Add(settings);
        }
        else
        {
            settings.SupportEmail = request.SupportEmail;
            settings.PrivacyEmail = request.PrivacyEmail;
            settings.LegalEmail = request.LegalEmail;
            settings.ContactPhone = request.ContactPhone;
            settings.CashfreeAppId = request.CashfreeAppId;
            if (!string.IsNullOrEmpty(request.CashfreeSecretKey) && request.CashfreeSecretKey != "***")
            {
                settings.CashfreeSecretKey = request.CashfreeSecretKey;
            }
            settings.CashfreeEnvironment = request.CashfreeEnvironment ?? "SANDBOX";
            settings.UpdatedAt = DateTime.UtcNow;
        }

        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
