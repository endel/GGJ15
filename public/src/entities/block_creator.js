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
      var row = Math.floor(data.x / _game.gridSizePx);
      var col = Math.floor(data.y / _game.gridSizePx);
      var posx = row * _game.gridSizePx;
      var posy = col * _game.gridSizePx;
      var box = _game.add.sprite(posx, posy, 'box');
      box.width = _game.gridSizePx;
      box.height = _game.gridSizePx;
      _game.gridState[row][col] = box;
      box.col = col;
      box.row = row;
      _game.allBoxes.push(box);
    }
    console.log("createBox");
  }

}

BlockCreator.MESSAGE = MESSAGE;

module.exports = BlockCreator
