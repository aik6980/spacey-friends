namespace Objects {
    export class SmokeEmitter extends Phaser.Particles.Arcade.Emitter {
        constructor( game : Phaser.Game, x : number, y: number ) {
            super(game, x, y)

            this.makeParticles('smoke');
            this.setAlpha(0.1, 1, Phaser.Timer.SECOND);
        }
    }
}