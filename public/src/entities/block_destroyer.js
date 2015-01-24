var MESSAGE = "rem_block";

class BlockDestroyer {

  constructor(_game) {
    this.icon = "something";
    this.game = _game;
    this.MESSAGE = MESSAGE;
  }

  isValid(row,col) {
    if(this.game) {
      if(this.game.gridState[row][col] == 0) {
        return true;
      }
    }
    return false;
  }

  destroyBlock(data) {
    if (this.game) {
      var _game = this.game;
      var col = data.col;
      var row = data.row;
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
