module Objects {
	export class Asteroid extends Phaser.Sprite {
    constructor(game : Phaser.Game, x : number, y) {
        super(game, x, y, 'atlas');
        this.game = game;
        this.x = x;
        this.y = y;

        this.anchor.setTo(0.5);
    }

    update() {
        this.angle += 1;
    }
}

}