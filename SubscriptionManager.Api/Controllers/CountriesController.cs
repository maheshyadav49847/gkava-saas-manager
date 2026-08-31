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
        using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture) { HeaderValidated = null, MissingFieldFound = null, IgnoreBlankLines = true, DetectDelimiter = true }))
        {
            csv.Read();
            csv.ReadHeader();
            var headerRecord = csv.HeaderRecord;

            var existingCountries = await _context.Countries.ToDictionaryAsync(c => c.Id.ToUpper());

            while (csv.Read())
            {
                // Smart column mapping to accept official external files (DataHub, etc) or our own exports
                var id = GetCsvValue(csv, headerRecord, "Id", "ISO3166-1-Alpha-2", "alpha-2", "cca2", "Code");
                var name = GetCsvValue(csv, headerRecord, "Name", "CLDR display name", "official_name_en", "Country", "name_en");
                var phone = GetCsvValue(csv, headerRecord, "PhoneCode", "Dial", "calling_code", "Phone");
                var currCode = GetCsvValue(csv, headerRecord, "CurrencyCode", "ISO4217-currency_alphabetic", "currency_code", "Currency");
                var currSym = GetCsvValue(csv, headerRecord, "CurrencySymbol", "currency_symbol", "Symbol");

                if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(name)) 
                    continue;

                // Cleanup phone code (e.g. some sources provide "91" instead of "+91", or "1-809" etc)
                if (!string.IsNullOrWhiteSpace(phone) && !phone.StartsWith("+"))
                {
                    phone = "+" + phone.Split(',')[0].Split('-')[0].Trim();
                }

                id = id.Trim().ToUpper();

                if (existingCountries.TryGetValue(id, out var existing))
                {
                    existing.Name = name;
                    if (!string.IsNullOrWhiteSpace(phone)) existing.PhoneCode = phone;
                    if (!string.IsNullOrWhiteSpace(currCode)) existing.CurrencyCode = currCode;
                    if (!string.IsNullOrWhiteSpace(currSym)) existing.CurrencySymbol = currSym;
                    updatedCount++;
                }
                else
                {
                    _context.Countries.Add(new Country
                    {
                        Id = id,
                        Name = name,
                        PhoneCode = phone ?? "",
                        CurrencyCode = currCode ?? "",
                        CurrencySymbol = currSym ?? ""
                    });
                    addedCount++;
                }
            }
            await _context.SaveChangesAsync(default);
        }

        return Ok(new { Message = $"Successfully imported. Added: {addedCount}, Updated: {updatedCount}" });
    }

    private string GetCsvValue(CsvReader csv, string[] headers, params string[] possibleNames)
    {
        foreach (var name in possibleNames)
        {
            // Case insensitive check if header exists
            if (headers.Any(h => string.Equals(h, name, StringComparison.OrdinalIgnoreCase)))
            {
                if (csv.TryGetField(name, out string value) && !string.IsNullOrWhiteSpace(value))
                    return value;
            }
        }
        return string.Empty;
    }
}
