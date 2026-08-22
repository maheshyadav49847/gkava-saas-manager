using Quartz;
using Microsoft.Extensions.Logging;

namespace SubscriptionManager.Infrastructure.Jobs;

public class SubscriptionExpiryJob : IJob
{
    private readonly ILogger<SubscriptionExpiryJob> _logger;

    public SubscriptionExpiryJob(ILogger<SubscriptionExpiryJob> logger)
    {
        _logger = logger;
    }

    public Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("SubscriptionExpiryJob executed at: {time}", DateTimeOffset.Now);
        return Task.CompletedTask;
    }
}
