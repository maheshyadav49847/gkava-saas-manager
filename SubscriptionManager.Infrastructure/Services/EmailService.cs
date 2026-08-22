using MailKit.Net.Smtp;
using MimeKit;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System;

namespace SubscriptionManager.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Admin", "admin@example.com"));
        message.To.Add(new MailboxAddress("", to));
        message.Subject = subject;
        
        message.Body = new TextPart("html")
        {
            Text = body
        };

        try
        {
            using var client = new SmtpClient();
            // In a real scenario, these would come from configuration
            await client.ConnectAsync("smtp.example.com", 587, false);
            // await client.AuthenticateAsync("user", "pass");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }
}
