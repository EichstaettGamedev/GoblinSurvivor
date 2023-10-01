import { GameObjects, Scene } from 'phaser';

import '../../types';
import { UIScene } from '../ui/uiScene';
import { Player } from '../../entities/player';
import { Director } from '../../systems/director';

const animation_frames = (frame: string, frames: number | number[]) => {
    const ret = [];
    if (Array.isArray(frames)) {
        for (let i = 0; i < frames.length; i++) {
            ret.push({ key: 'packed', frame: `${frame}_${frames[i]}` });
        }
    } else {
        for (let i = 0; i < frames; i++) {
            ret.push({ key: 'packed', frame: `${frame}_${i}` });
        }
    }
    return ret;
};

export type KeyMap = {
    Up: Phaser.Input.Keyboard.Key;
    Left: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Down: Phaser.Input.Keyboard.Key;
    Z: Phaser.Input.Keyboard.Key;
    X: Phaser.Input.Keyboard.Key;
    Y: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    Shift: Phaser.Input.Keyboard.Key;
};

export class GameScene extends Scene {
    keymap?: KeyMap;
    gameOverActive: boolean;

    gameTicks = 0;
    score = 0;

    bg?: Phaser.GameObjects.TileSprite;
    player?: Player;
    playerGroup?: Phaser.GameObjects.Group;
    enemyGroup?: Phaser.GameObjects.Group;
    playerBullets?: Phaser.GameObjects.Group;
    collectables?: Phaser.GameObjects.Group;

    director: Director;

    worldWidth = 8192;
    worldHeight = 8192;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        if (!config) {
            config = {};
        }
        config.key = 'GameScene';
        super(config);
        this.gameOverActive = false;
        this.director = new Director(this);
    }

    create() {
        this.score = 0;
        this.sound.pauseOnBlur = false;

        this.playerGroup = this.physics.add.group();
        this.playerBullets = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.collectables = this.physics.add.group();
        const handler = (a: any, b: any) => {
            a.onCollide && a.onCollide(b);
            b.onCollide && b.onCollide(a);
        };
        this.physics.add.overlap(this.playerBullets, this.enemyGroup, handler);
        this.physics.add.overlap(this.playerGroup, this.enemyGroup, handler);
        this.physics.add.overlap(this.playerGroup, this.collectables, handler);
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.physics.add.collider(this.playerGroup, this.enemyGroup);

        this.bg = this.add.tileSprite(
            0,
            0,
            this.worldWidth,
            this.worldHeight,
            'bg'
        );
        this.bg.setDepth(-65535);
        this.player = new Player(this);

        this.cameras.main.setBounds(-1000, -1000, 12800, 7200);
        this.cameras.main.startFollow(this.player, false, 0.05, 0.05);

        const ui = this.scene.get('UIScene') as UIScene;
        ui.events.emit('reset');

        this.physics.world.setBounds(
            -this.worldWidth,
            -this.worldHeight,
            this.worldWidth * 2,
            this.worldHeight * 2
        );
        this.keymap = this.input.keyboard?.addKeys(
            'Up,Left,Right,Down,X,Z,Shift,Y,W,A,S,D'
        ) as KeyMap;
        this.gameOverActive = false;
        this.gameTicks = 0;
    }

    update(time: number, delta: number) {
        this.gameTicks += delta;
        this.director.update(time, delta);
    }
}
