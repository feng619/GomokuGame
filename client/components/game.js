import React, { Component } from 'react';
import { Gomoku } from '../../imports/collections/gomoku';

import { connect } from 'react-redux';

import GameBoard from './game-board';
import GameInfo from './game-info';



class Game extends Component {
  componentDidMount() {
    Meteor.subscribe('gomoku');
    window.addEventListener("beforeunload", (e) =>{
      e.preventDefault();
      if ( Meteor.user() ) {
        // 處理直接關掉網頁或是直接改變網址的狀況
        Meteor.call('gomoku.removeplayer', this.props.gomoku[0]._id, Meteor.user().username);
      }
    });
  }

  componentWillUnmount() {
    if ( Meteor.user() ) {
      //處理按鈕回首頁的狀況
      Meteor.call('gomoku.removeplayer', this.props.gomoku[0]._id, Meteor.user().username);
    }
  }

  renderList() {
    const gomoku = this.props.gomoku[0];
    return (
      <div id="game" key={gomoku._id}>
        <GameBoard gomoku={gomoku}/>
        <GameInfo gomoku={gomoku}/>
      </div>
    );
  }

  render() {
    if(!this.props.gomoku[0]) {
      return (<div>Loading...</div>);
    }
    return (
      <div>
        { this.renderList() }
      </div>
    );
  }
}

function mapStateToProps( state, ownProps ){
  return { gomoku: Gomoku.find(ownProps.params.gameId).fetch() }
}

export default connect(mapStateToProps)(Game);
