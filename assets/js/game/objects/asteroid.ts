module Objects {
	export class Asteroid extends Phaser.Sprite {
        constructor(game : Phaser.Game, x : number, y : number) {
            super(game, x, y, 'atlas');
            this.game = game;
            this.x = x;
            this.y = y;

            this.anchor.setTo(0.5);
            this.game.physics.arcade.enable(this);
            // basic kill timer
            this.game.time.events.add(Phaser.Timer.SECOND * 30, this.kill, this);
        }

        update() {
            this.angle += 1;

            if(this.inWorld) {
                //this.body.collideWorldBounds = true;
            }
        }

        can_spawn_small_asteroids() : boolean {
            return (this.scale.getMagnitude() > 1.0);
        }
    }
}