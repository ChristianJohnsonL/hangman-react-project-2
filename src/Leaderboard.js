const DUMMY_PLAYERS = [
  { id: 'hangmaster', wins: 42 },
  { id: 'wordwizard', wins: 31 },
  { id: 'guessking', wins: 27 },
  { id: 'letterlord', wins: 19 },
  { id: 'noobie', wins: 3 },
];

function Leaderboard({ username, userWins, onPlayAgain }) {
  const all = [
    ...DUMMY_PLAYERS.filter((p) => p.id !== username),
    { id: username, wins: userWins },
  ].sort((a, b) => b.wins - a.wins);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {all.map((player, i) => (
            <tr key={player.id} className={player.id === username ? 'leaderboard-me' : ''}>
              <td>{i + 1}</td>
              <td>{player.id === username ? `${player.id} (you)` : player.id}</td>
              <td>{player.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="leaderboard-btn" onClick={onPlayAgain}>Play Again</button>
    </div>
  );
}

export default Leaderboard;
