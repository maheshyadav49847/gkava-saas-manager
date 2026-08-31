using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SubscriptionManager.Application.Features.ContactMessages.Queries.GetContactMessages;

public class GetContactMessagesQueryHandler : IRequestHandler<GetContactMessagesQuery, List<ContactMessageDto>>
{
    private readonly IAppDbContext _context;

    public GetContactMessagesQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContactMessageDto>> Handle(GetContactMessagesQuery request, CancellationToken cancellationToken)
    {
        return await _context.ContactMessages
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ContactMessageDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                PhoneCountryCode = x.PhoneCountryCode,
                Phone = x.Phone,
                Subject = x.Subject,
                Message = x.Message,
                IsRead = x.IsRead,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
