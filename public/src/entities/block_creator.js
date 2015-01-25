var MESSAGE = "add_block";

class BlockCreator {

  constructor(_game) {
    this.icon = "something";
    this.game = _game;
    this.MESSAGE = MESSAGE;
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
      var box = _game.add.sprite(posx, posy, 'box');
      box.width = GRID_SIZE_PX;
      box.height = GRID_SIZE_PX;
      _game.gridState[row][col] = box;
      box.accel = 0;
      box.col = col;
      box.row = row;
      _game.allBoxes.push(box);
    }
    console.log("createBox");
  }

}

BlockCreator.MESSAGE = MESSAGE;

module.exports = BlockCreator
