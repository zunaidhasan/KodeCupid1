window.KodeCupidStorage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  update(key, updater) {
    const existing = this.get(key, []);
    const next = updater(existing);
    this.set(key, next);
    return next;
  }
};
