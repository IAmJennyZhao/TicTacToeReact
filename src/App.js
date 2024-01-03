import { useState } from "react";

function Square({ value, onSquareClick, winner}) {
  return <button className={winner ? "winning-square" : "square"} onClick={onSquareClick} >{value}</button>
}

function Board({squares, handleClick, winningSquares}) {
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const row = [];
    for (let c = 0; c < 3; c++) {
      let i = r * 3 + c;
      row.push(<Square value={squares[i]} onSquareClick={() => handleClick(i)} winner={winningSquares && winningSquares.includes(i)}/>);
    }

    rows.push(<div className="board-row">{row}</div>);
  }

  return (
    <>{rows}</>
  )
}

export default function Game() {
  // history: [squares, player, [row, col]]
  const [history, setHistory] = useState([[Array(9).fill(null), '', [0,0]]]);
  const [index, setIndex] = useState(0);
  const [asc, setAsc] = useState(true);
  const squares = history[index][0];
  const nextMove = index % 2 ? "O" : "X";

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    if (winner == -1){
      status = "Tie!";
    } else {
      status = "Winner: " + winner[0];
    }
  } else {
    status = "Next player: " + nextMove;
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = nextMove;
    const nextHistory = history.slice(0, index+1).concat([[nextSquares, nextMove, [(i-i%3)/3 + 1, (i%3)+1]]]);
    setHistory(nextHistory);
    setIndex(index + 1);
  }

  function jumpTo(i) {
    setIndex(i);
  }

  function toggleAsc() {
    setAsc(!asc);
  }

  const moves = history.map((info, moveIndex) => {
    let move = asc ? moveIndex : history.length - 1 - moveIndex;
    let description;
    if (move > 0) {
      if (move == index){
        description = 'You are at move #' + move + ": ("+info[1]+", ["+info[2]+"])"; // You are at move #3: (X, [2,3])
      } else {
        description = 'Go to move #' + move + ": ("+info[1]+", ["+info[2]+"])";
      }
    } else {
      if (0 == index){
        description = 'You are at game start';
      } else {
        description = 'Go to game start';
      }
    }
    return (
      <li key={-move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} handleClick={handleClick} winningSquares={winner && winner!=-1 ? winner[1] : null}/>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button onClick={toggleAsc}>Reverse Order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];

  let tie = true;

  for (let i = 0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a]==squares[b] && squares[a]==squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  for (let i = 0; i<9; i++) {
    if (!squares[i]) {
      tie = false;
    }
  }
  if (tie) {
    return -1;
  }
  return null;
}