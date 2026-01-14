import React, { useState } from 'react';
// ...existing code...
import { useNotification } from './NotificationContext';
import './AdmittedStudents.css';

interface Student {
  id: number;
  name: string;
  department: string;
}

function AdmittedStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const { showNotification } = useNotification();

  const addStudent = () => {
    if (!name.trim() || !department.trim()) return;
    setStudents([
      ...students,
      { id: students.length + 1, name, department }
    ]);
    setName('');
    setDepartment('');
    showNotification(`${name} admitted to ${department}!`);
  };

  return (
    <div className="admitted-students">
      <h2>Admitted Students List</h2>
      <div className="student-form">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={e => setDepartment(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <div className="students-list">
        <h3>Recently Admitted</h3>
        {students.length === 0 && <p>No students added yet.</p>}
        <ul>
          {students.map(student => (
            <li key={student.id}>{student.name} - {student.department}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdmittedStudents;
