using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

namespace StudentManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class courseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public courseController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> create(courses courses)
        {
             _context.courses.Add(courses);
            await _context.SaveChangesAsync();
            return Ok(courses);
        }
        [HttpGet]
        public async Task<IActionResult>Getcourses()
        {
            var Courses =await _context.courses.ToListAsync();
            return Ok(Courses);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> updateCourses(int id, courses courses)
        {
            if (id != courses.id)
                return BadRequest("ID mismatch");
            var existingCourses = await _context.courses.FindAsync(id);
            if (existingCourses == null)
                return NotFound("course mot found");
            existingCourses.Name = courses.Name;
            await _context.SaveChangesAsync();
            return Ok(existingCourses);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult>delete (int id)
        {
            var courses = await _context.courses.FirstAsync();

            if (courses == null)
                return NotFound("course not found");
            _context.courses.Remove(courses);
            await _context.SaveChangesAsync();
              return Ok("course Deleted Successfully");
        }
    }
}
