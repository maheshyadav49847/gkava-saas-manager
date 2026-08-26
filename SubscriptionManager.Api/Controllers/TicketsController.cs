using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Domain.Enums;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly IAppDbContext _context;

    public TicketsController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Tenant)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new {
                t.Id,
                t.TenantId,
                TenantName = t.Tenant.Name,
                TenantEmail = t.Tenant.Email,
                t.Subject,
                Status = t.Status.ToString(),
                Priority = t.Priority.ToString(),
                Category = t.Category.ToString(),
                t.CreatedAt,
                t.UpdatedAt
            })
            .ToListAsync();

        return Ok(tickets);
    }

    public class CreateTicketRequest
    {
        public Guid TenantId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; }
        public TicketCategory Category { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(request.TenantId);
        if (tenant == null) return BadRequest("Tenant not found.");

        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            Subject = request.Subject,
            Priority = request.Priority,
            Category = request.Category,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow
        };

        var message = new TicketMessage
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            SenderId = request.TenantId.ToString(),
            SenderName = tenant.Name,
            IsInternalNote = false,
            MessageText = request.MessageText,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        _context.TicketMessages.Add(message);
        await _context.SaveChangesAsync(default);

        return Ok(new { message = "Ticket created", ticketId = ticket.Id });
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetTicketMessages(Guid id)
    {
        var messages = await _context.TicketMessages
            .Where(m => m.TicketId == id)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new {
                m.Id,
                m.SenderId,
                m.SenderName,
                m.IsInternalNote,
                m.MessageText,
                m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    public class ReplyRequest
    {
        public string MessageText { get; set; } = string.Empty;
        public bool IsInternalNote { get; set; }
    }

    [HttpPost("{id}/reply")]
    public async Task<IActionResult> ReplyToTicket(Guid id, [FromBody] ReplyRequest request)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null) return NotFound("Ticket not found.");

        // We assume the caller is an Admin.
        // In a real app we'd get User identity from Claims, for now we mock it.
        var message = new TicketMessage
        {
            Id = Guid.NewGuid(),
            TicketId = id,
            SenderId = "ADMIN", // Hardcoded admin for now
            SenderName = "Support Team",
            IsInternalNote = request.IsInternalNote,
            MessageText = request.MessageText,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketMessages.Add(message);
        
        // Update ticket status automatically based on reply type
        if (!request.IsInternalNote)
        {
            ticket.Status = TicketStatus.PendingCustomer;
        }
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(default);

        return Ok(new { message = "Reply sent successfully." });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string newStatus)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        if (ticket == null) return NotFound("Ticket not found.");

        if (Enum.TryParse(typeof(TicketStatus), newStatus, true, out var statusObj))
        {
            ticket.Status = (TicketStatus)statusObj;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(default);
            return Ok();
        }

        return BadRequest("Invalid status.");
    }
}
