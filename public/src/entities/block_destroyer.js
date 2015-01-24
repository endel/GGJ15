var MESSAGE = "rem_block";

class BlockDestroyer {

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

  destroyBox(data) {
    if (this.game) {
      var _game = this.game;
      var row = Math.floor(data.x / _game.gridSizePx);
      var col = Math.floor(data.y / _game.gridSizePx);
      var box = _game.gridState[row][col];
      if(box){
        var index = _game.allBoxes.indexOf(box);
        if(index > -1){
          _game.allBoxes.splice(index, 1);
        }
        _game.gridState[row][col] = 0;
        box.destroy();
      }
    }
  }
}

BlockDestroyer.MESSAGE = MESSAGE;

module.exports = BlockDestroyer
