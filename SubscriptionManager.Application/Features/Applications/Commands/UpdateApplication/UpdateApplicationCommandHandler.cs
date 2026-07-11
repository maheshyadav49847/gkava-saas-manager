using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication;

public class UpdateApplicationCommandHandler : IRequestHandler<UpdateApplicationCommand, bool>
{
    private readonly IAppDbContext _context;

    public UpdateApplicationCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _context.Applications
            .Include(a => a.Modules)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
            
        if (application == null)
            return false;

        application.Name = request.Name;
        application.Subtitle = request.Subtitle;
        application.WebhookUrl = request.WebhookUrl;
        application.Description = request.Description;
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            application.ImageBase64 = request.ImageBase64;
        }
        
        application.DisplayOrder = request.DisplayOrder;

        // Completely recreate modules to avoid tracking issues
        if (application.Modules.Any())
        {
            _context.ApplicationModules.RemoveRange(application.Modules);
            application.Modules.Clear();
        }

        // Add new modules
        if (request.Modules != null)
        {
            foreach (var reqMod in request.Modules)
            {
                var newModule = new SubscriptionManager.Domain.Entities.ApplicationModule
                {
                    Name = reqMod.Name,
                    Description = reqMod.Description,
                    Icon = reqMod.Icon,
                    DisplayOrder = reqMod.DisplayOrder
                };
                
                // Explicitly add to DbSet to force EntityState.Added, 
                // preventing EF Core from assuming it's an existing entity due to Guid.NewGuid()
                _context.ApplicationModules.Add(newModule);
                application.Modules.Add(newModule);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
