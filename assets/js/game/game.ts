class GameState extends Phaser.State {

    // control
    key_space_bar : Phaser.Key;

    // world
    background : Phaser.Sprite;
    ships : Array<Objects.Ship>;
    ufo : Phaser.Sprite;
    asteroid_manager : Game.AsteroidManager;

    preload() {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        
        this.load.image('background', 'public/game_assets/images/background.jpg');
        this.load.image('ship', 'public/game_assets/images/ship.png');
        this.load.image('ufo', 'public/game_assets/images/ufo.png');
        this.load.image('bullet', 'public/game_assets/images/bullet.png');
		
		this.load.atlas('atlas', 'public/game_assets/images/asteroids.png', 'public/game_assets/images/asteroids.json');
        this.load.spritesheet('big_explosion', 'public/game_assets/images/big_explosion.png', 128, 128);
    }

    create() {
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.key_space_bar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = this.game.add.sprite(0, 0, 'background');

        // UFO
        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);

        this.ships = [];
		
		this.asteroid_manager = new Game.AsteroidManager(this.game);
        this.asteroid_manager.init();
		//this.create_asteroid(400,400,3);
		//this.create_asteroid(400,150,2);
		//this.create_asteroid(100,150,1);
		//this.create_asteroid(100,400,0);
         this.key_space_bar.onDown.add(this.begin_spawn_asteroid, this);
		
        // DUBUGGING
        // this.text = this.game.add.text(10, 10, 'here is a colored line of text',  { font: "32px Arial", fill: '#FF0000' });   
    }

    update() {
        for (var i in this.ships) {
            var ship = this.ships[i];

            ship.body.acceleration.set(0);
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
                var speed = 100;
                game.physics.arcade.accelerationFromRotation(ship.rotation, speed, ship.body.acceleration);
            }

            if (ship.thrust_amount > 0) {
                var speed = 100;
                game.physics.arcade.accelerationFromRotation(ship.rotation, speed, ship.body.acceleration);
            }

            if (ship.activate_weapon) ship.weapon.fire();

			ship.body.angularAcceleration += 300 * ship.angular_accel_amount;				
			//console.log(ship.body.angularVelocity);
        }

        this.game.physics.arcade.collide(this.asteroid_manager.asteroid_group);
        for (var ship of this.ships) {
            this.game.physics.arcade.overlap(ship.weapon.bullets, this.asteroid_manager.asteroid_group, 
                this.on_bullet_hit_asteroid, null, this);
        }
    }

    begin_spawn_asteroid() {
        this.asteroid_manager.begin_spawn_asteroid();
    }

    on_bullet_hit_asteroid( a : Phaser.Sprite, b : Objects.Asteroid ) {
        a.kill();
        // kill this asteroid
        b.kill();
        let explosion_scale = 1; 
        if(b.can_spawn_small_asteroids()){
            // spawn 2 more
            this.asteroid_manager.spawn_small_asteroids(b);
            explosion_scale = 2;
        }
        // add explosion vfx
        this.create_big_explosion_vfx(b, explosion_scale);
    }

    create_big_explosion_vfx( a : Phaser.Sprite, scale : number ) {
        let vfx = this.game.add.sprite(a.x, a.y, 'big_explosion');
        vfx.anchor.setTo(0.5);
        vfx.scale.setTo(scale);
        vfx.animations.add('explode');
        vfx.animations.play('explode', 15, false, true);
    }

    createShip(ship_name : string) {
        // Ship Setup
        var ship = new Objects.Ship(this);
        ship.name = ship_name;
        ship.position.set(250,250);
        game.add.existing(ship);
        this.ships.push(ship);
    }
	
	create_asteroid(x : number, y : number, id : number) {
		this.asteroid_manager.create_asteroid(x,y,id);
	}
}

//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);
var game = new Phaser.Game(1024, 1024, Phaser.AUTO);
var game_state = new GameState();
//Add all states
game.state.add("GameState", game_state);
//Start the first state
game.state.start("GameState");

var socket = io.connect();

declare var game_name : string;
socket.emit('gameConnect', {
    'game_name': game_name
});

socket.on('instruction', function (data : any) {
    var shipIndex = searchArrayOfObjectsByProperty("name",data.player_name, game_state.ships);
    if (typeof shipIndex === "number") {
        game_state.ships[shipIndex].angular_accel_amount = data.rotation;
        game_state.ships[shipIndex].thrust_amount = data.thrust;
        game_state.ships[shipIndex].activate_weapon = data.activate_weapon;
    } else {
        console.log("the name " + data.player_name + " does not exist :(")
    }

});

socket.on('newShip', function (data : any) {
    game_state.createShip(data.player_name);
});

function searchArrayOfObjectsByProperty(propertyToCheck : string, dataToFind : string, arrayToSearch : Array<any>) {
    for (var i=0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][propertyToCheck] == dataToFind) return i;
    }
    return false;
}