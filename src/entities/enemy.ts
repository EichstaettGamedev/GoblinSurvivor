import { Physics } from 'phaser';
import type { GameScene } from '../scenes/game/gameScene';
import { Coin } from './coin';

export class Enemy extends Physics.Arcade.Sprite {
    scene: GameScene;
    health = 20;
    lastDamageDealt = 0;
    damageCooldown = 100;
    direction = 0;


    constructor(scene: GameScene, x:number, y:number) {
        super(scene, x, y, 'enemy');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.enemyGroup?.add(this);
        this.setCircle(16,16,16);
        this.setBounce(1, 1);
        this.setCollideWorldBounds(true);
    }

    damage(v:number) {
        this.health -= v;
    }

    die() {
        const gs = this.scene as GameScene;
        gs.enemyGroup?.remove(this);
        new Coin(gs, this.x, this.y, 1);
        this.destroy();
    }

    doPlayerDamage():number {
        if(this.scene.time.now > this.lastDamageDealt + this.damageCooldown){
            this.lastDamageDealt = this.scene.time.now;
            return 10;
        }
        return 0;
    }

    private setAnimationFrame(){
        if(!this.scene){return;}
        const fc = ((this.scene.time.now / 250)|0) % 3;
        this.setFrame(this.direction * 3 + fc);
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
        
        const dx = gs.player.x - this.x;
        const dy = gs.player.y - this.y;
        if(Math.abs(dx) > Math.abs(dy)){
            if(dx < 0){
                this.direction = 3;
            } else{
                this.direction = 2;
            }
        } else {
            if(dy < 0){
                this.direction = 1;
            } else {
                this.direction = 0;
            }
        }

        vx *= 64;
        vy *= 64;

        if(this.body){
            vx = this.body.velocity.x * 0.9 + vx * 0.1;
            vy = this.body.velocity.y * 0.9 + vy * 0.1;
            this.setVelocity(vx,vy);
        }

        this.setAnimationFrame();
        this.depth = this.y + this.height/2;
    }
}