using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;

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

    [HttpGet("export")]
    public async Task<IActionResult> ExportCsv()
    {
        var countries = await _context.Countries.ToListAsync();
        
        var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, 1024, true))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {
            csv.WriteRecords(countries);
        }
        
        memoryStream.Position = 0;
        return File(memoryStream, "text/csv", "countries_export.csv");
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportCsv(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var updatedCount = 0;
        var addedCount = 0;

        using (var reader = new StreamReader(file.OpenReadStream()))
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { HeaderValidated = null, MissingFieldFound = null }))
        {
            var records = csv.GetRecords<Country>().ToList();
            var existingCountries = await _context.Countries.ToDictionaryAsync(c => c.Id);

            foreach (var record in records)
            {
                if (existingCountries.TryGetValue(record.Id, out var existing))
                {
                    // Update existing
                    existing.Name = record.Name;
                    existing.PhoneCode = record.PhoneCode;
                    existing.CurrencyCode = record.CurrencyCode;
                    existing.CurrencySymbol = record.CurrencySymbol;
                    updatedCount++;
                }
                else
                {
                    // Add new
                    _context.Countries.Add(record);
                    addedCount++;
                }
            }
            await _context.SaveChangesAsync(default);
        }

        return Ok(new { Message = $"Successfully imported. Added: {addedCount}, Updated: {updatedCount}" });
    }
}
