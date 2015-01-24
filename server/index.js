// http://stackoverflow.com/questions/19156636/node-js-and-socket-io-creating-room
var io = require('socket.io')();

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

io.listen(3000);
