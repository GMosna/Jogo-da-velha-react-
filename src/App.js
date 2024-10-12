import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick} disabled={!!value}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, gameOver }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || gameOver) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Ganhador:  ${winner}`;
  } else {
    status = `Próximo :  ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winner = calculateWinner(currentSquares);
  const gameOver = !!winner;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const newWinner = calculateWinner(nextSquares);
    if (newWinner === 'X') {
      setXWins(xWins + 1);
    } else if (newWinner === 'O') {
      setOWins(oWins + 1);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  
  function resetGameAndScore() {
    setHistory([Array(9).fill(null)]); 
    setCurrentMove(0);
    setXWins(0); 
    setOWins(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Etapa ' + move;
    } else {
      description = 'Começar o Jogo';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} gameOver={gameOver} />
      </div>
      <div className="game-info">
        <div>
          <h3>Placar</h3>
          <p>Jogador X: {xWins}</p>
          <p>Jogador O: {oWins}</p>
          <button onClick={resetGameAndScore}>Resetar Jogo e Placar</button> 
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
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
      return squares[a];
    }
  }
  return null;
}
