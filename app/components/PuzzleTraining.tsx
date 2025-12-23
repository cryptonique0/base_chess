import { useState, useEffect } from 'react';
import { useChessPuzzles } from '../hooks/useAdvancedContracts';
import styles from './PuzzleTraining.module.css';

interface Puzzle {
  fen: string;
  solution: string[];
  theme: string;
  difficulty: string;
  rating: number;
}

const THEMES = ['Checkmate', 'Tactics', 'Endgame', 'Opening', 'Middlegame', 'Trapped', 'Fork', 'Pin', 'Skewer', 'Discovery'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

export default function PuzzleTraining() {
  const { puzzleStats, attemptPuzzle } = useChessPuzzles();
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [feedback, setFeedback] = useState<string>('');

  // Mock puzzle for demonstration
  useEffect(() => {
    setCurrentPuzzle({
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -',
      solution: ['f3e5', 'd8g5', 'e5f7'], // Fried Liver Attack setup
      theme: THEMES[1], // Tactics
      difficulty: DIFFICULTIES[1], // Intermediate
      rating: 1500
    });
  }, []);

  const handleMoveInput = (move: string) => {
    const newMoves = [...userMoves, move];
    setUserMoves(newMoves);

    if (currentPuzzle) {
      // Check if move matches solution at this step
      const stepIndex = newMoves.length - 1;
      if (newMoves[stepIndex] === currentPuzzle.solution[stepIndex]) {
        if (newMoves.length === currentPuzzle.solution.length) {
          // Puzzle solved!
          handlePuzzleSolved();
        } else {
          setFeedback('✓ Correct! Continue...');
        }
      } else {
        setFeedback('✗ Incorrect move. Try again!');
        setTimeout(() => {
          setUserMoves([]);
          setFeedback('');
        }, 1500);
      }
    }
  };

  const handlePuzzleSolved = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      if (currentPuzzle) {
        await attemptPuzzle(0, userMoves, timeSpent);
        setFeedback('🎉 Puzzle solved! Great job!');
      }
    } catch (error) {
      console.error('Error submitting puzzle:', error);
    }
  };

  const loadNextPuzzle = () => {
    // In production, this would fetch the next puzzle from the contract
    setUserMoves([]);
    setFeedback('');
    setStartTime(Date.now());
  };

  if (!currentPuzzle) {
    return <div className={styles.loading}>Loading puzzle...</div>;
  }

  return (
    <div className={styles.puzzleTraining}>
      <div className={styles.header}>
        <h1>Puzzle Training</h1>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Rating</span>
            <span className={styles.statValue}>
              {puzzleStats ? Number(puzzleStats[4]) : 1500}
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Solved</span>
            <span className={styles.statValue}>
              {puzzleStats ? Number(puzzleStats[1]) : 0}
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Streak</span>
            <span className={styles.statValue}>
              {puzzleStats ? Number(puzzleStats[2]) : 0}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.puzzleContainer}>
        <div className={styles.puzzleInfo}>
          <div className={styles.infoBadge}>
            <span className={styles.theme}>{currentPuzzle.theme}</span>
            <span className={styles.difficulty}>{currentPuzzle.difficulty}</span>
            <span className={styles.rating}>⚡ {currentPuzzle.rating}</span>
          </div>
          
          <div className={styles.instructions}>
            <h3>Find the best move sequence</h3>
            <p>White to move and win</p>
          </div>
        </div>

        <div className={styles.boardPlaceholder}>
          <div className={styles.fenDisplay}>
            <code>{currentPuzzle.fen}</code>
          </div>
          <p className={styles.note}>
            Chess board visualization would go here
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.moveInput}>
            <input
              type="text"
              placeholder="Enter move (e.g., e2e4)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleMoveInput((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className={styles.input}
            />
            <button className={styles.hintButton}>💡 Hint</button>
          </div>

          {feedback && (
            <div className={`${styles.feedback} ${feedback.includes('✓') ? styles.correct : styles.incorrect}`}>
              {feedback}
            </div>
          )}

          <div className={styles.moveHistory}>
            <strong>Your moves:</strong>
            {userMoves.map((move, i) => (
              <span key={i} className={styles.move}>{move}</span>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.skipButton} onClick={loadNextPuzzle}>
              Skip Puzzle
            </button>
            <button className={styles.nextButton} onClick={loadNextPuzzle}>
              Next Puzzle →
            </button>
          </div>
        </div>
      </div>

      <div className={styles.dailyChallenge}>
        <div className={styles.challengeHeader}>
          <h2>🏆 Daily Challenge</h2>
          <span className={styles.timer}>Time left: 8:42:15</span>
        </div>
        <p>Solve today&apos;s puzzle and compete for rewards!</p>
        <div className={styles.prizePool}>
          Prize Pool: <strong>0.1 ETH</strong>
        </div>
        <button className={styles.challengeButton}>
          Start Daily Challenge
        </button>
      </div>
    </div>
  );
}
