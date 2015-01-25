var MESSAGE = "rem_block";

class BlockDestroyer {

  constructor(_game) {
    this.icon = "something";
    this.game = _game;
    this.MESSAGE = MESSAGE;
    this.removalList = [];
  }

  isValid(row,col) {
    if(this.game) {
      if(this.game.gridState[row][col].isBlock) {
        return true;
      }
    }
    return false;
  }

  createAntiBlock(data) {
    if (this.game) {
      var _game = this.game;
      var col = data.col;
      var row = data.row;
      var posx = col * GRID_SIZE_PX;
      var posy = row * GRID_SIZE_PX;
      var box = _game.add.sprite(posx, posy, 'block_trash');
      box.width = GRID_SIZE_PX;
      box.height = GRID_SIZE_PX;
      _game.gridState[row][col] = box;
      box.accel = 0;
      box.col = col;
      box.row = row;
      box.antiblock = true;
      _game.objects.add(box);
      _game.allBoxes.push(box);
    }
  }

  addToRemoveList(block) {
    this.removalList.push(block);
  }

  removeBlocks() {
    if (this.game) {
      var _game = this.game;
      for (var i = 0; i < this.removalList.length; i++) {
        var block = this.removalList[i];
        var index = _game.allBoxes.indexOf(block);
        if(index > -1) {
          _game.gridState[block.row][block.col] = 0;
          _game.allBoxes.splice(index, 1);
          block.destroy();
        }
      }
    }
  }

  destroyBlock(data) {
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
      var row = _game.myTeam != data.team ? GRID_HEIGHT - data.row - 1: data.row;
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
