module Objects {
	export class Asteroid extends Phaser.Sprite {
    constructor(game : Phaser.Game, x : number, y : number) {
        super(game, x, y, 'atlas');
        this.game = game;
        this.x = x;
        this.y = y;

        this.anchor.setTo(0.5);

        // basic kill timer
        this.game.time.events.add(Phaser.Timer.SECOND * 30, this.kill, this);
    }

    update() {
        this.angle += 1;
    }
}

}