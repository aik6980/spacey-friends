namespace Objects {
    export class HealthBar extends Phaser.Sprite {
        background : Phaser.Sprite;
        foreground : Phaser.Sprite;

        constructor( game : Phaser.Game ) {
            super( game, 0, 0 );

            // create a bitmap data, if there isn't one
            if (this.game.cache.checkBitmapDataKey('white_1px') == false) {
                let bmd = this.game.add.bitmapData(1, 1);
                bmd.context.fillStyle = 'rgb(255,255,255)';
                bmd.context.fillRect(0,0,1,1);
                this.game.cache.addBitmapData('white_1px', bmd);
            }   
            this.anchor.setTo(0.5);

            var full_health = 32;

            this.foreground = this.game.make.sprite(0,0,this.game.cache.getBitmapData('white_1px'));
            this.foreground.tint = Phaser.Color.getColor(255, 0, 0);
            this.foreground.anchor.set(0.0, 0.5);
            this.foreground.position.set(-full_health/2, -32);
            this.foreground.scale.set(full_health, 2);

            this.addChild(this.foreground);
        }
    }
}