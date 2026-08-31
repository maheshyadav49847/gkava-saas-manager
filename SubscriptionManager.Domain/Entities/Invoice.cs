using System;
using System.Collections.Generic;
using SubscriptionManager.Domain.Enums;

namespace SubscriptionManager.Domain.Entities;

public class Invoice : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid TenantId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public InvoiceStatus Status { get; set; }
    public DateTime InvoiceDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string? StripeInvoiceId { get; set; }
    public string? PdfUrl { get; set; }
    
    public string? PaymentMethod { get; set; }
    public string? PaymentDetails { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();
}
