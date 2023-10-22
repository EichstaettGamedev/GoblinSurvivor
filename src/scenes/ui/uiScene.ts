import { Scene } from 'phaser';
import type { GameScene } from '../game/gameScene';

export class UIScene extends Scene {
    health?: Phaser.GameObjects.Text;
    money?: Phaser.GameObjects.Text;
    level?: Phaser.GameObjects.Text;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        if (!config) {
            config = {};
        }
        config.key = 'UIScene';
        super(config);
    }

    create() {
        this.health = this.add.text(16, 16, '');
        this.health.setShadow(0, 0, '#000', 4, true, true);

        this.money = this.add.text(16, 40, '');
        this.money.setShadow(0, 0, '#000', 4, true, true);

        this.level = this.add.text(16, 64, '');
        this.level.setShadow(0, 0, '#000', 4, true, true);
    }

    update(time: number, delta: number) {
        const gs = this.scene.get('GameScene') as GameScene;
        if (!gs) {
            return;
        }
        const player = gs.players.values().next().value;
        if (player && this.health) {
            this.health.setText(`Health: ${player.health}`);
        }
        if (player && this.money) {
            this.money.setText(`Money: ${gs.score}`);
        }
        if (player && this.level) {
            this.level.setText(`Level: ${gs.playerLevel}`);
        }


        if(!player){
            this.health?.setText("Press WASD / Cursor-keys or Click/Touch the screen to join");
        }
    }
}
