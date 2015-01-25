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
      console.log("destroyBlock", Sound.get('block-remove'));
      Sound.get('block-remove').play();

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
      var grid = _game.myTeam != data.team ? _game.theirGridState : _game.gridState;
      var box = grid[row][col];
      var objArray = _game.myTeam != data.team ? _game.allTheirBoxes : _game.allBoxes;
      if(box){
        var index = objArray.indexOf(box);
        if(index > -1){
          objArray.splice(index, 1);
        }
        grid[row][col] = 0;

        var removeEffect = this.game.add.sprite(col * GRID_SIZE_PX, row * GRID_SIZE_PX, 'miscelaneous');
        removeEffect.width = box.width;
        removeEffect.height = box.height;
        var defaultAnimation = removeEffect.animations.add('default', [
          'subtracao_07941.png',
          'subtracao_07942.png',
          'subtracao_07943.png',
          'subtracao_07944.png',
          'subtracao_07945.png',
          'subtracao_07946.png',
          'subtracao_07947.png',
          'subtracao_07948.png',
          'subtracao_07949.png',
          'subtracao_07950.png',
          'subtracao_07951.png',
          'subtracao_07952.png',
          'subtracao_07953.png',
          'subtracao_07954.png',
          'subtracao_07955.png',
          'subtracao_07956.png',
        ], 24, false, false);
        defaultAnimation.killOnComplete = true;
        removeEffect.play('default');

        box.destroy();
      }
    }
  }
}

BlockDestroyer.MESSAGE = MESSAGE;

module.exports = BlockDestroyer
