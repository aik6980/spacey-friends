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

        // Ship Setup
        this.ship = this.game.add.sprite(250, 250, 'ship');
        this.ship.anchor.setTo(0.5);
        this.ship.scale.setTo(0.03);
        game.physics.arcade.enable(this.ship);

        // Ship Rotation
        this.ship.body.allowRotation = true;
        this.ship.body.maxAngular = 300;
        this.ship.body.angularDrag = 350;

        // Ship Movement
        this.ship.body.drag.set(10);
        this.ship.body.maxVelocity.set(100);
        this.ship.speed = 100;

        // UFO
        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);


        // DUBUGGING
        // this.text = this.game.add.text(10, 10, 'here is a colored line of text',  { font: "32px Arial", fill: '#FF0000' });
    },
    update: function () {

        //  Reset the acceleration
        this.ship.body.angularAcceleration = 0;
        //  Apply acceleration if the left/right arrow keys are held down
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            this.ship.body.angularAcceleration -= 300;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            this.ship.body.angularAcceleration += 300;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.physics.arcade.accelerationFromRotation(this.ship.rotation, this.ship.speed, this.ship.body.acceleration);
        } else {
            this.ship.body.acceleration.set(0);
        }
       
        if (thrust) {
            game.physics.arcade.accelerationFromRotation(this.ship.rotation, this.ship.speed, this.ship.body.acceleration);
        } else {
            this.ship.body.acceleration.set(0);
        }

        this.ship.body.angularAcceleration += 300 * rotation;
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