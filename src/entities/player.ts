import type { Skill } from '../skills/Skill';
import type { Input } from '../systems/input';
import { Physics } from 'phaser';
import { GameScene } from '../scenes/game/gameScene';
import { Enemy } from './enemy';
import { MagicMissile } from '../skills/MagicMissile';

const sprites = Array(12).fill(0).map((_,i) => `player/${i}`);

export class Player extends Physics.Arcade.Sprite {
    health = 100;
    dead = false;
    vx = 0;
    vy = 0;

    moving = false;
    direction = 2;

    skills: Set<Skill> = new Set();

    constructor(scene: GameScene, protected inputScheme: Input, x = 0, y = 0) {
        super(scene, x, y, 'packed', 'player/0');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.playerGroup?.add(this);
        this.setCircle(8, 8, 16);
        this.skills.add(new MagicMissile(this));
    }

    collectCoin(value: number) {
        (this.scene as GameScene).score += value;
    }

    damage(v: number) {
        this.health -= v;
    }

    die() {
        this.dead = true;
        this.health = 0;
    }

    private setAnimationFrame() {
        if(this.dead){
            this.setFrame('player/dead');
            return;
        }
        const rfc = ((this.scene.time.now / 250) | 0) % 4;
        const fc = rfc > 2 ? 1 : rfc;
        const off = this.moving ? fc : 1;
        this.setFrame(sprites[this.direction * 3 + off]);
    }

    private setDirection(vx:number, vy:number) {
        if (vx < 0) {
            this.direction = 3;
        } else if (vx > 0) {
            this.direction = 1;
        }

        if (vy < 0) {
            this.direction = 0;
        } else if (vy > 0) {
            this.direction = 2;
        }
    }

    private checkInput(time: number, delta: number) {
        let [vx, vy] = this.inputScheme.checkInput(time, delta);
        this.moving = Boolean(vx || vy);
        this.setDirection(vx, vy);
        vx *= 128;
        vy *= 128;
        this.vx = this.vx * 0.8 + vx * 0.2;
        this.vy = this.vy * 0.8 + vy * 0.2;
        this.setVelocity(this.vx, this.vy);
    }

    preUpdate(time: number, delta: number) {
        if (this.health <= 0) {
            this.die();
        }

        if(!this.dead){
            this.checkInput(time, delta);
        }

        this.setAnimationFrame();
        if(!this.dead){
            for(const skill of this.skills){
                skill.update(time, delta);
            }
        }
        this.depth = this.y + this.height / 2;
    }

    onCollide(other: any) {
        if (other instanceof Enemy) {
            const damage = other.doPlayerDamage();
            if (damage > 0) {
                this.damage(damage);
            }
        }
    }
}
