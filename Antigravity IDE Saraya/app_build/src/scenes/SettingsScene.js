import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { Storage } from '../utils/Storage.js';
import { SoundManager } from '../audio/SoundManager.js';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    SoundManager.init();

    // Background
    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_beach')
      .setOrigin(0, 0);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x08142c, 0.8);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    this.add.text(GAME_WIDTH / 2, 50, 'GAME SETTINGS', {
      font: '900 36px "Segoe UI", Arial, sans-serif',
      fill: '#00e5ff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const settings = Storage.getSettings();

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x1a237e, 0.9);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 250, 100, 500, 320, 12);
    panel.lineStyle(2, 0x00e5ff, 0.8);
    panel.strokeRoundedRect(GAME_WIDTH / 2 - 250, 100, 500, 320, 12);

    let y = 140;

    // 1. BGM Volume
    this.add.text(GAME_WIDTH / 2 - 210, y, 'MUSIC VOLUME', {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    });

    const bgmValText = this.add.text(GAME_WIDTH / 2 + 100, y, `${Math.round(settings.bgmVolume * 100)}%`, {
      font: 'bold 18px Arial',
      fill: '#ffd700'
    }).setOrigin(0.5, 0);

    this.createStepper(GAME_WIDTH / 2 + 160, y + 10, (delta) => {
      let vol = Math.max(0, Math.min(1, Math.round((settings.bgmVolume + delta * 0.1) * 10) / 10));
      settings.bgmVolume = vol;
      SoundManager.setBgmVolume(vol);
      Storage.updateSettings(settings);
      bgmValText.setText(`${Math.round(vol * 100)}%`);
    });

    // 2. SFX Volume
    y += 65;
    this.add.text(GAME_WIDTH / 2 - 210, y, 'SOUND EFFECTS', {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    });

    const sfxValText = this.add.text(GAME_WIDTH / 2 + 100, y, `${Math.round(settings.sfxVolume * 100)}%`, {
      font: 'bold 18px Arial',
      fill: '#ffd700'
    }).setOrigin(0.5, 0);

    this.createStepper(GAME_WIDTH / 2 + 160, y + 10, (delta) => {
      let vol = Math.max(0, Math.min(1, Math.round((settings.sfxVolume + delta * 0.1) * 10) / 10));
      settings.sfxVolume = vol;
      SoundManager.setSfxVolume(vol);
      SoundManager.playCoin();
      Storage.updateSettings(settings);
      sfxValText.setText(`${Math.round(vol * 100)}%`);
    });

    // 3. Touch Controls Toggle
    y += 65;
    this.add.text(GAME_WIDTH / 2 - 210, y, 'TOUCH CONTROLS', {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    });

    const touchValText = this.add.text(GAME_WIDTH / 2 + 100, y, settings.touchControls ? 'ON' : 'OFF', {
      font: 'bold 18px Arial',
      fill: settings.touchControls ? '#4caf50' : '#f44336'
    }).setOrigin(0.5, 0);

    const toggleBtn = this.add.text(GAME_WIDTH / 2 + 160, y, '[ TOGGLE ]', {
      font: 'bold 16px Arial',
      fill: '#00e5ff'
    }).setInteractive({ cursor: 'pointer' });

    toggleBtn.on('pointerdown', () => {
      settings.touchControls = !settings.touchControls;
      Storage.updateSettings(settings);
      touchValText.setText(settings.touchControls ? 'ON' : 'OFF');
      touchValText.setFill(settings.touchControls ? '#4caf50' : '#f44336');
      SoundManager.playCoin();
    });

    // 4. Reset Progress
    y += 65;
    const resetBtn = this.add.text(GAME_WIDTH / 2, y + 10, '⚠️  RESET ALL PROGRESS', {
      font: 'bold 16px Arial',
      fill: '#ff5252'
    }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

    resetBtn.on('pointerdown', () => {
      if (confirm('Are you sure you want to reset all game data and unlocked levels?')) {
        Storage.resetAll();
        SoundManager.playGameOver();
        this.scene.start('MainMenuScene');
      }
    });

    // Back Button
    const backBtn = this.add.container(GAME_WIDTH / 2, 450);
    const backBg = this.add.graphics();
    backBg.fillStyle(0xe91e63, 0.9);
    backBg.fillRoundedRect(-90, -20, 180, 40, 6);
    const backLabel = this.add.text(0, 0, '⬅  BACK', {
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

  createStepper(x, y, onStep) {
    const minus = this.add.text(x - 30, y, '➖', { font: '18px Arial' })
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' });
    const plus = this.add.text(x + 30, y, '➕', { font: '18px Arial' })
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' });

    minus.on('pointerdown', () => onStep(-1));
    plus.on('pointerdown', () => onStep(1));
  }
}
