module System {
    export class AsteroidManager {
        game : Phaser.Game;
        asteroid_group : Phaser.Group;

        constructor (game : Phaser.Game) {
            this.game = game;
            this.asteroid_group = game.add.group()
        }

        create_asteroid(x, y, id) {
            let asteroid = new Objects.Asteroid(this.game, x, y);
            asteroid.frameName = "asteroid" + id;

            this.asteroid_group.add(asteroid);
        }
    }   
}
