import { Meteor } from 'meteor/meteor';
import { Gomoku } from '../imports/collections/gomoku';
import { AccountsServer, Accounts } from 'meteor/accounts-base';

// 移除 autopublish
Meteor.startup(() => {

  Meteor.publish('gomoku', function() {
    return Gomoku.find({});
  });

  Meteor.publish('userList', function (){
    return Meteor.users.find({});
  });

  Meteor.publish("onlineUsers", function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish("offlineUsers", function() {
    return Meteor.users.find({ "status.online": false });
  });

  Meteor.publish("paginate", function(a) {
    console.log('a',a);
    return Gomoku.find({}, { skip: a[0], limit: a[1], sort: {createdAt: -1} });
  });
});
