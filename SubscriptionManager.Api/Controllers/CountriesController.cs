using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountriesController : ControllerBase
{
    private readonly IAppDbContext _context;

    public CountriesController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var countries = await _context.Countries
            .Select(c => new { c.Id, c.Name, c.PhoneCode, c.CurrencyCode, c.CurrencySymbol })
            .ToListAsync();
        return Ok(countries);
    }
}
