// game states
var Boot = require('./states/boot'),
    Preloader = require('./states/preloader'),
    MainMenu = require('./states/main_menu'),
    Game = require('./states/game'),
    EndGame = require('./states/end_game');

window.Sound = require('./sound');

window.GRID_WIDTH = 10;
window.GRID_HEIGHT = 10;
window.GRID_SIZE_PX = 80;
window.GRAVITY = 2;

window.game = new Phaser.Game(800, 800, Phaser.AUTO, 'ggj');

// Add the States your game has.
// You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);

// Now start the Boot state.
game.state.start('Boot');
