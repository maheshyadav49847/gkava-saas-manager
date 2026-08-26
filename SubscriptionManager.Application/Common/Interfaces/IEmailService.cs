using System.Threading.Tasks;

namespace SubscriptionManager.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
