var realtime = require('../realtime');
var blockCreator = require('../entities/block_creator')
var blockDestroyer = require('../entities/block_destroyer')
//console.log("Realtime: ", realtime);

module.exports = class Game {

  constructor() {
    this.gridState = new Array(GRID_WIDTH);

    this.allBoxes = [];
    this.allEntities = [];
    this.graphics = null;

    this.blockCreator = new BlockCreator(this);
    this.blockDestroyer = new BlockDestroyer(this);
    this.tools = [this.blockCreator, this.blockDestroyer];

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
        //that.createBox(data);
        that.blockCreator.createBox(data);
      },

      onBlockRemoved: function(data) {
        console.log("onBlockRemoved", data);
        that.blockDestroyer.destroyBox(data);
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
    for (var i = 0; i <= GRID_WIDTH; i++) {
      this.graphics.moveTo(i*GRID_SIZE_PX, 0);
      this.graphics.lineTo(i*GRID_SIZE_PX, GRID_SIZE_PX*GRID_HEIGHT);
    }
    for (var j = 0; j <= GRID_HEIGHT; j++) {
      this.graphics.moveTo(0, j*GRID_SIZE_PX);
      this.graphics.lineTo(GRID_SIZE_PX*GRID_WIDTH, j*GRID_SIZE_PX);
    }
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
      var curCol = Math.ceil(this.allBoxes[i].y / GRID_SIZE_PX);
      if(curCol != this.allBoxes[i].col) {
        if(this.gridState[this.allBoxes[i].row][curCol] == 0) {
          this.gridState[this.allBoxes[i].row][this.allBoxes[i].col] = 0;
          this.gridState[this.allBoxes[i].row][curCol] = this.allBoxes[i];
          this.allBoxes[i].col = curCol;
        }
        else {
          this.allBoxes[i].y = this.allBoxes[i].col * GRID_SIZE_PX;
          this.allBoxes[i].accel = 0;
        }
      }

      if(this.allBoxes[i].y + GRID_SIZE_PX >= this.height) {
        this.allBoxes[i].y = this.height - GRID_SIZE_PX;
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
