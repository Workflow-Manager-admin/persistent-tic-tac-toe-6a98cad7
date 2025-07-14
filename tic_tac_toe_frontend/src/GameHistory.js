import React, { useEffect, useState } from "react";
import { apiHistory } from "./api";

// PUBLIC_INTERFACE
export function GameHistory() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    apiHistory()
      .then(setGames)
      .catch(() => setError("Could not load your history"));
  }, []);
  return (
    <div className="history-block">
      <h3>Recent Games</h3>
      {error && <div className="error">{error}</div>}
      <ul>
        {games.map((g) => (
          <li key={g.game_id}>
            <span>Game <b>{g.game_id.slice(0, 6)}</b>, as {g.as_player}, Opponent: {g.opponent || "?"}, Result: <b>{g.result || "?"}</b></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
