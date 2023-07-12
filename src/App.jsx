import { useState } from "react";
import confetti from "canvas-confetti";

import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { resetGameStorage, saveGameStorage } from "./logic/storage";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    return JSON.parse(boardFromStorage) ?? Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });
  
  const [winner, setWinner] = useState(null); // null = NO hay ganador, false = empate. 

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  }

  const updateBoard = (index) => {
    // No se actualiza el simbolo si ya existe uno en la casilla
    if ( board[index] || winner ) return;

    // Actualizar tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    // Cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    // Guardar movimientos
    saveGameStorage({
      board: newBoard,
      turn: newTurn
    });

    // Revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  };

  return (
    <main className="board">
      <h1>Triqui Game</h1>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={ index }
                index={ index }
                updateBoard={ updateBoard }
              >
                { square }
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={ turn === TURNS.X }>
          { TURNS.X }
        </Square>
        <Square isSelected={ turn === TURNS.O }>
          { TURNS.O }
        </Square>
      </section>

      <button onClick={ resetGame }> Empezar de nuevo</button>

      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  );
}

export default App;
