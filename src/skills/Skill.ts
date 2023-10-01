import type { Enemy } from "../entities/enemy";
import type { Player } from "../entities/player";
import type { GameScene } from "../scenes/game/gameScene";

export abstract class Skill {
    level = 1;
    maxLevel = 7;

    constructor(protected player: Player) { }

    abstract setLevel(newLevel: number): void;
    abstract update(time: number, delta: number): void;

    levelUp() {
        this.setLevel(this.level+1);
    }

    findClosestEnemy() {
        const gs = this.player.scene as GameScene;
        let closest: Enemy | undefined = undefined;
        let closestDist = 999999;
        for (const c of gs.enemyGroup?.children.entries || []) {
            const e = c as Enemy;
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            const dd = dx * dx + dy * dy;
            if (dd < closestDist) {
                closest = e;
                closestDist = dd;
            }
        }
        return closest;
    }
}
