var realtime = require('../realtime');
var blockCreator = require('../entities/block_creator')
var blockDestroyer = require('../entities/block_destroyer')

var GoodGuy = require('../entities/good_guy.js');

module.exports = class Game {

  constructor() {
    this.gridState = new Array(GRID_WIDTH);

    this.allBoxes = [];
    window.allBoxes = this.allBoxes;
    this.allEntities = [];
    this.graphics = null;

    this.tools = [ blockCreator, blockDestroyer ];
    this.toolLine = [];
    this.toolLineMax = 3;

    this.currentLevel = window.localStorage.getItem('level') || 0;
  }

  connect() {
    var that = this;

    this.socket = realtime({
      level: this.currentLevel,

      onConnect: function(data) {
        window.socket = that.socket;
        // socket.emit('game_end');
      },

      onGameStart: function(data) {
        console.log("onGameStart", data)
        that.createGoodGuy({x: 11, y: 10});
      },

      onGameEnd: function(data) {
        console.log("onGameEnd", data)
      },

      onBlockAdded: function(data) {
        console.log("onBlockAdded", data);
        that.createBox(data);
      }
    });
  }

  create() {
    this.connect();

    // Clean up grid with zeros
    for (var i = GRID_WIDTH - 1; i >= 0; i--) {
      this.gridState[i] = new Array(GRID_HEIGHT);
      for (var j = GRID_HEIGHT - 1; j >= 0; j--) {
        this.gridState[i][j] = 0;
      }
    }
    this.load.image('box', 'assets/images/elementos_01.png');

    this.graphics = this.add.graphics(0, 0);
    this.input.onDown.add(function() {
      socket.emit('add_block', {
        x: this.input.x,
        y: this.input.y
      });
    }, this);

    for (var i = 0; i < this.toolLineMax; i++) {
      this.toolLine.push(this.tools[Math.floor(Math.random()*2)]);
    };

    this.graphics.lineStyle(2, 0xFFFFFF);
    for (var i = 0; i <= GRID_WIDTH; i++) {
      this.graphics.moveTo(i*GRID_SIZE_PX, 0);
      this.graphics.lineTo(i*GRID_SIZE_PX, GRID_SIZE_PX*GRID_HEIGHT);
    }
    for (var j = 0; j <= GRID_HEIGHT; j++) {
      this.graphics.moveTo(0, j*GRID_SIZE_PX);
      this.graphics.lineTo(GRID_SIZE_PX*GRID_WIDTH, j*GRID_SIZE_PX);
    }
  }

  createBox(data) {
    var col = Math.floor(data.x / GRID_SIZE_PX);
    var row = Math.floor(data.y / GRID_SIZE_PX);
    var posx = col * GRID_SIZE_PX;
    var posy = row * GRID_SIZE_PX;
    var box = this.add.sprite(posx, posy, 'box');
    box.width = GRID_SIZE_PX;
    box.height = GRID_SIZE_PX;
    this.gridState[row][col] = box;
    box.col = col;
    box.row = row;
    box.accel = 0;
    this.allBoxes.push(box);
    console.log("createBox");
  }

  createGoodGuy(data) {
    var sprite = this.add.sprite(0, 0, 'box');
    var guy = new GoodGuy(sprite, data);
    this.allEntities.push(guy);
  }

  createBadGuy(data) {
  }

  update () {

    for (var i = this.allEntities.length - 1; i >= 0; i--) {
      this.allEntities[i].update(this.gridState);
    }

    for (var i = this.allBoxes.length - 1; i >= 0; i--) {
      this.allBoxes[i].accel += GRAVITY;
      this.allBoxes[i].y += this.time.physicsElapsed * this.allBoxes[i].accel;

      if(this.allBoxes[i].y + GRID_SIZE_PX >= this.height) {
        this.allBoxes[i].y = this.height - GRID_SIZE_PX;
        this.allBoxes[i].accel = 0;
      }

      var nextRow = Math.ceil(this.allBoxes[i].y / GRID_SIZE_PX),
          curRow = Math.floor(this.allBoxes[i].y / GRID_SIZE_PX);

      if(nextRow != this.allBoxes[i].row) {
        var targetRow = this.gridState[nextRow] || this.gridState[curRow];
        if(targetRow[this.allBoxes[i].col] == 0) {
          this.gridState[this.allBoxes[i].row][this.allBoxes[i].col] = 0;
          this.gridState[nextRow][this.allBoxes[i].col] = this.allBoxes[i];
          this.allBoxes[i].row = nextRow;
        }
        else {
          this.allBoxes[i].y = this.allBoxes[i].row * GRID_SIZE_PX;
          this.allBoxes[i].accel = 0;
        }
      }

    }
  }

  render() {
    var line = [];
    for (var i = 0; i < this.toolLine.length; i++) {
       line.push(this.toolLine[i].MESSAGE);
    }
    game.debug.text("Tools:" + line.toString(), 0, 50, 0xFF0000);
  }

}
