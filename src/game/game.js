import Board from '../board/board.js';
import React, { useEffect } from 'react';
import './game.css';
import { useState } from 'react';
import Input from '../file-input/file-input.js';

export default function Game() {
  const [selectedFile, setSelectedFile] = useState(undefined);

  let template = selectedFile ? <Board file={selectedFile} /> : [];

  //Riceve in input il file letto
  //@fileText string
  const handleCallback = (fileText) =>{
    setSelectedFile(fileText)
  }

    return (
      <div className="game">
        <div>
          <Input sendDataToParent = {handleCallback}/>
        </div>  
        <div>
          {template}
        </div>
      </div>
   );
 }