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
  },

  onGameEnd: function(data) {
  },

  onBlockAdded: function(data) {
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
var boxesGroup = null;
var boxesCollision = null

function preload() {
  for (var i = gridWidth - 1; i >= 0; i--) {
    gridState[i] = new Array(gridHeight);
    for (var j = gridHeight - 1; j >= 0; j--) {
      gridState[i][j] = 0;
    }
  }
  //  You can fill the preloader with as many assets as your game requires

  //  Here we are loading an image. The first parameter is the unique
  //  string by which we'll identify the image later in our code.

  //  The second parameter is the URL of the image (relative)
  game.load.image('box', 'assets/images/elementos_01.png');
}

function create() {

  //  This creates a simple sprite that is using our loaded image and
  //  displays it on-screen
  //game.add.sprite(0, 0, 'kitten');

  // game.physics.startSystem(Phaser.Physics.P2JS);
  // game.physics.p2.setImpactEvents(true);
  // game.physics.p2.restitution = 0.8;
  // game.physics.p2.applyGravity = true;
  // game.physics.p2.gravity.y = 250;
  // boxesCollision = game.physics.p2.createCollisionGroup();
  // game.physics.p2.updateBoundsCollisionGroup();

  graphics = game.add.graphics(0, 0);
  game.input.onDown.add(createBox, this);
}

function createBox() {
  var row = Math.floor(game.input.x / gridSizePx);
  var col = Math.floor(game.input.y / gridSizePx);
  var posx = row * gridSizePx;
  var posy = col * gridSizePx;
  //console.log("x: ", game.input.x, " posx:", posx, " | y:", game.input.y, " posy:", posy);
  var box = game.add.sprite(posx, posy, 'box');
  box.width = gridSizePx;
  box.height = gridSizePx;
  gridState[row][col] = box;
  box.col = col;
  box.row = row;
  // var box = boxesGroup.create(posx, posy, 'box');
  // box.body.setRectangleFromSprite(box);
  // box.body.fixedRotation = true;

  // box.body.setCollisionGroup(boxesCollision);
  // box.body.collides(boxesCollision);
  /*box.body.collideWorldBounds = true;
  box.body.allowGravity = true;
  box.body.bounce.y = 0.1;
  box.body.checkCollision = true;
  //box.body.checkCollision.up = true;
  //box.body.immovable = true;

  for (var i = allBoxes.length - 1; i >= 0; i--) {
    if(allBoxes[i].x == box.x) {
      console.log("found");
      game.physics.arcade.collide(box, allBoxes[i]);
    }
  }*/
  allBoxes.push(box);
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
