import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { Storage } from '../utils/Storage.js';
import { SoundManager } from '../audio/SoundManager.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    SoundManager.init();
    SoundManager.playBgm('menu');

    // 1. Animated Parallax Background
    this.bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_beach')
      .setOrigin(0, 0);

    // 2. Decorative Tropical Elements & Clouds
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xffffff, 0.4);
      cloud.fillCircle(100 + i * 220, 60 + (i % 2) * 30, 35);
      cloud.fillCircle(130 + i * 220, 50 + (i % 2) * 30, 45);
      cloud.fillCircle(160 + i * 220, 60 + (i % 2) * 30, 35);

      this.tweens.add({
        targets: cloud,
        x: '+=100',
        duration: 8000 + i * 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // 3. Game Title: STITCH ADVENTURE
    const titleContainer = this.add.container(GAME_WIDTH / 2, 110);

    // Title Backdrop / Glow
    const glow = this.add.text(0, 0, 'STITCH ADVENTURE', {
      font: '900 52px "Arial Black", Impact, sans-serif',
      fill: '#ff007f'
    }).setOrigin(0.5);

    const title = this.add.text(-2, -3, 'STITCH ADVENTURE', {
      font: '900 52px "Arial Black", Impact, sans-serif',
      fill: '#00e5ff',
      stroke: '#08142c',
      strokeThickness: 8
    }).setOrigin(0.5);

    const subtitle = this.add.text(0, 42, '🌺 HAWAIIAN ISLAND QUEST 🌺', {
      font: 'bold 18px "Segoe UI", Arial, sans-serif',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    titleContainer.add([glow, title, subtitle]);

    // Bouncing Title Tween
    this.tweens.add({
      targets: titleContainer,
      y: 118,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Interactive Animated Stitch Mascot
    this.stitchMascot = this.add.sprite(GAME_WIDTH / 2 - 240, 350, 'stitch')
      .setScale(2.5)
      .setInteractive({ cursor: 'pointer' });
    this.stitchMascot.play('stitch_idle');

    // Click/Hover on Stitch Mascot to make him dance / celebrate!
    this.stitchMascot.on('pointerdown', () => {
      SoundManager.playPowerup();
      this.stitchMascot.play('stitch_victory');
      this.time.delayedCall(1600, () => {
        this.stitchMascot.play('stitch_idle');
      });
    });

    // 5. Menu Buttons
    const buttonYStart = 230;
    const buttonSpacing = 58;

    this.createButton(GAME_WIDTH / 2 + 100, buttonYStart, '▶  PLAY GAME', '#4caf50', () => {
      SoundManager.playJump();
      const data = Storage.load();
      this.cameras.main.fade(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { level: data.unlockedLevel || 1 });
      });
    });

    this.createButton(GAME_WIDTH / 2 + 100, buttonYStart + buttonSpacing, '🗺  LEVEL SELECT', '#00acc1', () => {
      SoundManager.playCoin();
      this.scene.start('LevelSelectScene');
    });

    this.createButton(GAME_WIDTH / 2 + 100, buttonYStart + buttonSpacing * 2, '⚙  SETTINGS', '#fb8c00', () => {
      SoundManager.playCoin();
      this.scene.start('SettingsScene');
    });

    this.createButton(GAME_WIDTH / 2 + 100, buttonYStart + buttonSpacing * 3, '📖  HOW TO PLAY', '#8e24aa', () => {
      SoundManager.playCoin();
      this.showHowToPlayModal();
    });

    // Footer info
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, 'Press SPACE or Click to Play • Experiment 626 Ready!', {
      font: '14px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Global Key Listener for Quick Start
    this.input.keyboard.once('keydown-SPACE', () => {
      const data = Storage.load();
      this.scene.start('GameScene', { level: data.unlockedLevel || 1 });
    });
  }

  update() {
    if (this.bg) {
      this.bg.tilePositionX += 0.4;
    }
  }

  createButton(x, y, text, colorHex, callback) {
    const btn = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.9);
    bg.fillRoundedRect(-140, -22, 280, 44, 8);
    bg.lineStyle(2, 0xffffff, 0.8);
    bg.strokeRoundedRect(-140, -22, 280, 44, 8);

    const label = this.add.text(0, 0, text, {
      font: 'bold 18px "Segoe UI", Arial, sans-serif',
      fill: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(280, 44);
    btn.setInteractive({ cursor: 'pointer' });

    btn.on('pointerover', () => {
      this.tweens.add({
        targets: btn,
        scaleX: 1.06,
        scaleY: 1.06,
        duration: 100
      });
    });

    btn.on('pointerout', () => {
      this.tweens.add({
        targets: btn,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    btn.on('pointerdown', callback);

    return btn;
  }

  showHowToPlayModal() {
    const modal = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    modal.setDepth(100);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(-GAME_WIDTH / 2, -GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT);

    const box = this.add.graphics();
    box.fillStyle(0x1a237e, 0.95);
    box.fillRoundedRect(-280, -180, 560, 360, 12);
    box.lineStyle(3, 0x00e5ff, 1);
    box.strokeRoundedRect(-280, -180, 560, 360, 12);

    const title = this.add.text(0, -140, 'HOW TO PLAY', {
      font: 'bold 26px "Segoe UI", Arial',
      fill: '#ffd700'
    }).setOrigin(0.5);

    const info = this.add.text(0, -10, [
      '🎮 CONTROLS:',
      '• A / D or Left / Right : Move Stitch',
      '• SPACE / W / Up : Jump (Tap again in mid-air for Double Jump!)',
      '• J / X / Shift : Spin Attack or Fire Plasma Blaster',
      '• ESC / P : Pause Game',
      '',
      '🌴 OBJECTIVE:',
      '• Collect Golden Coins & Power-ups (Shield, Blaster, Coffee)',
      '• Stomp or Spin Attack enemies to defeat them',
      '• Reach Checkpoints (Tiki Totems) and finish all 5 Levels',
      '• Defeat Captain Gantu in Level 5 to win!'
    ].join('\n'), {
      font: '15px "Segoe UI", Arial',
      fill: '#ffffff',
      lineSpacing: 4,
      align: 'left'
    }).setOrigin(0.5);

    const closeBtn = this.add.text(0, 140, '[ CLOSE ]', {
      font: 'bold 20px Arial',
      fill: '#ff5252'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

    closeBtn.on('pointerdown', () => {
      SoundManager.playCoin();
      modal.destroy();
    });

    modal.add([overlay, box, title, info, closeBtn]);
  }
}
