using System;

namespace SubscriptionManager.Domain.Entities;

public class InvoiceLineItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid InvoiceId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Quantity { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }

    public virtual Invoice Invoice { get; set; } = null!;
}
