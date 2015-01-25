module.exports = class Preloader {

  constructor(game) {
    this.background = null;
    this.preloadBar = null;

    this.ready = false;
  }

  preload() {
    // These are the assets we loaded in Boot.js
    // A nice sparkly background and a loading progress bar
    this.preloadBar = this.add.sprite(0, 0, 'preloader-bar');
    this.preloadBar.x = game.width / 2 - this.preloadBar.width / 2;
    this.preloadBar.y = game.height / 2 - this.preloadBar.height / 2;

    // This sets the preloadBar sprite as a loader sprite.
    // What that does is automatically crop the sprite from 0 to full-width
    // as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    // alert messages
    this.load.image('message-waiting', 'assets/images/quotes/EnterWait_quote01.png');

    // Here we load the rest of the assets our game needs.
    // As this is just a Project Template I've not provided these assets, swap them for your own.
    this.load.image('good_guy', 'assets/images/character_png still 85px.png');
    this.load.image('block_trash', 'assets/images/elementos_01.png');
    this.load.image('block_paper', 'assets/images/elementos_02c 85px.png');
    this.load.image('block_car', 'assets/images/elementos_03c 85px.png');
    this.load.image('block_toilet', 'assets/images/elementos_04a 85px.png');
    this.load.image('block_bomb', 'assets/images/elementos_bomba01 85px.png');

    // texture packer atlases
    game.load.atlasJSONHash('good_guy', 'assets/images/good_guy.png', 'assets/images/good_guy.json');
    game.load.atlasJSONHash('miscelaneous', 'assets/images/miscelaneous.png', 'assets/images/miscelaneous.json');

    this.load_sky();

    this.load.image('skyline', 'assets/background/SkylineNoise.png');
    this.load.image('wires', 'assets/background/Fios_foreground.png');
    this.load.image('grid', 'assets/background/GRID_01.png');

    this.load.image('cursor-denied', 'assets/images/CliqueX_01.png');
    this.load.image('cursor-add', 'assets/images/cursor_add01.png');
    this.load.image('cursor-sub', 'assets/images/cursor_delete01.png');

    // audio
    this.load.audio('music-ambient', 'assets/audio/trilha/nivel1_ambiencia.mp3');
    this.load.audio('music-tense', 'assets/audio/trilha/nivel2_trilha.mp3');

    this.load.audio('audio-block', 'assets/audio/sons/create_block/create_block.mp3');
    this.load.audio('audio-block-remove', 'assets/audio/sons/remove/remove_block.mp3');
    this.load.audio('audio-block-undefined', 'assets/audio/sons/blocks/block_indefinido.mp3');
    this.load.audio('audio-block-metal', 'assets/audio/sons/blocks/block_metal.mp3');
    this.load.audio('audio-block-paper', 'assets/audio/sons/blocks/block_paper.mp3');
    this.load.audio('audio-bomb', 'assets/audio/sons/bomb/create_bomb.mp3');
    this.load.audio('audio-bomb-explode', 'assets/audio/sons/bomb/explosion_bomb.mp3');
    this.load.audio('audio-guy-walking', 'assets/audio/sons/steps/steps.mp3');
    this.load.audio('audio-guy-fall', 'assets/audio/sons/fall/fall.mp3');
    this.load.audio('audio-guy-jump', 'assets/audio/sons/jump/jump.mp3');
  }

  create() {
    Sound.get('music-ambient').play()

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

  load_sky() {
    var filenames = [ 'Sky_cycle03_00000.png',
                      'Sky_cycle03_00001.png',
                      'Sky_cycle03_00002.png',
                      'Sky_cycle03_00003.png',
                      'Sky_cycle03_00004.png',
                      'Sky_cycle03_00005.png',
                      'Sky_cycle03_00006.png',
                      'Sky_cycle03_00007.png',
                      'Sky_cycle03_00008.png',
                      'Sky_cycle03_00009.png',
                      'Sky_cycle03_00010.png',
                      'Sky_cycle03_00011.png',
                      'Sky_cycle03_00012.png',
                      'Sky_cycle03_00013.png',
                      'Sky_cycle03_00014.png',
                      'Sky_cycle03_00015.png',
                      'Sky_cycle03_00016.png',
                      'Sky_cycle03_00017.png',
                      'Sky_cycle03_00018.png',
                      'Sky_cycle03_00019.png',
                      'Sky_cycle03_00020.png',
                      'Sky_cycle03_00021.png',
                      'Sky_cycle03_00022.png',
                      'Sky_cycle03_00023.png',
                      'Sky_cycle03_00024.png',
                      'Sky_cycle03_00025.png',
                      'Sky_cycle03_00026.png',
                      'Sky_cycle03_00027.png',
                      'Sky_cycle03_00028.png',
                      'Sky_cycle03_00029.png',
                      'Sky_cycle03_00030.png',
                      'Sky_cycle03_00031.png',
                      'Sky_cycle03_00032.png',
                      'Sky_cycle03_00033.png',
                      'Sky_cycle03_00034.png',
                      'Sky_cycle03_00035.png',
                      'Sky_cycle03_00036.png',
                      'Sky_cycle03_00037.png',
                      'Sky_cycle03_00038.png',
                      'Sky_cycle03_00039.png',
                      'Sky_cycle03_00040.png',
                      'Sky_cycle03_00041.png',
                      'Sky_cycle03_00042.png',
                      'Sky_cycle03_00043.png',
                      'Sky_cycle03_00044.png',
                      'Sky_cycle03_00045.png',
                      'Sky_cycle03_00046.png',
                      'Sky_cycle03_00047.png',
                      'Sky_cycle03_00048.png',
                      'Sky_cycle03_00049.png' ];

    window.sky_names = [];
    for (var i = 0; i < filenames.length; i++) {
      this.load.image("sky"+i, 'assets/background/Sky_cycle/'+filenames[i]);
      window.sky_names.push("sky"+i);
    };
  }

}
