window.KodeCupidMatching = {
  calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const age = new Date(Date.now() - birthDate.getTime());
    return Math.abs(age.getUTCFullYear() - 1970);
  },
  matchScore(userA, userB) {
    let score = 0;
    const maxScore = 100;

    const distanceScore = Math.max(0, 35 - ((userA.distanceMiles || userB.distanceMiles || 0) / 2));
    score += distanceScore;

    if (userA.relationshipGoals && userB.relationshipGoals) {
      const sharedGoals = userA.relationshipGoals.filter((goal) => userB.relationshipGoals.includes(goal));
      score += sharedGoals.length * 9;
    }

    if (userA.professionCategory === userB.professionCategory) score += 12;
    if ((userA.specialty || '').toLowerCase() === (userB.specialty || '').toLowerCase()) score += 10;

    const ageDifference = Math.abs(this.calculateAge(userA.dateOfBirth) - this.calculateAge(userB.dateOfBirth));
    score += Math.max(0, 12 - ageDifference);

    if (userA.educationLevel && userB.educationLevel) {
      const a = userA.educationLevel.split(' ')[0].toLowerCase();
      const b = userB.educationLevel.split(' ')[0].toLowerCase();
      if (a === b) score += 8;
    }

    if (userA.workSchedule === userB.workSchedule) score += 10;

    if (window.KodeCupidSchedule && window.KodeCupidSchedule.calculateScheduleCompatibility) {
      score += window.KodeCupidSchedule.calculateScheduleCompatibility(userA, userB) * 20;
    }

    const lifestyleFields = ['drinking', 'smoking', 'cannabis', 'exercise'];
    lifestyleFields.forEach((field) => {
      if (userA[field] === userB[field]) score += 4;
    });

    return Math.min(maxScore, Math.round(score));
  },
  matchProfile(user, candidate) {
    const score = this.matchScore(user, candidate);
    return { ...candidate, compatibilityScore: score };
  }
};
