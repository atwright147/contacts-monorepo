using contacts_api.Data;
using contacts_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace contacts_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class ContactsController(ApplicationDbContext context) : ControllerBase
  {
    // GET: api/Contacts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
    {
      return context.Contacts.ToList();
    }

    // GET: api/Contacts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ContactWithFullName>> GetContact(int id)
    {
      var contact = await context.Contacts
        .Include(c => c.Addresses)
        .Include(c => c.PhoneNumbers)
        .FirstOrDefaultAsync(c => c.Id == id);

      if (contact == null)
      {
        return NotFound();
      }

      var contactWithFullname = new ContactWithFullName
      {
        Id = contact.Id,
        FirstName = contact.FirstName,
        LastName = contact.LastName,
        Email = contact.Email,
        DateOfBirth = contact.DateOfBirth,

        IsFavorite = contact.IsFavorite,
        PrimaryAddressId = contact.PrimaryAddressId,
        PrimaryPhoneNumberId = contact.PrimaryPhoneNumberId,

        Addresses = contact.Addresses,
        PhoneNumbers = contact.PhoneNumbers,
        FullName = $"{contact.FirstName} {contact.LastName}"
      };

      return contactWithFullname;
    }

    public record BirthdayGroup(int Month, List<Contact> Contacts);

    // GET: api/Contacts/birthdays
    [HttpGet("birthdays")]
    public async Task<ActionResult<IEnumerable<BirthdayGroup>>> GetBirthdays()
    {
      var contacts = context.Contacts
        .Where(c => c.DateOfBirth != null)
        .Select(c => new Contact
        {
          Id = c.Id,
          FirstName = c.FirstName,
          LastName = c.LastName,
          Email = c.Email,
          DateOfBirth = c.DateOfBirth,
          IsFavorite = c.IsFavorite
        })
        .ToList();

      return contacts
        .GroupBy(c => c.DateOfBirth!.Value.Month)
        .OrderBy(g => g.Key)
        .Select(g => new BirthdayGroup(g.Key, g.ToList()))
        .ToList();
    }

    // GET: api/Contacts/favorites
    [HttpGet("favorites")]
    public async Task<ActionResult<IEnumerable<Contact>>> GetFavorites()
    {
      return context.Contacts
        .Where(c => c.IsFavorite)
        .Select(c => new Contact
        {
          Id = c.Id,
          FirstName = c.FirstName,
          LastName = c.LastName,
          Email = c.Email,
          DateOfBirth = c.DateOfBirth,
          IsFavorite = c.IsFavorite
        })
        .ToList();
    }

    public record UpdateFavoriteDto([property: Required] bool IsFavorite);

    [HttpPatch("{id}/favorite")]
    public async Task<IActionResult> PatchContactFavorite(int id, UpdateFavoriteDto dto)
    {
      var contact = await context.Contacts.FirstOrDefaultAsync(c => c.Id == id);
      if (contact == null) return NotFound();

      contact.IsFavorite = dto.IsFavorite;
      await context.SaveChangesAsync();
      return NoContent();
    }

    // PUT: api/Contacts/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutContact(int id, Contact contact)
    {
      if (id != contact.Id)
      {
        return BadRequest();
      }

      var existingContact = await context.Contacts
        .Include(c => c.Addresses)
        .Include(c => c.PhoneNumbers)
        .FirstOrDefaultAsync(c => c.Id == id);

      if (existingContact == null)
      {
        return NotFound();
      }

      existingContact.FirstName = contact.FirstName;
      existingContact.LastName = contact.LastName;
      existingContact.Email = contact.Email;
      existingContact.DateOfBirth = contact.DateOfBirth;

      existingContact.IsFavorite = contact.IsFavorite;
      existingContact.PrimaryAddressId = contact.PrimaryAddressId;
      existingContact.PrimaryPhoneNumberId = contact.PrimaryPhoneNumberId;

      context.Addresses.RemoveRange(existingContact.Addresses);
      context.PhoneNumbers.RemoveRange(existingContact.PhoneNumbers);

      existingContact.Addresses = [.. (contact.Addresses ?? [])
        .Select(a => new Address
        {
          Line1 = a.Line1,
          Line2 = a.Line2,
          City = a.City,
          State = a.State,
          PostalCode = a.PostalCode,
          Country = a.Country
        })];

      existingContact.PhoneNumbers = [.. (contact.PhoneNumbers ?? [])
        .Select(t => new PhoneNumber
        {
          Number = t.Number,
          Type = t.Type,
        })];

      try
      {
        await context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!ContactExists(id))
        {
          return NotFound();
        }
      }

      return NoContent();
    }

    // POST: api/Contacts
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<Contact>> PostContact(Contact contact)
    {
      contact.Addresses ??= [];
      contact.PhoneNumbers ??= [];

      context.Contacts.Add(contact);
      await context.SaveChangesAsync();

      return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
    }

    // DELETE: api/Contacts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
      var contact = await context.Contacts.FindAsync(id);
      if (contact == null)
      {
        return NotFound();
      }

      context.Contacts.Remove(contact);
      await context.SaveChangesAsync();

      return NoContent();
    }

    private bool ContactExists(int id)
    {
      return context.Contacts.Any(e => e.Id == id);
    }
  }
}
