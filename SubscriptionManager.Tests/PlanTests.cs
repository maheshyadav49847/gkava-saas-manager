using SubscriptionManager.Domain.Entities;
using System;
using Xunit;

namespace SubscriptionManager.Tests;

public class PlanTests
{
    [Fact]
    public void Plan_CanBeCreated()
    {
        // Arrange & Act
        var plan = new Plan
        {
            Id = Guid.NewGuid(),
            Name = "Pro",
            PaymentProviderPriceId = "price_123",
            MonthlyPrice = 29.99m,
            YearlyPrice = 299.99m,
            IsPopular = true
        };

        // Assert
        Assert.NotNull(plan);
        Assert.Equal("Pro", plan.Name);
        Assert.Equal(29.99m, plan.MonthlyPrice);
    }
}
