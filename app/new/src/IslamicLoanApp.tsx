import React, { useState } from 'react';
import './IslamicLoanApp.css';

interface LoanRequest {
  id: number;
  name: string;
  amount: number;
  guarantor: string;
  status: 'pending' | 'approved' | 'rejected';
}

function IslamicLoanApp() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [guarantor, setGuarantor] = useState('');
  const [requests, setRequests] = useState<LoanRequest[]>([]);

  const prominentLeaders = [
    'Imam Musa',
    'Sheikh Abdullahi',
    'Mallam Sani',
    'Alhaji Umar',
    'Hajia Fatima'
  ];

  const submitRequest = () => {
    if (!name.trim() || amount <= 0 || !guarantor.trim()) return;
    setRequests([
      ...requests,
      {
        id: requests.length + 1,
        name,
        amount,
        guarantor,
        status: 'pending'
      }
    ]);
    setName('');
    setAmount(0);
    setGuarantor('');
  };

  const approveRequest = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const rejectRequest = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div className="islamic-loan-app">
      <h2>Islamic Loan (No Interest)</h2>
      <div className="loan-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Loan Amount (₦)"
          value={amount > 0 ? amount : ''}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <select value={guarantor} onChange={e => setGuarantor(e.target.value)}>
          <option value="">Select Prominent Leader (Guarantor)</option>
          {prominentLeaders.map(leader => (
            <option key={leader} value={leader}>{leader}</option>
          ))}
        </select>
        <button onClick={submitRequest}>Request Loan</button>
      </div>
      <div className="requests-list">
        <h3>Loan Requests</h3>
        {requests.length === 0 && <p>No requests yet.</p>}
        {requests.map(req => (
          <div key={req.id} className={`request ${req.status}`}>
            <span>{req.name} requests ₦{req.amount.toLocaleString()} (Guarantor: {req.guarantor})</span>
            <span>Status: {req.status}</span>
            {req.status === 'pending' && (
              <>
                <button onClick={() => approveRequest(req.id)}>Approve</button>
                <button onClick={() => rejectRequest(req.id)}>Reject</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default IslamicLoanApp;
