var instance = null;

module.exports = class Sound {

  constructor() {
    this.sounds = {
      'music-tense': game.add.audio('music-tense'),
      'music-ambient': game.add.audio('music-ambient'),

      'block-block_paper': game.add.audio('audio-block-paper'),
      'block-block_car': game.add.audio('audio-block-metal'),
      'block-block_toilet': game.add.audio('audio-block-undefined'),

      'guy-fall': game.add.audio('audio-guy-fall'),
      'guy-jump': game.add.audio('audio-guy-jump'),
      'guy-walking': game.add.audio('audio-guy-walking', 1, true),

      'steps': game.add.audio('audio-steps'),
      'block': game.add.audio('audio-block'),
      'block-remove': game.add.audio('audio-block-remove'),
      'block-undefined': game.add.audio('audio-block-undefined'),
      'block-metal': game.add.audio('audio-block-metal'),
      'block-paper': game.add.audio('audio-block-paper'),
      'bomb': game.add.audio('audio-bomb'),
      'bomb-explode': game.add.audio('audio-bomb-explode'),
    }
  }

  static get(name) {
    return this.getInstance().sounds[name];
  }

  static getInstance() {
    if (!instance) { instance = new Sound(); }
    return instance;
  }

}
