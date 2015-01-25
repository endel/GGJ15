var MESSAGE = "add_block";
var audios = null;

class BlockCreator {

  constructor(_game) {
    this.icon = "something";
    this.game = _game;
    this.MESSAGE = MESSAGE;
    this.block_sprites = ['block_paper', 'block_car', 'block_toilet', 'block_trash'];
  }

  isValid(x,y) {
    if(this.game) {
      if(this.game.gridState[x][y] == 0) {
        return true;
      }
    }
    return false;
  }

  createBlock(data) {
    if (this.game) {
      var _game = this.game;
      for (var i in _game.teams) {
        for (var j = 0; j < _game.teams[i].length; j++) {
          if(_game.teams[i][j] == data.socket_id) {
            data.team = i;
          }
        }
      }
      var col = data.col;
      var row = data.row;
      var posx = col * GRID_SIZE_PX;
      var posy = row * GRID_SIZE_PX;
      var group = _game.myTeam != data.team ? _game.theirObjects : _game.ourObjects;
      var objArray = _game.myTeam != data.team ? _game.allTheirBoxes : _game.allBoxes;
      var grid = _game.myTeam != data.team ? _game.theirGridState : _game.gridState;
      var spriteId = Math.floor(Math.random()*this.block_sprites.length);
      var box = group.create(posx, posy, this.block_sprites[spriteId]); //_game.add.sprite(posx, posy, this.block_sprites[spriteId], _game.objects);
      //_game.objects.add(box);

      // play respective audio
      box.audio = Sound.get("block-" + this.block_sprites[spriteId]) || Sound.get("block-undefined");
      Sound.get("block").play();

      box.width = GRID_SIZE_PX;
      box.height = GRID_SIZE_PX;
      grid[row][col] = box;
      box.accel = 0;
      box.col = col;
      box.row = row;
      box.antiblock = false;
      box.isBlock = true;
      box.team = data.team;
      ///////// TODO: Criar uma lista separada para blocos do time adversário
      objArray.push(box);

      game.add.tween(box).from( {
        angle: -20,
        x: "-5",
        y: "-2",
        alpha: 0
      }, 1000, Phaser.Easing.Cubic.Out, true);
    }
  }

}

BlockCreator.MESSAGE = MESSAGE;

module.exports = BlockCreator
