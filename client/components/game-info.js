import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class GameInfo extends Component {
  componentDidUpdate() {
    // 處理填子之後 #steps 要捲動到最下面
    let el = document.getElementById("steps");
    if( el && !this.props.gomoku.gameover ) {
      el.scrollTop = el.scrollHeight;
    }
  }

  undoSteps(idx) {
    const { _id, steps, completeSteps, gameover } = this.props.gomoku;
    // 遊戲結束了才能返回至點選的步驟
    if( gameover ) {
      const newSteps = completeSteps.slice(0, idx+1);
      Meteor.call('gomoku.undosteps', _id, newSteps);
    }
  }

  remainSteps() {
    const { _id, steps, completeSteps, gameover } = this.props.gomoku;
    if( gameover ) {
      const allLen = completeSteps.length;
      const cLen = steps.length;

      // 如果玩家看歷史步驟記錄 則完整步驟記錄剩下部份要用灰階顯示 ' cube-grey'
      if( allLen != cLen ) {
        let remain = completeSteps.slice( cLen );

        return remain.map( (cv, i, arr) => {
          const idx = i + cLen;
          return (
            <li key={idx}>
              <a href="#" onClick={this.undoSteps.bind(this, idx)}>
                <span className='steps-count'>
                  {idx+1}
                </span>
                <span className='step-li step-li-grey'>
                  <span>{cv[0]}</span>
                  <span>・</span>
                  <span>{cv[1]}</span>
                </span>
              </a>
            </li>
          );
        });
      }
    }
    return null;
  }

  render() {
    const { _id, steps, completeSteps, gameover, players, endPlayers, winLose } = this.props.gomoku;
    const lastPlayer = gameover ? (completeSteps.length%2 ? '黑子':'白子') : null;

    return (
      <div id="game-info" key={_id}>
        <h5>#{_id}</h5>

        <div id="player-info">
          <div className="player-row">
            <div className={gameover?'player-pointer':(steps.length%2?'player-pointer':'player-pointer red')}></div>
            <div className="player-dot black cube-black"></div>
            <div className={gameover?'player-col':(players[0]?'player-col':'player-col grey')}>
              {
                gameover
                ?(endPlayers[0]==winLose[0] ? `${endPlayers[0]} win`:`${endPlayers[0]} Lose`)
                :`${ players[0]?players[0]:'Waiting...' }`
              }
            </div>
          </div>
          <div className="player-row">
            <div className={gameover?'player-pointer':(steps.length%2?'player-pointer red':'player-pointer')}></div>
            <div className="player-dot white cube-white"></div>
            <div className={gameover?'player-col':(players[1]?'player-col':'player-col grey')}>
              {
                gameover
                ?(endPlayers[0]!=winLose[0] ? `${endPlayers[1]} Win`:`${endPlayers[1]} Lose`)
                :`${ players[1]?players[1]:'Waiting...' }`
              }
            </div>
          </div>
        </div>

        <div id="steps">
          <ul>
            <ReactCSSTransitionGroup
              transitionName="infosteps"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={50}>
              {
                steps.map( (cv, idx, arr) => {
                  return (
                    <li key={idx}>
                      <a href="#" onClick={this.undoSteps.bind(this, idx)}>
                        <span className='steps-count'>
                          {idx+1}
                        </span>
                        <span className={idx%2?'step-li step-li-white':'step-li step-li-black'}>
                          <span>{cv[0]}</span>
                          <span>・</span>
                          <span>{cv[1]}</span>
                        </span>
                      </a>
                    </li>
                  );
                })
              }
            </ReactCSSTransitionGroup>
            { this.remainSteps() }
          </ul>
        </div>
      </div>
    );
  }
}
