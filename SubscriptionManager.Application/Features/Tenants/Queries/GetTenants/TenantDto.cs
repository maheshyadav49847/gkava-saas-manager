using System;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenants
{
    public class TenantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public string Plan { get; set; }
        public DateTime JoinDate { get; set; }
    }
}
