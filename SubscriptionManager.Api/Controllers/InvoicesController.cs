using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Domain.Enums;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IAppDbContext _context;

    public InvoicesController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _context.Invoices
            .Include(i => i.Tenant)
            .Include(i => i.LineItems)
            .OrderByDescending(i => i.InvoiceDate)
            .Select(i => new {
                i.Id,
                i.TenantId,
                TenantName = i.Tenant.Name,
                TenantEmail = i.Tenant.Email,
                i.Amount,
                i.Currency,
                Status = i.Status.ToString(),
                i.InvoiceDate,
                i.DueDate,
                i.PdfUrl,
                i.PaymentMethod,
                i.PaymentDetails,
                LineItemsCount = i.LineItems.Count
            })
            .ToListAsync();

        return Ok(invoices);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(Guid id)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Tenant)
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null) return NotFound();

        return Ok(new {
            invoice.Id,
            invoice.TenantId,
            TenantName = invoice.Tenant.Name,
            invoice.Amount,
            invoice.Currency,
            Status = invoice.Status.ToString(),
            invoice.InvoiceDate,
            invoice.DueDate,
            LineItems = invoice.LineItems.Select(li => new {
                li.Id,
                li.Description,
                li.Amount,
                li.Quantity,
                li.TaxAmount,
                li.DiscountAmount
            })
        });
    }

    public class CreateInvoiceRequest
    {
        public Guid TenantId { get; set; }
        public DateTime DueDate { get; set; }
        public string Currency { get; set; } = "INR";
        public List<CreateInvoiceLineItemRequest> LineItems { get; set; } = new();
    }

    public class CreateInvoiceLineItemRequest
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Quantity { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(request.TenantId);
        if (tenant == null) return BadRequest("Tenant not found.");

        decimal totalAmount = request.LineItems.Sum(li => (li.Amount * li.Quantity) + li.TaxAmount - li.DiscountAmount);

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            Amount = totalAmount,
            Currency = request.Currency,
            Status = InvoiceStatus.Draft,
            InvoiceDate = DateTime.UtcNow,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var li in request.LineItems)
        {
            invoice.LineItems.Add(new InvoiceLineItem
            {
                Id = Guid.NewGuid(),
                Description = li.Description,
                Amount = li.Amount,
                Quantity = li.Quantity,
                TaxAmount = li.TaxAmount,
                DiscountAmount = li.DiscountAmount
            });
        }

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync(default);

        return Ok(new { message = "Invoice created successfully", invoiceId = invoice.Id });
    }

    [HttpPost("{id}/send")]
    public async Task<IActionResult> SendInvoice(Guid id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null) return NotFound();

        invoice.Status = InvoiceStatus.Open;
        invoice.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(default);

        return Ok(new { message = "Invoice sent to customer successfully." });
    }
    
    [HttpPost("{id}/mark-paid")]
    public async Task<IActionResult> MarkPaid(Guid id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice == null) return NotFound();

        invoice.Status = InvoiceStatus.Paid;
        invoice.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync(default);

        return Ok(new { message = "Invoice marked as paid." });
    }
}
