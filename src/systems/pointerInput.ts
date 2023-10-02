import type { GameScene } from "../scenes/game/gameScene";
import { Input } from "./input";

const normalize = (x:number, y:number):[number, number] =>
    Math.abs(x) > Math.abs(y)
        ? [x / Math.abs(x), y / Math.abs(x)]
        : [x / Math.abs(y), y / Math.abs(y)];

export class PointerInput extends Input {
    constructor(scene: GameScene) {
        super(scene);
    }

    checkInput(time: number, delta: number): [number, number] {
        if(!this.player){
            return [0, 0];
        }

        const pointer = this.scene.input.activePointer;
        if (pointer.isDown) {
            const ox = pointer.worldX - this.player.x;
            const oy = pointer.worldY - this.player.y;
            return normalize(ox, oy);
        }
        return [0, 0];
    }

    checkJoin(time: number, delta: number): boolean {
        const pointer = this.scene.input.activePointer;
        return pointer.isDown;
    }
}
