import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { SoundManager } from '../audio/SoundManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    this.level = data.level || 1;
    this.score = data.score || 0;

    // Dark backdrop
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0505, 0.9);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Dazed Stitch Mascot
    const stitch = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, 'stitch', 22)
      .setScale(2.2);

    // Title
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'GAME OVER', {
      font: '900 48px "Arial Black", Impact',
      fill: '#ff1744',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Subtitle Quote
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, '“Ohana means family... never give up!”', {
      font: 'italic bold 16px "Segoe UI", Arial',
      fill: '#ffd700'
    }).setOrigin(0.5);

    // Score Info
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, `FINAL SCORE: ${this.score}`, {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Buttons
    const btnY = GAME_HEIGHT / 2 + 110;

    this.createButton(GAME_WIDTH / 2 - 120, btnY, '🔄  TRY AGAIN', '#4caf50', () => {
      SoundManager.playJump();
      this.cameras.main.fade(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { level: this.level });
      });
    });

    this.createButton(GAME_WIDTH / 2 + 120, btnY, '🏠  MAIN MENU', '#e91e63', () => {
      SoundManager.playCoin();
      this.cameras.main.fade(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene');
      });
    });
  }

  createButton(x, y, text, colorHex, callback) {
    const btn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.9);
    bg.fillRoundedRect(-95, -20, 190, 40, 8);
    bg.lineStyle(1.5, 0xffffff, 0.8);
    bg.strokeRoundedRect(-95, -20, 190, 40, 8);

    const label = this.add.text(0, 0, text, {
      font: 'bold 15px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(190, 40);
    btn.setInteractive({ cursor: 'pointer' });

    btn.on('pointerdown', callback);
    return btn;
  }
}
