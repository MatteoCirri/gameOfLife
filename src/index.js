import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import start from './assets/start.txt';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gen: undefined,
      size: []
    };
    this.readFile();
  }

  readFile() {
    fetch(start)
      .then((r) => r.text())
      .then(text  => {
        this.setBoard(text);
      }).catch(error => {
        console.log(error);
      });
  }

  setBoard(text) {
    let grid = [];
    let board = [];
    let size = [];
    board = text.split('\r\n');
    let gen = board[0].split(' ')[1];
    size = board[1].split(' ');
    for(let i = 0; i < +[size[0]]; i++) {
       grid.push(board[i + 2].split(' '));
    }

    //Crea una griglia dove ogni cella viva è rappresentata da un 1 e ogni cella morta da uno 0
    for(let i = 0; i < size[0]; i++) {
      for(let j = 0; j < size[1]; j++) {
        if(grid[i][j] === '.') {
          grid[i][j] = 0;
        } else {
          grid[i][j] = 1;
        }
      }
    }

    this.setState({
      grid: grid,
      gen: gen,
      size: size
    })
    this.lifeCicle();
  }

  //Setta un intervallo per cui ogni secondo si ha una nuova generazione di celle
  lifeCicle() {
    setInterval(() => {
      this.nextGen();
    }, 1000);
  }

  nextGen() {
    const newGen = +[this.state.gen] + 1;
    let newGrid = [];

    //Crea una nuova griglia delle stesse dimensioni della griglia iniziale, ma ogni cella adesso rappresenta il numero di celle vive adiacenti
    for(let i = 0; i < this.state.size[0]; i++) {
      let newRow = [];
      for(let j = 0; j < this.state.size[1]; j++) {
        newRow.push(this.countNeighbor(i, j));
      }
      newGrid.push(newRow);
    }


    //Implementa le regola del 'Game of Life'
    for(let i = 0; i < this.state.size[0]; i++) {
      for(let j = 0; j < this.state.size[1]; j++) {
        if(newGrid[i][j] < 2 || newGrid[i][j] > 3) {
          newGrid[i][j] = 0;
        } else if (!this.state.grid[i][j] && newGrid[i][j] === 3) {
          newGrid[i][j] = 1;
        } else if (!this.state.grid[i][j] && newGrid[i][j] === 2) {
          newGrid[i][j] = 0;
        } else {
          newGrid[i][j] = 1;
        }
      }
    }

    this.setState({
      gen: newGen,
      grid: newGrid
    })
  }

  //Ritorna il numero di celle vive intorno ad una data cella
  countNeighbor(row, col) {
    let copyCell = 0;
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(!this.checkIsOut(row + i, col + j) && this.state.grid[row + i][col + j]) {
          copyCell++;
        }
      }
    }
    if(this.state.grid[row][col]) {
      copyCell--;
    }
    return copyCell;
  }

  //Controlla se la cella è fuori dal bordo della griglia
  checkIsOut(row, col) {
    return (row < 0) || (col < 0) || (row >= this.state.size[0]) || (col >= this.state.size[1])
  }

  render() {
    let dataComponent = [];

    dataComponent.push(<div>Generazione {this.state.gen}</div>);
    dataComponent.push(<div>{this.state.size[0]} {this.state.size[1]}</div>);

    this.state.grid.forEach(row => {
      row.forEach(cell => {
        dataComponent.push(<span className="cell"> {cell ? '◼️' : '.'} </span>);
      })
      dataComponent.push(<br></br>);
    })

    return(dataComponent);
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div>
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
