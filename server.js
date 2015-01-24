var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('lodash');
var shortId = require('shortid');

var browserify = require('browserify');
var browserify_6to5ify = require('6to5ify');

var clients = {};
var rooms = [];

var maxPlayersPerLevel = {
  '1': 2,
  '2': 4,
  '4': 8,
  '8': 16
};

io.sockets.on('connection', function(client) {

  client.on('enter_lobby', function(data) {
    console.log("enter_lobby", data);

    client.data = data;
    clients[client.id] = client;

    client.room = 'lobby';
    client.join('lobby');

    // check for necessary players to start.
    var lobbyClients = [],
        lobbyClientIds = Object.keys(io.sockets.adapter.rooms['lobby']);

    for(var i = 0; i < lobbyClientIds.length; i++) {
      lobbyClients.push(clients[lobbyClientIds[i]]);
    }

    // group clients by level
    var clientsInLevel = _.groupBy(lobbyClients, function(client) {
      return client.data.level;
    });

    // check which clients may play togheter
    for (var level in maxPlayersPerLevel) {
      if (clientsInLevel[level]) {
        console.log("clientsInLevel ", level, ": ", clientsInLevel[level].length, ", maxPlayersPerLevel: ", maxPlayersPerLevel[level]);
      }
      if (clientsInLevel[level] && clientsInLevel[level].length >= maxPlayersPerLevel[level]) {
        var clientsToJoin = clientsInLevel[level].slice(0, maxPlayersPerLevel[level]);
        var uniqRoomName = "_" + level + "_" + shortId.generate(),
            teams = {'0': [], '1': []};

        for (var i = 0; i < clientsToJoin.length; i++) {
          console.log("Clients to join: ", clientsToJoin[i])
          // Team 0 OR Team 1 ?
          clientsToJoin[i].data.team = (i < maxPlayersPerLevel[level] / 2) ? 0 : 1;
          clientsToJoin[i].room = uniqRoomName;
          clientsToJoin[i].leave(clientsToJoin[i].room);
          clientsToJoin[i].join(uniqRoomName);

          teams[clientsToJoin[i].data.team].push(clientsToJoin[i].id);
        }

        // send game_start event to clients in this room
        client.broadcast.to(uniqRoomName).emit('game_start', {
          level: level,
          teams: teams
        });
      }
    }

    // client.broadcast.to('lobby').emit('updatechat', 'SERVER', client.id + ' has connected to this room');
  });

  client.on('game_end', function(data) {
    var previousRoom = client.room;
    client.leave(client.room);
    client.join('lobby');

    console.log("Game end...");

    if (io.sockets.adapter.rooms['lobby']) {
      console.log("game_end: has room");
      var clientIds = Object.keys(io.sockets.adapter.rooms['lobby']);
      for(var i = 0; i < clientIds.length; i++) {
        clients[clientIds].leave(client.room);
        clients[clientIds].join('lobby');
      }
    }

  });

  client.on('add_block', function(data) {
    io.sockets.in(client.room).emit('block_added', data);
  });

  // client.on('switchRoom', function(newroom) {
  //   var oldroom;
  //   oldroom = client.room;
  //   client.leave(client.room);
  //   client.join(newroom);
  //   client.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
  //   client.broadcast.to(oldroom).emit('updatechat', 'SERVER', client.username + ' has left this room');
  //   client.room = newroom;
  //   client.broadcast.to(newroom).emit('updatechat', 'SERVER', client.username + ' has joined this room');
  //   client.emit('updaterooms', rooms, newroom);
  // });

  client.on('disconnect', function() {
    client.broadcast.to(client.room).emit('user_disconnected', client.id);
    client.leave(client.room);
    delete clients[client.id];
  });

});


//
// Express
//
app.use(express.static(__dirname + '/public'));
app.get('/build/build.js', function(req, res) {
  res.setHeader('Content-type', 'text/javascript');
  var browserify = require('browserify');
  var b = browserify();
  b.transform(browserify_6to5ify);
  b.add('./public/src/main.js');
  b.bundle().pipe(res);

  // res.send();

});

var port = process.env.PORT || 3000;
server.listen(port);
