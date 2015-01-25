module.exports = class Preloader {

  constructor(game) {
    this.background = null;
    this.preloadBar = null;

    this.ready = false;
  }

  preload() {
    console.log("Preload...");

    // These are the assets we loaded in Boot.js
    // A nice sparkly background and a loading progress bar
    this.background = this.add.sprite(0, 0, 'preloader-background');
    this.preloadBar = this.add.sprite(300, 400, 'preloader-bar');

    // This sets the preloadBar sprite as a loader sprite.
    // What that does is automatically crop the sprite from 0 to full-width
    // as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    // Here we load the rest of the assets our game needs.
    // As this is just a Project Template I've not provided these assets, swap them for your own.
    this.load.image('good_guy', 'assets/images/character_png still 85px.png');
    this.load.image('block_trash', 'assets/images/elementos_01.png');
    this.load.image('block_paper', 'assets/images/elementos_02c 85px.png');
    this.load.image('block_car', 'assets/images/elementos_03c 85px.png');
    this.load.image('block_toilet', 'assets/images/elementos_04a 85px.png');

    // texture packer atlases
    game.load.atlasJSONHash('good_guy', 'assets/images/good_guy.png', 'assets/images/good_guy.json');

    this.load.image('sky', 'assets/background/Sky_cycle/sky_cycle02_00000.png');
    this.load.image('skyline', 'assets/background/SkylineNoise.png');
    this.load.image('wires', 'assets/background/Fios_foreground.png');
    this.load.image('grid', 'assets/background/GRID_01.png');
    this.load.audio('music-background', 'assets/sound/sample_song.mp3');
  }

  create() {
    // Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;
  }

  update() {

    // You don't actually need to do this, but I find it gives a much smoother game experience.
    // Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    // You can jump right into the menu if you want and still play the music, but you'll have a few
    // seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    // it's best to wait for it to decode here first, then carry on.

    // If you don't have any music in your game then put the game.state.start line into the create function and delete
    // the update function completely.

    // if (this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
    //   this.ready = true;
    //   this.state.start('MainMenu');
    // }

    console.log("Goto main menu")
    this.state.start('Game');

  }

}
