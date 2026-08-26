using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;
using SubscriptionManager.Infrastructure.Data;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/app-integrations")]
public class AppIntegrationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IDataProtector _protector;

    public AppIntegrationsController(AppDbContext context, HttpClient httpClient, IDataProtectionProvider provider)
    {
        _context = context;
        _httpClient = httpClient;
        _protector = provider.CreateProtector("AppIntegrationSecretProtector");
    }

    [HttpGet]
    public async Task<IActionResult> GetAppIntegrations()
    {
        var applications = await _context.Set<SubscriptionManager.Domain.Entities.Application>().ToListAsync();
        var configs = await _context.AppIntegrationConfigs.ToListAsync();
        var histories = await _context.AppIntegrationHistories
            .OrderByDescending(h => h.UpdatedAt)
            .ToListAsync();

        var result = applications.Select(app => new
        {
            ApplicationId = app.Id,
            ApplicationName = app.Name,
            WebsiteUrl = configs.FirstOrDefault(c => c.ApplicationId == app.Id)?.TargetApiUrl,
            HasSecret = !string.IsNullOrEmpty(configs.FirstOrDefault(c => c.ApplicationId == app.Id)?.TargetApiSecretEncrypted),
            Config = configs.FirstOrDefault(c => c.ApplicationId == app.Id),
            Histories = histories.Where(h => h.ApplicationId == app.Id).ToList()
        });

        return Ok(result);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> Sync([FromBody] AppIntegrationDto dto)
    {
        if (dto.ApplicationId == Guid.Empty)
            return BadRequest("ApplicationId is required");

        var app = await _context.Set<SubscriptionManager.Domain.Entities.Application>().FindAsync(dto.ApplicationId);
        if (app == null)
            return NotFound("Application not found");

        if (string.IsNullOrEmpty(dto.TargetApiUrl))
            return BadRequest("Target Application does not have a Webhook URL configured.");

        // Save/Update config
        var config = await _context.AppIntegrationConfigs
            .FirstOrDefaultAsync(c => c.ApplicationId == dto.ApplicationId);

        if (config == null)
        {
            config = new AppIntegrationConfig
            {
                Id = Guid.NewGuid(),
                ApplicationId = dto.ApplicationId
            };
            _context.AppIntegrationConfigs.Add(config);
        }

        config.TargetApiUrl = dto.TargetApiUrl ?? config.TargetApiUrl;
        
        if (!string.IsNullOrEmpty(dto.TargetApiSecret)) {
            config.TargetApiSecretEncrypted = _protector.Protect(dto.TargetApiSecret);
        }

        config.Meta_AppId = dto.Meta_AppId ?? config.Meta_AppId;
        config.Meta_AppId_IsSensitive = dto.Meta_AppId_IsSensitive;

        config.Meta_ConfigId = dto.Meta_ConfigId ?? config.Meta_ConfigId;
        config.Meta_ConfigId_IsSensitive = dto.Meta_ConfigId_IsSensitive;

        config.Meta_SystemUserToken = dto.Meta_SystemUserToken ?? config.Meta_SystemUserToken;
        config.Meta_SystemUserToken_IsSensitive = dto.Meta_SystemUserToken_IsSensitive;

        config.WhatsApp_WebhookVerifyToken = dto.WhatsApp_WebhookVerifyToken ?? config.WhatsApp_WebhookVerifyToken;
        config.WhatsApp_WebhookVerifyToken_IsSensitive = dto.WhatsApp_WebhookVerifyToken_IsSensitive;

        config.Meta_BaseUrl = dto.Meta_BaseUrl ?? config.Meta_BaseUrl;
        config.Meta_BaseUrl_IsSensitive = dto.Meta_BaseUrl_IsSensitive;

        config.Twilio_AccountSid = dto.Twilio_AccountSid ?? config.Twilio_AccountSid;
        config.Twilio_AccountSid_IsSensitive = dto.Twilio_AccountSid_IsSensitive;

        config.Twilio_AuthToken = dto.Twilio_AuthToken ?? config.Twilio_AuthToken;
        config.Twilio_AuthToken_IsSensitive = dto.Twilio_AuthToken_IsSensitive;

        config.Twilio_SmsFromNumber = dto.Twilio_SmsFromNumber ?? config.Twilio_SmsFromNumber;
        config.Twilio_SmsFromNumber_IsSensitive = dto.Twilio_SmsFromNumber_IsSensitive;

        config.Telegram_BaseUrl = dto.Telegram_BaseUrl ?? config.Telegram_BaseUrl;
        config.Telegram_BaseUrl_IsSensitive = dto.Telegram_BaseUrl_IsSensitive;

        config.LastUpdatedAt = DateTime.UtcNow;

        // Build Payload
        var settingsList = new List<object>();
        
        void AddIfNotNull(string key, string? val, bool isSensitive)
        {
            if (!string.IsNullOrEmpty(val))
            {
                settingsList.Add(new {
                    key = key,
                    value = val,
                    isSensitive = isSensitive
                });
            }
        }

        AddIfNotNull("Meta_AppId", dto.Meta_AppId, dto.Meta_AppId_IsSensitive);
        AddIfNotNull("Meta_ConfigId", dto.Meta_ConfigId, dto.Meta_ConfigId_IsSensitive);
        AddIfNotNull("Meta_SystemUserToken", dto.Meta_SystemUserToken, dto.Meta_SystemUserToken_IsSensitive);
        AddIfNotNull("WhatsApp_WebhookVerifyToken", dto.WhatsApp_WebhookVerifyToken, dto.WhatsApp_WebhookVerifyToken_IsSensitive);
        AddIfNotNull("Meta_BaseUrl", dto.Meta_BaseUrl, dto.Meta_BaseUrl_IsSensitive);
        AddIfNotNull("Twilio:AccountSid", dto.Twilio_AccountSid, dto.Twilio_AccountSid_IsSensitive);
        AddIfNotNull("Twilio:AuthToken", dto.Twilio_AuthToken, dto.Twilio_AuthToken_IsSensitive);
        AddIfNotNull("Twilio:SmsFromNumber", dto.Twilio_SmsFromNumber, dto.Twilio_SmsFromNumber_IsSensitive);
        AddIfNotNull("Telegram_BaseUrl", dto.Telegram_BaseUrl, dto.Telegram_BaseUrl_IsSensitive);
        
        var payload = new { settings = settingsList };

        bool isSuccess = false;
        string errorMessage = "Sync Failed";
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, config.TargetApiUrl)
            {
                Content = JsonContent.Create(payload)
            };
            
            if (!string.IsNullOrEmpty(config.TargetApiSecretEncrypted))
            {
                string secret = _protector.Unprotect(config.TargetApiSecretEncrypted!);
                request.Headers.Add("X-SaaS-Manager-Key", secret);
            }
            
            var response = await _httpClient.SendAsync(request);
            isSuccess = response.IsSuccessStatusCode;
            config.SyncStatus = isSuccess ? "Success" : "Failed";
            if (!isSuccess) errorMessage = $"Target API responded with {response.StatusCode}";
        }
        catch (Exception ex)
        {
            config.SyncStatus = "Failed";
            isSuccess = false;
            errorMessage = ex.Message;
        }

        // Save history (sanitize secret from snapshot)
        var snapshotDto = new AppIntegrationDto {
            ApplicationId = dto.ApplicationId,
            Meta_AppId = dto.Meta_AppId,
            Meta_ConfigId = dto.Meta_ConfigId,
            Meta_SystemUserToken = dto.Meta_SystemUserToken,
            WhatsApp_WebhookVerifyToken = dto.WhatsApp_WebhookVerifyToken,
            Meta_BaseUrl = dto.Meta_BaseUrl,
            Twilio_AccountSid = dto.Twilio_AccountSid,
            Twilio_AuthToken = dto.Twilio_AuthToken,
            Twilio_SmsFromNumber = dto.Twilio_SmsFromNumber,
            Telegram_BaseUrl = dto.Telegram_BaseUrl,
            
            Meta_AppId_IsSensitive = dto.Meta_AppId_IsSensitive,
            Meta_ConfigId_IsSensitive = dto.Meta_ConfigId_IsSensitive,
            Meta_SystemUserToken_IsSensitive = dto.Meta_SystemUserToken_IsSensitive,
            WhatsApp_WebhookVerifyToken_IsSensitive = dto.WhatsApp_WebhookVerifyToken_IsSensitive,
            Meta_BaseUrl_IsSensitive = dto.Meta_BaseUrl_IsSensitive,
            Twilio_AccountSid_IsSensitive = dto.Twilio_AccountSid_IsSensitive,
            Twilio_AuthToken_IsSensitive = dto.Twilio_AuthToken_IsSensitive,
            Twilio_SmsFromNumber_IsSensitive = dto.Twilio_SmsFromNumber_IsSensitive,
            Telegram_BaseUrl_IsSensitive = dto.Telegram_BaseUrl_IsSensitive
        };

        var history = new AppIntegrationHistory
        {
            Id = Guid.NewGuid(),
            ApplicationId = dto.ApplicationId,
            ConfigSnapshotJson = JsonSerializer.Serialize(snapshotDto),
            UpdatedAt = DateTime.UtcNow,
            SyncStatus = config.SyncStatus
        };
        _context.AppIntegrationHistories.Add(history);

        await _context.SaveChangesAsync();

        if (isSuccess)
            return Ok(new { Message = "Synced Successfully" });
        return BadRequest(new { Message = errorMessage });
    }
}

