import React, { useRef, useState } from 'react';
import { useNotification } from './NotificationContext';
import './VideoCallApp.css';

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [screenStream, setScreenStream] = useState<MediaStream|null>(null);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  // Start webcam
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      setError('Could not access camera/mic.');
      showNotification('Could not access camera/mic.');
    }
  };

  // Start screen share
  const startScreenShare = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      setError('Could not share screen.');
      showNotification('Could not share screen.');
    }
  };

  // Stop all streams
  const stopStreams = () => {
    setError('');
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
  };

  return (
    <div className="video-call-app">
      <h2>Video Call & Screen Share</h2>
      <div className="controls">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={startScreenShare}>Share Screen</button>
        <button onClick={stopStreams}>Stop</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="video-section">
        <video ref={localVideoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 400, borderRadius: 8, background: '#000' }} />
      </div>
      <div className="external-app-info">
        <p>To allow external app view, share your screen and select the app window you want to share.</p>
      </div>
    </div>
  );
}

export default VideoCallApp;
