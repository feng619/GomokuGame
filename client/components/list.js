import React, { Component } from 'react';
import { Gomoku } from '../../imports/collections/gomoku';
import { Link } from 'react-router';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


// 分頁處理
import { onPage } from '../actions/index';
import { perPage } from '../actions/index';
const onPageNum = 1;


class List extends Component {
  componentDidMount() {
    // why not work ????
    // console.log(perPage,onPageNum,perPage);
    this.props.onPage([perPage*(onPageNum-1), perPage, 1])
    //setTimeout(() => {this.props.onPage([perPage*(onPageNum-1), perPage, 1])}, 200);
    //
    //
  }

  addPlayer( id, idx ) {
    if ( Meteor.user() ) {
      Meteor.call('gomoku.addplayer', id, idx, Meteor.user().username);
    }
  }

  handlePlay(e) {
    // 要登入過後才可以玩
    if( !Meteor.user() ) {
      e.preventDefault();
      alert('請先登入會員');
    }
  }

  createBtn( players, playerIdx, url, _id, playerColor ) {
    return (
      players[playerIdx]
      ? players[playerIdx]
      : (
        <Link to={url} onClick={this.handlePlay.bind(this)} >
          <button
            className="entry-btn"
            onClick={this.addPlayer.bind(this, _id, playerIdx)}
          >
            {playerColor}
          </button>
        </Link>
        )
    );
  }

  onPageClick( i ) {
    setTimeout( ()=>{ this.props.onPage([perPage*i, perPage, i+1]) } ,200);
  }

  pagination() {
    if(!this.props.listInThePage[1]) return null;
    const allDocNum = Math.ceil((this.props.listInThePage[1]) / perPage );
    const pagenum = this.props.listInThePage[2]; // 現在在第幾頁
    const lis = [];

    for(let i=0; i<allDocNum; i++) {
      lis.push((
        <li
          key={i}
          className={ pagenum==i+1 ? 'page-active' : '' }
          onClick={ this.onPageClick.bind(this, i) }>
         {i+1}
        </li>
      ));
    }

    return (
      <ul id="page-ul">
        { lis }
      </ul>
    )
  }

  renderList() {
    if(!this.props.listInThePage[0]) return null;

    return this.props.listInThePage[0].map((cv, index) => {
      const { _id, steps, completeSteps, gameover, createdAt, players } = cv;
      const url = `/games/${_id}`;

      return (
        <TableRow key={_id}>
          <TableRowColumn style={{width: '23%', color: '#666'}}>
            #{_id}
          </TableRowColumn>
          <TableRowColumn style={{width: '8%', color: '#666'}}>
            {gameover?completeSteps.length:steps.length}
          </TableRowColumn>
          <TableRowColumn style={{width: '12%', color: '#666'}}>
            {gameover?'已結束':'進行中'}
          </TableRowColumn>
          <TableRowColumn style={{width: '21%', color: '#666'}}>
            {moment(createdAt).calendar()}
          </TableRowColumn>
          <TableRowColumn style={{width: '11%',textAlign: 'center'}}>
            { gameover ? null : this.createBtn( players, 0, url, _id, 'black' ) }
          </TableRowColumn>
          <TableRowColumn style={{width: '11%',textAlign: 'center'}}>
            { gameover ? null : this.createBtn( players, 1, url, _id, 'white' ) }
          </TableRowColumn>
          <TableRowColumn style={{width: '11%',textAlign: 'center'}}>
            { <Link to={url}><button className="entry-btn">view</button></Link> }
          </TableRowColumn>
        </TableRow>
      );
    });
  }

  render() {
    return (
      <div id="list">
        <Table style={{width: '90%', margin: '0 auto'}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={{width: '23%'}}>ID</TableHeaderColumn>
              <TableHeaderColumn style={{width: '8%'}}>Steps</TableHeaderColumn>
              <TableHeaderColumn style={{width: '12%'}}>Status</TableHeaderColumn>
              <TableHeaderColumn style={{width: '21%'}}>Time</TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={{width: '33%'}}>Entries</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            { this.renderList() }
          </TableBody>
        </Table>
        { this.pagination() }
      </div>
    );
  }
}

function mapStateToProps( state ){
  return { listInThePage: state.reducer_three }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators( { onPage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
