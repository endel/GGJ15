var realtime = require('../realtime');
var BlockCreator = require('../entities/block_creator')
var BlockDestroyer = require('../entities/block_destroyer')
var GoodGuy = require('../entities/good_guy')
var _ = require('lodash');
//console.log("Realtime: ", realtime);

module.exports = class Game {

  constructor() {
    this.gridState = new Array(GRID_WIDTH);
    this.theirGridState = new Array(GRID_WIDTH);

    this.cursorOffset = new Phaser.Point(17, 13);

    this.allBoxes = [];
    this.allTheirBoxes = [];
    window.allBoxes = this.allBoxes;
    this.allEntities = [];
    this.allTheirEntities = [];
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
          else {
            that.cursorDenied = that.foregroud.create(that.input.x, that.input.y, 'cursor-denied');
            that.cursorDenied.lifespan = 500;
            that.cursorDenied.anchor.set(0.5, 0.5);
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

    this.backgroud = game.add.group();
    this.backgroud.z = 0;
    this.ourObjects = this.ourObjects || game.add.group();
    this.ourObjects.z = 1;
    this.theirObjects = this.theirObjects || game.add.group();
    this.theirObjects.x = this.theirObjects.width = game.width;
    this.theirObjects.y = this.theirObjects.height = game.height;
    this.theirObjects.pivot.set(0,0);
    this.theirObjects.scale.set(-1,-1);
    this.theirObjects.z = 2;
    this.foregroud = game.add.group();
    this.foregroud.z = 3;

    window.groupObjects = this.ourObjects;

    //*** Back and foreground ***
    this.create_sky();
    this.wires = this.foregroud.create(0, 0, 'wires');
    this.wires.width = game.width;
    this.wires.height = game.height;
    this.grid = this.foregroud.create(0, 0, 'grid');
    this.grid.width = game.width;
    this.grid.height = game.height;

    //this.cursorAdd = this.foregroud.create(0, 0, 'cursor-add');
    //this.cursorSub = this.foregroud.create(0, 0, 'cursor-sub');
    this.cursorAdd = this.add.sprite(0, 0, 'cursor-add');
    this.cursorSub = this.add.sprite(0, 0, 'cursor-sub');
    //this.cursorSub.visible = this.cursorAdd.visible = false;

    // Clean up grid with zeros
    for (var i = GRID_WIDTH - 1; i >= 0; i--) {
      this.gridState[i] = new Array(GRID_HEIGHT);
      this.theirGridState[i] = new Array(GRID_HEIGHT);
      for (var j = GRID_HEIGHT - 1; j >= 0; j--) {
        this.gridState[i][j] = 0;
        this.theirGridState[i][j] = 0;
      }
    }

    this.graphics = this.add.graphics(0, 0);

    this.refillToolLine();

    //that.createGoodGuy({x: 11, y: 10});

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
      that.ourObjects = that.ourObjects || that.add.group();
      that.ourObjects.z = 1;
      for (var i in that.teams) {
        for (var j = 0; j < that.teams[i].length; j++) {
          var ldata = _.clone(data);
          ldata.team = i;
          ldata.group = ldata.team != that.myTeam ? that.theirObjects : that.ourObjects;
          ldata.array = ldata.team != that.myTeam ? that.allTheirEntities : that.allEntities;
          var sprite = ldata.group.create(0, 0, 'good_guy');

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

          sprite.animations.add('turning', [
            'opposite_walk_rescale_00000.png',
            'opposite_walk_rescale_00001.png',
            'opposite_walk_rescale_00002.png',
            'opposite_walk_rescale_00003.png',
            'opposite_walk_rescale_00004.png',
            'opposite_walk_rescale_00005.png',
            'opposite_walk_rescale_00006.png',
            'opposite_walk_rescale_00007.png',
            'opposite_walk_rescale_00008.png',
            'opposite_walk_rescale_00009.png',
            'opposite_walk_rescale_00010.png',
            'opposite_walk_rescale_00011.png',
            'opposite_walk_rescale_00012.png',
            'opposite_walk_rescale_00013.png',
            'opposite_walk_rescale_00014.png',
            'opposite_walk_rescale_00015.png',
            'opposite_walk_rescale_00016.png',
            'opposite_walk_rescale_00017.png',
            'opposite_walk_rescale_00018.png',
            'opposite_walk_rescale_00019.png',
            'opposite_walk_rescale_00020.png',
            'opposite_walk_rescale_00021.png',
            'opposite_walk_rescale_00022.png',
            'opposite_walk_rescale_00023.png'
          ], 24, false, false);

          sprite.animations.add('falling', ['jump_DOWN_02_00030.png'], 24, true, false);

          sprite.animations.play('walk');
          var guy = new GoodGuy(sprite, data);

          ldata.array.push(guy);
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
      this.allEntities[i].update(this.gridState);
    }

    for (var i = this.allTheirEntities.length - 1; i >= 0; i--) {
      this.allTheirEntities[i].update(this.theirGridState);
    }

    this.updateBoxes(this.allBoxes, this.gridState);
    this.updateBoxes(this.allTheirBoxes, this.theirGridState);

    if(this.toolLine.length > 0) {
      this.cursorSub.visible = this.cursorAdd.visible = false;
      var tool = this.toolLine[0];
      if(tool == this.blockCreator) {
        this.cursorAdd.visible = true;
        Phaser.Point.add(this.input.position, this.cursorOffset, this.cursorAdd.position);
      }
      else {
        this.cursorSub.visible = true;
        Phaser.Point.add(this.input.position, this.cursorOffset, this.cursorSub.position);
      }
    }
  }

  render() {
    var line = [];
    for (var i = 0; i < this.toolLine.length; i++) {
       line.push(this.toolLine[i].MESSAGE);
    }
    //game.debug.text("Tools:" + line.toString(), 0, 55, 'rgb(255,255,0)');
  }

  updateBoxes(boxArray, grid) {
    for (var i = boxArray.length - 1; i >= 0; i--) {
      boxArray[i].accel += GRAVITY;
      boxArray[i].y += this.time.physicsElapsed * boxArray[i].accel * GRAVITY;

      if(boxArray[i].y + GRID_SIZE_PX >= this.height) {
        boxArray[i].y = this.height - GRID_SIZE_PX;
        boxArray[i].accel = 0;

        if(boxArray[i].antiblock) {
          this.blockDestroyer.addToRemoveList(boxArray[i]);
          Sound.get('block-remove').play()
          continue;
        }
      }

      var nextRow = Math.ceil(boxArray[i].y / GRID_SIZE_PX),
          curRow = Math.floor(boxArray[i].y / GRID_SIZE_PX);

      if(nextRow != boxArray[i].row) {
        var targetRow = grid[nextRow] || grid[curRow];
        if(targetRow[boxArray[i].col] == 0) {
          grid[boxArray[i].row][boxArray[i].col] = 0;
          grid[nextRow][boxArray[i].col] = boxArray[i];
          boxArray[i].row = nextRow;
        }
        else {
          if(boxArray[i].antiblock) {
            this.blockDestroyer.addToRemoveList(targetRow[boxArray[i].col]);
            this.blockDestroyer.addToRemoveList(boxArray[i]);
          }
          else {

            // play sound when it hits the ground.
            boxArray[i].y = boxArray[i].row * GRID_SIZE_PX;
            if (boxArray[i].audio && boxArray[i].accel > GRAVITY) {
              boxArray[i].audio.play();
            }
            boxArray[i].accel = 0;

            // // animate bounce
            // game.add.tween(boxArray[i]).from( {
            //   y: "-10",
            //   alpha: 0
            // }, 1000, Phaser.Easing.Bounce.Out, true);

          }
        }
      }
    }
  }

  create_sky() {
    this.sky = this.backgroud.create(0, 0, 'sky0');
    this.sky.width = game.width;
    this.sky.height = game.height;
    var count = 0;
    var that = this;
    setInterval(function () {
      that.sky.loadTexture(window.sky_names[count++]);
      count = count % 50;
    }, 40);
    //this.sky.animations.add('loop', window.sky_names, 24, false, false);
    //this.sky.animations.play('loop');
  }

}
