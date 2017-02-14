import React, { Component } from 'react';
import { Gomoku } from '../../imports/collections/gomoku';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';

import List from './list';
import LandingInfo from './landing-info';

class Landing extends Component {
  componentWillMount() {
    Meteor.subscribe('gomoku');
    Meteor.subscribe('userList');
  }

  render() {
    return (
      <div>
        <LandingInfo gomoku={this.props.gomoku} users={this.props.users} />
        <List />
      </div>
    );
  }
}

function mapStateToProps( state ){
  return { gomoku: state.reducer_one, users: state.reducer_two }
}

export default connect(mapStateToProps)(Landing);
