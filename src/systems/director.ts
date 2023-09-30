import type { GameScene } from "../scenes/game/gameScene";
import { Enemy } from "../entities/enemy";

export class Director {
    spawnCooldown = 0;
    spawnI = 0;

    constructor(public scene:GameScene) { }

    create() {
        this.spawnCooldown = 0;
        this.spawnI = 0;
    }

    update(time: number, delta: number) {
        this.spawnCooldown -= delta;
        if(this.spawnCooldown > 0){
            return;
        }

        if((this.scene.enemyGroup?.getLength() || 0) > 50){
            return;
        }

        if(!this.scene.player){
            return;
        }

        
        for(let i=0;i<32;i++){
            const deg = Math.random() * Math.PI;
            const d = Math.random() * 200 + 960;
            const x = this.scene.player.x + Math.cos(deg)*d;
            const y = this.scene.player.y + Math.sin(deg)*d;

            new Enemy(this.scene, x, y);
            this.spawnCooldown = 100 * (this.scene.enemyGroup?.getLength() || 1);
            this.spawnI++;
            break;
        }
    }
}