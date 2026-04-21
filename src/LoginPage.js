import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = username.trim().toLowerCase();
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3001/users/${id}`);
      if (res.status === 404) {
        await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, wins: 0 }),
        });
        onLogin(id, 0);
      } else {
        const data = await res.json();
        onLogin(id, parseInt(data.wins?.N || '0'));
      }
    } catch {
      setError('Could not connect to server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Hang 'em</h1>
      <h2>Enter your username to play</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Play'}
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default LoginPage;
