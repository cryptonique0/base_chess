import React, { useState } from 'react';
import './AdvancedEduApp.css';

const topics = [
  {
    subject: 'Mathematics',
    lessons: [
      {
        title: 'Linear Algebra',
        content: 'Covers vector spaces, matrices, determinants, eigenvalues, and eigenvectors.'
      },
      {
        title: 'Calculus',
        content: 'Differentiation, integration, multivariable calculus, and series.'
      },
      {
        title: 'Complex Analysis',
        content: 'Analytic functions, Cauchy-Riemann equations, contour integration.'
      }
    ]
  },
  {
    subject: 'Physics',
    lessons: [
      {
        title: 'Quantum Mechanics',
        content: 'Wave-particle duality, Schrödinger equation, operators, and uncertainty principle.'
      },
      {
        title: 'Electromagnetism',
        content: 'Maxwell’s equations, electromagnetic waves, and applications.'
      },
      {
        title: 'Thermodynamics',
        content: 'Laws of thermodynamics, entropy, and statistical mechanics.'
      }
    ]
  },
  {
    subject: 'Engineering Materials',
    lessons: [
      {
        title: 'Material Properties',
        content: 'Mechanical, thermal, electrical, and magnetic properties of materials.'
      },
      {
        title: 'Metals and Alloys',
        content: 'Structure, strengthening mechanisms, and phase diagrams.'
      },
      {
        title: 'Polymers and Ceramics',
        content: 'Types, properties, and applications in engineering.'
      }
    ]
  }
];

function AdvancedEduApp() {
  const [selectedSubject, setSelectedSubject] = useState(topics[0].subject);
  const [selectedLesson, setSelectedLesson] = useState(0);

  const subject = topics.find(t => t.subject === selectedSubject)!;
  const lesson = subject.lessons[selectedLesson];

  return (
    <div className="advanced-edu-app">
      <h2>Advanced University Education</h2>
      <div className="subject-select">
        <label>Subject:</label>
        <select value={selectedSubject} onChange={e => {
          setSelectedSubject(e.target.value);
          setSelectedLesson(0);
        }}>
          {topics.map(t => (
            <option key={t.subject} value={t.subject}>{t.subject}</option>
          ))}
        </select>
      </div>
      <div className="lesson-select">
        <label>Lesson:</label>
        <select value={selectedLesson} onChange={e => setSelectedLesson(Number(e.target.value))}>
          {subject.lessons.map((l, idx) => (
            <option key={l.title} value={idx}>{l.title}</option>
          ))}
        </select>
      </div>
      <div className="lesson-content">
        <h3>{lesson.title}</h3>
        <p>{lesson.content}</p>
      </div>
    </div>
  );
}

export default AdvancedEduApp;
