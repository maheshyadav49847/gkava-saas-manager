using MediatR;

namespace SubscriptionManager.Application.Features.Applications.Commands.DeleteApplication;

public class DeleteApplicationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
