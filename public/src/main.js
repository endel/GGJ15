var realtime = require('./realtime'),
    currentLevel = window.localStorage.getItem('level') || 1;

var socket = realtime({
  level: currentLevel,

  onConnect: function(data) {
    console.log(socket);
    window.socket = socket;
    // socket.emit('game_end');
  },

  onGameStart: function(data) {
    console.log("onGameStart", data)
  },

  onGameEnd: function(data) {
    console.log("onGameEnd", data)
  },

  onBlockAdded: function(data) {
    console.log("onBlockAdded", data);
    createBox(data);
  }
});

var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

var gridWidth = 16;
var gridHeight = 12;
var gridSizePx = 50;
var gridState = new Array(gridWidth);

var allBoxes = [];
var graphics = null;

function preload() {
  for (var i = gridWidth - 1; i >= 0; i--) {
    gridState[i] = new Array(gridHeight);
    for (var j = gridHeight - 1; j >= 0; j--) {
      gridState[i][j] = 0;
    }
  }
  game.load.image('box', 'assets/images/elementos_01.png');
}

function create() {
  graphics = game.add.graphics(0, 0);
  game.input.onDown.add(function() {
    socket.emit('add_block', {
      x: game.input.x,
      y: game.input.y
    });
  }, this);

  graphics.lineStyle(2, 0xFFFFFF);
  for (var i = 0; i <= gridWidth; i++) {
    graphics.moveTo(i*gridSizePx, 0);
    graphics.lineTo(i*gridSizePx, gridSizePx*gridHeight);
  }
  for (var j = 0; j <= gridHeight; j++) {
    graphics.moveTo(0, j*gridSizePx);
    graphics.lineTo(gridSizePx*gridWidth, j*gridSizePx);
  }
}

function createBox(data) {
  var row = Math.floor(data.x / gridSizePx);
  var col = Math.floor(data.y / gridSizePx);
  var posx = row * gridSizePx;
  var posy = col * gridSizePx;
  var box = game.add.sprite(posx, posy, 'box');
  box.width = gridSizePx;
  box.height = gridSizePx;
  gridState[row][col] = box;
  box.col = col;
  box.row = row;
  allBoxes.push(box);
  console.log("createBox");
}

function update () {
  for (var i = allBoxes.length - 1; i >= 0; i--) {
    if (!allBoxes[i].accel) {
      allBoxes[i].accel = 0;
    }
    allBoxes[i].accel += 10;
    allBoxes[i].y += game.time.physicsElapsed * allBoxes[i].accel;
    var curCol = Math.ceil(allBoxes[i].y / gridSizePx);
    if(curCol != allBoxes[i].col) {
      if(gridState[allBoxes[i].row][curCol] == 0) {
        gridState[allBoxes[i].row][allBoxes[i].col] = 0;
        gridState[allBoxes[i].row][curCol] = allBoxes[i];
        allBoxes[i].col = curCol;
      }
      else {
        allBoxes[i].y = allBoxes[i].col * gridSizePx;
        allBoxes[i].accel = 0;
      }
    }
    if(allBoxes[i].y + gridSizePx >= game.height) {
      allBoxes[i].y = game.height - gridSizePx;
      allBoxes[i].accel = 0;
    }
  }
}

function render() {
  game.debug.text(gridState.toString(),0,50);
}
