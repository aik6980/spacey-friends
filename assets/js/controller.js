var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'phaser-example');

var rotation;
var thrust;

var PhaserGame = function () {

    this.sprite;

    this.pad;

    this.stick;

    this.buttonA;
    this.buttonB;
    this.buttonC;

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {

        this.load.atlas('arcade', 'assets/game_assets/virtualjoystick/skins/arcade-joystick.png', 'assets/game_assets/virtualjoystick/skins/arcade-joystick.json');
        this.load.image('background', 'assets/game_assets/images/background.jpg');
    },

    create: function () {
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);


        this.add.image(0, 0, 'background');

        this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

        this.stick = this.pad.addStick(200, 150, 200, 'arcade');
        // this.stick.alignTopLeft();
        this.stick.motionLock = Phaser.VirtualJoystick.HORIZONTAL;

        var buttonXBase = 400;
        var buttonYBase = 150;
        this.buttonA = this.pad.addButton(buttonXBase, buttonYBase, 'arcade', 'button1-up', 'button1-down');

        this.buttonB = this.pad.addButton(buttonXBase + 115, buttonYBase - 70, 'arcade', 'button2-up', 'button2-down');

        this.buttonC = this.pad.addButton(buttonXBase + 230, buttonYBase, 'arcade', 'button3-up', 'button3-down');

    },

    update: function () {
        if (this.stick.isDown) {
            rotation = this.stick.forceX;
        } else {
            rotation = 0;
        }

        if (this.buttonA.isDown) {
            thrust = true;
        } else {
            thrust = false;
        }

        socket.emit('controller', { game_name: game_name, thrust: thrust, rotation: rotation, player_name: player_name });
    }

};

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
