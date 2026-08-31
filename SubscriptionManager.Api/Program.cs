using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Infrastructure.Data;
using SubscriptionManager.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Serilog;
using System.Threading.RateLimiting;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddControllers().AddJsonOptions(options => { options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()); });

// Add Application Layer (MediatR)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.Load("SubscriptionManager.Application")));

var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("StrictCorsPolicy", policy =>
    {
        if (corsOrigins.Length > 0)
        {
            policy.WithOrigins(corsOrigins).AllowAnyMethod().AllowAnyHeader();
        }
        else
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    });
});

var jwtSecret = builder.Configuration["JwtSettings:Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("JwtSettings:Secret is missing from configuration.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSecret))
    };
});

builder.Services.AddAuthorization(options => 
{
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
});

// Add Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Add Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Add Infrastructure Layer
builder.Services.AddScoped<SubscriptionManager.Infrastructure.Data.Interceptors.AuditInterceptor>();
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .AddInterceptors(sp.GetRequiredService<SubscriptionManager.Infrastructure.Data.Interceptors.AuditInterceptor>());
});

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

// Add Services & Caching
builder.Services.AddMemoryCache();
builder.Services.AddStackExchangeRedisCache(options => options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379");
builder.Services.AddHealthChecks();

// Quartz setup
builder.Services.AddQuartz(q =>
{
    var jobKey = new Quartz.JobKey("SubscriptionExpiryJob");
    q.AddJob<SubscriptionManager.Infrastructure.Jobs.SubscriptionExpiryJob>(opts => opts.WithIdentity(jobKey));
    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("SubscriptionExpiryJob-trigger")
        .WithCronSchedule("0 0 0 * * ?")); // Daily at midnight
});
builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

builder.Services.AddHttpClient<IWebhookService, SubscriptionManager.Infrastructure.Services.WebhookService>();
builder.Services.AddHttpClient<IPaymentService, SubscriptionManager.Infrastructure.Services.CashfreePaymentService>();
builder.Services.AddTransient<IEmailService, SubscriptionManager.Infrastructure.Services.EmailService>();

var app = builder.Build();

app.UseCors("StrictCorsPolicy");
app.UseExceptionHandler(); // Global Exception Handler

app.MapHealthChecks("/health");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
}

app.UseSerilogRequestLogging();
app.UseRateLimiter(); // Add Rate Limiter

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

