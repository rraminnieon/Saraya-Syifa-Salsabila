import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { Storage } from '../utils/Storage.js';
import { SoundManager } from '../audio/SoundManager.js';
import { LevelData } from '../levels/LevelData.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    SoundManager.init();

    // Background
    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_beach')
      .setOrigin(0, 0);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x08142c, 0.7);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    this.add.text(GAME_WIDTH / 2, 50, 'SELECT ADVENTURE LEVEL', {
      font: '900 36px "Segoe UI", Arial, sans-serif',
      fill: '#00e5ff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const save = Storage.load();
    const unlockedLevel = save.unlockedLevel || 1;

    // 5 Level Cards
    const cardWidth = 155;
    const cardHeight = 220;
    const spacing = 22;
    const startX = (GAME_WIDTH - (5 * cardWidth + 4 * spacing)) / 2 + cardWidth / 2;
    const cardY = 230;

    for (let i = 1; i <= 5; i++) {
      const x = startX + (i - 1) * (cardWidth + spacing);
      const isUnlocked = i <= unlockedLevel;
      const data = LevelData[i];

      const card = this.add.container(x, cardY);

      // Card Background
      const cardBg = this.add.graphics();
      if (isUnlocked) {
        cardBg.fillStyle(0x1a237e, 0.9);
        cardBg.lineStyle(3, 0x00e5ff, 1);
      } else {
        cardBg.fillStyle(0x212121, 0.8);
        cardBg.lineStyle(2, 0x757575, 0.6);
      }
      cardBg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);
      cardBg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);

      // Level Number
      const numText = this.add.text(0, -75, `LEVEL ${i}`, {
        font: 'bold 22px "Segoe UI", Arial',
        fill: isUnlocked ? '#ffd700' : '#9e9e9e'
      }).setOrigin(0.5);

      // Level Name
      const nameText = this.add.text(0, -40, data.title, {
        font: 'bold 12px Arial',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: cardWidth - 10 }
      }).setOrigin(0.5);

      // Icon / Thumbnail preview
      let iconText = '🌴';
      if (i === 2) iconText = '🌿';
      if (i === 3) iconText = '🌋';
      if (i === 4) iconText = '🛸';
      if (i === 5) iconText = '👾';

      const icon = this.add.text(0, 10, isUnlocked ? iconText : '🔒', {
        font: '40px Arial'
      }).setOrigin(0.5);

      // High Score & Stars
      const score = save.highScores[i] || 0;
      const stars = save.stars[i] || 0;
      const starsDisplay = isUnlocked ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '---';

      const starsText = this.add.text(0, 55, starsDisplay, {
        font: 'bold 18px Arial',
        fill: '#ffd700'
      }).setOrigin(0.5);

      const scoreText = this.add.text(0, 80, isUnlocked ? `BEST: ${score}` : 'LOCKED', {
        font: '12px Arial',
        fill: isUnlocked ? '#b2ebf2' : '#757575'
      }).setOrigin(0.5);

      card.add([cardBg, numText, nameText, icon, starsText, scoreText]);

      if (isUnlocked) {
        card.setSize(cardWidth, cardHeight);
        card.setInteractive({ cursor: 'pointer' });

        card.on('pointerover', () => {
          this.tweens.add({
            targets: card,
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 100
          });
        });

        card.on('pointerout', () => {
          this.tweens.add({
            targets: card,
            scaleX: 1,
            scaleY: 1,
            duration: 100
          });
        });

        card.on('pointerdown', () => {
          SoundManager.playJump();
          this.cameras.main.fade(300, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene', { level: i });
          });
        });
      }
    }

    // Back Button
    const backBtn = this.add.container(GAME_WIDTH / 2, 450);
    const backBg = this.add.graphics();
    backBg.fillStyle(0xe91e63, 0.9);
    backBg.fillRoundedRect(-90, -20, 180, 40, 6);
    const backLabel = this.add.text(0, 0, '⬅  MAIN MENU', {
      font: 'bold 16px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    backBtn.add([backBg, backLabel]);
    backBtn.setSize(180, 40);
    backBtn.setInteractive({ cursor: 'pointer' });

    backBtn.on('pointerdown', () => {
      SoundManager.playCoin();
      this.scene.start('MainMenuScene');
    });
  }
}
