import { Bullet } from "../entities/bullet";
import { Skill } from "./Skill";
import type { GameScene } from "../scenes/game/gameScene";
import icon from "../../assets/gfx/skill_icons/bullet.png";

export class MagicMissile extends Skill {
    static icon = icon;
    static skillName = "Magic Missile"

    lastShot = 0;
    shootRate = 500;

    setLevel(newLevel: number): void {
        this.level = newLevel;
    }

    update(time: number, delta: number): void {
        const gs = this.player.scene as GameScene;
        if (time > this.lastShot + this.shootRate) {
            const e = this.findClosestEnemy();
            if (e) {
                this.lastShot = time;
                const d = new Phaser.Math.Vector2(
                    e.x - this.player.x,
                    e.y - this.player.y
                ).normalize();
                const ttl = 5000;
                this.player.scene.add.existing(
                    new Bullet(gs, this.player.x, this.player.y, d.x * 192, d.y * 192, ttl)
                );
            }
        }
    }
}