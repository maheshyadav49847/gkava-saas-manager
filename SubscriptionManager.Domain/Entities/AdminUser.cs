using System;

namespace SubscriptionManager.Domain.Entities
{
    public class AdminUser
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Name { get; set; }
    }
}
