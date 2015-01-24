var io = require('socket.io-client');

module.exports = function(options) {
  var socket = io.connect();

  socket.on('connect', function() {
    console.log("Connect...");
    socket.emit('enter_lobby', options);
    if (options.onConnect) {
      options.onConnect();
    }
  });

  socket.on('game_start', function(data) {
    if (options.onGameStart) {
      options.onGameStart(data);
    }
  });

  socket.on('game_end', function(data) {
    if (options.onGameEnd) {
      options.onGameEnd(data);
    }
  });

  // call block_added callback
  socket.on('block_added', function(data) {
    if (options.onBlockAdded) {
      options.onBlockAdded(data);
    }
  });

  // call block_removed callback
  socket.on('block_removed', function(data) {
    if (options.onBlockRemoved) {
      options.onBlockRemoved(data);
    }
  });

  return socket;
};
