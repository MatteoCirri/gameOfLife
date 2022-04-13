import Board from '../board/board.js';
import './game.css';

export default function Game() {
    return (
      <div className="game">
       <div>
         <Board />
       </div>
      </div>
   );
 }