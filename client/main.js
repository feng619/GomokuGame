import React from 'react';
import ReactDOM from 'react-dom';
import { Gomoku } from '../imports/collections/gomoku';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import Landing from './components/landing';
import Game from './components/game';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Tracker } from 'meteor/tracker';
import { Provider } from 'react-redux';

import '../imports/startup/accounts-config.js';

const gomokuReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_GOMOKU':
      return action.gomokus;
    default:
      return state;
  }
};
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USERS':
      return action.users;
    default:
      return state;
  }
};
const gameReducer = (state = [], action) => {
  switch (action.type) {
    case 'PAGINATE':
      console.log('reducer',action.payload)
      return action.payload;
    default:
      return state;
  }
};
const onusersReducer = (state = [], action) => {
  switch (action.type) {
    case 'ON_USERS':
      return action.onusers;
    default:
      return state;
  }
};
const offusersReducer = (state = [], action) => {
  switch (action.type) {
    case 'OFF_USERS':
      return action.offusers;
    default:
      return state;
  }
};

const reducers = combineReducers({
  reducer_one: gomokuReducer,
  reducer_two: usersReducer,
  reducer_three: gameReducer,
  reducer_four: onusersReducer,
  reducer_five: offusersReducer
});
const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

// will run every time Counters changes
Tracker.autorun(() => {
  store.dispatch({
    type: 'SET_GOMOKU',
    gomokus: Gomoku.find().fetch(),
  });
  store.dispatch({
    type: 'SET_USERS',
    users: Meteor.users.find().fetch(),
  });
  store.dispatch({
    type: 'ON_USERS',
    onusers: Meteor.users.find({ "status.online": true }).fetch(),
  });
  store.dispatch({
    type: 'OFF_USERS',
    offusers: Meteor.users.find({ "status.online": false }).fetch(),
  });
});

Meteor.startup(() => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Landing} />
          <Route path="games/:gameId" component={Game} />
        </Route>
      </Router>
    </Provider>,
    document.querySelector('.render-target'))
});
