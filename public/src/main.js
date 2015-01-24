var realtime = require('./realtime');

var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
  render: render
});


var gridWidth = 16;
var gridHeight = 15;
var gridSizePx = 50;

var allBoxes = [];
var graphics = null;

function preload() {
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

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 250;

  graphics = game.add.graphics(0, 0);
  game.input.onDown.add(createBox, this);
}

function createBox() {
  var posx = game.input.x;
  var posy = game.input.y;
  //var box = new Phaser.Rectangle(posx, posy, gridSizePx, gridSizePx);
  var box = game.add.sprite(posx, posy, 'box');
  box.width = gridSizePx;
  box.height = gridSizePx;
  game.physics.enable(box, Phaser.Physics.ARCADE);
  box.body.collideWorldBounds = true;
  box.body.allowGravity = true;
  box.body.bounce.y = 0.1;
  allBoxes.push(box);
  console.log("createBox");
}

function update () {

}

function render() {
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
