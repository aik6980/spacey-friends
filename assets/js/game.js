/// Asteroid prototype
var Asteroid = function(game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'atlas');
	this.anchor.setTo(0.5);
}

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function()
{
	this.angle += 1;
}
/// ---

/// Asteroids Manager
var AsteroidManager = function(game){
	this.game = game;
	this.asteroid_group = game.add.group();
}

AsteroidManager.prototype.constructor = AsteroidManager;

AsteroidManager.prototype.create_asteroid = function(x, y, id)
{
	var asteroid = new Asteroid(this.game, x, y);
	asteroid.frameName = "asteroid" + id;
	
	this.asteroid_group.add(asteroid);
}
/// ---

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

var GameState = {
    preload: function () {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        
        this.load.image('background', 'assets/game_assets/images/background.jpg');
        this.load.image('ship', 'assets/game_assets/images/ship.png');
        this.load.image('ufo', 'assets/game_assets/images/ufo.png')
		
		this.load.atlas('atlas', 'assets/game_assets/images/asteroids.png', 'assets/game_assets/images/asteroids.json');
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
		
		this.asteroid_manager = new AsteroidManager(this);
		this.create_asteroid(400,400,3);
		this.create_asteroid(400,150,2);
		this.create_asteroid(100,150,1);
		this.create_asteroid(100,400,0);
		
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

            if (ship.thrust) {
                game.physics.arcade.accelerationFromRotation(ship.rotation, ship.speed, ship.body.acceleration);
            } else {
                ship.body.acceleration.set(0);
            }

			ship.body.angularAcceleration += 300 * ship.angular_accel_amount;				
			//console.log(ship.body.angularVelocity);
        }
    },
    createShip : function (ship_name) {
        // Ship Setup
        var ship = this.game.add.sprite(250, 250, 'ship');
        ship.shipName = ship_name;
        ship.anchor.setTo(0.5);
        ship.scale.setTo(0.03);
        ship.angular_accel_amount = 0.0;
        ship.thrust = null;
        game.physics.arcade.enable(ship);

        // Ship Rotation
        ship.body.allowRotation = true;
        //ship.body.maxAngular = 300;
        ship.body.angularDrag = 350;

        // Ship Movement
        ship.body.drag.set(10);
        ship.body.maxVelocity.set(100);
        ship.speed = 100;
		
		ship.body.enable = true;
        this.ships.push(ship);
    },
	
	create_asteroid : function(x, y, id) {
		this.asteroid_manager.create_asteroid(x,y,id);
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
    var shipIndex = searchArrayOfObjectsByProperty("shipName",data.player_name, GameState.ships);
    if (typeof shipIndex === "number") {
        GameState.ships[shipIndex].angular_accel_amount = data.rotation;
        GameState.ships[shipIndex].thrust = data.thrust;
        console.log(data.thrust);
    } else {
        console.log("the name " + data.player_name + " does not exist :(")
    }

});

socket.on('newShip', function (data) {
    GameState.createShip(data.player_name);
});

function searchArrayOfObjectsByProperty(propertyToCheck, dataToFind, arrayToSearch) {
    for (var i=0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][propertyToCheck] == dataToFind) return i;
    }
    return false;
}