public class AppIntegrationDto
{
    public Guid ApplicationId { get; set; }
    public string? TargetApiUrl { get; set; }
    public string? TargetApiSecret { get; set; }
    
    public string? Meta_AppId { get; set; }
    public bool Meta_AppId_IsSensitive { get; set; }
    
    public string? Meta_ConfigId { get; set; }
    public bool Meta_ConfigId_IsSensitive { get; set; }
    
    public string? Meta_SystemUserToken { get; set; }
    public bool Meta_SystemUserToken_IsSensitive { get; set; }
    
    public string? WhatsApp_WebhookVerifyToken { get; set; }
    public bool WhatsApp_WebhookVerifyToken_IsSensitive { get; set; }
    
    public string? Meta_BaseUrl { get; set; }
    public bool Meta_BaseUrl_IsSensitive { get; set; }
    
    public string? Twilio_AccountSid { get; set; }
    public bool Twilio_AccountSid_IsSensitive { get; set; }
    
    public string? Twilio_AuthToken { get; set; }
    public bool Twilio_AuthToken_IsSensitive { get; set; }
    
    public string? Twilio_SmsFromNumber { get; set; }
    public bool Twilio_SmsFromNumber_IsSensitive { get; set; }
    
    public string? Telegram_BaseUrl { get; set; }
    public bool Telegram_BaseUrl_IsSensitive { get; set; }
}
