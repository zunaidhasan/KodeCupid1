window.KodeCupidSchedule = {
  normalizeSchedule(schedule) {
    return (schedule || '').trim().toLowerCase();
  },
  calculateScheduleCompatibility(userA, userB) {
    const scheduleA = this.normalizeSchedule(userA.workSchedule);
    const scheduleB = this.normalizeSchedule(userB.workSchedule);

    if (scheduleA === scheduleB) return 1;
    if ((scheduleA.includes('nights') && scheduleB.includes('days')) || (scheduleA.includes('days') && scheduleB.includes('nights'))) return 0.6;
    if ((scheduleA.includes('swings') && (scheduleB.includes('days') || scheduleB.includes('regular weekday hours'))) || (scheduleB.includes('swings') && (scheduleA.includes('days') || scheduleA.includes('regular weekday hours')))) return 0.75;
    return 0.45;
  },
  getScheduleBadge(scheduleA, scheduleB) {
    const score = this.calculateScheduleCompatibility({ workSchedule: scheduleA }, { workSchedule: scheduleB });
    if (score >= 0.9) return 'Great schedule overlap';
    if (score >= 0.6) return 'Some overlap';
    return 'Different schedules';
  },
  getMicroDateSuggestions(userA, userB) {
    const overlap = this.calculateScheduleCompatibility(userA, userB);
    const options = ['Café near a campus', 'Quiet park walk', 'Hospital café after shift', 'Museum and coffee'];
    return overlap >= 0.8 ? options.slice(0, 2) : options.slice(0, 3);
  }
};
