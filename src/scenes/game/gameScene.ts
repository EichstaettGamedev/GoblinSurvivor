import { Scene } from 'phaser';

import '../../types';
import { UIScene } from '../ui/uiScene';
import { Player } from '../../entities/player';
import { Director } from '../../systems/director';
import { KeyboardInput } from '../../systems/keyboardInput';
import { Input } from '../../systems/input';
import { PointerInput } from '../../systems/pointerInput';

export type KeyMap = {
    Up: Phaser.Input.Keyboard.Key;
    Left: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Down: Phaser.Input.Keyboard.Key;

    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export class GameScene extends Scene {
    keymap?: KeyMap;
    gameOverActive: boolean;

    gameTime = 0;
    score = 0;
    playerLevel = 0;

    cameraPosition?: Phaser.GameObjects.Image;
    bg?: Phaser.GameObjects.TileSprite;
    players: Set<Player> = new Set();
    playerGroup?: Phaser.GameObjects.Group;
    enemyGroup?: Phaser.GameObjects.Group;
    playerBullets?: Phaser.GameObjects.Group;
    collectables?: Phaser.GameObjects.Group;

    freeInputSchemes: Set<Input> = new Set();

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
        this.players = new Set();
        this.freeInputSchemes = new Set();
        this.score = 0;
        this.sound.pauseOnBlur = false;
        this.cameraPosition = this.add.image(0,0,'packed','void');

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
        this.physics.add.collider(this.playerGroup, this.playerGroup);

        this.bg = this.add.tileSprite(
            0,
            0,
            this.worldWidth,
            this.worldHeight,
            'packed',
            'background'
        );
        this.bg.setDepth(-65535);

        this.freeInputSchemes.add(new KeyboardInput(this, "Up", "Down", "Left", "Right"));
        this.freeInputSchemes.add(new KeyboardInput(this, "W", "S", "A", "D"));
        this.freeInputSchemes.add(new PointerInput(this));

        this.cameras.main.setBounds(-this.worldWidth, -this.worldHeight, this.worldWidth * 2, this.worldHeight * 2);
        this.cameras.main.startFollow(this.cameraPosition, false, 0.05, 0.05);

        const ui = this.scene.get('UIScene') as UIScene;
        ui.events.emit('reset');

        this.physics.world.setBounds(
            -this.worldWidth,
            -this.worldHeight,
            this.worldWidth * 2,
            this.worldHeight * 2
        );
        this.keymap = this.input.keyboard?.addKeys(
            'Up,Left,Right,Down,W,A,S,D'
        ) as KeyMap;
        this.gameOverActive = false;
        this.gameTime = 0;
    }

    allPlayersDead():boolean {
        for(const player of this.players){
            if(!player.dead){
                return false;
            }
        }
        return true;
    }

    checkForLevelUp() {
        if(this.players.size <= 0){
            return;
        }
        const scoreNeeded = this.playerLevel * 10;
        if(this.score >= scoreNeeded){
            if(!this.scene.isActive("LevelUp")){
                this.scene.start("LevelUp");
                this.scene.pause();
            }
        }
    }

    checkForNewPlayers(time: number, delta: number) {
        for(const i of this.freeInputSchemes){
            if(i.checkJoin(time, delta)){
                const player = new Player(this, i);
                this.players.add(player);
                i.activate(player);
                this.freeInputSchemes.delete(i);
            }
        }
    }

    updateCameraPosition() {
        if(this.players.size <= 0){
            return;
        }

        let x = 0;
        let y = 0;
        for(const p of this.players){
            x += p.x;
            y += p.y;
        }
        this.cameraPosition?.setPosition(x / this.players.size, y / this.players.size);
    }

    update(time: number, delta: number) {
        this.gameTime += delta;
        this.director.update(time, delta);
        this.checkForNewPlayers(time, delta);
        this.updateCameraPosition();
        if((this.players.size > 0) && this.allPlayersDead()){
            this.scene.switch("GameOverScene");
        }
        this.checkForLevelUp();
    }
}
