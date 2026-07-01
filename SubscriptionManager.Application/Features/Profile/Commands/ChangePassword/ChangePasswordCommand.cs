using MediatR;

namespace SubscriptionManager.Application.Features.Profile.Commands.ChangePassword
{
    public class ChangePasswordCommand : IRequest<bool>
    {
        public string AdminUserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
