import { AssetGenerator } from '../utils/AssetGenerator.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Loading Screen UI
    const loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'LOADING STITCH ADVENTURE...', {
      font: 'bold 24px "Segoe UI", Arial, sans-serif',
      fill: '#00e5ff'
    }).setOrigin(0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1a237e, 0.8);
    progressBox.fillRoundedRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 + 10, 320, 24, 6);

    // Procedurally generate all assets into textures
    const generator = new AssetGenerator(this);
    generator.generateAll();

    progressBar.fillStyle(0x00e5ff, 1);
    progressBar.fillRoundedRect(GAME_WIDTH / 2 - 156, GAME_HEIGHT / 2 + 14, 312, 16, 4);

    // Create Animations
    this.createAnimations();

    // Smooth transition to Main Menu
    this.time.delayedCall(300, () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene');
      });
    });
  }

  createAnimations() {
    // 1. Stitch Animations
    this.anims.create({
      key: 'stitch_idle',
      frames: this.anims.generateFrameNumbers('stitch', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'stitch_walk',
      frames: this.anims.generateFrameNumbers('stitch', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'stitch_run',
      frames: this.anims.generateFrameNumbers('stitch', { start: 8, end: 11 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'stitch_jump',
      frames: [{ key: 'stitch', frame: 12 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'stitch_djump',
      frames: this.anims.generateFrameNumbers('stitch', { start: 13, end: 16 }),
      frameRate: 16,
      repeat: 0
    });

    this.anims.create({
      key: 'stitch_fall',
      frames: [{ key: 'stitch', frame: 17 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'stitch_attack',
      frames: this.anims.generateFrameNumbers('stitch', { start: 18, end: 21 }),
      frameRate: 16,
      repeat: 0
    });

    this.anims.create({
      key: 'stitch_hurt',
      frames: [{ key: 'stitch', frame: 22 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'stitch_victory',
      frames: this.anims.generateFrameNumbers('stitch', { start: 23, end: 26 }),
      frameRate: 6,
      repeat: -1
    });

    // 2. Enemy Animations
    this.anims.create({
      key: 'enemy_crab',
      frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_bat',
      frames: this.anims.generateFrameNumbers('enemies', { start: 2, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_spider',
      frames: this.anims.generateFrameNumbers('enemies', { start: 4, end: 5 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_flame',
      frames: this.anims.generateFrameNumbers('enemies', { start: 6, end: 7 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_drone',
      frames: this.anims.generateFrameNumbers('enemies', { start: 8, end: 9 }),
      frameRate: 4,
      repeat: -1
    });

    // 3. Coin Spin Animation
    this.anims.create({
      key: 'coin_spin',
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
  }
}
