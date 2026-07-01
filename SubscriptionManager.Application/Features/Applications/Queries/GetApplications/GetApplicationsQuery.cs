using MediatR;

namespace SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

public record GetApplicationsQuery : IRequest<List<ApplicationDto>>;
