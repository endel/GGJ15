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
      var col = data.col;
      var row = data.row;
      var posx = col * GRID_SIZE_PX;
      var posy = row * GRID_SIZE_PX;
      var spriteId = Math.floor(Math.random()*this.block_sprites.length);
      var box = _game.add.sprite(posx, posy, this.block_sprites[spriteId], _game.objects);

      box.audio = Sound.get("block-" + this.block_sprites[spriteId]) || Sound.get("block-undefined");
      Sound.get("block").play();

      box.width = GRID_SIZE_PX;
      box.height = GRID_SIZE_PX;
      _game.gridState[row][col] = box;
      box.accel = 0;
      box.col = col;
      box.row = row;
      box.antiblock = false;
      box.isBlock = true;
      _game.allBoxes.push(box);

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
