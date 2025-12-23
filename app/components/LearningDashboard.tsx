import { useState, useEffect } from 'react';
import { useChessAcademy } from '../hooks/useAdvancedContracts';
import styles from './LearningDashboard.module.css';

const SKILL_CATEGORIES = [
  'Opening',
  'Middlegame',
  'Endgame',
  'Tactics',
  'Strategy',
  'Calculation'
];

export default function LearningDashboard() {
  const { playerStats, skillLevels, completeLesson, isLoading } = useChessAcademy();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const handleCompleteLesson = async (lessonId: number) => {
    try {
      await completeLesson(lessonId);
      alert('Lesson completed! Skill points earned.');
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Failed to complete lesson');
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1>Chess Academy</h1>
      
      {/* Player Stats */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Games Analyzed</h3>
          <p className={styles.statValue}>
            {playerStats ? Number(playerStats[0]) : 0}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Lessons Completed</h3>
          <p className={styles.statValue}>
            {playerStats ? Number(playerStats[1]) : 0}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Current Streak</h3>
          <p className={styles.statValue}>
            {playerStats ? Number(playerStats[2]) : 0} days
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Longest Streak</h3>
          <p className={styles.statValue}>
            {playerStats ? Number(playerStats[3]) : 0} days
          </p>
        </div>
      </div>

      {/* Skill Levels */}
      <div className={styles.skillsContainer}>
        <h2>Your Skills</h2>
        <div className={styles.skillBars}>
          {SKILL_CATEGORIES.map((category, index) => {
            const level = skillLevels ? Number(skillLevels[index]) : 0;
            const percentage = (level / 1000) * 100;
            
            return (
              <div key={category} className={styles.skillBar}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{category}</span>
                  <span className={styles.skillValue}>{level}/1000</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progress}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Paths */}
      <div className={styles.learningPaths}>
        <h2>Learning Paths</h2>
        <div className={styles.pathsGrid}>
          <div className={styles.pathCard}>
            <h3>🎯 Beginner Fundamentals</h3>
            <p>Master the basics of chess</p>
            <div className={styles.pathMeta}>
              <span>Difficulty: ⭐⭐⭐</span>
              <span>10 hours</span>
            </div>
            <button className={styles.startButton}>
              Start Path
            </button>
          </div>
          
          <div className={styles.pathCard}>
            <h3>⚔️ Tactical Training</h3>
            <p>Sharpen your tactical vision</p>
            <div className={styles.pathMeta}>
              <span>Difficulty: ⭐⭐⭐⭐</span>
              <span>15 hours</span>
            </div>
            <button className={styles.startButton}>
              Start Path
            </button>
          </div>
          
          <div className={styles.pathCard}>
            <h3>👑 Endgame Mastery</h3>
            <p>Learn essential endgame techniques</p>
            <div className={styles.pathMeta}>
              <span>Difficulty: ⭐⭐⭐⭐⭐</span>
              <span>20 hours</span>
            </div>
            <button className={styles.startButton}>
              Start Path
            </button>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className={styles.achievements}>
        <h2>🏆 Achievements</h2>
        <div className={styles.achievementsList}>
          <div className={styles.achievementBadge}>
            <span className={styles.badge}>🎓</span>
            <span>First Steps</span>
          </div>
          <div className={styles.achievementBadge}>
            <span className={styles.badge}>⚡</span>
            <span>Tactical Master</span>
          </div>
          <div className={styles.achievementBadge}>
            <span className={styles.badge}>♔</span>
            <span>Endgame Expert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
