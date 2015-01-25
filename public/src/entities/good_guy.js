var STATE = {
  FALLING: 0,
  WALKING: 1,
  CLIMBING: 2
}

module.exports = class GoodGuy {

  constructor(sprite, data) {
    this.sprite = sprite;
    this.direction = true;

    this.gravity = GRAVITY;
    this.acceleration = 10;

    this.row = Math.floor(data.x / GRID_SIZE_PX);
    this.col = Math.floor(data.y / GRID_SIZE_PX);

    var posx = this.row * GRID_SIZE_PX;
    var posy = this.col * GRID_SIZE_PX;
    sprite.x = posx;
    sprite.y = posy;
    this.team = data.team;

    this.sprite.width = 6; //GRID_SIZE_PX;
    this.sprite.height = GRID_SIZE_PX * this.sprite.scale.y;

    //
    this.state = STATE.FALLING;
    this.targetClimbingRow = null;
    this.targetClimbingCol = null;
  }

  update(gridState) {
    var direction = (this.direction) ? 1 : -1;

    this.col = Math.floor(this.sprite.x / GRID_SIZE_PX);
    this.row = Math.floor(this.sprite.y / GRID_SIZE_PX);

    var nextCol = Math.ceil(this.sprite.x / GRID_SIZE_PX);
    var nextRow = Math.ceil(this.sprite.y / GRID_SIZE_PX);

    // set as FALLING when ground is empty
    if (gridState[this.row + 1] && gridState[this.row + 1][(direction > 0 ? this.col : nextCol)] == 0) {
      this.state = STATE.FALLING;
    }

    if (this.state == STATE.FALLING) {
      this.gravity += GRAVITY;
      this.sprite.y += game.time.physicsElapsed * this.gravity;

      var nextRow = Math.ceil(this.sprite.y / GRID_SIZE_PX);
      if (gridState[nextRow] && gridState[nextRow][this.col] != 0) {
        this.gravity = 0;
        this.state = STATE.WALKING;

      } else if (this.sprite.y + GRID_SIZE_PX >= game.height) {
        this.sprite.y = game.height - GRID_SIZE_PX;
        this.gravity = 0;
        this.state = STATE.WALKING;
      }

    } else if (this.state == STATE.WALKING) {

      this.sprite.x += game.time.physicsElapsed * this.acceleration * direction;

      // fix direction for checking gridState
      if (direction == -1) direction = 0;

      if (gridState[this.row][this.col + direction] != 0) {
        if (gridState[this.row - 1][this.col + direction] == 0) {
          this.state = STATE.CLIMBING;
          this.targetClimbingRow = this.row - 1;
          this.targetClimbingCol = this.col + direction;

        } else {
          // Can't climb, invert direction
          this.direction = !this.direction;
        }
      }

    } else if (this.state == STATE.CLIMBING) {

      // play climbing animation
      setTimeout(function() {
        this.state = STATE.WALKING;
        this.sprite.y = this.targetClimbingRow * GRID_SIZE_PX - 2;
        this.sprite.x = this.targetClimbingCol * GRID_SIZE_PX;
      }.bind(this), 100)
    }
  }


  updateUpsideDown(gridState) {
    var direction = (this.direction) ? 1 : -1;

    this.col = Math.ceil(this.sprite.x / GRID_SIZE_PX);
    this.row = Math.ceil(this.sprite.y / GRID_SIZE_PX);

    var nextCol = Math.floor(this.sprite.x / GRID_SIZE_PX);
    var nextRow = Math.floor(this.sprite.y / GRID_SIZE_PX);

    // set as FALLING when ground is empty
    if (gridState[this.row - 1] && gridState[this.row - 1][(direction > 0 ? this.col : nextCol)] == 0) {
      this.state = STATE.FALLING;
    }

    if (this.state == STATE.FALLING) {
      this.gravity += GRAVITY;
      this.sprite.y -= game.time.physicsElapsed * this.gravity;

      var nextRow = Math.floor(this.sprite.y / GRID_SIZE_PX);
      if (gridState[nextRow] && gridState[nextRow][this.col] != 0) {
        this.gravity = 0;
        this.state = STATE.WALKING;

      } else if (this.sprite.y <= 0) {
        this.sprite.y = 0;
        this.gravity = 0;
        this.state = STATE.WALKING;
      }

    } else if (this.state == STATE.WALKING) {

      this.sprite.x += game.time.physicsElapsed * this.acceleration * direction;

      // fix direction for checking gridState
      if (direction == -1) direction = 0;

      if (gridState[this.row][this.col + direction] != 0) {
        if (gridState[this.row + 1][this.col + direction] == 0) {
          this.state = STATE.CLIMBING;
          this.targetClimbingRow = this.row + 1;
          this.targetClimbingCol = this.col + direction;

        } else {
          // Can't climb, invert direction
          this.direction = !this.direction;
        }
      }

    } else if (this.state == STATE.CLIMBING) {

      // play climbing animation
      setTimeout(function() {
        this.state = STATE.WALKING;
        this.sprite.y = this.targetClimbingRow * GRID_SIZE_PX + 2;
        this.sprite.x = this.targetClimbingCol * GRID_SIZE_PX;
      }.bind(this), 100)

    }

  }

  onCollide() {
  }

  updateCoords() {
  }


}
