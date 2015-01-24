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
  // force game_start for level 0 players
  if (options.level == 0) options.onGameStart();

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

  return socket;
};
