using System;

namespace SubscriptionManager.Domain.Entities;

public class TicketMessage : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TicketId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public bool IsInternalNote { get; set; }
    public string MessageText { get; set; } = string.Empty;

    public virtual Ticket Ticket { get; set; } = null!;
}
