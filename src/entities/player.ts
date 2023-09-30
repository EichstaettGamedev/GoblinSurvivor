import { Physics } from 'phaser';
import { GameScene } from "../scenes/game/gameScene";
import { Bullet } from './bullet';
import { Enemy } from './enemy';

export class Player extends Physics.Arcade.Sprite {
    health = 100;
    money = 0;
    lastShot = 0;
    shootRate = 500;
    vx = 0;
    vy = 0;

    moving = false;
    direction = 2;

    constructor(scene: GameScene) {
        super(scene, 0, 0, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.playerGroup?.add(this);
        this.setCircle(8,8,16);
    }

    collectCoin(value: number){
        this.money += value;
        (this.scene as GameScene).score += value;
    }

    damage(v: number){
        this.health -= v;
    }

    die(){
        (this.scene as GameScene).player = undefined;
        this.scene.scene.switch("GameOverScene");
        this.destroy();
    }

    findClosestEnemy() {
        const gs = this.scene as GameScene;
        let closest: Enemy | undefined = undefined;
        let closestDist = 999999;
        for(const c of gs.enemyGroup?.children.entries || []){
            const e = c as Enemy;
            const dx = (e.x - this.x);
            const dy = (e.y - this.y);
            const dd = dx*dx+dy*dy;
            if(dd < closestDist){
                closest = e;
                closestDist = dd;
            }
        }
        return closest;
    }

    private setAnimationFrame(){
        const rfc = ((this.scene.time.now / 250)|0) % 4;
        const fc = rfc > 2 ? 1 : rfc;
        const off = this.moving ? fc : 1;
        this.setFrame(this.direction * 3 + off);
    }

    preUpdate(time: number, delta: number) {
        const gs = this.scene as GameScene;

        if(this.health <= 0){
            this.die();
            return;
        }

        let vx = 0;
        let vy = 0;
        if(gs.keymap?.A.isDown || gs.keymap?.Left.isDown){
            vx -= 1;
        }
        if(gs.keymap?.D.isDown || gs.keymap?.Right.isDown){
            vx += 1;
        }
        if(gs.keymap?.W.isDown || gs.keymap?.Up.isDown){
            vy -= 1;
        }
        if(gs.keymap?.S.isDown || gs.keymap?.Down.isDown){
            vy += 1;
        }

        if(vx < 0){
            this.direction = 3;
        } else if(vx > 0){
            this.direction = 1;
        }
        if(vy < 0){
            this.direction = 0;
        } else if(vy > 0){
            this.direction = 2;
        }
        this.moving = Boolean(vx || vy);

        vx *= 128;
        vy *= 128;
        this.vx = this.vx * 0.8 + vx * 0.2;
        this.vy = this.vy * 0.8 + vy * 0.2;
        this.setVelocity(this.vx, this.vy);

        if(time > (this.lastShot + this.shootRate)){
            const e = this.findClosestEnemy();
            if(e){
                this.lastShot = time;
                const d = new Phaser.Math.Vector2(e.x - this.x, e.y - this.y).normalize();
                const ttl = 5000;
                this.scene.add.existing(new Bullet(gs, this.x, this.y, d.x*100, d.y*100, ttl));
            }
        }

        this.depth = this.y + this.height/2;
        this.setAnimationFrame();
    }

    onCollide(other: any){
        if(other instanceof Enemy){
            const damage = other.doPlayerDamage();
            if(damage > 0){
                this.damage(damage);
            }
        }
    }
}