import Header from './Header.js';
import Word from './WordGeneration.js';
import LoginPage from './LoginPage.js';
import Leaderboard from './Leaderboard.js';
import './App.css';
import { useEffect, useRef, useState } from 'react';

const MAX_WRONG = 6;


function Keyboard({ onGuess, guessed, disabled }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="keyboard">
      {letters.map((letter) => {
        const isGuessed = guessed.has(letter);
        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isGuessed}
            className={`key ${isGuessed ? "key-guessed" : ""}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}


function HangMan({ wrongGuesses }) {
  const images = ["/0.png", "/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png"];
  return (
    <img src={images[wrongGuesses]} alt={`Hangman stage ${wrongGuesses}`} style={{ width: "400px" }} />
  );
}


function App() {
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('');
  const [userWins, setUserWins] = useState(0);

  const [secretWord, setSecretWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [loading, setLoading] = useState(false);
  const winRecorded = useRef(false);

  const fetchWord = async () => {
    try {
      setLoading(true);
      const word = await Word();
      setSecretWord(word);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
    } catch (err) {
      console.error("Error fetching word:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 'game') fetchWord();
  }, [page]);

  const hasWord = secretWord.length > 0;
  const isWinner =
    hasWord && secretWord.split("").every((letter) => guessedLetters.has(letter));
  const isLoser = wrongGuesses >= MAX_WRONG;
  const gameOver = isWinner || isLoser;

  useEffect(() => {
    if (isWinner && !winRecorded.current && username) {
      winRecorded.current = true;
      fetch(`http://localhost:3001/users/${username}`, { method: 'PATCH' })
        .then(() => setUserWins((prev) => prev + 1))
        .catch(console.error);
    }
  }, [isWinner, username]);

  const displayWord = hasWord
    ? secretWord.split("").map((l) => (guessedLetters.has(l) ? l : "_")).join(" ")
    : "";

  const handleGuess = (rawLetter) => {
    if (gameOver || !hasWord) return;
    const letter = rawLetter.toUpperCase();
    if (!/[A-Z]/.test(letter)) return;
    if (guessedLetters.has(letter)) return;

    setGuessedLetters((prev) => {
      const next = new Set(prev);
      next.add(letter);
      return next;
    });

    if (!secretWord.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (letter.length === 1 && /[A-Z]/.test(letter)) handleGuess(letter);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretWord, guessedLetters, wrongGuesses, gameOver]);

  const handleLogin = (id, wins) => {
    setUsername(id);
    setUserWins(wins);
    setPage('game');
  };

  const handlePlayAgain = () => {
    winRecorded.current = false;
    setPage('login');
  };

  if (page === 'login') return <LoginPage onLogin={handleLogin} />;

  if (page === 'leaderboard') {
    return <Leaderboard username={username} userWins={userWins} onPlayAgain={handlePlayAgain} />;
  }

  if (loading && !hasWord) {
    return (
      <div className="App">
        <Header username={username} />
        <p>Loading word...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header username={username} />
      <HangMan wrongGuesses={wrongGuesses} />
      <p className="word">{displayWord}</p>
      {isWinner && <p className="status win">You won! 🎉</p>}
      {isLoser && (
        <p className="status lose">
          You lost. The word was <strong>{secretWord}</strong>.
        </p>
      )}
      {gameOver && (
        <button className="leaderboard-btn" onClick={() => setPage('leaderboard')}>
          See Leaderboard
        </button>
      )}
      <Keyboard onGuess={handleGuess} guessed={guessedLetters} disabled={gameOver} />
    </div>
  );
}

export default App;
