using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Plans.Commands.DeletePlan
{
    public class DeletePlanCommandHandler : IRequestHandler<DeletePlanCommand, bool>
    {
        private readonly IAppDbContext _context;

        public DeletePlanCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeletePlanCommand request, CancellationToken cancellationToken)
        {
            var plan = await _context.Plans.FindAsync(new object[] { request.Id }, cancellationToken);
            if (plan == null)
                return false;

            _context.Plans.Remove(plan);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
