// http://stackoverflow.com/questions/19156636/node-js-and-socket-io-creating-room
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var usernames = {};

var rooms = ['Lobby'];

io.sockets.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.username = username;
    socket.room = 'Lobby';
    usernames[username] = username;
    socket.join('Lobby');
    socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
    socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
    socket.emit('updaterooms', rooms, 'Lobby');
  });

  socket.on('create', function(room) {
    rooms.push(room);
    socket.emit('updaterooms', rooms, socket.room);
  });

  socket.on('sendchat', function(data) {
    io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
  });

  socket.on('switchRoom', function(newroom) {
    var oldroom;
    oldroom = socket.room;
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
    socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
  });
});


//
// Express
//
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

// app.get('/', function (req, res) {
//   res.render('index.ejs');
// });
