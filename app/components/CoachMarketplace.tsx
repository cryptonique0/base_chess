import { useState } from 'react';
import { useChessCoach } from '../hooks/useAdvancedContracts';
import styles from './CoachMarketplace.module.css';

interface Coach {
  address: `0x${string}`;
  name: string;
  bio: string;
  hourlyRate: bigint;
  rating: number;
  totalSessions: number;
  specialties: string[];
}

export default function CoachMarketplace() {
  const { bookSession, isLoading } = useChessCoach();
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionDate, setSessionDate] = useState('');

  const mockCoaches: Coach[] = [
    {
      address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      name: 'GM Sarah Chen',
      bio: 'Grandmaster with 15 years of coaching experience',
      hourlyRate: BigInt('50000000000000000'), // 0.05 ETH
      rating: 485, // 4.85 stars
      totalSessions: 127,
      specialties: ['Opening Theory', 'Tournament Preparation']
    },
    {
      address: '0x2345678901234567890123456789012345678901' as `0x${string}`,
      name: 'IM David Torres',
      bio: 'International Master specializing in tactical training',
      hourlyRate: BigInt('30000000000000000'), // 0.03 ETH
      rating: 470, // 4.70 stars
      totalSessions: 89,
      specialties: ['Tactical Training', 'Blitz & Rapid']
    },
    {
      address: '0x3456789012345678901234567890123456789012' as `0x${string}`,
      name: 'FM Elena Petrov',
      bio: 'FIDE Master focused on endgame technique',
      hourlyRate: BigInt('25000000000000000'), // 0.025 ETH
      rating: 460, // 4.60 stars
      totalSessions: 64,
      specialties: ['Endgame Technique', 'Positional Play']
    }
  ];

  const handleBookSession = async (coachAddress: `0x${string}`, hourlyRate: bigint) => {
    if (!sessionDate) {
      alert('Please select a date and time');
      return;
    }

    try {
      const scheduledTime = new Date(sessionDate).getTime() / 1000;
      const price = (hourlyRate * BigInt(sessionDuration)) / BigInt(60);
      
      await bookSession(coachAddress, 0, scheduledTime, sessionDuration, price);
      alert('Session booked successfully!');
      setSelectedCoach(null);
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session');
    }
  };

  const renderStars = (rating: number) => {
    const stars = rating / 100;
    return '⭐'.repeat(Math.floor(stars)) + (stars % 1 >= 0.5 ? '½' : '');
  };

  return (
    <div className={styles.marketplace}>
      <h1>Find Your Chess Coach</h1>
      
      <div className={styles.filters}>
        <select className={styles.filterSelect}>
          <option>All Specialties</option>
          <option>Opening Theory</option>
          <option>Tactical Training</option>
          <option>Endgame Technique</option>
          <option>Tournament Preparation</option>
        </select>
        
        <select className={styles.filterSelect}>
          <option>All Ratings</option>
          <option>4+ Stars</option>
          <option>4.5+ Stars</option>
        </select>
        
        <select className={styles.filterSelect}>
          <option>Price: Any</option>
          <option>Under 0.03 ETH/hr</option>
          <option>Under 0.05 ETH/hr</option>
        </select>
      </div>

      <div className={styles.coachGrid}>
        {mockCoaches.map((coach) => (
          <div key={coach.address} className={styles.coachCard}>
            <div className={styles.coachAvatar}>
              {coach.name[0]}
            </div>
            
            <div className={styles.coachInfo}>
              <h3>{coach.name}</h3>
              <div className={styles.rating}>
                {renderStars(coach.rating)} ({(coach.rating / 100).toFixed(2)})
              </div>
              <p className={styles.bio}>{coach.bio}</p>
              
              <div className={styles.specialties}>
                {coach.specialties.map((specialty, i) => (
                  <span key={i} className={styles.specialtyTag}>
                    {specialty}
                  </span>
                ))}
              </div>
              
              <div className={styles.coachStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Sessions</span>
                  <span className={styles.statValue}>{coach.totalSessions}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Rate</span>
                  <span className={styles.statValue}>
                    {(Number(coach.hourlyRate) / 1e18).toFixed(3)} ETH/hr
                  </span>
                </div>
              </div>
              
              <button
                className={styles.bookButton}
                onClick={() => setSelectedCoach(coach.address)}
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedCoach && (
        <div className={styles.modal} onClick={() => setSelectedCoach(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Book Coaching Session</h2>
            
            <div className={styles.formGroup}>
              <label>Duration (minutes)</label>
              <select 
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className={styles.input}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className={styles.input}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            <div className={styles.priceInfo}>
              <span>Total Price:</span>
              <span className={styles.price}>
                {selectedCoach && mockCoaches.find(c => c.address === selectedCoach) 
                  ? ((Number(mockCoaches.find(c => c.address === selectedCoach)!.hourlyRate) / 1e18) * sessionDuration / 60).toFixed(4)
                  : '0'} ETH
              </span>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setSelectedCoach(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  const coach = mockCoaches.find(c => c.address === selectedCoach);
                  if (coach) handleBookSession(coach.address, coach.hourlyRate);
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
