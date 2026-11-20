export class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'coin') {
    let textureKey = 'coin';
    let frame = 0;

    if (type === 'heart') {
      textureKey = 'heart';
    } else if (type === 'blaster') {
      textureKey = 'power_blaster';
    } else if (type === 'shield') {
      textureKey = 'power_shield';
    } else if (type === 'coffee') {
      textureKey = 'power_coffee';
    } else if (type === 'checkpoint') {
      textureKey = 'checkpoint';
      frame = 0;
    } else if (type === 'flag') {
      textureKey = 'finish_flag';
    }

    super(scene, x, y, textureKey, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.collectibleType = type;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    if (type === 'coin') {
      if (scene.anims.exists('coin_spin')) {
        this.play('coin_spin');
      }
    }

    // Gentle floating bob animation for powerups and coins
    if (type !== 'checkpoint' && type !== 'flag') {
      scene.tweens.add({
        targets: this,
        y: y - 6,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  collect(player) {
    if (this.collectibleType === 'coin') {
      player.addCoin(1);
    } else if (this.collectibleType === 'heart') {
      player.heal(2);
    } else if (['blaster', 'shield', 'coffee'].includes(this.collectibleType)) {
      player.applyPowerup(this.collectibleType);
    }

    // Sparkle effect
    const sp = this.scene.add.image(this.x, this.y, 'sparkle');
    this.scene.tweens.add({
      targets: sp,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => sp.destroy()
    });

    this.destroy();
  }

  activateCheckpoint(player) {
    if (this.collectibleType === 'checkpoint' && this.frame.name !== 1) {
      this.setFrame(1);
      player.respawnPoint = { x: this.x, y: this.y - 10 };
      // Sparkle burst
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const sp = this.scene.add.image(this.x, this.y - 15, 'sparkle');
        this.scene.tweens.add({
          targets: sp,
          x: sp.x + Math.cos(angle) * 30,
          y: sp.y + Math.sin(angle) * 30,
          alpha: 0,
          scale: 0.3,
          duration: 400,
          onComplete: () => sp.destroy()
        });
      }
    }
  }
}
