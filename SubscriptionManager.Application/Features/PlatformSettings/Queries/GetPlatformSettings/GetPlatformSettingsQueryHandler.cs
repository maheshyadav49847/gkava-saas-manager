using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SubscriptionManager.Application.Features.PlatformSettings.Queries.GetPlatformSettings;

public class GetPlatformSettingsQueryHandler : IRequestHandler<GetPlatformSettingsQuery, PlatformSettingsDto>
{
    private readonly IAppDbContext _context;

    public GetPlatformSettingsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<PlatformSettingsDto> Handle(GetPlatformSettingsQuery request, CancellationToken cancellationToken)
    {
        var settings = await _context.PlatformSettings.FirstOrDefaultAsync(cancellationToken);

        if (settings == null)
        {
            return new PlatformSettingsDto();
        }

        return new PlatformSettingsDto
        {
            Id = settings.Id,
            SupportEmail = settings.SupportEmail,
            PrivacyEmail = settings.PrivacyEmail,
            LegalEmail = settings.LegalEmail,
            ContactPhone = settings.ContactPhone,
            CashfreeAppId = settings.CashfreeAppId,
            CashfreeSecretKey = string.IsNullOrEmpty(settings.CashfreeSecretKey) ? null : "***",
            CashfreeEnvironment = settings.CashfreeEnvironment ?? "SANDBOX",
            CompanyName = settings.CompanyName,
            CompanyAddress = settings.CompanyAddress,
            GstNumber = settings.GstNumber,
            UpdatedAt = settings.UpdatedAt
        };
    }
}
