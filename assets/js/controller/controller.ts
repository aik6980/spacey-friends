var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-example');
declare namespace Phaser {
    class VirtualJoystick extends Phaser.Plugin {
        addStick : any;
        addButton : any;
    }

    namespace VirtualJoystick {
        var HORIZONTAL : any;
    }
}

class PhaserGame extends Phaser.State {
    sprite : Phaser.Sprite;
    activate_weapon = false;
    thrust : boolean;
    pad : Phaser.VirtualJoystick;
    buttonA : any;
    buttonB : any;
    buttonLeft : any;
    buttonRight : any;
    rotation : any;

    init() {
        this.game.renderer.renderSession.roundPixels = true;
        //this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    preload() {
        // tell the game to keep running, even the browser losing focus (so we can test locally)
        game.stage.disableVisibilityChange = true;
        this.load.atlas('arcade', 'public/game_assets/virtualjoystick/skins/arcade-joystick.png', 'public/game_assets/virtualjoystick/skins/arcade-joystick.json');
        this.load.image('background', 'public/game_assets/images/background.jpg');
    }

    create() {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

        this.buttonA = this.pad.addButton(0, 0, 'arcade', 'button1-up', 'button1-down');

        this.buttonB = this.pad.addButton(0, 0, 'arcade', 'button2-up', 'button2-down');

        this.buttonLeft = this.pad.addButton(0, 0, 'arcade', 'buttonLeft-up', 'buttonLeft-down');

        this.buttonRight = this.pad.addButton(0, 0, 'arcade', 'buttonRight-up', 'buttonRight-down');

        this.resize();
    }

    update() {

        this.rotation = 0;
        if (this.buttonRight.isDown || this.buttonLeft.isDown) {
            this.rotation += this.buttonRight.isDown;
            this.rotation -= this.buttonLeft.isDown;
        }

        this.thrust = this.buttonA.isDown;
        this.activate_weapon = this.buttonB.isDown;

        socket.emit('controller', {game_name: game_name, thrust: this.thrust, activate_weapon: this.activate_weapon,
            rotation: this.rotation, player_name: player_name});
    }

    resize() {
        var buttonSize = 32;
        var padding = 60;

        game.scale.setGameSize(window.innerWidth, window.innerHeight);

        this.buttonRight.posX = padding + buttonSize;
        this.buttonRight.posY = padding + buttonSize;


        this.buttonB.posX = game.width - padding - buttonSize;
        this.buttonB.posY = padding + buttonSize;

        this.buttonLeft.posX = padding + buttonSize;
        this.buttonLeft.posY = game.height - padding - buttonSize;

        this.buttonA.posX = game.width - padding - buttonSize;
        this.buttonA.posY = game.height - padding - buttonSize;
    }
}

game.state.add('Game', PhaserGame, true);

var socket = io.connect();

socket.emit('controlGame', {
    'game_name': game_name,
    'player_name': player_name
});

socket.on('redirect', function (data) {
    if (data.location === "home") {
        alert("Game no longer exists :(");
        window.location.href = '/';
    }
});
