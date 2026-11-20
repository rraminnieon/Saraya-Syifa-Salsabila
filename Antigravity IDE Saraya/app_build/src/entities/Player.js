import { SoundManager } from '../audio/SoundManager.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'stitch', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics Body tuning
    this.body.setSize(30, 44);
    this.body.setOffset(17, 18);
    this.setCollideWorldBounds(true);

    // Player Stats & State
    this.maxHealth = 6;
    this.health = 6;
    this.lives = 3;
    this.score = 0;
    this.coins = 0;

    // Movement Tuning
    this.speed = 220;
    this.jumpForce = -470;
    this.canDoubleJump = true;
    this.isAttacking = false;
    this.isHurt = false;
    this.isInvulnerable = false;
    this.isDead = false;

    // Coyote Time & Jump Buffering
    this.coyoteCounter = 0;
    this.coyoteMax = 100;
    this.jumpBufferCounter = 0;
    this.jumpBufferMax = 120;

    // Power-up States
    this.hasBlaster = false;
    this.blasterTimer = 0;
    this.hasShield = false;
    this.shieldSprite = null;
    this.hasSpeedBoost = false;
    this.speedTimer = 0;

    // Active Checkpoint Coordinate
    this.respawnPoint = { x, y };

    // Create Shield Visual
    this.shieldSprite = scene.add.sprite(x, y, 'power_shield').setVisible(false);
    this.shieldSprite.setDepth(15);
  }

  update(time, delta, cursors, keys, touchInputs) {
    if (this.isDead) return;

    // Update Shield position
    if (this.hasShield && this.shieldSprite) {
      this.shieldSprite.setPosition(this.x, this.y);
      this.shieldSprite.setVisible(true);
      this.shieldSprite.rotation += 0.05;
    } else if (this.shieldSprite) {
      this.shieldSprite.setVisible(false);
    }

    // Power-up Countdown Timers
    if (this.hasBlaster) {
      this.blasterTimer -= delta;
      if (this.blasterTimer <= 0) {
        this.hasBlaster = false;
      }
    }
    if (this.hasSpeedBoost) {
      this.speedTimer -= delta;
      if (this.speedTimer <= 0) {
        this.hasSpeedBoost = false;
        this.speed = 220;
      }
    }

    const onGround = this.body.blocked.down || this.body.touching.down;

    // Coyote Time
    if (onGround) {
      this.coyoteCounter = this.coyoteMax;
      this.canDoubleJump = true;
    } else {
      this.coyoteCounter = Math.max(0, this.coyoteCounter - delta);
    }

    // Safe input evaluation (handles desktop + mobile / touch)
    const tIn = touchInputs || {};
    const leftPressed = Boolean(cursors?.left?.isDown || keys?.A?.isDown || tIn.left);
    const rightPressed = Boolean(cursors?.right?.isDown || keys?.D?.isDown || tIn.right);
    const jumpJustPressed = Boolean(
      (cursors?.up && Phaser.Input.Keyboard.JustDown(cursors.up)) ||
      (cursors?.space && Phaser.Input.Keyboard.JustDown(cursors.space)) ||
      (keys?.W && Phaser.Input.Keyboard.JustDown(keys.W)) ||
      tIn.jumpJustPressed
    );
    const jumpHeld = Boolean(cursors?.up?.isDown || cursors?.space?.isDown || keys?.W?.isDown || tIn.jump);
    const attackPressed = Boolean(
      (keys?.J && Phaser.Input.Keyboard.JustDown(keys.J)) ||
      (keys?.X && Phaser.Input.Keyboard.JustDown(keys.X)) ||
      (keys?.SHIFT && Phaser.Input.Keyboard.JustDown(keys.SHIFT)) ||
      tIn.attackJustPressed
    );

    // Jump Buffering
    if (jumpJustPressed) {
      this.jumpBufferCounter = this.jumpBufferMax;
    } else {
      this.jumpBufferCounter = Math.max(0, this.jumpBufferCounter - delta);
    }

    // Horizontal Movement
    if (!this.isHurt) {
      const currentSpeed = this.hasSpeedBoost ? this.speed * 1.4 : this.speed;

      if (leftPressed) {
        this.setVelocityX(-currentSpeed);
        this.setFlipX(true);
      } else if (rightPressed) {
        this.setVelocityX(currentSpeed);
        this.setFlipX(false);
      } else {
        this.setVelocityX(0);
      }
    }

    // Jump Logic
    if (this.jumpBufferCounter > 0) {
      if (this.coyoteCounter > 0) {
        this.setVelocityY(this.jumpForce);
        this.coyoteCounter = 0;
        this.jumpBufferCounter = 0;
        SoundManager.playJump();
        this.emitDust();
      } else if (this.canDoubleJump) {
        this.setVelocityY(this.jumpForce * 0.95);
        this.canDoubleJump = false;
        this.jumpBufferCounter = 0;
        SoundManager.playDoubleJump();
        this.play('stitch_djump', true);
        this.emitSparkles();
      }
    }

    // Variable Jump Height
    if (!jumpHeld && this.body.velocity.y < -150) {
      this.setVelocityY(this.body.velocity.y * 0.5);
    }

    // Attack Action
    if (attackPressed && !this.isAttacking && !this.isHurt) {
      this.performAttack();
    }

    // Animations
    if (!this.isAttacking && !this.isHurt) {
      if (!onGround) {
        if (this.body.velocity.y < 0) {
          if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'stitch_djump') {
            this.play('stitch_jump', true);
          }
        } else {
          this.play('stitch_fall', true);
        }
      } else {
        if (Math.abs(this.body.velocity.x) > 10) {
          if (this.hasSpeedBoost || Math.abs(this.body.velocity.x) > 230) {
            this.play('stitch_run', true);
          } else {
            this.play('stitch_walk', true);
          }
        } else {
          this.play('stitch_idle', true);
        }
      }
    }
  }

  performAttack() {
    this.isAttacking = true;
    SoundManager.playAttack();

    if (this.hasBlaster) {
      this.firePlasma();
      this.scene.time.delayedCall(200, () => {
        this.isAttacking = false;
      });
    } else {
      this.play('stitch_attack', true);
      this.scene.time.delayedCall(300, () => {
        this.isAttacking = false;
      });
    }
  }

  firePlasma() {
    SoundManager.playLaser();
    const dir = this.flipX ? -1 : 1;
    const bolt = this.scene.physics.add.sprite(this.x + dir * 20, this.y, 'plasma_bolt');
    this.scene.projectiles.add(bolt);
    bolt.body.setAllowGravity(false);
    bolt.setVelocityX(dir * 550);
    this.scene.time.delayedCall(1200, () => {
      if (bolt && bolt.active) bolt.destroy();
    });
  }

  takeDamage(amount = 1, hazardKnockback = false) {
    if (this.isInvulnerable || this.isDead) return;

    if (this.hasShield) {
      this.hasShield = false;
      SoundManager.playPowerup();
      this.triggerInvulnerability(1000);
      return;
    }

    this.health = Math.max(0, this.health - amount);
    SoundManager.playHurt();

    if (this.health <= 0) {
      this.die();
      return;
    }

    this.isHurt = true;
    this.play('stitch_hurt', true);
    this.setVelocityY(-250);
    this.setVelocityX(this.flipX ? 150 : -150);

    this.triggerInvulnerability(1500);

    this.scene.time.delayedCall(350, () => {
      this.isHurt = false;
    });

    if (hazardKnockback) {
      this.respawnAtCheckpoint();
    }
  }

  triggerInvulnerability(durationMs = 1500) {
    this.isInvulnerable = true;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: Math.floor(durationMs / 200),
      onComplete: () => {
        this.alpha = 1;
        this.isInvulnerable = false;
      }
    });
  }

  respawnAtCheckpoint() {
    this.setPosition(this.respawnPoint.x, this.respawnPoint.y);
    this.setVelocity(0, 0);
    this.triggerInvulnerability(1200);
  }

  die() {
    this.isDead = true;
    this.lives--;
    this.setVelocity(0, -350);
    this.body.setCollideWorldBounds(false);
    SoundManager.playGameOver();

    this.scene.time.delayedCall(1200, () => {
      if (this.lives > 0) {
        this.health = 6;
        this.isDead = false;
        this.body.setCollideWorldBounds(true);
        this.respawnAtCheckpoint();
      } else {
        this.scene.scene.start('GameOverScene', { score: this.score, level: this.scene.currentLevel });
      }
    });
  }

  heal(amount = 2) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    SoundManager.playPowerup();
  }

  addCoin(value = 1) {
    this.coins += value;
    this.score += 50;
    SoundManager.playCoin();

    if (this.coins >= 100) {
      this.coins -= 100;
      this.lives++;
      SoundManager.playPowerup();
    }
  }

  applyPowerup(type) {
    SoundManager.playPowerup();
    if (type === 'blaster') {
      this.hasBlaster = true;
      this.blasterTimer = 15000;
    } else if (type === 'shield') {
      this.hasShield = true;
    } else if (type === 'coffee') {
      this.hasSpeedBoost = true;
      this.speedTimer = 10000;
    }
  }

  emitDust() {
    const p = this.scene.add.image(this.x, this.y + 22, 'dust').setScale(0.8);
    this.scene.tweens.add({
      targets: p,
      scale: 1.4,
      alpha: 0,
      y: this.y + 15,
      duration: 300,
      onComplete: () => p.destroy()
    });
  }

  emitSparkles() {
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const sp = this.scene.add.image(this.x + Math.cos(angle) * 12, this.y + Math.sin(angle) * 12, 'sparkle');
      this.scene.tweens.add({
        targets: sp,
        x: sp.x + Math.cos(angle) * 20,
        y: sp.y + Math.sin(angle) * 20,
        alpha: 0,
        scale: 0.2,
        duration: 350,
        onComplete: () => sp.destroy()
      });
    }
  }
}
