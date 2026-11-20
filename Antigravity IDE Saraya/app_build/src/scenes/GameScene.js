import { Player } from '../entities/Player.js';
import { LevelBuilder } from '../levels/LevelBuilder.js';
import { SoundManager } from '../audio/SoundManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.isVictory = false;
  }

  create() {
    this.isVictory = false;
    SoundManager.init();

    // 1. Build Level Geometry & Entities
    const builder = new LevelBuilder(this);
    this.levelData = builder.build(this.currentLevel);

    // Play Level Music
    SoundManager.playBgm(this.levelData.bgmTrack);

    // 2. Projectile Groups
    this.projectiles = this.physics.add.group();
    this.bossProjectiles = this.physics.add.group();

    // 3. Spawn Player
    const startPos = this.levelData.playerStart || { x: 100, y: 400 };
    this.player = new Player(this, startPos.x, startPos.y);

    // 4. Camera Follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(80, 40);

    // 5. Setup Collisions & Overlaps
    this.setupCollisions();

    // 6. Setup Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      J: Phaser.Input.Keyboard.KeyCodes.J,
      X: Phaser.Input.Keyboard.KeyCodes.X,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
      P: Phaser.Input.Keyboard.KeyCodes.P
    });

    // Pause Key Listeners
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    // 7. Launch Parallel UI Scene
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    }
  }

  setupCollisions() {
    // Player vs Terrain & Moving Platforms
    this.physics.add.collider(this.player, this.platforms);
    if (this.movingPlatformsList) {
      this.movingPlatformsList.forEach((mp) => {
        this.physics.add.collider(this.player, mp);
      });
    }

    // Player vs Bouncy Mushrooms
    this.physics.add.overlap(this.player, this.mushrooms, (player, mushroom) => {
      mushroom.bounce(player);
    });

    // Player vs Collectibles
    this.physics.add.overlap(this.player, this.collectibles, (player, collectible) => {
      collectible.collect(player);
    });

    // Player vs Checkpoints
    this.physics.add.overlap(this.player, this.checkpoints, (player, cp) => {
      if (cp.frame.name === 0) {
        cp.activateCheckpoint(player);
        SoundManager.playCheckpoint();
      }
    });

    // Player vs Hazards (Lava / Abyss)
    this.physics.add.overlap(this.player, this.hazards, (player, hazard) => {
      player.takeDamage(2, true);
    });

    // Player vs Finish Flag (Levels 1-4)
    if (this.finishFlag) {
      this.physics.add.overlap(this.player, this.finishFlag, () => {
        this.handleVictory();
      });
    }

    // Enemies vs Terrain
    this.physics.add.collider(this.enemies, this.platforms);

    // Player vs Enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (enemy.isDead || player.isDead) return;

      if (player.isAttacking) {
        enemy.defeat();
        player.score += 200;
      } else if (player.body.velocity.y > 0 && player.y < enemy.y - 12) {
        enemy.defeat();
        player.setVelocityY(-360);
        player.score += 200;
        SoundManager.playJump();
      } else {
        player.takeDamage(1);
      }
    });

    // Player Projectiles vs Enemies
    this.physics.add.overlap(this.projectiles, this.enemies, (proj, enemy) => {
      if (!proj.active || enemy.isDead) return;
      proj.destroy();
      enemy.defeat();
      this.player.score += 250;
    });

    // Player Projectiles vs Terrain
    this.physics.add.collider(this.projectiles, this.platforms, (proj) => {
      if (proj.active) proj.destroy();
    });

    // Boss Encounters (Level 5)
    if (this.boss) {
      this.physics.add.collider(this.boss, this.platforms);

      // Player vs Boss
      this.physics.add.overlap(this.player, this.boss, (player, boss) => {
        if (boss.isDefeated || player.isDead) return;
        if (player.isAttacking && boss.isVulnerable) {
          boss.takeDamage(1);
          player.setVelocityY(-250);
          player.setVelocityX(player.flipX ? 200 : -200);
        } else {
          player.takeDamage(1);
        }
      });

      // Player Projectiles vs Boss
      this.physics.add.overlap(this.projectiles, this.boss, (proj, boss) => {
        if (!proj.active || boss.isDefeated) return;
        proj.destroy();
        boss.takeDamage(1);
      });

      // Boss Projectiles vs Player
      this.physics.add.overlap(this.bossProjectiles, this.player, (bolt, player) => {
        if (!bolt.active || player.isDead) return;
        bolt.destroy();
        player.takeDamage(1);
      });

      // Boss Projectiles vs Terrain
      this.physics.add.collider(this.bossProjectiles, this.platforms, (bolt) => {
        if (bolt.active) bolt.destroy();
      });
    }
  }

  update(time, delta) {
    if (this.isVictory) return;

    const ui = this.scene.get('UIScene');
    const touchInputs = ui ? ui.touchInputs : { left: false, right: false, jump: false, jumpJustPressed: false, attackJustPressed: false };

    if (this.player) {
      this.player.update(time, delta, this.cursors, this.keys, touchInputs);

      if (this.player.y > this.levelData.worldHeight + 50) {
        this.player.takeDamage(2, true);
      }
    }

    if (this.movingPlatformsList) {
      this.movingPlatformsList.forEach((mp) => mp.update());
    }

    if (this.enemies) {
      this.enemies.getChildren().forEach((e) => {
        if (e.update) e.update(time, delta);
      });
    }

    if (this.boss && this.boss.update) {
      this.boss.update(time, delta, this.player);
    }

    if (ui && ui.updateHUD) {
      const levelTitle = `LEVEL ${this.currentLevel}: ${this.levelData.title}`;
      ui.updateHUD(this.player, levelTitle, this.boss);
      ui.clearJustPressed();
    }
  }

  pauseGame() {
    this.scene.pause();
    this.scene.pause('UIScene');
    this.scene.launch('PauseScene', { level: this.currentLevel });
  }

  handleVictory() {
    if (this.isVictory) return;
    this.isVictory = true;

    SoundManager.stopBgm();
    SoundManager.playVictory();

    this.player.setVelocity(0, 0);
    this.player.play('stitch_victory', true);

    this.time.delayedCall(1400, () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('UIScene');
        this.scene.start('VictoryScene', {
          level: this.currentLevel,
          score: this.player.score,
          coins: this.player.coins
        });
      });
    });
  }
}
