using System;
using System.Collections.Generic;
using SubscriptionManager.Domain.Enums;

namespace SubscriptionManager.Domain.Entities;

public class Ticket : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public TicketCategory Category { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<TicketMessage> Messages { get; set; } = new List<TicketMessage>();
}
