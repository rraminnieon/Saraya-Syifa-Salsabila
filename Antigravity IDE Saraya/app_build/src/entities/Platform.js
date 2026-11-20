import { SoundManager } from '../audio/SoundManager.js';

export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'moving_platform_tex', frame = null, distance = 140, isVertical = false, speed = 60) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.friction.x = 1;
    this.body.setSize(64, 18);
    this.body.setOffset(0, 1);

    this.startX = x;
    this.startY = y;
    this.distance = distance;
    this.isVertical = isVertical;
    this.speed = speed;

    if (isVertical) {
      this.setVelocityY(speed);
    } else {
      this.setVelocityX(speed);
    }
  }

  update() {
    if (this.isVertical) {
      if (this.y >= this.startY + this.distance) {
        this.setVelocityY(-this.speed);
      } else if (this.y <= this.startY - this.distance) {
        this.setVelocityY(this.speed);
      }
    } else {
      if (this.x >= this.startX + this.distance) {
        this.setVelocityX(-this.speed);
      } else if (this.x <= this.startX - this.distance) {
        this.setVelocityX(this.speed);
      }
    }
  }
}

export class BouncyMushroom extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bouncy_mushroom');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(30, 20);
    this.body.setOffset(1, 10);
  }

  bounce(player) {
    SoundManager.playJump();
    player.setVelocityY(-620);
    player.canDoubleJump = true;

    this.scene.tweens.add({
      targets: this,
      scaleY: 0.6,
      scaleX: 1.3,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });
  }
}

export class SinkingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'tileset', frame = 6) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.isSinking = false;
    this.originalY = y;
  }

  triggerSink() {
    if (this.isSinking) return;
    this.isSinking = true;

    this.scene.tweens.add({
      targets: this,
      x: this.x + 3,
      duration: 60,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        this.body.setAllowGravity(true);
        this.setVelocityY(160);

        this.scene.time.delayedCall(2000, () => {
          this.body.setAllowGravity(false);
          this.setVelocityY(0);
          this.setPosition(this.x, this.originalY);
          this.isSinking = false;
        });
      }
    });
  }
}
