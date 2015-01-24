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

    this.sprite.width = GRID_SIZE_PX;
    this.sprite.height = GRID_SIZE_PX;

    //
    this.state = STATE.FALLING;
  }

  update(gridState) {
    this.row = Math.floor(this.sprite.x / GRID_SIZE_PX);
    this.col = Math.floor(this.sprite.y / GRID_SIZE_PX);

    // set as FALLING when ground is empty
    if (gridState[this.row][this.col+1] == 0) {
      this.state = STATE.FALLING;
    }

    if (this.state == STATE.FALLING) {
      this.gravity += GRAVITY;
      this.sprite.y += game.time.physicsElapsed * this.gravity;

      if(this.sprite.y + GRID_SIZE_PX >= game.height) {
        this.sprite.y = game.height - GRID_SIZE_PX;
        this.gravity = 0;
        this.state = STATE.WALKING;
      }

    } else if (this.state == STATE.WALKING) {
      var direction = (this.direction) ? 1 : -1;
      this.sprite.x += game.time.physicsElapsed * this.acceleration * direction;

      window.gridState = gridState;

      console.log(
        this.row, this.col,
        gridState[this.row] && gridState[this.row][this.col + direction],
        gridState[this.row - 1] && gridState[this.row - 1][this.col + direction]
      );

      if (gridState[this.row] && gridState[this.row][this.col + direction] != 0 &&
          gridState[this.row - 1] && gridState[this.row - 1][this.col + direction] == 0) {
        this.state = STATE.CLIMBING;
      }

    } else if (this.state == STATE.CLIMBING) {

    }

  }

  onCollide() {
  }

  updateCoords() {
  }


}
