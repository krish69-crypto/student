using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StudentManagement.Data;
using StudentManagement.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure SQL Server Database Connection
var connectionString = builder.Configuration.GetConnectionString("ConStr");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Student Management System API",
        Version = "v1",
        Description = "RESTful APIs for managing student records with CRUD operations."
    });
});

var app = builder.Build();

// Ensure database table and sample records exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        const string createTableSql = @"
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'Students')
            BEGIN
                CREATE TABLE [dbo].[Students] (
                    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    [Name] NVARCHAR(100) NOT NULL,
                    [Email] NVARCHAR(100) NOT NULL,
                    [Phone] NVARCHAR(20) NULL,
                    [Course] NVARCHAR(100) NULL,
                    [Age] INT NULL,
                    [EnrollmentDate] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
                );
            END";

        context.Database.ExecuteSqlRaw(createTableSql);

        if (!context.Students.Any())
        {
            context.Students.AddRange(
                new Student
                {
                    Name = "Rahul Sharma",
                    Email = "rahul.sharma@example.com",
                    Phone = "+91 9876543210",
                    Course = "Computer Science",
                    Age = 21,
                    EnrollmentDate = DateTime.UtcNow.AddMonths(-3)
                },
                new Student
                {
                    Name = "Priya Patel",
                    Email = "priya.patel@example.com",
                    Phone = "+91 9123456780",
                    Course = "Information Technology",
                    Age = 22,
                    EnrollmentDate = DateTime.UtcNow.AddMonths(-2)
                },
                new Student
                {
                    Name = "Ananya Verma",
                    Email = "ananya.verma@example.com",
                    Phone = "+91 9988776655",
                    Course = "Data Science",
                    Age = 20,
                    EnrollmentDate = DateTime.UtcNow.AddMonths(-1)
                }
            );
            context.SaveChanges();
            logger.LogInformation("Database verified and seeded.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error while ensuring Students table exists.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Enable Swagger and Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Student Management API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "Student Management API Documentation";
});

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

// Map API Controllers
app.MapControllers();

// Enable static files
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
