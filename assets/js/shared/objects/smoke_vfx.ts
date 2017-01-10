namespace Objects {
    export class SmokeEmitter extends Phaser.Particles.Arcade.Emitter {
        constructor( game : Phaser.Game, x : number, y: number ) {
            super(game, x, y)

            // create a bitmap data, if there isn't one
            //if (this.game.cache.checkImageKey('smoke') == false) {
            //    this.game.load.image('smoke', 'public/game_assets/images/smoke.png');
            //}

            this.scale.set(0.25);

            this.makeParticles('smoke');
            this.setAlpha(1.0, 0.1, Phaser.Timer.SECOND);
            this.setXSpeed(-0.1, -0.1);
            this.setYSpeed(-0.1, -0.1);
        }

        begin()
        {
            this.flow(2000, 500);
        }
    }
}