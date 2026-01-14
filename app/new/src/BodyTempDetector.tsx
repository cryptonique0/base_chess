import React, { useState } from 'react';
import './BodyTempDetector.css';

function BodyTempDetector() {
  const [temp, setTemp] = useState('');
  const [result, setResult] = useState('');

  const checkTemp = () => {
    const value = parseFloat(temp);
    if (isNaN(value)) {
      setResult('Please enter a valid temperature.');
      return;
    }
    if (value >= 38) {
      setResult('Warning: High temperature detected! (Possible fever)');
    } else if (value < 35) {
      setResult('Warning: Temperature is too low!');
    } else {
      setResult('Temperature is normal.');
    }
  };

  return (
    <div className="body-temp-detector">
      <h2>Body Temperature Detector</h2>
      <div className="input-section">
        <label>Enter Body Temperature (°C):</label>
        <input
          type="number"
          value={temp}
          onChange={e => setTemp(e.target.value)}
          placeholder="e.g. 36.5"
        />
        <button onClick={checkTemp}>Check</button>
      </div>
      {result && <div className="result-section">{result}</div>}
    </div>
  );
}

export default BodyTempDetector;
