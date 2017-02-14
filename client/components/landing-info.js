import React, { Component } from 'react';
import moment from 'moment';

import { connect } from 'react-redux';

class LandingInfo extends Component {
  componentDidMount() {
    Meteor.subscribe('onlineUsers');
    Meteor.subscribe('offlineUsers');
  }

  createUsersList() {
    if(!this.props.users) {
      return (<div>loading...</div>);
    }

    const onUserList = [];
    const offUserList = [];
    this.props.onUsers.map(cv => {
      onUserList.push( <div className="users users-on" key={cv.username}>{cv.username}</div> );
    })
    this.props.offUsers.map(cv => {
      offUserList.push(
        <div className="users users-off" key={cv.username}>
          {cv.username}
          <span>{moment(cv.status.lastLogin.date).calendar()}</span>
        </div>
      );
    })

    return onUserList.concat(offUserList);
  }

  render() {
    return (
      <div id="landing-info">

        <div id="game-intro">
          <h2>Gomoku Intro</h2>
          <p>Gomoku is an abstract strategy board game. Also called Gobang or Five in a Row, it is traditionally played with Go pieces (black and white stones) on a go board with 19x19 (15x15) intersections.</p>
        </div>

        <div id="count-board">
          <h2>Scoreboard</h2>
        </div>

        <div id="online-player">
          <h2>Players</h2>
          {
            this.createUsersList()
          }
        </div>

      </div>
    );
  }
}

function mapStateToProps( state ){
  return { onUsers: state.reducer_four,
           offUsers: state.reducer_five }
}

export default connect(mapStateToProps)(LandingInfo);
