var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'phaser-example');

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
        this.buttonA.onDown.add(this.pressButtonA, this);

        this.buttonB = this.pad.addButton(buttonXBase + 115, buttonYBase - 70, 'arcade', 'button2-up', 'button2-down');
        this.buttonB.onDown.add(this.pressButtonB, this);

        this.buttonC = this.pad.addButton(buttonXBase + 230, buttonYBase, 'arcade', 'button3-up', 'button3-down');
        this.buttonC.onDown.add(this.pressButtonC, this);

    },

    pressButtonA: function () {

        console.log("A PRESSED");

    },

    pressButtonB: function () {
        console.log("B PRESSED");
    },

    pressButtonC: function () {
        console.log("C PRESSED");

    },

    update: function () {
        if (this.stick.isDown)
        {
            console.log(this.stick.forceX);
        }
    }

};

game.state.add('Game', PhaserGame, true);
