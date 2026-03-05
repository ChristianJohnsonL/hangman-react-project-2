import Header from './Header.js';
import Word from './WordGeneration.js';
import './App.css';
import { useEffect, useState } from 'react';

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


function HangMan({ wrongGuesses })
{
  const images = ["/0.png", "/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png"];
  
  return (
    <img src = {images[wrongGuesses]} alt={`Hangman stage ${wrongGuesses}`} style={{ width: "400px"}}/>
  );
}


function App() {
  const [secretWord, setSecretWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [loading, setLoading] = useState(true);

  // load initial word
  useEffect(() => {
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

    fetchWord();
  }, []);

  const hasWord = secretWord.length > 0;
  const isWinner =
    hasWord && secretWord.split("").every((letter) => guessedLetters.has(letter));
  const isLoser = wrongGuesses >= MAX_WRONG;
  const gameOver = isWinner || isLoser;

  const displayWord = hasWord
    ? secretWord
        .split("")
        .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
        .join(" ")
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

  const resetGame = async () => {
    try {
      setLoading(true);
      const word = await Word();
      setSecretWord(word);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
    } catch (err) {
      console.error("Error fetching new word:", err);
    } finally {
      setLoading(false);
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (letter.length === 1 && /[A-Z]/.test(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretWord, guessedLetters, wrongGuesses, gameOver]); // fine for now

  if (loading && !hasWord) {
    return (
      <div className="App">
        <Header />
        <p>Loading word...</p>
      </div>
    );
  }

  console.log("secretWord:", secretWord);
console.log("displayWord:", displayWord);

  return (
    <div className="App">
      <Header />
      <HangMan wrongGuesses = {wrongGuesses}/>
      <p className="word">{displayWord}</p>
      {isWinner && <p className="status win">You won! 🎉</p>}
      {isLoser && (
        <p className="status lose">
          You lost. The word was <strong>{secretWord}</strong>.
        </p>
      )}

      <Keyboard onGuess={handleGuess} guessed={guessedLetters} disabled={gameOver} />

    </div>
  );
}

export default App;
