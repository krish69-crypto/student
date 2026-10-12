using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

namespace StudentManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(AppDbContext context, ILogger<StudentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents([FromQuery] string? search = null)
        {
            try
            {
                var query = _context.Students.AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    search = search.Trim().ToLower();
                    query = query.Where(s =>
                        s.Name.ToLower().Contains(search) ||
                        s.Email.ToLower().Contains(search) ||
                        (s.Course != null && s.Course.ToLower().Contains(search)) ||
                        (s.Phone != null && s.Phone.ToLower().Contains(search)));
                }

                var students = await query.OrderByDescending(s => s.Id).ToListAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching students");
                return StatusCode(500, new { message = "Error retrieving student records", error = ex.Message });
            }
        }

        // GET: api/students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            try
            {
                var student = await _context.Students.FindAsync(id);
                if (student == null)
                {
                    return NotFound(new { message = $"Student with ID {id} not found." });
                }

                return Ok(student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching student {Id}", id);
                return StatusCode(500, new { message = "Error retrieving student", error = ex.Message });
            }
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] Student student)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check for duplicate email
                var emailExists = await _context.Students.AnyAsync(s => s.Email.ToLower() == student.Email.Trim().ToLower());
                if (emailExists)
                {
                    return Conflict(new { message = "A student with this email address already exists." });
                }

                student.EnrollmentDate = student.EnrollmentDate == default ? DateTime.UtcNow : student.EnrollmentDate;

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating student");
                return StatusCode(500, new { message = "Error creating student record", error = ex.Message });
            }
        }

        // PUT: api/students/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
        {
            if (id != student.Id)
            {
                return BadRequest(new { message = "Student ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingStudent = await _context.Students.FindAsync(id);
                if (existingStudent == null)
                {
                    return NotFound(new { message = $"Student with ID {id} not found." });
                }

                // Check if email changed and if new email already exists for another student
                var emailExists = await _context.Students.AnyAsync(s => s.Id != id && s.Email.ToLower() == student.Email.Trim().ToLower());
                if (emailExists)
                {
                    return Conflict(new { message = "Another student with this email address already exists." });
                }

                existingStudent.Name = student.Name.Trim();
                existingStudent.Email = student.Email.Trim();
                existingStudent.Phone = student.Phone?.Trim();
                existingStudent.Course = student.Course?.Trim();
                existingStudent.Age = student.Age;

                await _context.SaveChangesAsync();
                return Ok(existingStudent);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!StudentExists(id))
                {
                    return NotFound(new { message = $"Student with ID {id} not found." });
                }
                _logger.LogError(ex, "Concurrency error updating student {Id}", id);
                return StatusCode(500, new { message = "Concurrency conflict occurred", error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating student {Id}", id);
                return StatusCode(500, new { message = "Error updating student record", error = ex.Message });
            }
        }

        // DELETE: api/students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var student = await _context.Students.FindAsync(id);
                if (student == null)
                {
                    return NotFound(new { message = $"Student with ID {id} not found." });
                }

                _context.Students.Remove(student);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Student deleted successfully.", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student {Id}", id);
                return StatusCode(500, new { message = "Error deleting student record", error = ex.Message });
            }
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Id == id);
        }
    }
}
