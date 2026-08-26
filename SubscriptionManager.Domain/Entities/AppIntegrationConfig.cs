using System;  namespace SubscriptionManager.Domain.Entities;  public class AppIntegrationConfig {     public Guid Id { get; set; }     public Guid ApplicationId { get; set; }          public string? TargetApiUrl { get; set; }     public string? TargetApiSecretEncrypted { get; set; }          public string? Meta_AppId { get; set; }
    public bool Meta_AppId_IsSensitive { get; set; }         public string? Meta_ConfigId { get; set; }
    public bool Meta_ConfigId_IsSensitive { get; set; }         public string? Meta_SystemUserToken { get; set; }
    public bool Meta_SystemUserToken_IsSensitive { get; set; } = true;         public string? WhatsApp_WebhookVerifyToken { get; set; }
    public bool WhatsApp_WebhookVerifyToken_IsSensitive { get; set; } = true;         public string Meta_BaseUrl { get; set; } = "https://graph.facebook.com/v19.0";
    public bool Meta_BaseUrl_IsSensitive { get; set; }         public string? Twilio_AccountSid { get; set; }
    public bool Twilio_AccountSid_IsSensitive { get; set; }         public string? Twilio_AuthToken { get; set; }
    public bool Twilio_AuthToken_IsSensitive { get; set; } = true;         public string? Twilio_SmsFromNumber { get; set; }
    public bool Twilio_SmsFromNumber_IsSensitive { get; set; }         public string Telegram_BaseUrl { get; set; } = "https://api.telegram.org";
    public bool Telegram_BaseUrl_IsSensitive { get; set; }     public string? LastUpdatedBy { get; set; }     public DateTime LastUpdatedAt { get; set; }     public string? SyncStatus { get; set; } }
