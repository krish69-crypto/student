import React from 'react';
import { Edit2, Trash2, Phone, Mail, GraduationCap, Calendar, UserX } from 'lucide-react';

export default function StudentTable({ students, onEdit, onDelete, isLoading, onAddFirst }) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-slate-600">Loading student records...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="h-16 w-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          <GraduationCap size={32} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No Students Found</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">
          No records match your search or no students have been registered yet.
        </p>
        <button
          onClick={onAddFirst}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition"
        >
          Add New Student
        </button>
      </div>
    );
  }

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
            <th className="py-3.5 px-6"># ID</th>
            <th className="py-3.5 px-6">Student Info</th>
            <th className="py-3.5 px-6">Phone</th>
            <th className="py-3.5 px-6">Course / Dept</th>
            <th className="py-3.5 px-6">Age</th>
            <th className="py-3.5 px-6">Enrollment Date</th>
            <th className="py-3.5 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {students.map((student) => {
            const initials = student.name
              ? student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'ST';
            const colorClass = avatarColors[student.id % avatarColors.length];

            const formattedDate = student.enrollmentDate
              ? new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '—';

            return (
              <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-6 font-mono text-xs text-slate-400 font-semibold">
                  #{student.id}
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-full ${colorClass} font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={12} /> {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6">
                  {student.phone ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone size={12} className="text-slate-400" />
                      {student.phone}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="py-3.5 px-6">
                  {student.course ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {student.course}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="py-3.5 px-6 text-slate-600 font-medium">
                  {student.age || <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="py-3.5 px-6 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    {formattedDate}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      title="Delete Student"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
