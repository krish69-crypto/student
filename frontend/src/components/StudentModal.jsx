import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, BookOpen, Calendar, X, Check, Hash } from 'lucide-react';

export default function StudentModal({ isOpen, onClose, onSave, student = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    age: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        course: student.course || '',
        age: student.age || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        age: '',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: student ? student.id : 0,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      course: formData.course.trim() || null,
      age: formData.age ? parseInt(formData.age, 10) : null,
    });
  };

  const isEdit = Boolean(student && student.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transform transition-all animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`h-9 w-9 rounded-xl ${isEdit ? 'bg-indigo-100 text-indigo-600' : 'bg-brand-100 text-brand-600'} flex items-center justify-center font-bold text-sm`}>
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isEdit ? 'Edit Student Details' : 'Add New Student'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit ? `Updating record for #${student.id}` : 'Fill in the details to register student'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <User size={15} />
              </span>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition text-slate-800 ${
                  errors.name ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="e.g. alex.j@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition text-slate-800 ${
                  errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Phone size={15} />
                </span>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Age
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Hash size={15} />
                </span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 21"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition text-slate-800 ${
                    errors.age ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                  }`}
                />
              </div>
              {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Course / Department */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Course / Department
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <BookOpen size={15} />
              </span>
              <input
                type="text"
                placeholder="e.g. Computer Science, Information Technology, MBA"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition text-slate-800"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-5 py-2 rounded-xl shadow-sm shadow-brand-600/30 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEdit ? 'Update Student' : 'Save Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
