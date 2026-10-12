import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  RotateCw, 
  Users, 
  BookOpen, 
  Layers, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { studentApi } from './services/api';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch Students
  const fetchStudents = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await studentApi.getAll();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect to backend API';
      setApiError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.course && s.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.phone && s.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCourse =
        selectedCourse === 'ALL' ||
        (selectedCourse === 'UNCATEGORIZED' && !s.course) ||
        (s.course && s.course.toLowerCase() === selectedCourse.toLowerCase());

      return matchSearch && matchCourse;
    });
  }, [students, searchQuery, selectedCourse]);

  // Unique Courses for Filter Dropdown
  const courseList = useMemo(() => {
    const list = students
      .map((s) => s.course?.trim())
      .filter((c) => Boolean(c));
    return Array.from(new Set(list));
  }, [students]);

  // Handle Add Click
  const handleAddClick = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // Handle Edit Click
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // Handle Save Student (Create or Update)
  const handleSaveStudent = async (studentData) => {
    setIsSaving(true);
    try {
      if (studentData.id > 0) {
        await studentApi.update(studentData.id, studentData);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Student updated successfully!',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      } else {
        await studentApi.create(studentData);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Student added successfully!',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }

      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      const errMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Failed to save student record');

      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: errMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (student) => {
    Swal.fire({
      title: 'Delete Student?',
      text: `Are you sure you want to delete "${student.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await studentApi.delete(student.id);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Student deleted successfully.',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
          fetchStudents();
        } catch (err) {
          console.error('Error deleting student:', err);
          const errMsg = err.response?.data?.message || 'Failed to delete student.';
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errMsg,
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Student Management
              </h1>
              <p className="text-xs text-slate-500">React + .NET 9 Web API Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
              <Users size={13} />
              <span>{students.length} Registered</span>
            </span>

            <a
              href="http://localhost:5252/swagger"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              <span>Swagger API</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Backend Error Banner if any */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start justify-between gap-3 text-red-700">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold">Backend Connection Issue</h4>
                <p className="text-xs text-red-600 mt-0.5">{apiError}</p>
                <p className="text-xs text-slate-500 mt-1">Make sure the .NET backend is running on <code className="bg-red-100 px-1 py-0.5 rounded font-mono">http://localhost:5252</code>.</p>
              </div>
            </div>
            <button
              onClick={fetchStudents}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</p>
              <h3 className="text-xl font-bold text-slate-800">{students.length}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Courses</p>
              <h3 className="text-xl font-bold text-slate-800">{courseList.length}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtered Count</p>
              <h3 className="text-xl font-bold text-slate-800">{filteredStudents.length}</h3>
            </div>
          </div>
        </div>

        {/* Actions & Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Left: Add Student Button */}
            <div>
              <button
                onClick={handleAddClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-brand-600/30 transition cursor-pointer"
              >
                <Plus size={18} />
                <span>Add New Student</span>
              </button>
            </div>

            {/* Right: Search, Filter, Refresh */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1 md:max-w-xl">
              
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search student, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-800 placeholder-slate-400 transition"
                />
              </div>

              {/* Course Filter Dropdown */}
              {courseList.length > 0 && (
                <div className="relative min-w-[140px]">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-700 transition appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Courses</option>
                    {courseList.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <Filter size={13} />
                  </span>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={fetchStudents}
                title="Refresh Students"
                className="p-2.5 rounded-xl text-slate-500 hover:text-brand-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Student List Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Student Directory</h2>
            <span className="text-xs text-slate-400">
              Showing {filteredStudents.length} of {students.length}
            </span>
          </div>

          <StudentTable
            students={filteredStudents}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isLoading={loading}
            onAddFirst={handleAddClick}
          />
        </div>
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
        isLoading={isSaving}
      />
    </div>
  );
}
