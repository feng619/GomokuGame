import React, { Component } from 'react';

export default class Cube extends Component {
  constructor(props) {
    super(props);
  }

  defineCubeClass( dot ) {
    const { tate, yoko, gomoku: { steps } } = this.props;
    let cubeClass = 'cube';

    // 基本線格
    if(tate==='A') cubeClass+=' cube-left';
    if(tate==='O') cubeClass+=' cube-right';
    if(yoko=== 15) cubeClass+=' cube-top';
    if(yoko=== 1 ) cubeClass+=' cube-bottom';

    // 基本黑白子
    steps.map( (cv, idx) => {
      if( cv[0]=== tate && cv[1]=== yoko )
        cubeClass += idx%2? ' cube-white':' cube-black';
    })

    // 填子
    if( dot==='cube-black' ) {
      cubeClass+=' cube-black';
    }

    return cubeClass;
  }

  putDot() {
    const { tate, yoko, gomoku: { _id, steps, gameover, players } } = this.props;
    const nowPlayer = steps.length%2; // 現在輪到 黑子(0) 白子(1)
    // 遊戲結束(gameover==true) 就不能再填子
    // 必須輪到自己才能填子
    if( !gameover && players[nowPlayer]==Meteor.user().username ) {
      // 已經有子的地方(notSameDot==false) 不能再填子
      const notSameDot = steps.every(cv => (
        cv[0]=== tate && cv[1]=== yoko ? false : true
      ));

      if(notSameDot) {
        Meteor.call('gomoku.putdot', _id, tate, yoko);
        this.defineCubeClass('cube-black');
      }

      // 判斷是否得勝
      steps.push([tate, yoko]);
      let win = this.isGameOver(tate, yoko, steps);
      if(win) {
        // [ 勝利者, 失敗者 ]
        let winLose = nowPlayer ? [ players[1], players[0] ] : players;
        Meteor.call('gomoku.win', _id, steps, players, winLose);
      }

    }
  }

  isGameOver(tate, yoko, steps) {
    const str = 'ABCDEFGHIJKLMNO';
    const player = (steps.length+1)%2; // 0 黑子 1 白子

    const onlySteps = []; // 取得只有該玩家下的步數
    steps.map((cv, i, arr) => {
      if( i%2==player ) onlySteps.push(cv);
    })

    // 直線得勝 ----------------------------------------
    let numArr = [yoko];
    onlySteps.map(cv => {
      if( cv[0] === tate ) numArr.push(cv[1]);
    })
    if( this.arrNumInLine(numArr) ) return true;

    // 橫線得勝 ----------------------------------------
    numArr = [tate];
    onlySteps.map(cv => {
      if( cv[1] === yoko ) numArr.push(cv[0]);
    })
    numArr = numArr.map(cv => str.indexOf(cv)+1 );
    if( this.arrNumInLine(numArr) ) return true;

    // \線得勝 ----------------------------------------
    if( this.arrNumInTilt(tate, yoko, onlySteps, 1) ) return true;

    // /線得勝 ----------------------------------------
    if( this.arrNumInTilt(tate, yoko, onlySteps, -1) ) return true;

    return false;
  }

  arrNumInLine(arr) {
    // 判斷陣列裡 是否有五個連成一線的數字
    var count4 = 0;
    let inLine = false;

    arr
      .sort((a,b) => a-b)
      .map((cv, i, arr) => {
        if( i>0 ) count4 = (cv === (arr[i-1] + 1)) ? count4+1 : 0;
        if( count4 === 4 ) inLine = true;
      })

    return inLine;
  }

  arrNumInTilt(tateEng, yoko, onlySteps, direction) {
    // 判斷斜線 是否有五個連成一線的子
    const str = 'ABCDEFGHIJKLMNO';
    const tate = str.indexOf(tateEng)+1;
    let count4 = 0;
    let inTiltLine = true;

    // 往左上方找
    let v_tate = tate - 1; // 變動的
    let v_yoko = yoko + 1*direction; // 變動的
    while( (direction==1?v_yoko<=15:v_yoko>=1) && v_tate>=1 && inTiltLine ) {
      let foundDot = onlySteps.find(cv => v_tate==(str.indexOf(cv[0])+1) && v_yoko==cv[1]);
      if(foundDot) {
        count4++;
        v_tate = v_tate - 1;
        v_yoko = v_yoko + 1*direction;
      } else {
        inTiltLine = false;
      }
    }

    // 往右下方找
    inTiltLine = true;
    v_tate = tate + 1; // 變動的
    v_yoko = yoko - 1*direction; // 變動的
    while( (direction==1?v_yoko>=1:v_yoko<=15) && v_tate<=15 && inTiltLine ) {
      let foundDot = onlySteps.find(cv => v_tate==(str.indexOf(cv[0])+1) && v_yoko==cv[1]);
      if(foundDot) {
        count4++;
        v_tate = v_tate + 1;
        v_yoko = v_yoko - 1*direction;
      } else {
        inTiltLine = false;
      }
    }

    return count4 >= 4 ? true : false;
  }

  render() {
    return (
      <div
        className={this.defineCubeClass()}
        onClick={this.putDot.bind(this)}
      >
        {/*this.props.tate + '/' + this.props.yoko*/}
      </div>
    );
  }
}
