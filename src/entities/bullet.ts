import { Physics } from 'phaser';
import type { GameScene } from '../scenes/game/gameScene';
import { Enemy } from './enemy';

export class Bullet extends Physics.Arcade.Sprite {
    ttl: number;

    constructor(
        scene: GameScene,
        x: number,
        y: number,
        vx: number,
        vy: number,
        ttl: number
    ) {
        super(scene, x, y, 'packed', 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.playerBullets?.add(this);
        this.setVelocity(vx, vy);
        this.setSize(12, 12);
        this.ttl = ttl;
    }

    die() {
        const gs = this.scene as GameScene;
        gs.playerBullets?.remove(this);
        this.destroy();
    }

    preUpdate(time: number, delta: number) {
        this.ttl -= delta;
        if (this.ttl <= 0) {
            this.die();
        }
        this.depth = this.y + this.height / 2;
    }

    onCollide(other: any) {
        if (other instanceof Enemy) {
            other.damage(5);
            this.die();
        }
    }
}
