using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SubscriptionManager.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Infrastructure.Data.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        LogChanges(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        LogChanges(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void LogChanges(DbContext? context)
    {
        if (context == null) return;

        var entries = context.ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
            .ToList();

        foreach (var entry in entries)
        {
            if (entry.Entity is AuditLog) continue;

            var changes = new System.Collections.Generic.Dictionary<string, object?>();

            if (entry.State == EntityState.Modified)
            {
                foreach (var prop in entry.OriginalValues.Properties)
                {
                    var original = entry.OriginalValues[prop];
                    var current = entry.CurrentValues[prop];
                    if (!object.Equals(original, current))
                    {
                        changes[prop.Name] = new { old_value = original, new_value = current };
                    }
                }
            }
            else if (entry.State == EntityState.Added || entry.State == EntityState.Deleted)
            {
                foreach (var prop in entry.CurrentValues.Properties)
                {
                    changes[prop.Name] = entry.State == EntityState.Added ? entry.CurrentValues[prop] : entry.OriginalValues[prop];
                }
            }

            var detailsJson = System.Text.Json.JsonSerializer.Serialize(changes);

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                Action = entry.State.ToString(),
                EntityName = entry.Entity.GetType().Name,
                UserId = "System", // Or extract from HttpContext/Claims if available
                Details = detailsJson,
                Timestamp = DateTime.UtcNow
            };

            context.Add(auditLog);
        }
    }
}
