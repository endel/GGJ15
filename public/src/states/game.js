var realtime = require('../realtime');
var BlockCreator = require('../entities/block_creator')
var BlockDestroyer = require('../entities/block_destroyer')
//console.log("Realtime: ", realtime);

module.exports = class Game {

  constructor() {
    var that = this;

    this.gridWidth = 40;
    this.gridHeight = 40;
    this.gridSizePx = 20;
    this.gridState = new Array(this.gridWidth);

    this.allBoxes = [];
    this.graphics = null;

    this.blockCreator = new BlockCreator(this);
    this.blockDestroyer = new BlockDestroyer(this);
    this.tools = [this.blockCreator, this.blockDestroyer];

    this.toolLine = [];
    this.toolLineMax = 3;

    this.currentLevel = window.localStorage.getItem('level') || 1;

    this.socket = realtime({
      level: this.currentLevel,

      onConnect: function(data) {
        window.socket = that.socket;
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
        //that.createBox(data);
        that.blockCreator.createBox(data);
      },

      onBlockRemoved: function(data) {
        console.log("onBlockRemoved", data);
        that.blockDestroyer.destroyBox(data);
      }
    });
  }

  create()
  {
    for (var i = this.gridWidth - 1; i >= 0; i--) {
      this.gridState[i] = new Array(this.gridHeight);
      for (var j = this.gridHeight - 1; j >= 0; j--) {
        this.gridState[i][j] = 0;
      }
    }
    this.load.image('box', 'assets/images/elementos_01.png');

    this.graphics = this.add.graphics(0, 0);
    //*******************
    //*** CLICK EVENT ***
    //*******************
    this.input.onDown.add(function() {
      var tool = this.toolLine[0];
      var row = Math.floor(this.input.x / this.gridSizePx);
      var col = Math.floor(this.input.y / this.gridSizePx);
      if(tool.isValid(row, col)) {
        socket.emit(tool.MESSAGE, {
          x: row,
          y: col
        });
      }
      this.toolLine.shift();
      this.toolLine.push(this.tools[Math.floor(Math.random()*2)]);
    }, this);

    for (var i = 0; i < this.toolLineMax; i++) {
      this.toolLine.push(this.tools[Math.floor(Math.random()*2)]);
    };

    this.graphics.lineStyle(2, 0xFFFFFF);
    for (var i = 0; i <= this.gridWidth; i++) {
      this.graphics.moveTo(i*this.gridSizePx, 0);
      this.graphics.lineTo(i*this.gridSizePx, this.gridSizePx*this.gridHeight);
    }
    for (var j = 0; j <= this.gridHeight; j++) {
      this.graphics.moveTo(0, j*this.gridSizePx);
      this.graphics.lineTo(this.gridSizePx*this.gridWidth, j*this.gridSizePx);
    }
  }

  createBox(data) {
    var row = Math.floor(data.x / this.gridSizePx);
    var col = Math.floor(data.y / this.gridSizePx);
    var posx = row * this.gridSizePx;
    var posy = col * this.gridSizePx;
    var box = this.add.sprite(posx, posy, 'box');
    box.width = this.gridSizePx;
    box.height = this.gridSizePx;
    this.gridState[row][col] = box;
    box.col = col;
    box.row = row;
    this.allBoxes.push(box);
    console.log("createBox");
  }

  destroyBox(data) {
    var row = Math.floor(data.x / this.gridSizePx);
    var col = Math.floor(data.y / this.gridSizePx);
    var box = this.gridState[row][col];
    if(box){
      var index = this.allBoxes.indexOf(box);
      if(index > -1){
        this.allBoxes.splice(index, 1);
      }
      this.gridState[row][col] = 0;
      box.destroy();
    }
  }

  update () {
    for (var i = this.allBoxes.length - 1; i >= 0; i--) {
      if (!this.allBoxes[i].accel) {
        this.allBoxes[i].accel = 0;
      }
      this.allBoxes[i].accel += 10;
      this.allBoxes[i].y += this.time.physicsElapsed * this.allBoxes[i].accel;
      var curCol = Math.ceil(this.allBoxes[i].y / this.gridSizePx);
      if(curCol != this.allBoxes[i].col) {
        if(this.gridState[this.allBoxes[i].row][curCol] == 0) {
          this.gridState[this.allBoxes[i].row][this.allBoxes[i].col] = 0;
          this.gridState[this.allBoxes[i].row][curCol] = this.allBoxes[i];
          this.allBoxes[i].col = curCol;
        }
        else {
          this.allBoxes[i].y = this.allBoxes[i].col * this.gridSizePx;
          this.allBoxes[i].accel = 0;
        }
      }
      if(this.allBoxes[i].y + this.gridSizePx >= this.height) {
        this.allBoxes[i].y = this.height - this.gridSizePx;
        this.allBoxes[i].accel = 0;
      }
    }
  }

  render() {
    var line = [];
    for (var i = 0; i < this.toolLine.length; i++) {
       line.push(this.toolLine[i].MESSAGE);
    }
    game.debug.text("Tools:" + line.toString(), 0, 55, 'rgb(255,255,0)');
  }

}
