var MESSAGE = "add_block";

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
      box.width = GRID_SIZE_PX;
      box.height = GRID_SIZE_PX;
      _game.gridState[row][col] = box;
      box.accel = 0;
      box.col = col;
      box.row = row;
      box.antiblock = false;
      box.isBlock = true;
      _game.allBoxes.push(box);
    }
  }

}

BlockCreator.MESSAGE = MESSAGE;

module.exports = BlockCreator
