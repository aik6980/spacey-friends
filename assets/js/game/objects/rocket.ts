namespace Objects {
    export class Rocket extends Phaser.Bullet {
        owner : Phaser.Sprite;

        constructor( game:Phaser.Game, x:number, y:number, key?:any, frame?:any) {
            super(game, x, y, key, frame);
        }
    }
}