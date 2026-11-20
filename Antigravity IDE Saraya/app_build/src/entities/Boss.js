import { SoundManager } from '../audio/SoundManager.js';

export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss_gantu', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(64, 76);
    this.body.setOffset(16, 12);
    this.setCollideWorldBounds(true);

    this.maxHealth = 10;
    this.health = 10;
    this.phase = 1;
    this.isVulnerable = true;
    this.isDefeated = false;

    this.attackTimer = 0;
    this.attackInterval = 2500; // ms
    this.patrolSpeed = 80;
    this.direction = 1;
    this.minX = x - 250;
    this.maxX = x + 250;

    this.setVelocityX(this.patrolSpeed);
  }

  update(time, delta, player) {
    if (this.isDefeated) return;

    // Movement patrol
    if (this.x >= this.maxX) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.x <= this.minX) {
      this.direction = 1;
      this.setFlipX(false);
    }
    this.setVelocityX(this.patrolSpeed * this.direction);

    // Attack State Machine
    this.attackTimer += delta;
    if (this.attackTimer >= this.attackInterval) {
      this.attackTimer = 0;
      this.executePhaseAttack(player);
    }
  }

  executePhaseAttack(player) {
    if (this.isDefeated) return;

    this.setFrame(2); // Attack frame

    if (this.phase === 1) {
      // Phase 1: Dual Plasma Volley
      SoundManager.playLaser();
      this.firePlasmaAt(player.x, player.y);
      this.scene.time.delayedCall(400, () => {
        if (!this.isDefeated) this.setFrame(0);
      });
    } else if (this.phase === 2) {
      // Phase 2: Ground Slam & Drone Minion Drop
      SoundManager.playBossHit();
      this.scene.cameras.main.shake(300, 0.015);
      this.spawnMinionDrone();
      this.firePlasmaAt(player.x, player.y);
      this.scene.time.delayedCall(600, () => {
        if (!this.isDefeated) this.setFrame(0);
      });
    } else if (this.phase === 3) {
      // Phase 3: Rapid Double Blaster & Charge
      SoundManager.playLaser();
      this.firePlasmaAt(player.x, player.y);
      this.scene.time.delayedCall(300, () => {
        this.firePlasmaAt(player.x, player.y);
      });
      this.patrolSpeed = 130;
      this.scene.time.delayedCall(600, () => {
        if (!this.isDefeated) this.setFrame(0);
      });
    }
  }

  firePlasmaAt(targetX, targetY) {
    const bolt = this.scene.physics.add.sprite(this.x, this.y, 'boss_blast');
    this.scene.bossProjectiles.add(bolt);
    bolt.body.setAllowGravity(false);

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    this.scene.physics.velocityFromRotation(angle, 350, bolt.body.velocity);

    this.scene.time.delayedCall(3000, () => {
      if (bolt && bolt.active) bolt.destroy();
    });
  }

  spawnMinionDrone() {
    if (this.scene.enemies) {
      const drone = this.scene.enemies.create(this.x, this.y - 40, 'enemies', 8);
      drone.enemyType = 'drone';
      drone.speed = 100;
      drone.direction = this.direction;
      drone.body.setAllowGravity(false);
      drone.setVelocityX(this.direction * 100);
      drone.minX = this.minX;
      drone.maxX = this.maxX;
    }
  }

  takeDamage(amount = 1) {
    if (!this.isVulnerable || this.isDefeated) return;

    this.health = Math.max(0, this.health - amount);
    SoundManager.playBossHit();

    // Visual Hurt state
    this.setFrame(3);
    this.isVulnerable = false;

    // Check Phase Shifts
    if (this.health <= 3) {
      this.phase = 3;
      this.attackInterval = 1400;
    } else if (this.health <= 7) {
      this.phase = 2;
      this.attackInterval = 1800;
    }

    if (this.health <= 0) {
      this.defeat();
      return;
    }

    this.scene.tweens.add({
      targets: this,
      alpha: 0.4,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.alpha = 1;
        this.setFrame(0);
        this.isVulnerable = true;
      }
    });
  }

  defeat() {
    this.isDefeated = true;
    this.setVelocity(0, 0);
    this.body.setEnable(false);
    this.setFrame(3);

    SoundManager.playVictory();
    this.scene.cameras.main.flash(600, 255, 255, 255);

    // Explosions
    for (let i = 0; i < 8; i++) {
      this.scene.time.delayedCall(i * 150, () => {
        const rx = this.x + Phaser.Math.Between(-40, 40);
        const ry = this.y + Phaser.Math.Between(-40, 40);
        const boom = this.scene.add.image(rx, ry, 'sparkle').setScale(2);
        this.scene.tweens.add({
          targets: boom,
          scale: 3,
          alpha: 0,
          duration: 300,
          onComplete: () => boom.destroy()
        });
        SoundManager.playEnemyHit();
      });
    }

    this.scene.time.delayedCall(1600, () => {
      this.scene.handleVictory();
    });
  }
}
