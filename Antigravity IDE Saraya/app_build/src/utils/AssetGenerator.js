// Procedural Vector / Pixel Canvas Asset Generator for STITCH ADVENTURE
// Creates crisp, authentic Disney Stitch character spritesheets, enemies, tilesets, and parallax backgrounds

export class AssetGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateAll() {
    this.generateStitchSprites();
    this.generateEnemySprites();
    this.generateBossSprites();
    this.generateTiles();
    this.generateCollectibles();
    this.generateProjectiles();
    this.generatePlatformTextures();
    this.generateBackgrounds();
    this.generateParticles();
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  // ==========================================
  // STITCH SPRITESHEET (64x64 per frame)
  // ==========================================
  generateStitchSprites() {
    const frameW = 64;
    const frameH = 64;
    const totalFrames = 27;
    const { canvas, ctx } = this.createCanvas(totalFrames * frameW, frameH);

    const drawStitch = (offsetX, state, frameIndex) => {
      ctx.save();
      ctx.translate(offsetX + 32, 32);

      const cBlue = '#225bbf';
      const cDarkBlue = '#123985';
      const cLightBlue = '#76b8fc';
      const cPink = '#e65c92';
      const cDarkPink = '#b03366';
      const cWhite = '#ffffff';
      const cBlack = '#08142c';
      const cNose = '#0b162a';

      let bodyBob = 0;
      let earAngleL = -0.3;
      let earAngleR = 0.3;
      let eyeSquint = 0;
      let legOffsetL = 0;
      let legOffsetR = 0;
      let armAngleL = 0.2;
      let armAngleR = -0.2;
      let rotation = 0;
      let scaleY = 1;
      let scaleX = 1;

      if (state === 'idle') {
        bodyBob = Math.sin(frameIndex * Math.PI / 2) * 1.5;
        if (frameIndex === 2) eyeSquint = 0.7;
        earAngleL = -0.3 + Math.sin(frameIndex) * 0.1;
        earAngleR = 0.3 - Math.sin(frameIndex) * 0.1;
      } else if (state === 'walk') {
        const t = (frameIndex / 4) * Math.PI * 2;
        bodyBob = Math.abs(Math.sin(t)) * -3;
        legOffsetL = Math.sin(t) * 6;
        legOffsetR = -Math.sin(t) * 6;
        armAngleL = -Math.sin(t) * 0.5;
        armAngleR = Math.sin(t) * 0.5;
        earAngleL = -0.3 + Math.cos(t) * 0.15;
        earAngleR = 0.3 - Math.cos(t) * 0.15;
      } else if (state === 'run') {
        const t = (frameIndex / 4) * Math.PI * 2;
        bodyBob = Math.abs(Math.sin(t)) * -4;
        legOffsetL = Math.sin(t) * 10;
        legOffsetR = -Math.sin(t) * 10;
        armAngleL = -Math.sin(t) * 0.9;
        armAngleR = Math.sin(t) * 0.9;
        earAngleL = -0.6;
        earAngleR = 0.6;
        rotation = 0.15;
      } else if (state === 'jump') {
        bodyBob = -4;
        scaleY = 1.1;
        scaleX = 0.92;
        legOffsetL = -3;
        legOffsetR = -3;
        armAngleL = -0.8;
        armAngleR = 0.8;
        earAngleL = -0.5;
        earAngleR = 0.5;
      } else if (state === 'djump') {
        rotation = (frameIndex / 4) * Math.PI * 2;
        scaleX = 0.9;
        scaleY = 0.9;
        bodyBob = -2;
        earAngleL = -0.8;
        earAngleR = 0.8;
      } else if (state === 'fall') {
        scaleY = 0.95;
        scaleX = 1.05;
        armAngleL = -1.2;
        armAngleR = 1.2;
        earAngleL = -0.1;
        earAngleR = 0.1;
        legOffsetL = 2;
        legOffsetR = 2;
      } else if (state === 'attack') {
        rotation = (frameIndex / 4) * Math.PI * 2;
        armAngleL = -1.5;
        armAngleR = 1.5;
      } else if (state === 'hurt') {
        rotation = -0.25;
        bodyBob = 2;
        earAngleL = 0.1;
        earAngleR = -0.1;
        eyeSquint = 1;
      } else if (state === 'victory') {
        const t = (frameIndex / 4) * Math.PI * 2;
        bodyBob = Math.sin(t) * -5;
        armAngleL = -2.2 + Math.sin(t) * 0.3;
        armAngleR = 2.2 - Math.sin(t) * 0.3;
        earAngleL = -0.4 + Math.sin(t) * 0.2;
        earAngleR = 0.4 - Math.sin(t) * 0.2;
      }

      ctx.rotate(rotation);
      ctx.scale(scaleX, scaleY);
      ctx.translate(0, bodyBob);

      // 1. EARS
      ctx.save();
      ctx.translate(-10, -8);
      ctx.rotate(earAngleL);
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(-14, -10, 16, 7, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = cDarkBlue;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = cPink;
      ctx.beginPath();
      ctx.ellipse(-13, -10, 12, 4.5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cDarkPink;
      ctx.fillRect(-20, -11, 3, 2);
      ctx.restore();

      ctx.save();
      ctx.translate(10, -8);
      ctx.rotate(earAngleR);
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(14, -10, 16, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = cDarkBlue;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = cPink;
      ctx.beginPath();
      ctx.ellipse(13, -10, 12, 4.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cDarkPink;
      ctx.fillRect(18, -11, 3, 2);
      ctx.restore();

      // 2. LEGS & PAWS
      ctx.fillStyle = cDarkBlue;
      ctx.beginPath();
      ctx.arc(-8, 16 + legOffsetL, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cBlack;
      ctx.fillRect(-12, 20 + legOffsetL, 2, 3);
      ctx.fillRect(-9, 21 + legOffsetL, 2, 3);
      ctx.fillRect(-6, 20 + legOffsetL, 2, 3);

      ctx.fillStyle = cDarkBlue;
      ctx.beginPath();
      ctx.arc(8, 16 + legOffsetR, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cBlack;
      ctx.fillRect(4, 20 + legOffsetR, 2, 3);
      ctx.fillRect(7, 21 + legOffsetR, 2, 3);
      ctx.fillRect(10, 20 + legOffsetR, 2, 3);

      // 3. BODY & CHEST
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(0, 8, 14, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = cDarkBlue;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = cLightBlue;
      ctx.beginPath();
      ctx.ellipse(0, 9, 8, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. ARMS
      ctx.save();
      ctx.translate(-10, 5);
      ctx.rotate(armAngleL);
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(-4, 4, 7, 4, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cBlack;
      ctx.fillRect(-9, 6, 2, 2);
      ctx.fillRect(-7, 8, 2, 2);
      ctx.restore();

      ctx.save();
      ctx.translate(10, 5);
      ctx.rotate(armAngleR);
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(4, 4, 7, 4, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cBlack;
      ctx.fillRect(5, 8, 2, 2);
      ctx.fillRect(7, 6, 2, 2);
      ctx.restore();

      // 5. HEAD
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.ellipse(0, -6, 17, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = cDarkBlue;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hair tufts
      ctx.fillStyle = cDarkBlue;
      ctx.beginPath();
      ctx.moveTo(-3, -19);
      ctx.lineTo(0, -25);
      ctx.lineTo(2, -20);
      ctx.lineTo(5, -23);
      ctx.lineTo(4, -18);
      ctx.closePath();
      ctx.fill();

      // 6. EYES & PATCHES
      ctx.fillStyle = cDarkBlue;
      ctx.beginPath();
      ctx.ellipse(-7, -6, 6, 7.5, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cDarkBlue;
      ctx.beginPath();
      ctx.ellipse(7, -6, 6, 7.5, 0.15, 0, Math.PI * 2);
      ctx.fill();

      if (eyeSquint > 0.5) {
        ctx.strokeStyle = cBlack;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -6);
        ctx.lineTo(-4, -6);
        ctx.moveTo(4, -6);
        ctx.lineTo(10, -6);
        ctx.stroke();
      } else {
        ctx.fillStyle = cBlack;
        ctx.beginPath();
        ctx.ellipse(-6.5, -6, 4, 5.5, 0, 0, Math.PI * 2);
        ctx.ellipse(6.5, -6, 4, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = cWhite;
        ctx.beginPath();
        ctx.arc(-5.5, -8, 1.8, 0, Math.PI * 2);
        ctx.arc(5.5, -8, 1.8, 0, Math.PI * 2);
        ctx.arc(-7, -4.5, 1, 0, Math.PI * 2);
        ctx.arc(7, -4.5, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. NOSE & MOUTH
      ctx.fillStyle = cNose;
      ctx.beginPath();
      ctx.ellipse(0, -1, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = cBlack;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (state === 'victory') {
        ctx.fillStyle = '#9e1a3a';
        ctx.ellipse(0, 3, 5, 3.5, 0, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (state === 'hurt') {
        ctx.arc(0, 4, 3, Math.PI, 0, false);
        ctx.stroke();
      } else {
        ctx.arc(-1.5, 1.5, 3, 0.2, Math.PI * 0.8, false);
        ctx.stroke();
      }

      if (state === 'attack') {
        ctx.strokeStyle = '#4deeea';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 24 + frameIndex * 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    let currentFrame = 0;
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'idle', i); currentFrame++; }
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'walk', i); currentFrame++; }
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'run', i); currentFrame++; }
    drawStitch(currentFrame * frameW, 'jump', 0); currentFrame++;
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'djump', i); currentFrame++; }
    drawStitch(currentFrame * frameW, 'fall', 0); currentFrame++;
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'attack', i); currentFrame++; }
    drawStitch(currentFrame * frameW, 'hurt', 0); currentFrame++;
    for (let i = 0; i < 4; i++) { drawStitch(currentFrame * frameW, 'victory', i); currentFrame++; }

    this.scene.textures.addSpriteSheet('stitch', canvas, {
      frameWidth: frameW,
      frameHeight: frameH
    });
  }

  generatePlatformTextures() {
    // 64x20 Wide Moving Platform texture
    const { canvas, ctx } = this.createCanvas(64, 20);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(0, 0, 64, 20);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, 0, 64, 3);
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(4, 5, 26, 12);
    ctx.fillRect(34, 5, 26, 12);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, 64, 20);
    this.scene.textures.addCanvas('moving_platform_tex', canvas);
  }

  // ==========================================
  // ENEMIES SPRITESHEET (48x48)
  // ==========================================
  generateEnemySprites() {
    const { canvas, ctx } = this.createCanvas(480, 48);

    const drawFrame = (index, drawFn) => {
      ctx.save();
      ctx.translate(index * 48 + 24, 24);
      drawFn(ctx);
      ctx.restore();
    };

    // Crab
    for (let f = 0; f < 2; f++) {
      drawFrame(f, (c) => {
        const clawAngle = f === 0 ? 0 : 0.3;
        c.fillStyle = '#e64a19';
        c.beginPath();
        c.ellipse(0, 4, 14, 10, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#d84315';
        c.lineWidth = 2.5;
        for (let i = -1; i <= 1; i += 2) {
          c.beginPath();
          c.moveTo(i * 10, 6);
          c.lineTo(i * 18, 14);
          c.moveTo(i * 8, 8);
          c.lineTo(i * 16, 17);
          c.stroke();
        }
        c.fillStyle = '#ff7043';
        c.beginPath();
        c.arc(-14 - clawAngle * 4, -2, 6, 0, Math.PI * 2);
        c.arc(14 + clawAngle * 4, -2, 6, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(-4, -6, 3.5, 0, Math.PI * 2);
        c.arc(4, -6, 3.5, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#000000';
        c.beginPath();
        c.arc(-4, -6, 1.8, 0, Math.PI * 2);
        c.arc(4, -6, 1.8, 0, Math.PI * 2);
        c.fill();
      });
    }

    // Bat / Seagull
    for (let f = 0; f < 2; f++) {
      drawFrame(2 + f, (c) => {
        const wingY = f === 0 ? -12 : 8;
        c.fillStyle = '#3f51b5';
        c.beginPath();
        c.arc(0, 0, 8, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#5c6bc0';
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(-18, wingY);
        c.lineTo(-10, 2);
        c.closePath();
        c.fill();
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(18, wingY);
        c.lineTo(10, 2);
        c.closePath();
        c.fill();
        c.fillStyle = '#ff1744';
        c.beginPath();
        c.arc(-3, -2, 2, 0, Math.PI * 2);
        c.arc(3, -2, 2, 0, Math.PI * 2);
        c.fill();
      });
    }

    // Spider
    for (let f = 0; f < 2; f++) {
      drawFrame(4 + f, (c) => {
        const legShift = f === 0 ? -2 : 2;
        c.fillStyle = '#2e7d32';
        c.beginPath();
        c.ellipse(0, 2, 11, 9, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#fbc02d';
        c.beginPath();
        c.arc(0, 2, 4, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#1b5e20';
        c.lineWidth = 2;
        [-1, 1].forEach((dir) => {
          c.beginPath();
          c.moveTo(dir * 8, 0);
          c.lineTo(dir * 18, -6 + legShift);
          c.lineTo(dir * 20, 8);
          c.moveTo(dir * 8, 4);
          c.lineTo(dir * 18, 2 - legShift);
          c.lineTo(dir * 21, 14);
          c.stroke();
        });
        c.fillStyle = '#ff5252';
        c.beginPath();
        c.arc(-3, -3, 1.5, 0, Math.PI * 2);
        c.arc(3, -3, 1.5, 0, Math.PI * 2);
        c.arc(-1.5, -5, 1.2, 0, Math.PI * 2);
        c.arc(1.5, -5, 1.2, 0, Math.PI * 2);
        c.fill();
      });
    }

    // Flame Hopper
    for (let f = 0; f < 2; f++) {
      drawFrame(6 + f, (c) => {
        const flicker = f === 0 ? 0 : 3;
        c.fillStyle = '#ff3d00';
        c.beginPath();
        c.moveTo(0, -18 - flicker);
        c.quadraticCurveTo(16, -4, 12, 12);
        c.quadraticCurveTo(0, 18, -12, 12);
        c.quadraticCurveTo(-16, -4, 0, -18 - flicker);
        c.fill();
        c.fillStyle = '#ffea00';
        c.beginPath();
        c.ellipse(0, 6, 7, 9, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#212121';
        c.beginPath();
        c.arc(-4, 3, 2, 0, Math.PI * 2);
        c.arc(4, 3, 2, 0, Math.PI * 2);
        c.fill();
      });
    }

    // Alien Drone
    for (let f = 0; f < 2; f++) {
      drawFrame(8 + f, (c) => {
        c.fillStyle = '#37474f';
        c.beginPath();
        c.arc(0, 0, 13, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#00e5ff';
        c.lineWidth = 1.5;
        c.stroke();
        c.fillStyle = f === 0 ? '#00e5ff' : '#76ff03';
        c.fillRect(-8, 12, 4, 4);
        c.fillRect(4, 12, 4, 4);
        c.fillStyle = '#ff1744';
        c.beginPath();
        c.arc(0, 0, 5, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(1.5, -1.5, 1.5, 0, Math.PI * 2);
        c.fill();
      });
    }

    this.scene.textures.addSpriteSheet('enemies', canvas, {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  // ==========================================
  // BOSS SPRITESHEET (96x96)
  // ==========================================
  generateBossSprites() {
    const { canvas, ctx } = this.createCanvas(384, 96);

    for (let f = 0; f < 4; f++) {
      ctx.save();
      ctx.translate(f * 96 + 48, 48);

      const isHurt = f === 3;
      const isAttack = f === 2;

      const cBody = isHurt ? '#ffffff' : '#455a64';
      const cArmor = isHurt ? '#ff5252' : '#263238';
      const cAccent = '#ffab00';
      const cGlow = isAttack ? '#ff1744' : '#00e5ff';

      ctx.fillStyle = cArmor;
      ctx.beginPath();
      ctx.moveTo(-28, -20);
      ctx.lineTo(28, -20);
      ctx.lineTo(34, 15);
      ctx.lineTo(18, 38);
      ctx.lineTo(-18, 38);
      ctx.lineTo(-34, 15);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = cBody;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cArmor;
      ctx.beginPath();
      ctx.ellipse(0, -26, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHurt ? '#000000' : '#ff1744';
      ctx.fillRect(-12, -28, 24, 6);

      const armOffset = isAttack ? -6 : 0;
      ctx.fillStyle = cArmor;
      ctx.fillRect(-44 + armOffset, -10, 14, 28);
      ctx.fillStyle = cAccent;
      ctx.fillRect(-44 + armOffset, 12, 14, 6);
      if (isAttack) {
        ctx.fillStyle = '#ff5252';
        ctx.beginPath();
        ctx.arc(-37 + armOffset, 24, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = cArmor;
      ctx.fillRect(30 - armOffset, -10, 14, 28);
      ctx.fillStyle = cAccent;
      ctx.fillRect(30 - armOffset, 12, 14, 6);
      if (isAttack) {
        ctx.fillStyle = '#ff5252';
        ctx.beginPath();
        ctx.arc(37 - armOffset, 24, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#1c313a';
      ctx.fillRect(-16, 38, 12, 8);
      ctx.fillRect(4, 38, 12, 8);

      ctx.restore();
    }

    this.scene.textures.addSpriteSheet('boss_gantu', canvas, {
      frameWidth: 96,
      frameHeight: 96
    });
  }

  // ==========================================
  // LEVEL TILESETS (32x32)
  // ==========================================
  generateTiles() {
    const { canvas, ctx } = this.createCanvas(480, 32);

    const drawTile = (idx, fn) => {
      ctx.save();
      ctx.translate(idx * 32, 0);
      fn(ctx);
      ctx.restore();
    };

    // Beach
    drawTile(0, (c) => {
      c.fillStyle = '#f5c97b';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#55c542';
      c.fillRect(0, 0, 32, 6);
      c.fillStyle = '#3ea72e';
      c.fillRect(0, 4, 32, 2);
      c.fillStyle = '#e6b965';
      c.fillRect(6, 12, 4, 3);
      c.fillRect(18, 20, 5, 3);
    });
    drawTile(1, (c) => {
      c.fillStyle = '#e5b866';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#d4a450';
      c.fillRect(4, 8, 6, 4);
      c.fillRect(18, 18, 8, 4);
      c.fillRect(8, 24, 5, 3);
    });
    drawTile(2, (c) => {
      c.fillStyle = '#8d6e63';
      c.fillRect(0, 0, 32, 14);
      c.fillStyle = '#5d4037';
      c.fillRect(0, 0, 32, 2);
      c.fillRect(10, 0, 2, 14);
      c.fillRect(22, 0, 2, 14);
      c.fillStyle = '#4e342e';
      c.fillRect(4, 14, 6, 18);
      c.fillRect(22, 14, 6, 18);
    });

    // Jungle
    drawTile(3, (c) => {
      c.fillStyle = '#2e7d32';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#4caf50';
      c.fillRect(0, 0, 32, 7);
      c.fillStyle = '#81c784';
      c.fillRect(4, 2, 8, 3);
      c.fillRect(18, 2, 9, 3);
      c.fillStyle = '#1b5e20';
      c.fillRect(8, 16, 6, 4);
    });
    drawTile(4, (c) => {
      c.fillStyle = '#37474f';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#2e7d32';
      c.fillRect(0, 0, 10, 6);
      c.fillRect(20, 0, 12, 4);
      c.fillStyle = '#263238';
      c.fillRect(6, 10, 10, 8);
      c.fillRect(18, 18, 10, 8);
    });
    drawTile(5, (c) => {
      c.fillStyle = '#a1887f';
      c.fillRect(0, 6, 32, 8);
      c.fillStyle = '#4e342e';
      c.fillRect(6, 4, 4, 12);
      c.fillRect(20, 4, 4, 12);
      c.strokeStyle = '#5d4037';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, 4);
      c.lineTo(32, 4);
      c.stroke();
    });

    // Volcano
    drawTile(6, (c) => {
      c.fillStyle = '#212121';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#37474f';
      c.fillRect(0, 0, 32, 4);
      c.fillStyle = '#ff3d00';
      c.fillRect(4, 10, 8, 2);
      c.fillRect(10, 12, 2, 8);
      c.fillRect(20, 18, 8, 2);
    });
    drawTile(7, (c) => {
      c.fillStyle = '#dd2c00';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#ff6d00';
      c.fillRect(0, 0, 32, 8);
      c.fillStyle = '#ffd600';
      c.beginPath();
      c.arc(8, 6, 4, 0, Math.PI * 2);
      c.arc(24, 6, 5, 0, Math.PI * 2);
      c.fill();
    });
    drawTile(8, (c) => {
      c.fillStyle = '#1c1c1c';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#d50000';
      c.fillRect(2, 6, 12, 6);
      c.fillRect(18, 18, 12, 6);
    });

    // Alien
    drawTile(9, (c) => {
      c.fillStyle = '#311b92';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#00e5ff';
      c.fillRect(0, 0, 32, 4);
      c.fillStyle = '#7c4dff';
      c.fillRect(4, 12, 10, 8);
      c.fillRect(18, 16, 8, 6);
    });
    drawTile(10, (c) => {
      c.fillStyle = '#1a237e';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#651fff';
      c.fillRect(2, 2, 28, 28);
      c.fillStyle = '#00e5ff';
      c.fillRect(14, 0, 4, 32);
    });
    drawTile(11, (c) => {
      c.fillStyle = '#4a148c';
      c.fillRect(0, 4, 32, 16);
      c.fillStyle = '#b388ff';
      c.fillRect(0, 4, 32, 3);
      c.fillStyle = '#00e5ff';
      c.fillRect(8, 20, 16, 4);
    });

    // Citadel
    drawTile(12, (c) => {
      c.fillStyle = '#455a64';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#90a4ae';
      c.fillRect(0, 0, 32, 4);
      c.fillStyle = '#263238';
      c.fillRect(6, 10, 8, 8);
      c.fillRect(18, 10, 8, 8);
    });
    drawTile(13, (c) => {
      c.fillStyle = '#212121';
      c.fillRect(0, 0, 32, 32);
      c.fillStyle = '#ffab00';
      for (let x = -32; x < 64; x += 12) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x + 8, 0);
        c.lineTo(x - 4, 32);
        c.lineTo(x - 12, 32);
        c.closePath();
        c.fill();
      }
    });
    drawTile(14, (c) => {
      c.fillStyle = '#37474f';
      c.fillRect(0, 0, 32, 18);
      c.fillStyle = '#00bcd4';
      c.fillRect(0, 0, 32, 3);
      c.fillStyle = '#cfd8dc';
      c.beginPath();
      c.arc(8, 9, 4, 0, Math.PI * 2);
      c.arc(24, 9, 4, 0, Math.PI * 2);
      c.fill();
    });

    this.scene.textures.addSpriteSheet('tileset', canvas, {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  // ==========================================
  // COLLECTIBLES & ITEMS
  // ==========================================
  generateCollectibles() {
    // Coin
    const { canvas: coinCanv, ctx: coinCtx } = this.createCanvas(128, 32);
    for (let f = 0; f < 4; f++) {
      coinCtx.save();
      coinCtx.translate(f * 32 + 16, 16);
      const scaleX = Math.abs(Math.cos((f / 4) * Math.PI));
      coinCtx.scale(Math.max(0.2, scaleX), 1);
      coinCtx.fillStyle = '#ffd700';
      coinCtx.beginPath();
      coinCtx.arc(0, 0, 11, 0, Math.PI * 2);
      coinCtx.fill();
      coinCtx.strokeStyle = '#b8860b';
      coinCtx.lineWidth = 1.5;
      coinCtx.stroke();
      coinCtx.fillStyle = '#fff8dc';
      coinCtx.beginPath();
      coinCtx.arc(0, 0, 5, 0, Math.PI * 2);
      coinCtx.fill();
      coinCtx.restore();
    }
    this.scene.textures.addSpriteSheet('coin', coinCanv, { frameWidth: 32, frameHeight: 32 });

    // Heart Container
    const { canvas: heartCanv, ctx: heartCtx } = this.createCanvas(32, 32);
    heartCtx.translate(16, 16);
    heartCtx.fillStyle = '#e91e63';
    heartCtx.beginPath();
    heartCtx.moveTo(0, 4);
    heartCtx.bezierCurveTo(0, -2, -10, -8, -10, -2);
    heartCtx.bezierCurveTo(-10, 5, 0, 11, 0, 13);
    heartCtx.bezierCurveTo(0, 11, 10, 5, 10, -2);
    heartCtx.bezierCurveTo(10, -8, 0, -2, 0, 4);
    heartCtx.fill();
    heartCtx.fillStyle = '#ffffff';
    heartCtx.beginPath();
    heartCtx.arc(-4, -2, 2.5, 0, Math.PI * 2);
    heartCtx.fill();
    this.scene.textures.addCanvas('heart', heartCanv);

    // Plasma Blaster
    const { canvas: blastCanv, ctx: blastCtx } = this.createCanvas(32, 32);
    blastCtx.translate(16, 16);
    blastCtx.fillStyle = '#ff1744';
    blastCtx.fillRect(-8, -4, 16, 8);
    blastCtx.fillStyle = '#212121';
    blastCtx.fillRect(-6, 4, 6, 8);
    blastCtx.fillStyle = '#00e5ff';
    blastCtx.fillRect(8, -2, 4, 4);
    this.scene.textures.addCanvas('power_blaster', blastCanv);

    // Shield
    const { canvas: shieldCanv, ctx: shieldCtx } = this.createCanvas(32, 32);
    shieldCtx.translate(16, 16);
    shieldCtx.strokeStyle = '#00e5ff';
    shieldCtx.lineWidth = 3;
    shieldCtx.beginPath();
    shieldCtx.arc(0, 0, 12, 0, Math.PI * 2);
    shieldCtx.stroke();
    shieldCtx.fillStyle = 'rgba(0, 229, 255, 0.4)';
    shieldCtx.fill();
    this.scene.textures.addCanvas('power_shield', shieldCanv);

    // Coffee
    const { canvas: cofCanv, ctx: cofCtx } = this.createCanvas(32, 32);
    cofCtx.translate(16, 16);
    cofCtx.fillStyle = '#ff9800';
    cofCtx.fillRect(-8, -6, 16, 16);
    cofCtx.strokeStyle = '#e65100';
    cofCtx.strokeRect(-8, -6, 16, 16);
    cofCtx.lineWidth = 2.5;
    cofCtx.beginPath();
    cofCtx.arc(8, 2, 4, -Math.PI / 2, Math.PI / 2);
    cofCtx.stroke();
    cofCtx.strokeStyle = '#ffffff';
    cofCtx.beginPath();
    cofCtx.moveTo(-3, -8);
    cofCtx.lineTo(-1, -12);
    cofCtx.moveTo(2, -8);
    cofCtx.lineTo(4, -12);
    cofCtx.stroke();
    this.scene.textures.addCanvas('power_coffee', cofCanv);

    // Checkpoint
    const { canvas: tikiCanv, ctx: tikiCtx } = this.createCanvas(64, 48);
    for (let f = 0; f < 2; f++) {
      tikiCtx.save();
      tikiCtx.translate(f * 32 + 16, 24);
      const isActive = f === 1;
      tikiCtx.fillStyle = '#6d4c41';
      tikiCtx.fillRect(-8, -20, 16, 40);
      tikiCtx.fillStyle = isActive ? '#00e5ff' : '#ffab00';
      tikiCtx.beginPath();
      tikiCtx.arc(-4, -10, 3, 0, Math.PI * 2);
      tikiCtx.arc(4, -10, 3, 0, Math.PI * 2);
      tikiCtx.fill();
      tikiCtx.fillRect(-6, -2, 12, 4);
      if (isActive) {
        tikiCtx.fillStyle = '#e91e63';
        tikiCtx.beginPath();
        tikiCtx.arc(0, -22, 6, 0, Math.PI * 2);
        tikiCtx.fill();
      }
      tikiCtx.restore();
    }
    this.scene.textures.addSpriteSheet('checkpoint', tikiCanv, { frameWidth: 32, frameHeight: 48 });

    // Flag
    const { canvas: flagCanv, ctx: flagCtx } = this.createCanvas(32, 48);
    flagCtx.fillStyle = '#4e342e';
    flagCtx.fillRect(4, 4, 4, 40);
    flagCtx.fillStyle = '#e91e63';
    flagCtx.beginPath();
    flagCtx.moveTo(8, 6);
    flagCtx.lineTo(28, 14);
    flagCtx.lineTo(8, 22);
    flagCtx.closePath();
    flagCtx.fill();
    flagCtx.fillStyle = '#ffffff';
    flagCtx.font = 'bold 8px sans-serif';
    flagCtx.fillText('★', 12, 16);
    this.scene.textures.addCanvas('finish_flag', flagCanv);

    // Mushroom
    const { canvas: mushCanv, ctx: mushCtx } = this.createCanvas(32, 32);
    mushCtx.translate(16, 16);
    mushCtx.fillStyle = '#f5f5f5';
    mushCtx.fillRect(-5, 2, 10, 12);
    mushCtx.fillStyle = '#e91e63';
    mushCtx.beginPath();
    mushCtx.arc(0, 2, 14, Math.PI, 0);
    mushCtx.fill();
    mushCtx.fillStyle = '#ffffff';
    mushCtx.beginPath();
    mushCtx.arc(-6, -4, 3, 0, Math.PI * 2);
    mushCtx.arc(6, -4, 3, 0, Math.PI * 2);
    mushCtx.arc(0, -8, 2.5, 0, Math.PI * 2);
    mushCtx.fill();
    this.scene.textures.addCanvas('bouncy_mushroom', mushCanv);
  }

  // ==========================================
  // PROJECTILES
  // ==========================================
  generateProjectiles() {
    const { canvas: pCanv, ctx: pCtx } = this.createCanvas(16, 16);
    pCtx.translate(8, 8);
    pCtx.fillStyle = '#00e5ff';
    pCtx.beginPath();
    pCtx.arc(0, 0, 6, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#ffffff';
    pCtx.beginPath();
    pCtx.arc(0, 0, 3, 0, Math.PI * 2);
    pCtx.fill();
    this.scene.textures.addCanvas('plasma_bolt', pCanv);

    const { canvas: bCanv, ctx: bCtx } = this.createCanvas(24, 24);
    bCtx.translate(12, 12);
    bCtx.fillStyle = '#ff1744';
    bCtx.beginPath();
    bCtx.arc(0, 0, 9, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.fillStyle = '#ffeb3b';
    bCtx.beginPath();
    bCtx.arc(0, 0, 4, 0, Math.PI * 2);
    bCtx.fill();
    this.scene.textures.addCanvas('boss_blast', bCanv);
  }

  // ==========================================
  // PARALLAX BACKGROUNDS
  // ==========================================
  generateBackgrounds() {
    const W = 960;
    const H = 540;

    // Beach
    const { canvas: beachCanv, ctx: bCtx } = this.createCanvas(W, H);
    const skyGrad = bCtx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#4fc3f7');
    skyGrad.addColorStop(0.5, '#b3e5fc');
    skyGrad.addColorStop(0.8, '#ffcc80');
    skyGrad.addColorStop(1, '#ffab91');
    bCtx.fillStyle = skyGrad;
    bCtx.fillRect(0, 0, W, H);

    bCtx.fillStyle = '#fff59d';
    bCtx.beginPath();
    bCtx.arc(800, 120, 50, 0, Math.PI * 2);
    bCtx.fill();

    bCtx.fillStyle = '#37474f';
    bCtx.beginPath();
    bCtx.moveTo(0, H);
    bCtx.lineTo(0, 320);
    bCtx.lineTo(240, 220);
    bCtx.lineTo(480, 340);
    bCtx.lineTo(720, 260);
    bCtx.lineTo(W, 360);
    bCtx.lineTo(W, H);
    bCtx.closePath();
    bCtx.fill();

    const oceanGrad = bCtx.createLinearGradient(0, 380, 0, H);
    oceanGrad.addColorStop(0, '#00acc1');
    oceanGrad.addColorStop(1, '#00838f');
    bCtx.fillStyle = oceanGrad;
    bCtx.fillRect(0, 380, W, H - 380);

    const drawPalm = (x, y, scale) => {
      bCtx.save();
      bCtx.translate(x, y);
      bCtx.scale(scale, scale);
      bCtx.fillStyle = '#1b5e20';
      bCtx.strokeStyle = '#4e342e';
      bCtx.lineWidth = 8;
      bCtx.beginPath();
      bCtx.moveTo(0, 0);
      bCtx.quadraticCurveTo(15, -60, 5, -120);
      bCtx.stroke();
      for (let a = -2.5; a <= 2.5; a += 0.8) {
        bCtx.beginPath();
        bCtx.ellipse(5 + Math.cos(a) * 40, -120 + Math.sin(a) * 20, 35, 12, a, 0, Math.PI * 2);
        bCtx.fill();
      }
      bCtx.restore();
    };

    drawPalm(120, 420, 1);
    drawPalm(900, 430, 1.2);
    this.scene.textures.addCanvas('bg_beach', beachCanv);

    // Jungle
    const { canvas: jungleCanv, ctx: jCtx } = this.createCanvas(W, H);
    const jGrad = jCtx.createLinearGradient(0, 0, 0, H);
    jGrad.addColorStop(0, '#0a2e12');
    jGrad.addColorStop(0.5, '#1b5e20');
    jGrad.addColorStop(1, '#2e7d32');
    jCtx.fillStyle = jGrad;
    jCtx.fillRect(0, 0, W, H);

    jCtx.fillStyle = '#061c0a';
    for (let i = 0; i < 6; i++) {
      jCtx.beginPath();
      jCtx.arc(i * 180 + 90, 180, 120, 0, Math.PI * 2);
      jCtx.fill();
    }
    this.scene.textures.addCanvas('bg_jungle', jungleCanv);

    // Volcano
    const { canvas: volcCanv, ctx: vCtx } = this.createCanvas(W, H);
    const vGrad = vCtx.createLinearGradient(0, 0, 0, H);
    vGrad.addColorStop(0, '#260505');
    vGrad.addColorStop(0.6, '#b71c1c');
    vGrad.addColorStop(1, '#ff6d00');
    vCtx.fillStyle = vGrad;
    vCtx.fillRect(0, 0, W, H);

    vCtx.fillStyle = '#1a0808';
    vCtx.beginPath();
    vCtx.moveTo(0, H);
    vCtx.lineTo(200, 180);
    vCtx.lineTo(350, 300);
    vCtx.lineTo(600, 140);
    vCtx.lineTo(850, 280);
    vCtx.lineTo(W, H);
    vCtx.closePath();
    vCtx.fill();
    this.scene.textures.addCanvas('bg_volcano', volcCanv);

    // Alien
    const { canvas: alienCanv, ctx: aCtx } = this.createCanvas(W, H);
    const aGrad = aCtx.createLinearGradient(0, 0, 0, H);
    aGrad.addColorStop(0, '#0d0221');
    aGrad.addColorStop(0.5, '#240046');
    aGrad.addColorStop(1, '#3c096c');
    aCtx.fillStyle = aGrad;
    aCtx.fillRect(0, 0, W, H);

    aCtx.fillStyle = '#ffffff';
    for (let i = 0; i < 120; i++) {
      const rx = (i * 137) % W;
      const ry = (i * 89) % H;
      aCtx.fillRect(rx, ry, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1);
    }
    aCtx.fillStyle = '#ff79c6';
    aCtx.beginPath();
    aCtx.arc(750, 160, 60, 0, Math.PI * 2);
    aCtx.fill();
    aCtx.strokeStyle = '#8be9fd';
    aCtx.lineWidth = 4;
    aCtx.beginPath();
    aCtx.ellipse(750, 160, 100, 25, -0.3, 0, Math.PI * 2);
    aCtx.stroke();
    this.scene.textures.addCanvas('bg_alien', alienCanv);

    // Citadel
    const { canvas: citCanv, ctx: cCtx } = this.createCanvas(W, H);
    cCtx.fillStyle = '#10141a';
    cCtx.fillRect(0, 0, W, H);

    cCtx.strokeStyle = '#1e293b';
    cCtx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      cCtx.beginPath();
      cCtx.moveTo(x, 0);
      cCtx.lineTo(x, H);
      cCtx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      cCtx.beginPath();
      cCtx.moveTo(0, y);
      cCtx.lineTo(W, y);
      cCtx.stroke();
    }

    cCtx.strokeStyle = '#ff1744';
    cCtx.lineWidth = 3;
    cCtx.beginPath();
    cCtx.moveTo(0, 120);
    cCtx.lineTo(W, 120);
    cCtx.stroke();
    this.scene.textures.addCanvas('bg_citadel', citCanv);
  }

  // ==========================================
  // PARTICLES
  // ==========================================
  generateParticles() {
    const { canvas: starCanv, ctx: sCtx } = this.createCanvas(16, 16);
    sCtx.translate(8, 8);
    sCtx.fillStyle = '#ffeb3b';
    sCtx.beginPath();
    sCtx.moveTo(0, -7);
    sCtx.lineTo(2, -2);
    sCtx.lineTo(7, 0);
    sCtx.lineTo(2, 2);
    sCtx.lineTo(0, 7);
    sCtx.lineTo(-2, 2);
    sCtx.lineTo(-7, 0);
    sCtx.lineTo(-2, -2);
    sCtx.closePath();
    sCtx.fill();
    this.scene.textures.addCanvas('sparkle', starCanv);

    const { canvas: dustCanv, ctx: dCtx } = this.createCanvas(16, 16);
    dCtx.fillStyle = 'rgba(240, 240, 240, 0.7)';
    dCtx.beginPath();
    dCtx.arc(8, 8, 6, 0, Math.PI * 2);
    dCtx.fill();
    this.scene.textures.addCanvas('dust', dustCanv);
  }
}
