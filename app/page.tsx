"use client";
import { useState, useEffect, useCallback } from 'react';
import ChessBoard from './components/ChessBoardNew';
import GameControls from './components/GameControls';
import MoveHistory from './components/MoveHistory';
import GameLobbyOnline from './components/GameLobbyOnline';
import OnlineGame from './components/OnlineGame';
import LearningDashboard from './components/LearningDashboard';
import CoachMarketplace from './components/CoachMarketplace';
import PuzzleTraining from './components/PuzzleTraining';
import { 
  createInitialState, 
  makeMove as applyMove, 
  undoMove, 
  GameState, 
  Move,
  GameStatus 
} from './lib/chessEngine';
import { Difficulty } from './lib/genkitChessAI';
import styles from './page.module.css';

type GameMode = 'menu' | 'single-player' | 'multiplayer' | 'online-lobby' | 'online-game' | 'learn' | 'coaches' | 'puzzles';
type ColorChoice = 'white' | 'black' | 'random';

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isPlayerWhite, setIsPlayerWhite] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [onlineGameId, setOnlineGameId] = useState<number | null>(null);

  // Check if it's AI's turn
  const isAITurn = gameMode === 'single-player' && gameState.isWhiteTurn !== isPlayerWhite;
  const isGameOver = gameState.status === GameStatus.Checkmate || 
                     gameState.status === GameStatus.Stalemate || 
                     gameState.status === GameStatus.Draw;

  // AI makes a move using Gemini GenKit
  useEffect(() => {
    if (!isAITurn || isGameOver || isAIThinking) return;

    setIsAIThinking(true);
    
    // Add a small delay to make it feel more natural
    const timer = setTimeout(async () => {
      try {
        // Call the API route to get AI move
        const response = await fetch('/api/ai-move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameState,
            difficulty,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI move');
        }

        const data = await response.json();
        
        if (data.move) {
          const aiMove: Move = {
            from: data.move.from,
            to: data.move.to,
            piece: gameState.board[data.move.from],
            capturedPiece: gameState.board[data.move.to],
          };
          
          console.log('AI reasoning:', data.reasoning);
          
          const newState = applyMove(gameState, aiMove);
          setGameState(newState);
          setLastMove(aiMove);
        }
      } catch (error) {
        console.error('Error getting AI move:', error);
        // Fallback to local AI if API fails
        const { getBestMove } = await import('./lib/chessAI');
        const aiMove = getBestMove(gameState, difficulty);
        if (aiMove) {
          const newState = applyMove(gameState, aiMove);
          setGameState(newState);
          setLastMove(aiMove);
        }
      } finally {
        setIsAIThinking(false);
      }
    }, 300 + Math.random() * 500);

    return () => clearTimeout(timer);
  }, [isAITurn, isGameOver, gameState, difficulty, isAIThinking]);

  const handleMove = useCallback((move: Move) => {
    if (isAIThinking) return;
    
    const newState = applyMove(gameState, move);
    setGameState(newState);
    setLastMove(move);
  }, [gameState, isAIThinking]);

  const handleNewGame = useCallback(() => {
    setGameState(createInitialState());
    setLastMove(null);
    setIsAIThinking(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (gameMode === 'single-player') {
      // Undo both AI and player move
      let newState = undoMove(gameState);
      if (newState.moveHistory.length > 0 && newState.isWhiteTurn !== isPlayerWhite) {
        newState = undoMove(newState);
      }
      setGameState(newState);
      setLastMove(newState.moveHistory[newState.moveHistory.length - 1] || null);
    } else {
      const newState = undoMove(gameState);
      setGameState(newState);
      setLastMove(newState.moveHistory[newState.moveHistory.length - 1] || null);
    }
  }, [gameState, gameMode, isPlayerWhite]);

  const handleFlipBoard = useCallback(() => {
    setBoardFlipped(!boardFlipped);
  }, [boardFlipped]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  const startGame = (mode: GameMode, color: ColorChoice = 'white') => {
    const isWhite = color === 'random' ? Math.random() > 0.5 : color === 'white';
    setIsPlayerWhite(isWhite);
    setBoardFlipped(!isWhite);
    setGameState(createInitialState());
    setLastMove(null);
    setGameMode(mode);
    setIsAIThinking(false);
  };

  const returnToMenu = () => {
    setGameMode('menu');
    setGameState(createInitialState());
    setLastMove(null);
    setIsAIThinking(false);
    setOnlineGameId(null);
  };

  const handleJoinOnlineGame = (gameId: number) => {
    setOnlineGameId(gameId);
    setGameMode('online-game');
  };

  // Render online lobby
  if (gameMode === 'online-lobby') {
    return (
      <GameLobbyOnline 
        onBack={returnToMenu}
        onJoinGame={handleJoinOnlineGame}
      />
    );
  }

  // Render online game
  if (gameMode === 'online-game' && onlineGameId !== null) {
    return (
      <OnlineGame 
        gameId={onlineGameId}
        onBack={() => setGameMode('online-lobby')}
      />
    );
  }

  // Render learning dashboard
  if (gameMode === 'learn') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button className={styles.backBtn} onClick={returnToMenu}>
              ← Menu
            </button>
            <h1 className={styles.logo}>
              <span className={styles.logoIcon}>♟</span>
              Base Chess
            </h1>
          </div>
        </header>
        <LearningDashboard />
      </div>
    );
  }

  // Render coach marketplace
  if (gameMode === 'coaches') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button className={styles.backBtn} onClick={returnToMenu}>
              ← Menu
            </button>
            <h1 className={styles.logo}>
              <span className={styles.logoIcon}>♟</span>
              Base Chess
            </h1>
          </div>
        </header>
        <CoachMarketplace />
      </div>
    );
  }

  // Render puzzle training
  if (gameMode === 'puzzles') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button className={styles.backBtn} onClick={returnToMenu}>
              ← Menu
            </button>
            <h1 className={styles.logo}>
              <span className={styles.logoIcon}>♟</span>
              Base Chess
            </h1>
          </div>
        </header>
        <PuzzleTraining />
      </div>
    );
  }

  // Render menu
  if (gameMode === 'menu') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>
              <span className={styles.logoIcon}>♟</span>
              Base Chess
            </h1>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.menuContainer}>
            <div className={styles.menuTitle}>
              <span className={styles.menuIcon}>♔</span>
              <h2>Play Chess</h2>
              <p className={styles.menuSubtitle}>Choose your game mode</p>
            </div>

            <div className={styles.modeCards}>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>🤖</div>
                <h3>Practice vs AI</h3>
                <p>Sharpen your skills against the computer</p>
                
                <div className={styles.difficultySelect}>
                  <label>Difficulty:</label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className={styles.select}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className={styles.colorChoice}>
                  <button 
                    className={`${styles.colorBtn} ${styles.white}`}
                    onClick={() => startGame('single-player', 'white')}
                  >
                    ♔ Play White
                  </button>
                  <button 
                    className={`${styles.colorBtn} ${styles.black}`}
                    onClick={() => startGame('single-player', 'black')}
                  >
                    ♚ Play Black
                  </button>
                  <button 
                    className={`${styles.colorBtn} ${styles.random}`}
                    onClick={() => startGame('single-player', 'random')}
                  >
                    🎲 Random
                  </button>
                </div>
              </div>

              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>👥</div>
                <h3>Local Two Player</h3>
                <p>Play with a friend on the same device</p>
                
                <button 
                  className={styles.startBtn}
                  onClick={() => startGame('multiplayer', 'white')}
                >
                  Start Game
                </button>
              </div>

              <div className={`${styles.modeCard} ${styles.onlineCard}`}>
                <div className={styles.modeIcon}>🌐</div>
                <h3>Online Play</h3>
                <p>Play on-chain against players worldwide</p>
                <div className={styles.onlineBadge}>
                  <span>⛓️ On Base Network</span>
                </div>
                
                <button 
                  className={styles.startBtn}
                  onClick={() => setGameMode('online-lobby')}
                >
                  Enter Lobby
                </button>
              </div>

              <div className={`${styles.modeCard} ${styles.learningCard}`}>
                <div className={styles.modeIcon}>🎓</div>
                <h3>Learn Chess</h3>
                <p>Track your progress and improve your skills</p>
                <div className={styles.onlineBadge}>
                  <span>⛓️ On-Chain Progress</span>
                </div>
                
                <button 
                  className={styles.startBtn}
                  onClick={() => setGameMode('learn')}
                >
                  Start Learning
                </button>
              </div>

              <div className={`${styles.modeCard} ${styles.coachCard}`}>
                <div className={styles.modeIcon}>👨‍🏫</div>
                <h3>Find a Coach</h3>
                <p>Book sessions with certified chess coaches</p>
                <div className={styles.onlineBadge}>
                  <span>⛓️ Escrow Protected</span>
                </div>
                
                <button 
                  className={styles.startBtn}
                  onClick={() => setGameMode('coaches')}
                >
                  Browse Coaches
                </button>
              </div>

              <div className={`${styles.modeCard} ${styles.puzzleCard}`}>
                <div className={styles.modeIcon}>🧩</div>
                <h3>Solve Puzzles</h3>
                <p>Train tactics and earn rewards</p>
                <div className={styles.onlineBadge}>
                  <span>⛓️ Earn ETH</span>
                </div>
                
                <button 
                  className={styles.startBtn}
                  onClick={() => setGameMode('puzzles')}
                >
                  Start Training
                </button>
              </div>
            </div>

            <div className={styles.features}>
              <h4>Features</h4>
              <ul>
                <li>✓ Full chess rules including castling & en passant</li>
                <li>✓ Pawn promotion</li>
                <li>✓ Legal move highlighting</li>
                <li>✓ Check/checkmate/stalemate detection</li>
                <li>✓ Move history & undo</li>
                <li>✓ Three difficulty levels</li>
                <li>✓ On-chain multiplayer on Base Network</li>
                <li>✓ Wager ETH on games</li>
                <li>✓ Learning paths & achievements</li>
                <li>✓ Certified chess coaches</li>
                <li>✓ Puzzle training with rewards</li>
              </ul>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Powered by Base Network • On-chain Chess
          </p>
        </footer>
      </div>
    );
  }

  // Render game
  const displayAsWhite = boardFlipped ? !isPlayerWhite : isPlayerWhite;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backBtn} onClick={returnToMenu}>
            ← Menu
          </button>
          <h1 className={styles.logo}>
            <span className={styles.logoIcon}>♟</span>
            Base Chess
          </h1>
          <div className={styles.modeTag}>
            {gameMode === 'single-player' ? '🤖 vs AI' : '👥 2 Players'}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.gameLayout}>
          <div className={styles.boardSection}>
            {isAIThinking && (
              <div className={styles.thinkingIndicator}>
                <span className={styles.spinner}></span>
                AI is thinking...
              </div>
            )}
            
            <ChessBoard
              gameState={gameState}
              onMove={handleMove}
              isPlayerWhite={gameMode === 'multiplayer' ? gameState.isWhiteTurn : displayAsWhite}
              disabled={isAIThinking || isAITurn}
              lastMove={lastMove}
              highlightLegalMoves={true}
            />
          </div>

          <div className={styles.sidePanel}>
            <GameControls
              gameState={gameState}
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              onFlipBoard={handleFlipBoard}
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              isPlayerWhite={displayAsWhite}
              isSinglePlayer={gameMode === 'single-player'}
              canUndo={gameState.moveHistory.length > 0}
            />

            <MoveHistory gameState={gameState} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by Base Network • On-chain Chess
        </p>
      </footer>
    </div>
  );
}
