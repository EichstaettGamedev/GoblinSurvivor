import type { GameScene } from "../scenes/game/gameScene";

export abstract class Input {
    constructor(protected scene: GameScene) {}

    abstract checkInput(time: number, delta: number): [number, number];
}