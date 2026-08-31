using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Helpers;

public static class InvoiceNumberGenerator
{
    public static async Task<string> GenerateNextAsync(IAppDbContext context)
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"INV-{year}-";
        
        var lastInvoice = await context.Invoices
            .Where(i => i.InvoiceNumber.StartsWith(prefix))
            .OrderByDescending(i => i.InvoiceNumber)
            .FirstOrDefaultAsync();
        
        int nextSeq = 1;
        if (lastInvoice != null && lastInvoice.InvoiceNumber.Length > prefix.Length)
        {
            var seqPart = lastInvoice.InvoiceNumber.Substring(prefix.Length);
            if (int.TryParse(seqPart, out var lastSeq))
            {
                nextSeq = lastSeq + 1;
            }
        }
        
        return $"{prefix}{nextSeq:D4}";
    }
}
