const STORAGE_KEY = 'stitch_adventure_save_v1';

const defaultData = {
  unlockedLevel: 1,
  highScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  totalCoins: 0,
  settings: {
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    touchControls: true
  }
};

export const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultData };
      const parsed = JSON.parse(raw);
      return {
        ...defaultData,
        ...parsed,
        settings: { ...defaultData.settings, ...(parsed.settings || {}) },
        highScores: { ...defaultData.highScores, ...(parsed.highScores || {}) },
        stars: { ...defaultData.stars, ...(parsed.stars || {}) }
      };
    } catch (e) {
      console.warn('Storage read failed:', e);
      return { ...defaultData };
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  unlockLevel(levelNum) {
    const data = this.load();
    if (levelNum > data.unlockedLevel) {
      data.unlockedLevel = Math.min(5, levelNum);
      this.save(data);
    }
    return data.unlockedLevel;
  },

  updateScore(levelNum, score, stars = 3) {
    const data = this.load();
    if (!data.highScores[levelNum] || score > data.highScores[levelNum]) {
      data.highScores[levelNum] = score;
    }
    if (!data.stars[levelNum] || stars > data.stars[levelNum]) {
      data.stars[levelNum] = stars;
    }
    this.save(data);
    return data;
  },

  addCoins(amount) {
    const data = this.load();
    data.totalCoins = (data.totalCoins || 0) + amount;
    this.save(data);
    return data.totalCoins;
  },

  getSettings() {
    return this.load().settings;
  },

  updateSettings(newSettings) {
    const data = this.load();
    data.settings = { ...data.settings, ...newSettings };
    this.save(data);
    return data.settings;
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    return { ...defaultData };
  }
};
