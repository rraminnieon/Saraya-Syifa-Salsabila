import { gameConfig } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

// Assemble Scenes in configuration
const config = {
  ...gameConfig,
  scene: [
    BootScene,
    MainMenuScene,
    LevelSelectScene,
    SettingsScene,
    GameScene,
    UIScene,
    PauseScene,
    GameOverScene,
    VictoryScene
  ]
};

// Initialize Phaser Game instance
window.addEventListener('load', () => {
  const game = new Phaser.Game(config);

  // Prevent default scroll behavior on arrow keys and spacebar
  window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }, { passive: false });
});
