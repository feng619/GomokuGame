import { Mongo } from 'meteor/mongo';

// 移除掉 insecure 之後就要用 methods
Meteor.methods({
  // 這裡不能用 fat arrow function, 否則 this 所指不同, this.userId 會找不到
  'gomoku.newgame': function( creater ) {
    return Gomoku.insert({
      gameover: false,
      steps: [],
      completeSteps: [],
      players: [null, null],
      endPlayers: [null, null], // 遊戲結束時的玩家紀錄
      winLose: [null, null], // [ 勝利者, 失敗者 ]
      createdAt: new Date(),
      creater,
    });
  },

  'gomoku.putdot': function( id, tate, yoko ) {
    return Gomoku.update( id, { $push: { steps: [tate, yoko] } });
  },

  'gomoku.undosteps': function( id, newSteps ) {
    return Gomoku.update( id, { $set: { steps: newSteps } });
  },

  'gomoku.win': function( id, completeSteps, endPlayers, winLose ) {
    return Gomoku.update( id, { $set: { gameover: true, completeSteps, endPlayers, winLose } });
  },

  'gomoku.addplayer': function( gameId, idx, userId ) {
    let players = Gomoku.findOne(gameId).players;
    players[idx] = userId;
    return Gomoku.update( gameId, { $set: { players: players } });
  },

  'gomoku.removeplayer': function( gameId, userId ) {
    let players = Gomoku.findOne(gameId).players;
    players[0] = players[0] == userId ? null : players[0] ;
    players[1] = players[1] == userId ? null : players[1] ;
    return Gomoku.update( gameId, { $set: { players: players } });
  },

});

export const Gomoku = new Mongo.Collection('gomoku');
