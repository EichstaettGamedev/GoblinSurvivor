import './style.css';
import './game.css';

import options from './options';
import { Game, Types } from 'phaser';
import { GameScene } from './scenes/game/gameScene';
import { UIScene } from './scenes/ui/uiScene';
import { GameOverScene } from './scenes/menu/gameOver';
import { MainMenuScene } from './scenes/menu/mainMenu';
import { GameWonScene } from './scenes/menu/gameWon';
import { LoadingScreenScene } from './scenes/menu/loadingScreen';

const main = () => {
    const config: Types.Core.GameConfig = {
        type: Phaser.WEBGL,
        width: 1280,
        height: 720,
        scale: {
            // Fit to window
            mode: Phaser.Scale.RESIZE,
            // Center vertically and horizontally
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        //pixelArt: true,
        parent: document.getElementById('phaser-parent') as HTMLElement,
        title: 'Goblin Survivor',
        backgroundColor: '#000',
        dom: {
            createContainer: true,
        },
        input: {
            gamepad: true,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: options.showCollider,
            },
        },
        scene: [
            LoadingScreenScene,
            MainMenuScene,
            GameScene,
            UIScene,
            GameOverScene,
            GameWonScene,
        ],
    };
    const game = new Game(config);
};
setTimeout(main, 0);
