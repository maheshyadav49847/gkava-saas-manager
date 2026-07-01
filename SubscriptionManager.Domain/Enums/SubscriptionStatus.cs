namespace SubscriptionManager.Domain.Enums;

public enum SubscriptionStatus
{
    Active,
    Trialing,
    PastDue,
    Expired,
    Cancelled,
    Paused
}
