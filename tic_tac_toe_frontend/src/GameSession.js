import React, { useState, useEffect } from "react";
import {
  apiCreateGame,
  apiJoinGame,
  apiGetGame,
  apiSubmitMove,
} from "./api";
import { GameBoard } from "./GameBoard";

// PUBLIC_INTERFACE
export function GameSession({ username }) {
  const [gameState, setGameState] = useState(null);
  const [gameIdInput, setGameIdInput] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);

  // For real-time/game refresh, simple polling
  useEffect(() => {
    let timerId;
    if (gameState && !gameState.winner && gameState.status === "active") {
      timerId = setInterval(() => {
        apiGetGame(gameState.game_id)
          .then(setGameState)
          .catch(() => {});
      }, 2500);
    }
    return () => clearInterval(timerId);
  }, [gameState]);

  // Launch new game
  async function startNewGame() {
    setError(""); setActionLoading(true);
    try {
      const gs = await apiCreateGame();
      setGameState(gs);
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to create game");
    } finally {
      setActionLoading(false);
    }
  }

  // Join existing game
  async function joinExistingGame() {
    setError(""); setActionLoading(true);
    try {
      const gs = await apiJoinGame(gameIdInput.trim());
      setGameState(gs);
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to join game");
    } finally {
      setActionLoading(false);
    }
  }

  // Make move as current user
  async function handleMove(x, y) {
    if (!gameState) return;
    setMoveLoading(true);
    setError("");
    try {
      const newGs = await apiSubmitMove(gameState.game_id, x, y);
      setGameState(newGs);
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed making move");
    } finally {
      setMoveLoading(false);
    }
  }

  // Get symbol for this user (X or O)
  function getMySymbol() {
    if (!gameState) return "?";
    if (gameState.player_x === username) return "X";
    if (gameState.player_o === username) return "O";
    return "?";
  }

  function isMyTurn() {
    const mySymbol = getMySymbol();
    if (!gameState || !mySymbol) return false;
    return (
      !gameState.winner &&
      ((gameState.next_turn === "X" && mySymbol === "X") ||
        (gameState.next_turn === "O" && mySymbol === "O"))
    );
  }

  // Reset back to lobby state
  function leaveGame() {
    setGameState(null);
    setError("");
    setActionLoading(false);
    setMoveLoading(false);
  }

  // If not in game, show menu
  if (!gameState) {
    return (
      <div className="game-menu">
        <button className="btn btn-large" onClick={startNewGame} disabled={actionLoading}>
          {actionLoading ? "Creating..." : "Start New Game"}
        </button>
        <div className="join-game">
          <input
            className="input"
            placeholder="Game ID to join"
            value={gameIdInput}
            onChange={e => setGameIdInput(e.target.value)}
            maxLength={24}
          />
          <button className="btn" onClick={joinExistingGame} disabled={actionLoading}>
            Join Game
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  // In-game board
  return (
    <div className="game-session">
      <div className="top-row">
        <button className="btn" onClick={leaveGame}>Leave Game</button>
        <b>Game ID: {gameState.game_id.slice(0, 8)}</b>
      </div>
      <GameBoard
        board={gameState.board}
        nextTurn={gameState.next_turn}
        winner={gameState.winner}
        currentUserPlayer={getMySymbol()}
        onCellClick={handleMove}
        isMyTurn={isMyTurn()}
        status={gameState.status}
      />
      {moveLoading && <div>Sending move...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
