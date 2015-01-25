var STATE = {
  FALLING: 0,
  WALKING: 1,
  CLIMBING: 2,
  CLIMBING_DOWN: 3,
  TURNING: 4,
}

var musicLevel = 0, levelToGetTense = 4;

module.exports = class GoodGuy {

  constructor(sprite, data) {
    this.sprite = sprite;
    this.direction = true;

    this.gravity = GRAVITY;
    this.acceleration = 30;

    this.row = Math.floor(data.x / GRID_SIZE_PX);
    this.col = Math.floor(data.y / GRID_SIZE_PX);

    var posx = this.row * GRID_SIZE_PX;
    var posy = this.col * GRID_SIZE_PX;
    sprite.x = posx;
    sprite.y = posy;
    this.team = data.team;

    this.audioWalking = Sound.get('guy-walking');
    this.audioJump = Sound.get('guy-jump');
    this.audioJumpDown = Sound.get('guy-fall');

    var oldWidth = this.sprite.width,
        oldHeight = this.sprite.height;
    this.sprite.height = GRID_SIZE_PX;
    this.spriteScale = GRID_SIZE_PX / oldHeight
    this.sprite.width = this.spriteScale * this.sprite.width;

    this.sprite.events.onAnimationComplete.add(function(anim) {
      if (this.state == STATE.TURNING) {
        // Can't climb, invert direction
        this.sprite.scale.x *= -1;
        this.direction = !this.direction;

        // fix anchor for inverted direction
        if (this.sprite.scale.x < 0) {
          this.sprite.anchor.setTo(1, 0);
        } else {
          this.sprite.anchor.setTo(0, 0);
        }
      }

      // 136x170
      // 100x100
      if (this.state == STATE.CLIMBING || this.state == STATE.CLIMBING_DOWN) {
        this.sprite.x = this.targetClimbingCol * GRID_SIZE_PX;
        this.sprite.y = this.targetClimbingRow * GRID_SIZE_PX;
      }

      this.state = STATE.WALKING;
    }, this);

    //
    this.state = STATE.FALLING;
    this.sprite.play('falling');
    this.targetClimbingRow = null;
    this.targetClimbingCol = null;
  }

  set state(state) {
    this._state = state;
    console.log("Set state: ", state);
    if (state == STATE.WALKING) {
      if (!this.audioWalking.isPlaying) {
        this.audioWalking.play();
      }
      this.sprite.play('walk');

    } else if (state == STATE.FALLING) {
      this.sprite.play('falling');
      this.audioWalking.stop();

    } else if (state == STATE.CLIMBING) {
      this.sprite.play('jump');

      this.audioWalking.stop();
      this.audioJump.play();

    } else if (state == STATE.CLIMBING_DOWN) {
      this.sprite.play('jump_down');
      this.audioWalking.stop();
      this.audioJumpDown.play();

    } else if (state == STATE.TURNING) {
      this.sprite.play('turning');
    }

  }

  get state() {
    return this._state;
  }

  update(gridState) {
    var direction = (this.direction) ? 1 : -1;

    this.col = Math.floor(this.sprite.x / GRID_SIZE_PX);
    this.row = Math.floor(this.sprite.y / GRID_SIZE_PX);

    var vel = game.time.physicsElapsed * this.acceleration * direction;
    // var vel = 0;

    var nextCol = Math.ceil((this.sprite.x + vel) / GRID_SIZE_PX);
    var nextRow = Math.ceil((this.sprite.y) / GRID_SIZE_PX);

    // set as FALLING when ground is empty
    if (this.state != STATE.CLIMBING && this.state != STATE.CLIMBING_DOWN &&
        gridState[this.row + 1] && gridState[this.row + 1][(direction > 0 ? this.col : nextCol)] == 0) {
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
      var willInvertDirection = false;

      if (musicLevel == 0 && GRID_WIDTH - this.row > levelToGetTense) {
        musicLevel = 1;
        Sound.get('music-ambient').stop()
        Sound.get('music-tense').play()
      }

      if (typeof(gridState[this.row][this.col + this.direction]) !== "undefined") {
        this.sprite.x += game.time.physicsElapsed * this.acceleration * direction;
      } else {
        willInvertDirection = true;
      }

      // fix direction for checking gridState
      if (direction == -1) direction = 0;

      if (typeof(gridState[this.row][this.col + direction]) !== "undefined" &&
          gridState[this.row][this.col + direction] != 0 &&
          gridState[this.row][this.col + direction].accel == 0) {

        // CLIMBING UP?
        if (gridState[this.row - 1][this.col + direction] == 0) {
          this.targetClimbingRow = this.row - 1;
          this.targetClimbingCol = this.col + direction;

          this.state = STATE.CLIMBING;

          this.sprite.y -= 84 * this.spriteScale;
          this.sprite.x += 36 * ((this.direction) ? 1 : -1.7) * this.spriteScale;

        } else {
          willInvertDirection = true;
        }

      } else if (typeof(gridState[this.row][this.col + direction]) !== "undefined" &&
          gridState[this.row][this.col + direction] == 0 &&
          gridState[this.row + 1]) {

        // CLIMBING DOWN?
        if (gridState[this.row + 1][this.col + direction] == 0 &&
            (typeof(gridState[this.row + 2]) == "undefined" || gridState[this.row + 2][this.col + direction] != 0)) {
          this.targetClimbingRow = this.row + 1;
          this.targetClimbingCol = this.col + direction;

          this.state = STATE.CLIMBING_DOWN;
          this.sprite.y += 10 * this.spriteScale;
          this.sprite.x += 36 * ((this.direction) ? 1 : -1.7) * this.spriteScale;

        } else if (gridState[this.row + 2] && gridState[this.row + 2][this.col + direction] == 0) {
          console.log("invert")
          willInvertDirection = true;
        }
      }

      if (willInvertDirection) {
        this.state = STATE.TURNING;
      }
    }


  }

  onCollide() {
  }

  updateCoords() {
  }


}
