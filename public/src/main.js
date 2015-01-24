var
    // game states
    Boot = require('./states/boot'),
    Preloader = require('./states/preloader'),
    MainMenu = require('./states/main_menu'),
    Game = require('./states/game'),
    EndGame = require('./states/end_game'),

    // game elements
    GoodGuy = require('./entities/good_guy.js');

window.game = new Phaser.Game(800, 800, Phaser.AUTO, 'ggj');

// Add the States your game has.
// You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);

// Now start the Boot state.
game.state.start('Boot');
