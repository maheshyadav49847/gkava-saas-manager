using System;

namespace SubscriptionManager.Application.Features.AuditLogs.Queries.GetAuditLogs;

public class AuditLogDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; }
}
