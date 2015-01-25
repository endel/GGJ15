var realtime = require('../realtime');
var BlockCreator = require('../entities/block_creator')
var BlockDestroyer = require('../entities/block_destroyer')
var GoodGuy = require('../entities/good_guy')
var _ = require('lodash');
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
        console.log("onGameStart", data);
        //*******************
        //*** CLICK EVENT ***
        //*******************
        that.input.onDown.add(function() {
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
        }, that);
        that.myTeam = -1;
        that.teams = data.teams;
        for (var i in that.teams) {
          for (var j = 0; j < that.teams[i].length; j++) {
            if(that.teams[i][j] == socket.id) {
              that.myTeam = i;
            }
          }
        }
        that.createGoodGuy({x: 11, y: 10});
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

    this.refillToolLine();

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
        for (var i in that.teams) {
        for (var j = 0; j < that.teams[i].length; j++) {
          var ldata = _.clone(data);
          ldata.team = i;
          var sprite = that.add.sprite(0, 0, 'good_guy', that.objects);
          if(ldata.team != that.myTeam) {
            sprite.scale.y *= -1;
            sprite.anchor.setTo(0,1);
            //data.x = game.width - 11;
            ldata.y = game.height - 10;
          }
          var guy = new GoodGuy(sprite, ldata);
          that.allEntities.push(guy);
          console.log("createGoodGuy", data);
        }
      }
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
      if(this.allEntities[i].team != this.myTeam) {
        this.allEntities[i].updateUpsideDown(this.gridState);
      }
      else {
        this.allEntities[i].update(this.gridState);
      }
    }

    for (var i = this.allBoxes.length - 1; i >= 0; i--) {
      if(this.allBoxes[i].team != this.myTeam) {
        this.updateBlocksUpsideDown(this.allBoxes[i]);
      }
      else {
        this.updateBlocks(this.allBoxes[i]);
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

  updateBlocks(block) {
    block.accel += GRAVITY;
    block.y += this.time.physicsElapsed * block.accel;

    if(block.y + GRID_SIZE_PX >= this.height) {
      block.y = this.height - GRID_SIZE_PX;
      block.accel = 0;
      if(block.antiblock) {
        this.blockDestroyer.addToRemoveList(block);
        return;
      }
    }

    var nextRow = Math.ceil(block.y / GRID_SIZE_PX),
        curRow = Math.floor(block.y / GRID_SIZE_PX);

    if(nextRow != block.row) {
      var targetRow = this.gridState[nextRow] || this.gridState[curRow];
      if(targetRow[block.col] == 0) {
        this.gridState[block.row][block.col] = 0;
        this.gridState[nextRow][block.col] = block;
        block.row = nextRow;
      }
      else {
        if(block.antiblock) {
          this.blockDestroyer.addToRemoveList(targetRow[block.col]);
          this.blockDestroyer.addToRemoveList(block);
        }
        else {
          block.y = block.row * GRID_SIZE_PX;
          block.accel = 0;
        }
      }
    }
  }

  updateBlocksUpsideDown(block) {
    block.accel += GRAVITY;
    block.y -= this.time.physicsElapsed * block.accel;

    if(block.y < 0) {
      block.y = 0;
      block.accel = 0;
      if(block.antiblock) {
        this.blockDestroyer.addToRemoveList(block);
        return;
      }
    }

    var nextRow = Math.floor(block.y / GRID_SIZE_PX),
        curRow = Math.ceil(block.y / GRID_SIZE_PX);

    if(nextRow != block.row) {
      var targetRow = this.gridState[nextRow] || this.gridState[curRow];
      if(targetRow[block.col] == 0) {
        this.gridState[block.row][block.col] = 0;
        this.gridState[nextRow][block.col] = block;
        block.row = nextRow;
      }
      else {
        if(block.antiblock) {
          this.blockDestroyer.addToRemoveList(targetRow[block.col]);
          this.blockDestroyer.addToRemoveList(block);
        }
        else {
          block.y = block.row * GRID_SIZE_PX;
          block.accel = 0;
        }
      }
    }
  }

}
