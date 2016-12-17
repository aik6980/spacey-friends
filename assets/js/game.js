var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

var rotation;
var thrust;

var GameState = {
    preload: function () {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        
        this.load.image('background', 'assets/game_assets/images/background.jpg');
        this.load.image('ship', 'assets/game_assets/images/ship.png');
        this.load.image('ufo', 'assets/game_assets/images/ufo.png')
    },
    create: function () {
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = this.game.add.sprite(0, 0, 'background');

        // UFO
        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);

        this.ships = [];

        // DUBUGGING
        // this.text = this.game.add.text(10, 10, 'here is a colored line of text',  { font: "32px Arial", fill: '#FF0000' });
    },
    update: function () {

        for (var i in this.ships) {
            var ship = this.ships[i];
            ship.body.angularAcceleration = 0;
            //  Apply acceleration if the left/right arrow keys are held down
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
            {
                ship.body.angularAcceleration -= 300;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            {
                ship.body.angularAcceleration += 300;
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
            {
                game.physics.arcade.accelerationFromRotation(ship.rotation, ship.speed, ship.body.acceleration);
            } else {
                ship.body.acceleration.set(0);
            }

            if (thrust) {
                game.physics.arcade.accelerationFromRotation(ship.rotation, ship.speed, ship.body.acceleration);
            } else {
                ship.body.acceleration.set(0);
            }

            ship.body.angularAcceleration += 300 * rotation;
        }
        //  Reset the acceleration

    },
    createShip : function (ship_name) {
        // Ship Setup
        var ship = this.game.add.sprite(250, 250, 'ship');
        ship.shipName = ship_name;
        ship.anchor.setTo(0.5);
        ship.scale.setTo(0.03);
        game.physics.arcade.enable(ship);

        // Ship Rotation
        ship.body.allowRotation = true;
        ship.body.maxAngular = 300;
        ship.body.angularDrag = 350;

        // Ship Movement
        ship.body.drag.set(10);
        ship.body.maxVelocity.set(100);
        ship.speed = 100;

        this.ships.push(ship);
    }
};

//Add all states
game.state.add("GameState", GameState);

//Start the first state
game.state.start("GameState");

var socket = io.connect();

socket.emit('gameConnect', {
    'game_name': game_name
});

socket.on('instruction', function (data) {
    rotation = data.rotation;
    thrust = data.thrust;
});

socket.on('newShip', function (data) {
    GameState.createShip(data.player_name);
});
