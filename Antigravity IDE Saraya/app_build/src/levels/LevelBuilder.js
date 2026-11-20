import { LevelData } from './LevelData.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { Collectible } from '../entities/Collectible.js';
import { MovingPlatform, BouncyMushroom } from '../entities/Platform.js';

export class LevelBuilder {
  constructor(scene) {
    this.scene = scene;
  }

  build(levelNum) {
    const data = LevelData[levelNum] || LevelData[1];

    this.scene.physics.world.setBounds(0, 0, data.worldWidth, data.worldHeight);
    this.scene.cameras.main.setBounds(0, 0, data.worldWidth, data.worldHeight);

    // 1. Parallax Background
    this.createBackground(data);

    // 2. Physics Groups
    this.scene.platforms = this.scene.physics.add.staticGroup();
    this.scene.hazards = this.scene.physics.add.staticGroup();
    this.scene.movingPlatformsList = [];
    this.scene.mushrooms = this.scene.physics.add.staticGroup();
    this.scene.enemies = this.scene.physics.add.group();
    this.scene.collectibles = this.scene.physics.add.group();
    this.scene.checkpoints = this.scene.physics.add.group();
    this.scene.finishFlag = null;
    this.scene.boss = null;

    // 3. Ground & Hazards Construction
    this.buildGround(data);

    // 4. Elevated Platforms
    this.buildPlatforms(data);

    // 5. Moving Platforms & Mushrooms
    this.buildMovingPlatforms(data);
    this.buildMushrooms(data);

    // 6. Enemies & Boss
    this.buildEnemies(data);

    // 7. Collectibles & Checkpoints
    this.buildCollectibles(data);

    return data;
  }

  createBackground(data) {
    const bg = this.scene.add.tileSprite(0, 0, data.worldWidth, data.worldHeight, data.bgKey)
      .setOrigin(0, 0)
      .setScrollFactor(0.2, 1);
    bg.setDepth(-10);
  }

  buildGround(data) {
    const groundY = data.groundY;
    const tileTop = data.tileIndices.top;
    const tileBlock = data.tileIndices.block;
    const gaps = data.groundGaps || [];

    for (let x = 0; x < data.worldWidth; x += 32) {
      const inGap = gaps.some((g) => x >= g.start && x < g.end);

      if (!inGap) {
        const topTile = this.scene.platforms.create(x + 16, groundY + 16, 'tileset', tileTop);
        topTile.body.updateFromGameObject();

        for (let y = groundY + 32; y < data.worldHeight; y += 32) {
          const subTile = this.scene.platforms.create(x + 16, y + 16, 'tileset', tileBlock);
          subTile.body.updateFromGameObject();
        }
      } else {
        const hazardFrame = data.theme === 'volcano' ? 7 : (data.theme === 'alien' ? 10 : 7);
        const hazard = this.scene.hazards.create(x + 16, groundY + 28, 'tileset', hazardFrame);
        hazard.body.updateFromGameObject();
      }
    }
  }

  buildPlatforms(data) {
    if (!data.platforms) return;

    data.platforms.forEach((p) => {
      const tileF = p.tileFrame !== undefined ? p.tileFrame : data.tileIndices.platform;
      for (let i = 0; i < p.width; i++) {
        const px = p.x + i * 32 + 16;
        const py = p.y + 16;
        const tile = this.scene.platforms.create(px, py, 'tileset', tileF);
        tile.body.updateFromGameObject();
      }
    });
  }

  buildMovingPlatforms(data) {
    if (!data.movingPlatforms) return;

    data.movingPlatforms.forEach((mp) => {
      const plat = new MovingPlatform(
        this.scene,
        mp.x,
        mp.y,
        'moving_platform_tex',
        null,
        mp.distance,
        mp.isVertical,
        mp.speed
      );
      this.scene.movingPlatformsList.push(plat);
    });
  }

  buildMushrooms(data) {
    if (!data.bouncyMushrooms) return;

    data.bouncyMushrooms.forEach((m) => {
      const mush = new BouncyMushroom(this.scene, m.x, m.y);
      this.scene.mushrooms.add(mush);
    });
  }

  buildEnemies(data) {
    if (data.enemies) {
      data.enemies.forEach((e) => {
        const enemy = new Enemy(this.scene, e.x, e.y, e.type, e.minX, e.maxX);
        this.scene.enemies.add(enemy);
      });
    }

    if (data.boss) {
      this.scene.boss = new Boss(this.scene, data.boss.x, data.boss.y);
    }
  }

  buildCollectibles(data) {
    if (!data.collectibles) return;

    data.collectibles.forEach((c) => {
      if (c.type === 'checkpoint') {
        const cp = new Collectible(this.scene, c.x, c.y, 'checkpoint');
        this.scene.checkpoints.add(cp);
      } else if (c.type === 'flag') {
        this.scene.finishFlag = new Collectible(this.scene, c.x, c.y, 'flag');
      } else {
        const item = new Collectible(this.scene, c.x, c.y, c.type);
        this.scene.collectibles.add(item);
      }
    });
  }
}
