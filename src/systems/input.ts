import type { Player } from "../entities/player";
import type { GameScene } from "../scenes/game/gameScene";

export abstract class Input {
    player ?: Player;
    constructor(protected scene: GameScene) {}

    activate(player: Player) {
        this.player = player;
    }

    abstract checkInput(time: number, delta: number): [number, number];
    abstract checkJoin(time: number, delta: number): boolean;
}