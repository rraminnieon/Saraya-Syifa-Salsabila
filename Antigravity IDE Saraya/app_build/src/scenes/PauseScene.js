import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { SoundManager } from '../audio/SoundManager.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(data) {
    this.parentLevel = data.level || 1;

    // Dark backdrop overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Modal Box
    const box = this.add.graphics();
    box.fillStyle(0x1a237e, 0.95);
    box.fillRoundedRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 - 150, 320, 300, 12);
    box.lineStyle(3, 0x00e5ff, 1);
    box.strokeRoundedRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 - 150, 320, 300, 12);

    // Title
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, 'GAME PAUSED', {
      font: 'bold 28px "Segoe UI", Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const startY = GAME_HEIGHT / 2 - 40;
    const spacing = 50;

    // Resume Button
    this.createButton(GAME_WIDTH / 2, startY, 'RESUME', '#4caf50', () => {
      SoundManager.playJump();
      this.scene.stop();
      this.scene.resume('GameScene');
      this.scene.resume('UIScene');
    });

    // Restart Level Button
    this.createButton(GAME_WIDTH / 2, startY + spacing, 'RESTART LEVEL', '#ff9800', () => {
      SoundManager.playCoin();
      this.scene.stop();
      this.scene.stop('UIScene');
      this.scene.start('GameScene', { level: this.parentLevel });
    });

    // Main Menu Button
    this.createButton(GAME_WIDTH / 2, startY + spacing * 2, 'MAIN MENU', '#e91e63', () => {
      SoundManager.playCoin();
      this.scene.stop();
      this.scene.stop('GameScene');
      this.scene.stop('UIScene');
      this.scene.start('MainMenuScene');
    });

    // Keyboard ESC shortcut to resume
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
      this.scene.resume('UIScene');
    });
  }

  createButton(x, y, text, colorHex, callback) {
    const btn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.9);
    bg.fillRoundedRect(-110, -18, 220, 36, 6);
    bg.lineStyle(1.5, 0xffffff, 0.8);
    bg.strokeRoundedRect(-110, -18, 220, 36, 6);

    const label = this.add.text(0, 0, text, {
      font: 'bold 15px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(220, 36);
    btn.setInteractive({ cursor: 'pointer' });

    btn.on('pointerdown', callback);
    return btn;
  }
}
