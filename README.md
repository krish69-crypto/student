# Student Management System

A fullstack **Student Management System** consisting of a **.NET 9 Web API** backend connected to SQL Server (`Nakshatra` database) and a **React (Vite + Tailwind CSS)** frontend.

---

## 📁 Project Structure

```
student management/
├── Controllers/                 # .NET Web API Controllers
│   └── StudentsController.cs    # Full CRUD API (/api/students)
├── Models/                      # Entity Models
│   └── Student.cs               # Student Schema & Validations
├── Data/                        # EF Core DbContext
│   └── AppDbContext.cs          # SQL Server DbContext
├── appsettings.json             # DB Connection String
├── Program.cs                   # App startup & Middleware
│
├── frontend/                    # ⚛️ React (Vite + Tailwind CSS) App
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentModal.jsx # Add & Edit Modal Dialog
│   │   │   └── StudentTable.jsx # Responsive Data Table
│   │   ├── services/
│   │   │   └── api.js           # Axios API Client
│   │   ├── App.jsx              # Main Dashboard Screen
│   │   └── main.jsx
│   └── package.json
│
└── wwwroot/                     # Built-in standalone fallback UI
```

---

## 🗄️ Database Configuration

In [appsettings.json](file:///e:/Aniket/student%20managemaent/appsettings.json):
```json
"ConnectionStrings": {
  "ConStr": "Server=ANIKET-PC\\SQLEXPRESS;Database=Nakshatra;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
*The database table `Students` is automatically created on startup via `EnsureCreated()`.*

---

## 🚀 How to Run

### 1. Start the .NET 9 Web API Backend
Open PowerShell / Terminal in the root folder:
```bash
dotnet run
```
- API will start at: `http://localhost:5252`
- Swagger Documentation: [http://localhost:5252/swagger](http://localhost:5252/swagger)

### 2. Start the React Frontend
Open a new terminal in the `frontend/` folder:
```bash
cd frontend
npm run dev
```
- React Application: [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (supports `?search=keyword`) |
| `GET` | `/api/students/{id}` | Get student details by ID |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/{id}` | Update existing student |
| `DELETE` | `/api/students/{id}` | Delete student |
