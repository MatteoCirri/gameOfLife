import React, { useEffect } from 'react';
import './board.css';
import start from '../assets/start.txt';
import { useState } from 'react';

export default function Board(props) {
  const [grid, setGrid] = useState([]);
  const [gen, setGen] = useState(null);
  const [size, setSize] = useState([]);

  useEffect(() => {
    if(props.file) {
      setBoard(props.file)
    }
  }, [props.file]);

  useEffect(() => {
    if(props.file) {
      const interval = setInterval(function(){
        nextGen();
      },1000);
      return () => {
        clearInterval(interval);
      }
    }
  }, [grid, gen, size]);

  let dataComponent = [];

  if(props.file) {
    dataComponent.push(<div>Generazione {gen}</div>);
    dataComponent.push(<div>{size[0]} {size[1]}</div>);

    grid.forEach(row => {
      row.forEach(cell => {
        dataComponent.push(<span className="cell"> {cell ? '◼️' : '.'} </span>);
      })
      dataComponent.push(<br></br>);
    })
  }

  return(dataComponent);

  //Riceve il testo del file e inizializza la griglia
  //@text string
  function setBoard(text) {
    let grid1 = [];
    let board1 = [];
    let size1 = [];
    board1 = text.split('\r\n');
    let gen1 = board1[0].split(' ')[1];
    size1 = board1[1].split(' ');
    for(let i = 0; i < +[size1[0]]; i++) {
       grid1.push(board1[i + 2].split(' '));
    }

    //Crea una griglia dove ogni cella viva è rappresentata da un 1 e ogni cella morta da uno 0
    for(let i = 0; i < size1[0]; i++) {
      for(let j = 0; j < size1[1]; j++) {
        if(grid1[i][j] === '.') {
          grid1[i][j] = 0;
        } else {
          grid1[i][j] = 1;
        }
      }
    }
    setGrid(grid1);
    setGen(gen1);
    setSize(size1);
  }

  function nextGen() {
    const newGen = +[gen] + 1;
    const newSize = size;
    let neighbors;
    let newGrid = [];
    for(let i = 0; i < size[0]; i++) {
      newGrid[i] = [];
    }

    //Implementa le regole del game of life
    for(let i = 0; i < size[0]; i++) {
      for(let j = 0; j < size[1]; j++) {
        neighbors = countNeighbor(i, j);
        if(neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = 0;
        } else if (!grid[i][j] && neighbors === 3) {
          newGrid[i][j] = 1;
        } else if (!grid[i][j] && neighbors === 2) {
          newGrid[i][j] = 0;
        } else {
          newGrid[i][j] = 1;
        }
      }
    }

    //Aggiunge una riga se c'è una cella viva sul bordo inferiore della griglia
    for(let j = 0; j < size[1]; j++) {
      if(newGrid[size[0] - 1][j]) {
        newSize[0]++
        let newArray = [];
        for(let c = 0; c < size[1]; c++) {
          newArray.push(0);
        }
        newGrid.push(newArray)
        break;
      }
    }

    //Aggiunge una colonna se c'è una cella viva sul bordo destro della griglia
    for(let i = 0; i < size[0]; i++) {
      if(newGrid[i][size[1] - 1]) {
        newSize[1]++
        for(let i = 0; i < size[0]; i++) {
          newGrid[i].push(0)
        }
        break;
      }
    }

    setGrid(newGrid);
    setGen(newGen)
    setSize(newSize)
  }

  //Ritorna il numero di celle vive intorno ad una data cella
  //@row number: indice della riga in cui si trova la cella
  //@col number: indice della colonna in cui si trova la cella
  function countNeighbor(row, col) {
    let copyCell = 0;
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(!checkIsOut(row + i, col + j) && grid[row + i][col + j]) {
          copyCell++;
        }
      }
    }
    if(grid[row][col]) {
      copyCell--;
    }
    return copyCell;
  }

  //Controlla se la cella è fuori dal bordo della griglia
  //@row number: indice della riga in cui si trova la cella
  //@col number: indice della colonna in cui si trova la cella
  function checkIsOut(row, col) {
    return (row < 0) || (col < 0) || (row >= size[0]) || (col >= size[1])
  }
}