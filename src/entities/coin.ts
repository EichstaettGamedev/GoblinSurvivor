import { Physics } from 'phaser';
import type { GameScene } from '../scenes/game/gameScene';
import { Player } from './player';

export class Coin extends Physics.Arcade.Sprite {
    constructor(
        scene: GameScene,
        x: number,
        y: number,
        private value: number
    ) {
        super(scene, x, y, 'packed', 'coin');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.collectables?.add(this);
        this.setSize(12, 12);
        this.depth = -1000;
    }

    die() {
        const gs = this.scene as GameScene;
        gs.collectables?.remove(this);
        this.destroy();
    }

    onCollide(other: any) {
        if (other instanceof Player) {
            other.collectCoin(this.value);
            this.die();
        }
    }
}
