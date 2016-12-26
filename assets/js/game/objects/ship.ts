module Objects {
    export class Ship extends Phaser.Sprite {
        name : string;
        thrust_amount = 0.0;
        angular_accel_amount = 0.0;
        activate_weapon = false;

        weapon : Phaser.Weapon;

        constructor( game_state : Phaser.State ) {
            super(game_state.game, 0, 0, 'ship')

            this.anchor.setTo(0.5);
            this.scale.setTo(0.03);
            this.game.physics.arcade.enable(this);

            // Ship Rotation
            this.body.maxAngular = 300;
            this.body.angularDrag = 350;

            // Ship Movement
            this.body.drag.set(10);
            this.body.maxVelocity.set(100);

            // add weapon
            this.weapon = this.game.add.weapon(10, 'bullet');
            this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this.weapon.bulletSpeed = 250;
            this.weapon.fireRate = 1000; // fire rate in milliseconds

            this.weapon.trackSprite(this, 10, 0, true);
        }
    }
}