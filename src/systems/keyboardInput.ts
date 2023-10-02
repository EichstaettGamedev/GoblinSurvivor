import type { GameScene } from "../scenes/game/gameScene";
import { Input } from "./input";

export class KeyboardInput extends Input {
    constructor(scene: GameScene, private upKey:string, private downKey:string, private leftKey:string, private rightKey:string) {
        super(scene);
    }

    checkInput(time: number, delta: number): [number, number] {
        const keymap = this.scene.keymap as Record<string, {isDown: boolean}>

        let vx = 0;
        let vy = 0;
        if (keymap[this.leftKey].isDown) {
            vx -= 1;
        }
        if (keymap[this.rightKey].isDown) {
            vx += 1;
        }
        if (keymap[this.upKey].isDown) {
            vy -= 1;
        }
        if (keymap[this.downKey].isDown) {
            vy += 1;
        }
        return [vx, vy];
    }

    checkJoin(time: number, delta: number): boolean {
        const keymap = this.scene.keymap as Record<string, {isDown: boolean}>
        return keymap[this.leftKey].isDown
        || keymap[this.rightKey].isDown
        || keymap[this.upKey].isDown
        || keymap[this.downKey].isDown;
    }
}
