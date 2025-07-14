import React from "react";

// PUBLIC_INTERFACE
export function GameBoard({
  board,
  nextTurn,
  winner,
  currentUserPlayer,
  onCellClick,
  isMyTurn,
  status,
}) {
  if (!board) return null;
  const boardSize = board.length;
  return (
    <div className="game-board-container">
      <table className="game-board">
        <tbody>
          {board.map((row, y) => (
            <tr key={y}>
              {row.map((cell, x) => (
                <td
                  key={x}
                  className={
                    "board-cell" +
                    (cell === "X"
                      ? " cell-x"
                      : cell === "O"
                      ? " cell-o"
                      : " cell-empty")
                  }
                  onClick={() =>
                    isMyTurn && !cell && !winner
                      ? onCellClick(x, y)
                      : undefined
                  }
                  tabIndex={cell || winner ? undefined : 0}
                  aria-label={`Row ${y + 1} Col ${x + 1} ${cell || "empty"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="game-status">
        {winner
          ? winner === "draw"
            ? <b>Draw!</b>
            : <b>Winner: {winner}</b>
          : status === "waiting"
          ? <span>Waiting for an opponent...</span>
          : (
            <span>
              {isMyTurn
                ? "Your turn"
                : `Turn: ${nextTurn === "X" ? "X" : "O"}`}
            </span>
          )}
      </div>
    </div>
  );
}
