import { SoundManager } from '../audio/SoundManager.js';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'crab', minX = 0, maxX = 0) {
    // Determine sprite frame index based on type
    const frameOffsets = {
      crab: 0,
      bat: 2,
      spider: 4,
      flame: 6,
      drone: 8
    };
    const startFrame = frameOffsets[type] ?? 0;

    super(scene, x, y, 'enemies', startFrame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemyType = type;
    this.minX = minX || (x - 80);
    this.maxX = maxX || (x + 80);
    this.speed = type === 'bat' || type === 'drone' ? 80 : 50;
    this.direction = 1;
    this.isDead = false;

    // Body sizing
    this.body.setSize(34, 30);
    this.body.setOffset(7, 10);

    if (type === 'bat' || type === 'drone') {
      this.body.setAllowGravity(false);
      this.floatBaseY = y;
    }

    // Play animation
    const animKey = `enemy_${type}`;
    if (scene.anims.exists(animKey)) {
      this.play(animKey);
    }

    this.setVelocityX(this.speed * this.direction);
  }

  update(time, delta) {
    if (this.isDead) return;

    // Horizontal patrol logic
    if (this.x >= this.maxX) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.x <= this.minX) {
      this.direction = 1;
      this.setFlipX(false);
    }
    this.setVelocityX(this.speed * this.direction);

    // Flying sinusoidal bob
    if (this.enemyType === 'bat' || this.enemyType === 'drone') {
      this.y = this.floatBaseY + Math.sin(time / 200) * 16;
    }
  }

  defeat() {
    if (this.isDead) return;
    this.isDead = true;
    SoundManager.playEnemyHit();

    this.body.setEnable(false);
    this.setVelocity(0, -180);

    this.scene.tweens.add({
      targets: this,
      y: this.y + 200,
      alpha: 0,
      angle: 180,
      duration: 600,
      onComplete: () => {
        this.destroy();
      }
    });

    // Score pop-up
    const scoreText = this.scene.add.text(this.x, this.y - 10, '+200', {
      font: 'bold 14px Arial',
      fill: '#ffd700'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: scoreText,
      y: scoreText.y - 30,
      alpha: 0,
      duration: 500,
      onComplete: () => scoreText.destroy()
    });
  }
}
