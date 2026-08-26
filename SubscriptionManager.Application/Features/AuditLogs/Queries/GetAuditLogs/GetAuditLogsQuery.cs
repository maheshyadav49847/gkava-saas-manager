using MediatR;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.AuditLogs.Queries.GetAuditLogs;

public class GetAuditLogsQuery : IRequest<List<AuditLogDto>>
{
}
