import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { Storage } from '../utils/Storage.js';
import { SoundManager } from '../audio/SoundManager.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.gameScene = this.scene.get('GameScene');

    // Touch Inputs State
    this.touchInputs = {
      left: false,
      right: false,
      jump: false,
      jumpJustPressed: false,
      attackJustPressed: false
    };

    // 1. Health Hearts (3 hearts container)
    this.heartGraphics = this.add.graphics();
    this.heartGraphics.setScrollFactor(0);
    this.drawHearts(6);

    // 2. Lives Counter
    this.livesIcon = this.add.sprite(150, 24, 'stitch', 0).setScale(0.7);
    this.livesText = this.add.text(172, 14, 'x 3', {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    // 3. Level Title Badge
    this.levelBadge = this.add.text(GAME_WIDTH / 2, 22, 'LEVEL 1: HAWAIIAN BEACH', {
      font: 'bold 16px "Segoe UI", Arial',
      fill: '#00e5ff',
      backgroundColor: 'rgba(8, 20, 44, 0.7)',
      padding: { x: 12, y: 5 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // 4. Boss Health Bar (Level 5)
    this.bossBarContainer = this.add.container(GAME_WIDTH / 2, 54).setVisible(false);
    this.bossBarBg = this.add.graphics();
    this.bossBarBg.fillStyle(0x212121, 0.8);
    this.bossBarBg.fillRoundedRect(-150, -10, 300, 20, 6);
    this.bossBarFill = this.add.graphics();
    this.bossBarLabel = this.add.text(0, -1, 'CAPTAIN GANTU', {
      font: 'bold 12px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.bossBarContainer.add([this.bossBarBg, this.bossBarFill, this.bossBarLabel]);

    // 5. Coins & Score
    this.coinIcon = this.add.sprite(GAME_WIDTH - 210, 24, 'coin', 0).setScale(0.8);
    this.coinText = this.add.text(GAME_WIDTH - 195, 14, 'x 00', {
      font: 'bold 18px Arial',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.scoreText = this.add.text(GAME_WIDTH - 120, 14, 'SCORE: 000000', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    // 6. Pause Button
    const pauseBtn = this.add.container(GAME_WIDTH - 30, 24);
    const pauseBg = this.add.graphics();
    pauseBg.fillStyle(0x00bcd4, 0.9);
    pauseBg.fillCircle(0, 0, 16);
    const pauseLabel = this.add.text(0, 0, '⏸', { font: '14px Arial', fill: '#ffffff' }).setOrigin(0.5);
    pauseBtn.add([pauseBg, pauseLabel]);
    pauseBtn.setSize(32, 32);
    pauseBtn.setInteractive({ cursor: 'pointer' });

    pauseBtn.on('pointerdown', () => {
      SoundManager.playCoin();
      this.gameScene.pauseGame();
    });

    // 7. Touch Controls (D-Pad & Action Buttons)
    const settings = Storage.getSettings();
    if (settings.touchControls) {
      this.createVirtualControls();
    }
  }

  drawHearts(hp) {
    this.heartGraphics.clear();
    // 3 hearts. Each heart = 2 HP.
    for (let i = 0; i < 3; i++) {
      const heartHp = Math.max(0, Math.min(2, hp - i * 2));
      const x = 30 + i * 36;
      const y = 24;

      // Outer Heart Frame
      this.heartGraphics.fillStyle(0x212121, 0.6);
      this.heartGraphics.fillCircle(x - 6, y - 4, 7);
      this.heartGraphics.fillCircle(x + 6, y - 4, 7);
      this.heartGraphics.fillTriangle(x - 13, y - 2, x + 13, y - 2, x, y + 12);

      if (heartHp === 2) {
        // Full Heart
        this.heartGraphics.fillStyle(0xe91e63, 1);
        this.heartGraphics.fillCircle(x - 6, y - 4, 6);
        this.heartGraphics.fillCircle(x + 6, y - 4, 6);
        this.heartGraphics.fillTriangle(x - 12, y - 2, x + 12, y - 2, x, y + 11);
      } else if (heartHp === 1) {
        // Half Heart
        this.heartGraphics.fillStyle(0xe91e63, 1);
        this.heartGraphics.fillCircle(x - 6, y - 4, 6);
        this.heartGraphics.fillTriangle(x - 12, y - 2, x, y - 2, x, y + 11);
      }
    }
  }

  updateHUD(player, levelTitle, boss) {
    if (!player) return;

    this.drawHearts(player.health);
    this.livesText.setText(`x ${player.lives}`);
    this.coinText.setText(`x ${player.coins.toString().padStart(2, '0')}`);
    this.scoreText.setText(`SCORE: ${player.score.toString().padStart(6, '0')}`);

    if (levelTitle) {
      this.levelBadge.setText(levelTitle);
    }

    if (boss && !boss.isDefeated) {
      this.bossBarContainer.setVisible(true);
      const pct = Math.max(0, boss.health / boss.maxHealth);
      this.bossBarFill.clear();
      this.bossBarFill.fillStyle(0xff1744, 1);
      this.bossBarFill.fillRoundedRect(-146, -6, 292 * pct, 12, 4);
    } else {
      this.bossBarContainer.setVisible(false);
    }
  }

  createVirtualControls() {
    // Left & Right D-pad
    const dpadY = GAME_HEIGHT - 60;
    const btnSize = 52;

    const leftBtn = this.createTouchButton(55, dpadY, '◀', btnSize, 0x1a237e,
      () => { this.touchInputs.left = true; },
      () => { this.touchInputs.left = false; }
    );

    const rightBtn = this.createTouchButton(135, dpadY, '▶', btnSize, 0x1a237e,
      () => { this.touchInputs.right = true; },
      () => { this.touchInputs.right = false; }
    );

    // Jump & Attack Buttons (Right side)
    const jumpBtn = this.createTouchButton(GAME_WIDTH - 65, dpadY, '▲', btnSize, 0x2e7d32,
      () => {
        this.touchInputs.jump = true;
        this.touchInputs.jumpJustPressed = true;
      },
      () => { this.touchInputs.jump = false; }
    );

    const attackBtn = this.createTouchButton(GAME_WIDTH - 145, dpadY, '⚔', btnSize, 0xc62828,
      () => { this.touchInputs.attackJustPressed = true; },
      () => {}
    );
  }

  createTouchButton(x, y, symbol, size, colorHex, onPress, onRelease) {
    const btn = this.add.container(x, y);
    btn.setScrollFactor(0);
    btn.setDepth(200);

    const bg = this.add.graphics();
    bg.fillStyle(colorHex, 0.65);
    bg.fillCircle(0, 0, size / 2);
    bg.lineStyle(2, 0xffffff, 0.8);
    bg.strokeCircle(0, 0, size / 2);

    const text = this.add.text(0, 0, symbol, {
      font: 'bold 22px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, text]);
    btn.setSize(size, size);
    btn.setInteractive({ cursor: 'pointer' });

    btn.on('pointerdown', () => {
      bg.alpha = 1;
      btn.setScale(0.92);
      onPress();
    });

    btn.on('pointerup', () => {
      bg.alpha = 0.65;
      btn.setScale(1);
      onRelease();
    });

    btn.on('pointerout', () => {
      bg.alpha = 0.65;
      btn.setScale(1);
      onRelease();
    });

    return btn;
  }

  clearJustPressed() {
    this.touchInputs.jumpJustPressed = false;
    this.touchInputs.attackJustPressed = false;
  }
}
