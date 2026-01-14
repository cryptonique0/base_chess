import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import './UnzipperApp.css';

function UnzipperApp() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFileNames([]);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip')) {
      setError('Please select a .zip file.');
      return;
    }
    try {
      const zip = await JSZip.loadAsync(file);
      const names = Object.keys(zip.files);
      setFileNames(names);
    } catch {
      setError('Failed to unzip file.');
    }
  };

  return (
    <div className="unzipper-app">
      <h2>Automatic Unzipper</h2>
      <input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {error && <div className="error">{error}</div>}
      <div className="unzipped-list">
        <h3>Files in Zip</h3>
        {fileNames.length === 0 && <p>No files extracted yet.</p>}
        <ul>
          {fileNames.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UnzipperApp;
