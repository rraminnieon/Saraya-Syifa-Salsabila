// Comprehensive 5-Level Map Design for STITCH ADVENTURE
// Coordinates are in grid tile units (1 tile = 32px) or absolute pixels

export const LevelData = {
  // ==========================================
  // LEVEL 1: HAWAIIAN BEACH
  // ==========================================
  1: {
    title: "HAWAIIAN BEACH",
    theme: "beach",
    bgKey: "bg_beach",
    bgmTrack: "beach",
    worldWidth: 3200,
    worldHeight: 540,
    playerStart: { x: 100, y: 400 },
    tileIndices: { top: 0, block: 1, platform: 2 },
    groundY: 480, // Base sand height

    // Gaps in ground (abyss / ocean water hazard)
    groundGaps: [
      { start: 600, end: 720 },
      { start: 1400, end: 1560 },
      { start: 2200, end: 2360 }
    ],

    // Raised Platforms: { x, y, width, tileFrame }
    platforms: [
      { x: 300, y: 380, width: 4, tileFrame: 0 },
      { x: 480, y: 320, width: 3, tileFrame: 2 },
      { x: 630, y: 360, width: 3, tileFrame: 2 }, // bridge over 1st gap
      { x: 800, y: 380, width: 5, tileFrame: 0 },
      { x: 1000, y: 300, width: 4, tileFrame: 2 },
      { x: 1200, y: 370, width: 4, tileFrame: 0 },
      { x: 1440, y: 340, width: 3, tileFrame: 2 }, // over 2nd gap
      { x: 1650, y: 320, width: 5, tileFrame: 0 },
      { x: 1850, y: 260, width: 4, tileFrame: 2 },
      { x: 2050, y: 350, width: 4, tileFrame: 0 },
      { x: 2250, y: 330, width: 3, tileFrame: 2 }, // over 3rd gap
      { x: 2450, y: 380, width: 6, tileFrame: 0 },
      { x: 2700, y: 320, width: 5, tileFrame: 2 },
      { x: 2900, y: 440, width: 8, tileFrame: 0 }
    ],

    // Moving platforms: { x, y, distance, isVertical, speed }
    movingPlatforms: [
      { x: 1120, y: 260, distance: 80, isVertical: false, speed: 50 },
      { x: 1950, y: 220, distance: 60, isVertical: true, speed: 45 }
    ],

    // Bouncy Mushrooms
    bouncyMushrooms: [
      { x: 420, y: 464 },
      { x: 1720, y: 304 }
    ],

    // Enemies: { type, x, y, minX, maxX }
    enemies: [
      { type: 'crab', x: 380, y: 450, minX: 200, maxX: 500 },
      { type: 'crab', x: 850, y: 450, minX: 750, maxX: 950 },
      { type: 'bat', x: 1050, y: 220, minX: 980, maxX: 1150 },
      { type: 'crab', x: 1300, y: 450, minX: 1220, maxX: 1380 },
      { type: 'bat', x: 1700, y: 200, minX: 1600, maxX: 1850 },
      { type: 'crab', x: 2100, y: 450, minX: 2020, maxX: 2180 },
      { type: 'crab', x: 2550, y: 450, minX: 2420, maxX: 2650 }
    ],

    // Collectibles: { type, x, y }
    collectibles: [
      // Coins
      { type: 'coin', x: 250, y: 440 },
      { type: 'coin', x: 320, y: 340 },
      { type: 'coin', x: 350, y: 340 },
      { type: 'coin', x: 500, y: 280 },
      { type: 'coin', x: 650, y: 320 },
      { type: 'coin', x: 830, y: 340 },
      { type: 'coin', x: 860, y: 340 },
      { type: 'coin', x: 1030, y: 260 },
      { type: 'coin', x: 1230, y: 330 },
      { type: 'coin', x: 1460, y: 300 },
      { type: 'coin', x: 1680, y: 280 },
      { type: 'coin', x: 1880, y: 220 },
      { type: 'coin', x: 2270, y: 290 },
      { type: 'coin', x: 2500, y: 340 },
      { type: 'coin', x: 2730, y: 280 },
      // Heart & Power-ups
      { type: 'heart', x: 920, y: 440 },
      { type: 'blaster', x: 1130, y: 220 },
      { type: 'coffee', x: 1950, y: 150 },
      // Checkpoints
      { type: 'checkpoint', x: 1200, y: 448 },
      { type: 'checkpoint', x: 2150, y: 448 },
      // Goal
      { type: 'flag', x: 3050, y: 448 }
    ]
  },

  // ==========================================
  // LEVEL 2: JUNGLE ADVENTURE
  // ==========================================
  2: {
    title: "JUNGLE ADVENTURE",
    theme: "jungle",
    bgKey: "bg_jungle",
    bgmTrack: "jungle",
    worldWidth: 3500,
    worldHeight: 540,
    playerStart: { x: 100, y: 400 },
    tileIndices: { top: 3, block: 4, platform: 5 },
    groundY: 480,

    groundGaps: [
      { start: 500, end: 680 },
      { start: 1200, end: 1450 },
      { start: 2100, end: 2380 }
    ],

    platforms: [
      { x: 250, y: 380, width: 4, tileFrame: 3 },
      { x: 420, y: 310, width: 3, tileFrame: 5 },
      { x: 570, y: 350, width: 3, tileFrame: 5 }, // vine bridge
      { x: 740, y: 390, width: 5, tileFrame: 3 },
      { x: 950, y: 320, width: 4, tileFrame: 5 },
      { x: 1150, y: 240, width: 3, tileFrame: 3 },
      { x: 1300, y: 320, width: 4, tileFrame: 5 },
      { x: 1550, y: 370, width: 6, tileFrame: 3 },
      { x: 1800, y: 290, width: 4, tileFrame: 5 },
      { x: 2020, y: 220, width: 4, tileFrame: 3 },
      { x: 2200, y: 330, width: 4, tileFrame: 5 },
      { x: 2450, y: 370, width: 6, tileFrame: 3 },
      { x: 2750, y: 300, width: 4, tileFrame: 5 },
      { x: 2950, y: 230, width: 4, tileFrame: 3 },
      { x: 3150, y: 440, width: 8, tileFrame: 3 }
    ],

    movingPlatforms: [
      { x: 1030, y: 220, distance: 90, isVertical: false, speed: 65 },
      { x: 1700, y: 250, distance: 80, isVertical: true, speed: 50 },
      { x: 2350, y: 260, distance: 75, isVertical: false, speed: 60 }
    ],

    bouncyMushrooms: [
      { x: 350, y: 464 },
      { x: 800, y: 464 },
      { x: 1650, y: 354 },
      { x: 2550, y: 354 }
    ],

    enemies: [
      { type: 'spider', x: 320, y: 450, minX: 200, maxX: 450 },
      { type: 'bat', x: 600, y: 200, minX: 520, maxX: 700 },
      { type: 'spider', x: 860, y: 450, minX: 750, maxX: 950 },
      { type: 'spider', x: 1400, y: 450, minX: 1320, maxX: 1500 },
      { type: 'bat', x: 1850, y: 180, minX: 1750, maxX: 1980 },
      { type: 'spider', x: 2080, y: 190, minX: 2020, maxX: 2150 },
      { type: 'spider', x: 2600, y: 450, minX: 2480, maxX: 2700 },
      { type: 'bat', x: 2850, y: 180, minX: 2750, maxX: 2950 }
    ],

    collectibles: [
      { type: 'coin', x: 280, y: 340 },
      { type: 'coin', x: 440, y: 270 },
      { type: 'coin', x: 590, y: 310 },
      { type: 'coin', x: 770, y: 350 },
      { type: 'coin', x: 970, y: 280 },
      { type: 'coin', x: 1170, y: 200 },
      { type: 'coin', x: 1330, y: 280 },
      { type: 'coin', x: 1580, y: 330 },
      { type: 'coin', x: 1830, y: 250 },
      { type: 'coin', x: 2230, y: 290 },
      { type: 'coin', x: 2780, y: 260 },
      { type: 'coin', x: 2980, y: 190 },
      // Powerups
      { type: 'shield', x: 1160, y: 180 },
      { type: 'blaster', x: 2030, y: 170 },
      { type: 'heart', x: 1450, y: 440 },
      { type: 'coffee', x: 2800, y: 250 },
      // Checkpoints
      { type: 'checkpoint', x: 1500, y: 448 },
      { type: 'checkpoint', x: 2400, y: 448 },
      // Goal
      { type: 'flag', x: 3350, y: 448 }
    ]
  },

  // ==========================================
  // LEVEL 3: VOLCANO ISLAND
  // ==========================================
  3: {
    title: "VOLCANO ISLAND",
    theme: "volcano",
    bgKey: "bg_volcano",
    bgmTrack: "volcano",
    worldWidth: 3600,
    worldHeight: 540,
    playerStart: { x: 100, y: 400 },
    tileIndices: { top: 6, block: 8, platform: 6 },
    groundY: 480,

    groundGaps: [
      { start: 400, end: 650 },
      { start: 1000, end: 1300 },
      { start: 1800, end: 2150 },
      { start: 2600, end: 2950 }
    ],

    platforms: [
      { x: 220, y: 380, width: 3, tileFrame: 6 },
      { x: 350, y: 310, width: 3, tileFrame: 6 },
      { x: 500, y: 350, width: 3, tileFrame: 6 }, // stone in lava
      { x: 700, y: 380, width: 6, tileFrame: 6 },
      { x: 920, y: 300, width: 4, tileFrame: 6 },
      { x: 1120, y: 260, width: 3, tileFrame: 6 },
      { x: 1350, y: 360, width: 6, tileFrame: 6 },
      { x: 1580, y: 290, width: 4, tileFrame: 6 },
      { x: 1750, y: 220, width: 3, tileFrame: 6 },
      { x: 1950, y: 340, width: 3, tileFrame: 6 },
      { x: 2200, y: 380, width: 6, tileFrame: 6 },
      { x: 2450, y: 310, width: 4, tileFrame: 6 },
      { x: 2750, y: 340, width: 3, tileFrame: 6 },
      { x: 3000, y: 380, width: 6, tileFrame: 6 },
      { x: 3300, y: 440, width: 8, tileFrame: 6 }
    ],

    movingPlatforms: [
      { x: 1060, y: 340, distance: 80, isVertical: false, speed: 70 },
      { x: 1880, y: 280, distance: 70, isVertical: true, speed: 60 },
      { x: 2680, y: 300, distance: 80, isVertical: false, speed: 70 }
    ],

    bouncyMushrooms: [
      { x: 750, y: 464 },
      { x: 2250, y: 464 }
    ],

    enemies: [
      { type: 'flame', x: 300, y: 450, minX: 150, maxX: 380 },
      { type: 'flame', x: 780, y: 450, minX: 720, maxX: 880 },
      { type: 'bat', x: 1020, y: 200, minX: 950, maxX: 1100 },
      { type: 'flame', x: 1420, y: 450, minX: 1360, maxX: 1520 },
      { type: 'flame', x: 1600, y: 260, minX: 1580, maxX: 1680 },
      { type: 'bat', x: 2000, y: 190, minX: 1920, maxX: 2100 },
      { type: 'flame', x: 2320, y: 450, minX: 2240, maxX: 2400 },
      { type: 'flame', x: 3100, y: 450, minX: 3020, maxX: 3220 }
    ],

    collectibles: [
      { type: 'coin', x: 240, y: 340 },
      { type: 'coin', x: 370, y: 270 },
      { type: 'coin', x: 520, y: 310 },
      { type: 'coin', x: 730, y: 340 },
      { type: 'coin', x: 940, y: 260 },
      { type: 'coin', x: 1140, y: 220 },
      { type: 'coin', x: 1380, y: 320 },
      { type: 'coin', x: 1600, y: 250 },
      { type: 'coin', x: 1770, y: 180 },
      { type: 'coin', x: 2230, y: 340 },
      { type: 'coin', x: 2470, y: 270 },
      // Powerups
      { type: 'shield', x: 720, y: 330 },
      { type: 'blaster', x: 1750, y: 170 },
      { type: 'heart', x: 1400, y: 440 },
      { type: 'coffee', x: 2480, y: 260 },
      // Checkpoints
      { type: 'checkpoint', x: 1350, y: 448 },
      { type: 'checkpoint', x: 2250, y: 448 },
      // Goal
      { type: 'flag', x: 3450, y: 448 }
    ]
  },

  // ==========================================
  // LEVEL 4: ALIEN PLANET
  // ==========================================
  4: {
    title: "ALIEN PLANET",
    theme: "alien",
    bgKey: "bg_alien",
    bgmTrack: "alien",
    worldWidth: 3800,
    worldHeight: 540,
    playerStart: { x: 100, y: 400 },
    tileIndices: { top: 9, block: 10, platform: 11 },
    groundY: 480,

    groundGaps: [
      { start: 450, end: 750 },
      { start: 1100, end: 1450 },
      { start: 1900, end: 2300 },
      { start: 2800, end: 3200 }
    ],

    platforms: [
      { x: 200, y: 370, width: 4, tileFrame: 9 },
      { x: 380, y: 290, width: 3, tileFrame: 11 },
      { x: 550, y: 330, width: 3, tileFrame: 11 }, // floating anti-gravity block
      { x: 780, y: 380, width: 6, tileFrame: 9 },
      { x: 980, y: 280, width: 4, tileFrame: 11 },
      { x: 1200, y: 240, width: 3, tileFrame: 11 },
      { x: 1480, y: 370, width: 6, tileFrame: 9 },
      { x: 1720, y: 280, width: 4, tileFrame: 11 },
      { x: 1980, y: 220, width: 3, tileFrame: 11 },
      { x: 2180, y: 310, width: 4, tileFrame: 11 },
      { x: 2350, y: 380, width: 7, tileFrame: 9 },
      { x: 2650, y: 300, width: 4, tileFrame: 11 },
      { x: 2950, y: 260, width: 3, tileFrame: 11 },
      { x: 3250, y: 380, width: 6, tileFrame: 9 },
      { x: 3500, y: 440, width: 8, tileFrame: 9 }
    ],

    movingPlatforms: [
      { x: 650, y: 260, distance: 70, isVertical: true, speed: 60 },
      { x: 1320, y: 300, distance: 80, isVertical: false, speed: 70 },
      { x: 2080, y: 250, distance: 90, isVertical: true, speed: 65 },
      { x: 3080, y: 290, distance: 80, isVertical: false, speed: 75 }
    ],

    bouncyMushrooms: [
      { x: 800, y: 464 },
      { x: 2400, y: 464 }
    ],

    enemies: [
      { type: 'drone', x: 350, y: 240, minX: 250, maxX: 450 },
      { type: 'bat', x: 600, y: 180, minX: 500, maxX: 700 },
      { type: 'drone', x: 850, y: 320, minX: 780, maxX: 950 },
      { type: 'drone', x: 1550, y: 300, minX: 1480, maxX: 1650 },
      { type: 'bat', x: 1800, y: 160, minX: 1700, maxX: 1920 },
      { type: 'drone', x: 2450, y: 320, minX: 2360, maxX: 2580 },
      { type: 'drone', x: 2750, y: 240, minX: 2650, maxX: 2880 },
      { type: 'bat', x: 3350, y: 180, minX: 3250, maxX: 3450 }
    ],

    collectibles: [
      { type: 'coin', x: 220, y: 330 },
      { type: 'coin', x: 400, y: 250 },
      { type: 'coin', x: 570, y: 290 },
      { type: 'coin', x: 800, y: 340 },
      { type: 'coin', x: 1000, y: 240 },
      { type: 'coin', x: 1220, y: 200 },
      { type: 'coin', x: 1500, y: 330 },
      { type: 'coin', x: 1740, y: 240 },
      { type: 'coin', x: 2000, y: 180 },
      { type: 'coin', x: 2380, y: 340 },
      { type: 'coin', x: 2670, y: 260 },
      // Powerups
      { type: 'blaster', x: 550, y: 280 },
      { type: 'shield', x: 1200, y: 190 },
      { type: 'coffee', x: 1980, y: 170 },
      { type: 'heart', x: 1520, y: 440 },
      // Checkpoints
      { type: 'checkpoint', x: 1480, y: 448 },
      { type: 'checkpoint', x: 2450, y: 448 },
      // Goal
      { type: 'flag', x: 3650, y: 448 }
    ]
  },

  // ==========================================
  // LEVEL 5: FINAL ADVENTURE (GAUNTLET + BOSS)
  // ==========================================
  5: {
    title: "FINAL ADVENTURE",
    theme: "citadel",
    bgKey: "bg_citadel",
    bgmTrack: "boss",
    worldWidth: 3200,
    worldHeight: 540,
    playerStart: { x: 100, y: 400 },
    tileIndices: { top: 12, block: 13, platform: 14 },
    groundY: 480,

    groundGaps: [
      { start: 400, end: 650 },
      { start: 1050, end: 1350 }
    ],

    platforms: [
      // Section 1: The Dreadnought Gauntlet
      { x: 220, y: 380, width: 4, tileFrame: 12 },
      { x: 350, y: 300, width: 3, tileFrame: 14 },
      { x: 520, y: 340, width: 3, tileFrame: 14 },
      { x: 720, y: 380, width: 6, tileFrame: 12 },
      { x: 950, y: 300, width: 4, tileFrame: 14 },
      { x: 1150, y: 250, width: 3, tileFrame: 14 },
      { x: 1400, y: 380, width: 7, tileFrame: 12 },
      { x: 1650, y: 310, width: 4, tileFrame: 14 },
      { x: 1850, y: 440, width: 8, tileFrame: 12 },

      // Section 2: Boss Arena (from x: 2100 to 3200)
      { x: 2100, y: 440, width: 35, tileFrame: 12 }, // Massive boss arena floor
      { x: 2280, y: 340, width: 4, tileFrame: 14 },  // Left elevated vantage platform
      { x: 2520, y: 260, width: 5, tileFrame: 14 },  // High center tactical platform
      { x: 2800, y: 340, width: 4, tileFrame: 14 }   // Right elevated vantage platform
    ],

    movingPlatforms: [
      { x: 620, y: 260, distance: 70, isVertical: true, speed: 65 },
      { x: 1250, y: 310, distance: 80, isVertical: false, speed: 70 }
    ],

    bouncyMushrooms: [
      { x: 740, y: 464 },
      { x: 2200, y: 424 } // Inside boss arena
    ],

    enemies: [
      { type: 'drone', x: 300, y: 260, minX: 200, maxX: 400 },
      { type: 'drone', x: 800, y: 310, minX: 720, maxX: 900 },
      { type: 'bat', x: 1000, y: 180, minX: 920, maxX: 1100 },
      { type: 'drone', x: 1500, y: 320, minX: 1420, maxX: 1620 },
      { type: 'flame', x: 1700, y: 270, minX: 1650, maxX: 1750 }
    ],

    // Boss Entity
    boss: {
      x: 2600,
      y: 360
    },

    collectibles: [
      { type: 'coin', x: 240, y: 340 },
      { type: 'coin', x: 370, y: 260 },
      { type: 'coin', x: 540, y: 300 },
      { type: 'coin', x: 740, y: 340 },
      { type: 'coin', x: 970, y: 260 },
      { type: 'coin', x: 1420, y: 340 },
      { type: 'coin', x: 1670, y: 270 },
      // Powerups right before boss room
      { type: 'blaster', x: 1650, y: 260 },
      { type: 'shield', x: 1950, y: 390 },
      { type: 'coffee', x: 2050, y: 390 },
      { type: 'heart', x: 2520, y: 220 },
      // Checkpoint at Boss Entrance
      { type: 'checkpoint', x: 2000, y: 408 }
    ]
  }
};
