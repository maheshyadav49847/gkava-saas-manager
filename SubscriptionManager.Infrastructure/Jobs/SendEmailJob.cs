using Quartz;
using Microsoft.Extensions.Logging;
using SubscriptionManager.Application.Common.Interfaces;
using System.Threading.Tasks;

namespace SubscriptionManager.Infrastructure.Jobs;

public class SendEmailJob : IJob
{
    private readonly IEmailService _emailService;
    private readonly ILogger<SendEmailJob> _logger;

    public SendEmailJob(IEmailService emailService, ILogger<SendEmailJob> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var dataMap = context.JobDetail.JobDataMap;
        var to = dataMap.GetString("To");
        var subject = dataMap.GetString("Subject");
        var body = dataMap.GetString("Body");

        if (!string.IsNullOrEmpty(to) && !string.IsNullOrEmpty(subject) && !string.IsNullOrEmpty(body))
        {
            await _emailService.SendEmailAsync(to, subject, body);
            _logger.LogInformation("Sent email to {To}", to);
        }
        else
        {
            _logger.LogWarning("Email payload is missing required fields.");
        }
    }
}
