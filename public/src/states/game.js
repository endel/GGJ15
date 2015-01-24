var realtime = require('../realtime');
console.log("Realtime: ", realtime);

module.exports = class Game {

  constructor() {
    var that = this;

    this.gridWidth = 16;
    this.gridHeight = 12;
    this.gridSizePx = 50;
    this.gridState = new Array(this.gridWidth);

    this.allBoxes = [];
    this.graphics = null;

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
        that.createBox(data);
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
    this.input.onDown.add(function() {
      socket.emit('add_block', {
        x: this.input.x,
        y: this.input.y
      });
    }, this);

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
    game.debug.text(this.gridState.toString(), 0, 50);
  }

}
