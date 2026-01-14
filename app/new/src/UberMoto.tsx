import React, { useState } from 'react';
import './UberMoto.css';

interface RideRequest {
  id: number;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'completed';
}

let rideId = 1;

function UberMoto() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rides, setRides] = useState<RideRequest[]>([]);

  const requestRide = () => {
    if (!pickup || !dropoff) return;
    setRides([
      ...rides,
      { id: rideId++, pickup, dropoff, status: 'pending' }
    ]);
    setPickup('');
    setDropoff('');
  };

  const acceptRide = (id: number) => {
    setRides(rides.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };

  const completeRide = (id: number) => {
    setRides(rides.map(r => r.id === id ? { ...r, status: 'completed' } : r));
  };

  return (
    <div className="ubermoto-app">
      <h2>UberMoto - Motorcycle Ride Booking</h2>
      <div className="ride-form">
        <input
          type="text"
          placeholder="Pickup location"
          value={pickup}
          onChange={e => setPickup(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dropoff location"
          value={dropoff}
          onChange={e => setDropoff(e.target.value)}
        />
        <button onClick={requestRide}>Request Ride</button>
      </div>
      <div className="rides-list">
        <h3>Ride Requests</h3>
        {rides.length === 0 && <p>No rides requested yet.</p>}
        {rides.map(ride => (
          <div key={ride.id} className={`ride ${ride.status}`}>
            <span>From: {ride.pickup} → To: {ride.dropoff}</span>
            <span>Status: {ride.status}</span>
            {ride.status === 'pending' && (
              <button onClick={() => acceptRide(ride.id)}>Accept</button>
            )}
            {ride.status === 'accepted' && (
              <button onClick={() => completeRide(ride.id)}>Complete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UberMoto;
