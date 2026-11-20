import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { Storage } from '../utils/Storage.js';
import { SoundManager } from '../audio/SoundManager.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data) {
    this.completedLevel = data.level || 1;
    this.score = data.score || 0;
    this.coins = data.coins || 0;

    // Calculate stars (3 stars default, or based on score/health)
    const stars = 3;

    // Save progression
    Storage.updateScore(this.completedLevel, this.score, stars);
    if (this.completedLevel < 5) {
      Storage.unlockLevel(this.completedLevel + 1);
    }
    Storage.addCoins(this.coins);

    // Tropical Backdrop
    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_beach').setOrigin(0, 0);
    const overlay = this.add.graphics();
    overlay.fillStyle(0x08142c, 0.75);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Fireworks / Confetti particles
    this.createCelebrationParticles();

    // Dancing Stitch Mascot
    const stitch = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, 'stitch')
      .setScale(2.5);
    stitch.play('stitch_victory');

    // Title
    const isGameComplete = this.completedLevel === 5;
    const titleText = isGameComplete ? '🏆 UNIVERSE SAVED! 🏆' : 'LEVEL COMPLETE!';
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15, titleText, {
      font: '900 42px "Arial Black", Impact',
      fill: '#ffd700',
      stroke: '#08142c',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Stars Display
    const starsContainer = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35);
    for (let i = 0; i < 3; i++) {
      const star = this.add.text((i - 1) * 36, 0, '★', {
        font: 'bold 36px Arial',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5).setScale(0);

      this.tweens.add({
        targets: star,
        scale: 1,
        duration: 400,
        delay: i * 200,
        ease: 'Back.easeOut'
      });
      starsContainer.add(star);
    }

    // Stats
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `SCORE: ${this.score}  •  COINS: ${this.coins}`, {
      font: 'bold 18px "Segoe UI", Arial',
      fill: '#00e5ff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Navigation Buttons
    const btnY = GAME_HEIGHT / 2 + 140;

    if (!isGameComplete) {
      this.createButton(GAME_WIDTH / 2 + 110, btnY, 'NEXT LEVEL  ▶', '#4caf50', () => {
        SoundManager.playJump();
        this.cameras.main.fade(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('GameScene', { level: this.completedLevel + 1 });
        });
      });

      this.createButton(GAME_WIDTH / 2 - 110, btnY, '🏠  MAIN MENU', '#00acc1', () => {
        SoundManager.playCoin();
        this.cameras.main.fade(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MainMenuScene');
        });
      });
    } else {
      // Game Beaten
      this.createButton(GAME_WIDTH / 2, btnY, '🎉 PLAY AGAIN 🎉', '#ff9800', () => {
        SoundManager.playJump();
        this.scene.start('MainMenuScene');
      });
    }
  }

  createCelebrationParticles() {
    for (let i = 0; i < 24; i++) {
      this.time.delayedCall(i * 120, () => {
        const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
        const y = Phaser.Math.Between(60, GAME_HEIGHT - 120);
        const p = this.add.image(x, y, 'sparkle').setScale(0.5);
        this.tweens.add({
          targets: p,
          scale: 2.5,
          alpha: 0,
          duration: 600,
          onComplete: () => p.destroy()
        });
      });
    }
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
