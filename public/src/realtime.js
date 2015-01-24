window.io = require('socket.io-client');
var socket = io.connect();

socket.on('connect', function(){
  //socket.emit('adduser', prompt("What's your name: "));
});

socket.on('updatechat', function (username, data) {
  console.log(username, data)
});

module.exports = {
  open: function() {}
};
