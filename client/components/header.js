import React, { Component } from 'react';
import { Gomoku } from '../../imports/collections/gomoku';
import { Link } from 'react-router';

import Accounts from './accounts';

import AppBar from 'material-ui/AppBar';
import { yellow800 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { onPage } from '../actions/index';
import { perPage } from '../actions/index';

class Header extends Component {
  onCreaterClick(event) {
    event.preventDefault();
    if ( Meteor.user().username ) {
      // 創新遊戲
      Meteor.call('gomoku.newgame', Meteor.userId() );
      // 發送當前資料(this.props.listInThePage)的 action, 不是為了更新 state, 只是要刷新 List
      const pagenum = this.props.listInThePage[2];
      this.props.onPage( [perPage*(pagenum-1), perPage, pagenum] );

    } else {
      alert('請先登入會員：）')
    }
  }

  render() {
    return (
      <AppBar
        style={{backgroundColor: yellow800}}
        iconElementLeft={<div></div>}
        title={
          <div>
            <Link id="mytitle" to="/">五子棋達人</Link>
            <FlatButton
              label="新遊戲"
              labelStyle={{fontSize: '17px', color: '#555', display: 'inline-block', lineHeight: '40px', verticalAlign: 'top'}}
              style={{width: '80px', height: '40px', margin: '0 20px'}}
              onClick={this.onCreaterClick.bind(this)}
            />
          </div>
        }
        titleStyle={{flex: '0.8 1 0'}}
        children={<Accounts />}
      />

    );
  }
}

function mapStateToProps( state ){
  return { listInThePage: state.reducer_three }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators( { onPage }, dispatch)
}

export default connect( mapStateToProps, mapDispatchToProps)(Header);
