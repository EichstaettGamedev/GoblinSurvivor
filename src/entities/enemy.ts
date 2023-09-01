import { Physics } from 'phaser';
import type { GameScene } from '../scenes/game/gameScene';

export class Enemy extends Physics.Arcade.Sprite {
    scene: GameScene;
    health = 20;
    lastDamageDealt = 0;
    damageCooldown = 100;

    constructor(scene: GameScene, x:number, y:number) {
        super(scene, x, y, 'enemy');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.enemyGroup?.add(this);
        this.setCircle(16,16,16);
        this.setBounce(1, 1);
    }

    damage(v:number) {
        this.health -= v;
    }

    die() {
        const gs = this.scene as GameScene;
        gs.enemyGroup?.remove(this);
        this.destroy();
    }

    doPlayerDamage():number {
        if(this.scene.time.now > this.lastDamageDealt + this.damageCooldown){
            this.lastDamageDealt = this.scene.time.now;
            return 10;
        }
        return 0;
    }

    preUpdate(time: number, delta: number) {
        const gs = this.scene as GameScene;
        if(!gs.player){
            return;
        }

        if(this.health <= 0){
            this.die();
        }

        let vx = 0;
        let vy = 0;
        if(gs.player.x < this.x){
            vx--;
        } else if(gs.player.x > this.x){
            vx++;
        }

        if(gs.player.y < this.y){
            vy--;
        } else if(gs.player.y > this.y){
            vy++;
        }

        vx *= 15;
        vy *= 15;

        if(this.body){
            vx = this.body.velocity.x * 0.9 + vx * 0.1;
            vy = this.body.velocity.y * 0.9 + vy * 0.1;
            this.setVelocity(vx,vy);
        }
    }
}