var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

var GameState = {
    preload: function () {
        this.load.image('background', 'assets/game_assets/images/background.jpg');
        this.load.image('ship', 'assets/game_assets/images/ship.png');
        this.load.image('ufo', 'assets/game_assets/images/ufo.png')
    },
    create: function () {
        this.background = this.game.add.sprite(0, 0, 'background');

        this.ship = this.game.add.sprite(250, 250, 'ship');
        this.ship.anchor.setTo(0.5);
        this.ship.scale.setTo(0.1);

        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);
    },
    update: function () {
        this.ship.angle += 1;
    }
};

//Add all states
game.state.add("GameState", GameState);

//Start the first state
game.state.start("GameState");