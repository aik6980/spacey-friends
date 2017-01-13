class GameState extends Phaser.State {

    // control
    key_space_bar : Phaser.Key;

    // world
    background : Phaser.TileSprite;
    base : Phaser.Sprite;

    ships : Phaser.Group;
    color_shift_val = 0.0;

    ufo : Phaser.Sprite;
    asteroid_manager : Game.AsteroidManager;
    score = 0;
    text: Phaser.Text;

    preload() {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        
        this.load.image('background', 'public/game_assets/images/background.jpg');
        this.load.image('planet', 'public/game_assets/images/planet.png');
        this.load.image('ship', 'public/game_assets/images/ship.png');
        this.load.image('ufo', 'public/game_assets/images/ufo.png');
        this.load.image('bullet', 'public/game_assets/images/bullet.png');
        this.game.load.image('smoke', 'public/game_assets/images/smoke.png'); 
		
		this.load.atlas('atlas', 'public/game_assets/images/asteroids.png', 'public/game_assets/images/asteroids.json');
        this.load.spritesheet('big_explosion', 'public/game_assets/images/big_explosion.png', 128, 128);
    }

    create() {
        // scale the game
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.key_space_bar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        let planet = this.game.add.sprite(this.game.width/2, this.game.height/2, 'planet');
        planet.anchor.setTo(0.5);

        // UFO
        this.ufo = this.game.add.sprite(250, 50, 'ufo');
        this.ufo.anchor.setTo(0.5);
        this.ufo.scale.setTo(0.1);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        this.text = game.add.text(0, 0, "Score = " + this.score, style);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.text.setTextBounds(0, 0, this.game.width, this.game.height * 0.1);
        this.text.align = "center";

        this.ships = this.game.add.group();
		
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
        for (var i in this.ships.children) {
            var ship : Objects.Ship = this.ships.children[i] as Objects.Ship;
            ship.body.acceleration.set(0);
            ship.body.angularAcceleration = 0;

            if (ship.break_down) continue;

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
        // this.game.physics.arcade.collide(this.ships);
        for (var i in this.ships.children) {

            var ship : Objects.Ship = this.ships.children[i] as Objects.Ship;

            if (ship.position.x > this.game.width + ship.height) {
                ship.position.x = 0 - ship.height;
            } else if (ship.position.x < 0 - ship.height) {
                ship.position.x = this.game.width + ship.height;
            }

            if (ship.position.y > this.game.height + ship.height) {
                ship.position.y = 0 - ship.height;
            } else if (ship.position.y < 0 - ship.height) {
                ship.position.y = this.game.height + ship.height;
            }


            this.game.physics.arcade.overlap(ship.weapon.bullets, this.asteroid_manager.asteroid_group, 
                this.on_bullet_hit_asteroid, null, this);

            this.game.physics.arcade.overlap(ship, this.asteroid_manager.asteroid_group, 
                this.on_ship_hit_asteroid, null, this);
        }

        // detect ships overlapping each other
        this.game.physics.arcade.overlap(this.ships, this.ships, this.on_ships_overlapped_event,
            this.on_ships_overlapped, this);

        // emit player stats
        var player_stats = new Array<Shared.PlayerStatMessage>();
        for (var i in this.ships.children) {
            var ship : Objects.Ship = this.ships.children[i] as Objects.Ship;
            player_stats.push( { player_name: ship.name, curr_health: ship.health, 
                max_health: ship.maxHealth } );
        }

        if(player_stats.length > 0) {
            socket.emit('update_player_stats', { game_name: game_name, player_stats } );
        }

        //Checks if all ships are dead
        if (this.ships.children.length > 0) {
            var dead = true;
            for (var i in this.ships.children) {
                var ship : Objects.Ship = this.ships.children[i] as Objects.Ship;
                if (!(ship.break_down)) {
                    dead = false;
                }
            }
        }

        if (dead) {
            console.log("DEAAAAAADA");
            socket.emit('gameOver', {
                'game_name': game_name,
                'score': this.score
            });
            this.text.setText("GAME OVER\nFinal Score = " + this.score);
            window.location.href = '/';
        }

    }

    begin_spawn_asteroid() {
        this.asteroid_manager.begin_spawn_asteroid();
    }

    on_ships_overlapped_event( a: Objects.Ship, b: Objects.Ship ) {
        if (a.break_down && b.break_down) {
            return;
        }

        if(a.break_down) {
            a.health = a.maxHealth;
            a.break_down = false;
        }

        if(b.break_down) {
            b.health = b.maxHealth;
            b.break_down = false;
        }
    }

    test = true;
    on_ships_overlapped( a: Objects.Ship, b: Objects.Ship ) {
         return true;
    }

    on_ship_hit_asteroid( a : Objects.Ship, b : Objects.Asteroid ) {
        a.health -= a.maxHealth * 1;
        if( a.health < 0 ) {
            a.health = 0;
        }

        a.body.velocity = b.body.velocity;
        b.kill();
        // add explosion vfx
        this.create_big_explosion_vfx(b, Game.AsteroidManager.explosion_scale);
    }

    on_bullet_hit_asteroid( a : Phaser.Sprite, b : Objects.Asteroid ) {
        this.score += 10;
        this.text.setText("Score = " + this.score);
        a.kill();
        // kill this asteroid
        b.kill();
        let explosion_scale = Game.AsteroidManager.explosion_scale_sm; 
        if(b.can_spawn_small_asteroids()){
            // spawn 2 more
            this.asteroid_manager.spawn_small_asteroids(b);
            explosion_scale = Game.AsteroidManager.explosion_scale;
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
        ship.position.set(this.game.width/2, this.game.height/2 - 100);
        ship.angle = -90;

        ship.set_texture_color_shift(this.color_shift_val);
        Phaser.Math.wrap( this.color_shift_val += 0.1, 0.0, 1.0 );

        this.ships.add(ship);
    }

    destroyShip(ship_name : string) {
        for (var shipIndex in this.ships.children) {
            var ship = this.ships.children[shipIndex] as Objects.Ship;
            if (ship.name === ship_name) {
                this.ships.remove(ship, true);
            }
        }
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

socket.emit('update_player_stat');

socket.on('instruction', function (data : any) {
    var shipIndex = searchArrayOfObjectsByProperty("name",data.player_name, game_state.ships.children);
    if (typeof shipIndex === "number") {
        var ship : Objects.Ship = game_state.ships.children[shipIndex] as Objects.Ship;
        ship.angular_accel_amount = data.rotation;
        ship.thrust_amount = data.thrust;
        ship.activate_weapon = data.activate_weapon;
    } else {
        console.log("the name " + data.player_name + " does not exist :(")
    }

});

socket.on('newShip', function (data : any) {
    game_state.createShip(data.player_name);
});

socket.on('destroyShip', function (data : any) {
    game_state.destroyShip(data.player_name);
});

function searchArrayOfObjectsByProperty(propertyToCheck : string, dataToFind : string, arrayToSearch : Array<any>) {
    for (var i=0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][propertyToCheck] == dataToFind) return i;
    }
    return false;
}