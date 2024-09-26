import { useState } from "react";

function Square({ value, onSquareClick, isWinSquare }) {
  return (
    <button
      className={isWinSquare ? "highlightSquare" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  let status;
  const winner = calculateWinner(squares);
  const winnerSquares = winner ? winner : [];
  if (winnerSquares.length > 0) {
    status = "Winner: " + squares[winnerSquares[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winnerSquares.length > 0) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const rows = 3;
  const cols = 3;
  const sq = [];
  for (let row = 0; row < rows; row++) {
    const line = [];
    for (let col = 0; col < cols; col++) {
      let key = row * cols + col;
      line.push(
        <Square
          key={key}
          value={squares[key]}
          onSquareClick={() => handleClick(key)}
          isWinSquare={winnerSquares.includes(key)}
        />
      );
    }
    sq.push(
      <div key={row} className="board-row">
        {line}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {sq}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [asc, setAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  // const currentSquares = history[history.length - 1];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const sortMoves = () => {
    setAsc(!asc);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "go to move #" + move;
    } else {
      description = "go to game start";
    }
    if (currentMove === move) {
      let msg = "You are at move #" + move;
      return <li key={move}>{msg}</li>;
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  const sortedMoves = asc ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button onClick={sortMoves}>
          change to {asc ? "descending" : "ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
