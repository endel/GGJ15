var realtime = require('../realtime');
var BlockCreator = require('../entities/block_creator')
var BlockDestroyer = require('../entities/block_destroyer')
var GoodGuy = require('../entities/good_guy')
//console.log("Realtime: ", realtime);

module.exports = class Game {

  constructor() {
    this.gridState = new Array(GRID_WIDTH);

    this.allBoxes = [];
    window.allBoxes = this.allBoxes;
    this.allEntities = [];
    this.graphics = null;

    this.blockCreator = new BlockCreator(this);
    this.blockDestroyer = new BlockDestroyer(this);
    this.tools = [this.blockCreator, this.blockDestroyer];

    this.toolLine = [];
    this.toolLineMax = 3;

    this.currentLevel = window.localStorage.getItem('level') || 1;
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
      },

      onGameEnd: function(data) {
        console.log("onGameEnd", data)
      },

      onBlockAdded: function(data) {
        console.log("onBlockAdded", data);
        //that.createBox(data);
        that.blockCreator.createBlock(data);
      },

      onBlockRemoved: function(data) {
        console.log("onBlockRemoved", data);
        //that.blockDestroyer.createAntiBlock(data);
        that.blockDestroyer.destroyBlock(data);
      }
    });
  }

  create() {
    var that = this;
    this.connect();

    this.backgroud = this.add.group();
    this.backgroud.z = 0;
    this.objects = this.objects || this.add.group();
    this.objects.z = 1;
    this.foregroud = this.add.group();
    this.foregroud.z = 2;

    //*** Back and foreground ***
    this.sky = this.add.sprite(0, 0, 'sky', this.backgroud);
    this.sky.width = game.width;
    this.sky.height = game.height;
    this.wires = this.add.sprite(0, 0, 'wires', this.foregroud);
    this.wires.width = game.width;
    this.wires.height = game.height;
    this.grid = this.add.sprite(0, 0, 'grid', this.foregroud);
    this.grid.width = game.width;
    this.grid.height = game.height;

    // Clean up grid with zeros
    for (var i = GRID_WIDTH - 1; i >= 0; i--) {
      this.gridState[i] = new Array(GRID_HEIGHT);
      for (var j = GRID_HEIGHT - 1; j >= 0; j--) {
        this.gridState[i][j] = 0;
      }
    }

    this.graphics = this.add.graphics(0, 0);
    //*******************
    //*** CLICK EVENT ***
    //*******************
    this.input.onDown.add(function() {
      var tool = that.toolLine[0];
      var col = Math.floor(that.input.x / GRID_SIZE_PX);
      var row = Math.floor(that.input.y / GRID_SIZE_PX);
      if(tool.isValid(row, col)) {
        socket.emit(tool.MESSAGE, {
          col: col,
          row: row
        });
        that.toolLine.shift();
        that.refillToolLine();
      }
    }, this);

    this.refillToolLine();

    that.createGoodGuy({x: 11, y: 10});

    /*this.graphics.lineStyle(2, 0xFFFFFF);
    for (var i = 0; i <= GRID_WIDTH; i++) {
      this.graphics.moveTo(i*GRID_SIZE_PX, 0);
      this.graphics.lineTo(i*GRID_SIZE_PX, GRID_SIZE_PX*GRID_HEIGHT);
    }
    for (var j = 0; j <= GRID_HEIGHT; j++) {
      this.graphics.moveTo(0, j*GRID_SIZE_PX);
      this.graphics.lineTo(GRID_SIZE_PX*GRID_WIDTH, j*GRID_SIZE_PX);
    }*/
  }

  createGoodGuy(data) {
    var that = this;
    setTimeout(function(){
      that.objects = that.objects || that.add.group();
      that.objects.z = 1;
      var sprite = that.add.sprite(0, 0, 'good_guy', that.objects);

      sprite.animations.add('walk', [
        'walk_cycle_00000.png',
        'walk_cycle_00001.png',
        'walk_cycle_00002.png',
        'walk_cycle_00003.png',
        'walk_cycle_00004.png',
        'walk_cycle_00005.png',
        'walk_cycle_00006.png',
        'walk_cycle_00007.png',
        'walk_cycle_00008.png',
        'walk_cycle_00009.png',
        'walk_cycle_00010.png',
        'walk_cycle_00011.png',
        'walk_cycle_00012.png',
        'walk_cycle_00013.png',
        'walk_cycle_00014.png',
        'walk_cycle_00015.png',
        'walk_cycle_00016.png',
        'walk_cycle_00017.png',
        'walk_cycle_00018.png',
        'walk_cycle_00019.png',
      ], 24, true, false);

      sprite.animations.add('jump', [
        'jump_UP_01_00000.png',
        'jump_UP_01_00001.png',
        'jump_UP_01_00002.png',
        'jump_UP_01_00003.png',
        'jump_UP_01_00004.png',
        'jump_UP_01_00005.png',
        'jump_UP_01_00006.png',
        'jump_UP_01_00007.png',
        'jump_UP_01_00008.png',
        'jump_UP_01_00009.png',
        'jump_UP_01_00010.png',
        'jump_UP_01_00011.png',
        'jump_UP_01_00012.png',
        'jump_UP_01_00013.png',
        'jump_UP_01_00014.png',
        'jump_UP_01_00015.png',
        'jump_UP_01_00016.png',
        'jump_UP_01_00017.png',
        'jump_UP_01_00018.png',
        'jump_UP_01_00019.png',
        'jump_UP_01_00020.png',
        'jump_UP_01_00021.png',
        'jump_UP_01_00022.png',
        'jump_UP_01_00023.png',
        'jump_UP_01_00024.png',
        'jump_UP_01_00025.png',
        'jump_UP_01_00026.png',
        'jump_UP_01_00027.png',
        'jump_UP_01_00028.png',
        'jump_UP_01_00029.png',
        'jump_UP_01_00030.png',
        'jump_UP_01_00031.png',
        'jump_UP_01_00032.png',
        'jump_UP_01_00033.png',
        'jump_UP_01_00034.png',
        'jump_UP_01_00035.png',
        'jump_UP_01_00036.png',
        'jump_UP_01_00037.png',
        'jump_UP_01_00038.png',
        'jump_UP_01_00039.png',
        'jump_UP_01_00040.png',
        'jump_UP_01_00041.png',
        'jump_UP_01_00042.png',
        'jump_UP_01_00043.png',
        'jump_UP_01_00044.png',
        'jump_UP_01_00045.png',
        'jump_UP_01_00046.png',
        'jump_UP_01_00047.png',
      ], 24, false, false);

      sprite.animations.add('jump_down', [
        'jump_DOWN_02_00000.png',
        'jump_DOWN_02_00001.png',
        'jump_DOWN_02_00002.png',
        'jump_DOWN_02_00003.png',
        'jump_DOWN_02_00004.png',
        'jump_DOWN_02_00005.png',
        'jump_DOWN_02_00006.png',
        'jump_DOWN_02_00007.png',
        'jump_DOWN_02_00008.png',
        'jump_DOWN_02_00009.png',
        'jump_DOWN_02_00010.png',
        'jump_DOWN_02_00011.png',
        'jump_DOWN_02_00012.png',
        'jump_DOWN_02_00013.png',
        'jump_DOWN_02_00014.png',
        'jump_DOWN_02_00015.png',
        'jump_DOWN_02_00016.png',
        'jump_DOWN_02_00017.png',
        'jump_DOWN_02_00018.png',
        'jump_DOWN_02_00019.png',
        'jump_DOWN_02_00020.png',
        'jump_DOWN_02_00021.png',
        'jump_DOWN_02_00022.png',
        'jump_DOWN_02_00023.png',
        'jump_DOWN_02_00024.png',
        'jump_DOWN_02_00025.png',
        'jump_DOWN_02_00026.png',
        'jump_DOWN_02_00027.png',
        'jump_DOWN_02_00028.png',
        'jump_DOWN_02_00029.png',
        'jump_DOWN_02_00030.png',
        'jump_DOWN_02_00031.png',
        'jump_DOWN_02_00032.png',
        'jump_DOWN_02_00033.png',
        'jump_DOWN_02_00034.png',
        'jump_DOWN_02_00035.png',
        'jump_DOWN_02_00036.png',
        'jump_DOWN_02_00037.png',
        'jump_DOWN_02_00038.png',
        'jump_DOWN_02_00039.png',
        'jump_DOWN_02_00040.png',
        'jump_DOWN_02_00041.png',
        'jump_DOWN_02_00042.png',
        'jump_DOWN_02_00043.png',
        'jump_DOWN_02_00044.png',
        'jump_DOWN_02_00045.png',
        'jump_DOWN_02_00046.png',
        'jump_DOWN_02_00047.png',
      ], 24, false, false);

      sprite.animations.add('falling', ['jump_DOWN_02_00030.png'], 24, true, false);

      sprite.animations.play('walk');

      sprite.z = 100;
      var guy = new GoodGuy(sprite, data);
      that.allEntities.push(guy);
      console.log("createGoodGuy", data);
    }, 150);

  }

  createBadGuy(data) {
  }

  refillToolLine() {
    while(this.toolLine.length < this.toolLineMax) {
      if(this.allBoxes.length < this.toolLineMax) {
        this.toolLine.push(this.blockCreator);
      }
      else {
        this.toolLine.push(this.tools[Math.floor(Math.random()*this.tools.length)]);
      }
    }
  }

  update () {

    for (var i = this.allEntities.length - 1; i >= 0; i--) {
      this.allEntities[i].update(this.gridState);
    }

    for (var i = this.allBoxes.length - 1; i >= 0; i--) {
      this.allBoxes[i].accel += GRAVITY;
      this.allBoxes[i].y += this.time.physicsElapsed * this.allBoxes[i].accel * GRAVITY;

      if(this.allBoxes[i].y + GRID_SIZE_PX >= this.height) {
        this.allBoxes[i].y = this.height - GRID_SIZE_PX;
        this.allBoxes[i].accel = 0;

        if(this.allBoxes[i].antiblock) {
          this.blockDestroyer.addToRemoveList(this.allBoxes[i]);
          continue;
        }
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
          if(this.allBoxes[i].antiblock) {
            this.blockDestroyer.addToRemoveList(targetRow[this.allBoxes[i].col]);
            this.blockDestroyer.addToRemoveList(this.allBoxes[i]);
          }
          else {

            // play sound when it hits the ground.
            this.allBoxes[i].y = this.allBoxes[i].row * GRID_SIZE_PX;
            if (this.allBoxes[i].audio && this.allBoxes[i].accel > GRAVITY) {
              this.allBoxes[i].audio.play();
            }
            this.allBoxes[i].accel = 0;

            // // animate bounce
            // game.add.tween(this.allBoxes[i]).from( {
            //   y: "-10",
            //   alpha: 0
            // }, 1000, Phaser.Easing.Bounce.Out, true);

          }
        }
      }
    }
    this.blockDestroyer.removeBlocks();
  }

  render() {
    var line = [];
    for (var i = 0; i < this.toolLine.length; i++) {
       line.push(this.toolLine[i].MESSAGE);
    }
    game.debug.text("Tools:" + line.toString(), 0, 55, 'rgb(255,255,0)');
  }

}
