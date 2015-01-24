var io = require('socket.io-client');

module.exports = function(options) {
  var socket = io.connect();

  socket.on('connect', function(session) {
    console.log("Connect...", session);
    socket.emit('enter_lobby', options, session);
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

  return socket;
};
