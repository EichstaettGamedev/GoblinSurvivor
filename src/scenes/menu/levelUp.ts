import { Scene } from 'phaser';
import { GameScene } from '../game/gameScene';
import { Player } from '../../entities/player';
import skillList, { Skill } from '../../skills';

export class LevelUpScene extends Scene {
    players: Set<Player> = new Set();
    skillSelection: Map<Player, typeof Skill> = new Map();
    countDownLeft:number = 0;
    counter?: HTMLSpanElement;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        if (!config) {
            config = {};
        }
        config.key = 'LevelUp';
        super(config);
    }

    create() {
        const that = this;
        const gs = that.scene.get('GameScene') as GameScene;
        this.players = gs.players;
        this.countDownLeft = 5000;

        const dom = document.createElement('div');
        dom.classList.add("level-up-wrap")
        dom.style.textAlign = 'center';
        dom.innerHTML = `<h1>Level Up</h1>`;

        const skillWrap = document.createElement('div');
        skillWrap.classList.add("level-up-skill-wrap");

        this.counter = document.createElement("span");
        this.counter.innerText = "5.0";

        dom.append(this.counter);

        let firstSkill = true;
        for(const s of skillList){
            const wrap = document.createElement('div');
            wrap.classList.add("level-up-skill");
            if(firstSkill){
                firstSkill = false;
                wrap.classList.add("active");
                for(const p of this.players){
                    this.skillSelection.set(p,s);
                }
            }
            wrap.innerHTML = `<img src="${s.icon}"/><h3>${s.skillName}</h3>`;
            skillWrap.append(wrap);
        }
        dom.append(skillWrap);
        this.add.dom(this.scale.width / 2, this.scale.height / 2, dom);
    }

    update(time: number, delta: number): void {
        this.countDownLeft -= delta;
        if(this.counter){
            this.counter.innerText = String(Math.round(this.countDownLeft / 100)/10);
        }
        if(this.countDownLeft < 0){
            this.scene.switch("GameScene");

            const gs = this.scene.get('GameScene') as GameScene;
            gs.playerLevel++;

            for(const p of this.players){
                const sel = this.skillSelection.get(p);
                if(!sel){
                    throw new Error("No selection for player");
                }
                for(const s of p.skills.values()){
                    if(s instanceof sel){
                        s.levelUp();
                        break;
                    }
                }
            }
        }
    }
}
