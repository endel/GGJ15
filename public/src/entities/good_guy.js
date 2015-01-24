class GoodGuy {

  constructor() {
    var posx = data.x;
    var posy = data.y;
    var box = game.add.sprite(posx, posy, 'box');
    box.width = gridSizePx;
    box.height = gridSizePx;
    game.physics.enable(box, Phaser.Physics.ARCADE);
    box.body.collideWorldBounds = true;
    box.body.allowGravity = true;
    box.body.bounce.y = 0.1;
    allBoxes.push(box);
  }

  onCollide() {

  }

}

module.exports = GoodGuy
