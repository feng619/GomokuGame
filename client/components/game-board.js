import React, { Component } from 'react';

import Cube from './cube';

export default class GameBoard extends Component {
  createCubes() {
    const str = 'ABCDEFGHIJKLMNO';
    // 15x15 空陣列
    const initArr = [];
    for(let i=15; i>0; i--){
      initArr.push([]);
      for(let j=0; j<15; j++){
        initArr.push(
          <Cube
            key={('i'+i)+('j'+j)}
            yoko={i}
            tate={ str[j] }
            gomoku={this.props.gomoku}
          />
        );
      }
    }
    return initArr;
  }

  createLeftCubes() {
    const leftArr = [];
    for(let i=15; i>0; i--){
      leftArr.push(
        <div key={i} className="left-cubes">{i}</div>
      );
    }
    return leftArr;
  }

  createBotCubes() {
    const str = 'ABCDEFGHIJKLMNO';
    const botArr = [];
    for(let i=-1; i<15; i++){
      botArr.push(
        <div key={i} className="bot-cubes">{i>-1?str[i]:''}</div>
      );
    }
    return botArr;
  }

  render() {
    return (
      <div id="game-board">

        <div className="game-board-row game-board-title">
          Welcome to Gomoku Tatsujin
        </div>

        <div id="game-board-midrow">
          <div className="game-board-col">
            {this.createLeftCubes()}
          </div>
          <div id="game-board-main">
            {this.createCubes()}
          </div>
          <div className="game-board-col"></div>
        </div>

        <div className="game-board-row">
          {this.createBotCubes()}
        </div>

      </div>
    );
  }
}
