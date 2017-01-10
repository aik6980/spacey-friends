module Objects {
    export class Ship extends Phaser.Sprite {
        name : string;
        thrust_amount = 0.0;
        angular_accel_amount = 0.0;
        activate_weapon = false;

        ship : Phaser.Sprite;
        weapon : Phaser.Weapon;
        healthbar : Objects.HealthBar;

        smoke_vfx : Objects.SmokeEmitter;

        // unique texture for player's ship
        bmd : Phaser.BitmapData;

        break_down = false;

        constructor( game_state : Phaser.State ) {
            super(game_state.game, 0, 0, 'ship');

            this.anchor.setTo(0.5);
            this.scale.setTo(0.03);
            this.game.physics.arcade.enable(this);

            this.body.mass = 1;
            this.body.bounce = 0.9;
            this.health = this.maxHealth;
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

            // add UI
            //this.healthbar = new Objects.HealthBar(this.game);
            //this.game.add.existing(this.healthbar);

            this.bmd = game.make.bitmapData();
            this.bmd.load('ship');

            this.smoke_vfx = new Objects.SmokeEmitter(this.game, 0, 0);
            this.game.add.existing(this.smoke_vfx);
            this.smoke_vfx.begin();
            this.smoke_vfx.particleAnchor.set(0, -32);
        }

        set_texture_color_shift( val : number ) {
            // shift value can be between 0...1
            this.bmd.shiftHSL(val);
            this.setTexture(this.bmd.texture);
        }

        update() {
            //this.healthbar.position.set(this.x, this.y);

            if(this.health <= 0.0) {
                this.break_down = true;
            }
            this.smoke_vfx.position.set(this.x, this.y + 32);
            this.smoke_vfx.rotation = this.rotation - Phaser.Math.degToRad(90);
        }
    }
}