var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

var GameState = {
    preload: function () {
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

        this.ship = this.game.add.sprite(250, 250, 'ship');
        this.ship.anchor.setTo(0.5);
        this.ship.scale.setTo(0.03);
        this.ship.rotationSpeed = 5;
        this.ship.direction = 0;
        game.physics.arcade.enable(this.ship);
        this.ship.body.allowRotation = true;
        this.ship.body.maxAngular = 500;
        this.ship.body.angularDrag = 150;

        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);
    },
    update: function () {
        this.ship.angle += this.ship.direction * this.ship.rotationSpeed;

        //  Reset the acceleration
        this.ship.body.angularAcceleration = 0;
        //  Apply acceleration if the left/right arrow keys are held down
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            this.ship.body.angularAcceleration -= 200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            this.ship.body.angularAcceleration += 200;
        }

        game.physics.arcade.velocityFromAngle(this.ship.angle, 10, this.ship.body.velocity)
    }
};

function rotateShipRight() {
    this.ship.body.angularAcceleration -= 200;
}

function rotateShipLeft() {
    this.ship.body.angularAcceleration += 200;
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

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'background');    //Vehicles group hold all cars
    vehicles = game.add.group();
    var policecar = vehicles.create(700, streetHeight, 'policecar');
    vehicles.setAll('anchor.x', 0);    vehicles.setAll('anchor.y', 1);
    game.physics.arcade.enable(policecar);
    policecar.animations.add('run');
    policecar.animations.play('run', 15, true);
    policecar.inputEnabled = true;
    policecar.events.onInputDown.add(ItemClicked, this);
    game.physics.arcade.moveToXY(policecar, 100, streetHeight);
}

function ItemClicked (sprite) {    //gets the sprite of the item clicked
   counter++;
    console.log(counter);
    sprite.body.acceleration.x = -1000;
}
