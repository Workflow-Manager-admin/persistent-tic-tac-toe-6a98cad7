import React, { useEffect, useState } from "react";
import { apiLeaderboard } from "./api";

// PUBLIC_INTERFACE
export function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    apiLeaderboard()
      .then(setEntries)
      .catch((e) => setError("Failed to load leaderboard"));
  }, []);
  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      {error && <div className="error">{error}</div>}
      <ol>
        {entries.map((entry, i) => (
          <li key={entry.username}>
            <span className="leaderboard-user">{entry.username}</span>
            <span className="leaderboard-wins">{entry.wins} win{entry.wins !== 1 ? "s" : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
