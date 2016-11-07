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
        this.ship.rotationSpeed = 3;
        this.ship.direction = 0;

        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);



        this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.right.onDown.add(rotateShipRight, this);
        this.right.onUp.add(stopRotateRight, this);

        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.left.onDown.add(rotateShipLeft, this);
        this.left.onUp.add(stopRotateLeft, this);



    },
    update: function () {
        this.ship.angle += this.ship.direction * this.ship.rotationSpeed;
    }

};

function rotateShipRight() {
    this.ship.direction = 1;
}

function stopRotateRight() {
    if (this.ship.direction > 0) {
        this.ship.direction = 0;
    }
}

function rotateShipLeft() {
    this.ship.direction = -1;
}

function stopRotateLeft() {
    if (this.ship.direction < 0) {
        this.ship.direction = 0;
    }
}


//Add all states
game.state.add("GameState", GameState);

//Start the first state
game.state.start("GameState");