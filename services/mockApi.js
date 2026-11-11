window.KodeCupidMockApi = {
  getProfiles() {
    return [...window.KodeCupidProfiles];
  },
  getProfileById(id) {
    return window.KodeCupidProfiles.find((profile) => profile.id === id) || null;
  },
  getUser() {
    const raw = localStorage.getItem('kodeCupidCurrentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error('Unable to parse the saved KodeCupid member profile.', error);
      return null;
    }
  },
  saveUser(user) {
    localStorage.setItem('kodeCupidCurrentUser', JSON.stringify(user));
  },
  getState(key, fallback = []) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Unable to read saved KodeCupid state "${key}".`, error);
      return fallback;
    }
  },
  setState(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  seedDemoState() {
    if (localStorage.getItem('kodeCupidMatches') === null) {
      this.setState('kodeCupidMatches', [
        { id: 'm-p003', userId: 'p003', name: 'Maya Patel', preview: 'Would love to plan a coffee outside our shifts.', unread: 1, matchDate: '2026-11-08T16:30:00.000Z', status: 'active', expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 6 },
        { id: 'm-p013', userId: 'p013', name: 'Leah Chen', preview: 'I am free after work next Thursday if you are.', unread: 0, matchDate: '2026-11-05T13:15:00.000Z', status: 'active', expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 4 }
      ]);
    }
    if (localStorage.getItem('kodeCupidLikes') === null) {
      this.setState('kodeCupidLikes', ['p003', 'p013'].map((id) => ({ id, createdAt: new Date().toISOString() })));
    }
    if (localStorage.getItem('kodeCupidPasses') === null) this.setState('kodeCupidPasses', []);
    if (localStorage.getItem('kodeCupidBlockedProfiles') === null) this.setState('kodeCupidBlockedProfiles', []);
    if (localStorage.getItem('kodeCupidReports') === null) {
      this.setState('kodeCupidReports', [
        { id: 'report-demo', profileId: 'p018', name: 'Harassment complaint', reason: 'Harassment or hate speech', reporter: 'A member', evidence: 'Repeated unwanted messages', status: 'New', createdAt: new Date().toISOString() }
      ]);
    }
    if (localStorage.getItem('kodeCupidNotifications') === null) {
      this.setState('kodeCupidNotifications', [
        { id: 'n1', type: 'new_match', title: 'New match', message: 'Maya Patel liked your profile back.', timestamp: new Date().toISOString(), read: false },
        { id: 'n2', type: 'micro_date', title: 'Micro-date invitation', message: 'A quiet coffee invite is ready to accept.', timestamp: new Date().toISOString(), read: false }
      ]);
    }
    if (localStorage.getItem('kodeCupidMicroDates') === null) {
      this.setState('kodeCupidMicroDates', [
        { id: 'md1', date: '2026-11-17', time: '6:30 PM', location: 'Cedar Lane Café', status: 'Pending' }
      ]);
    }
    if (localStorage.getItem('kodeCupidChatThreads') === null) {
      this.setState('kodeCupidChatThreads', {
        'Maya Patel': [
          { id: 'msg-m1', from: 'Maya Patel', text: 'Would love to grab coffee after our shifts this week.', time: '2m ago', mine: false, read: true },
          { id: 'msg-m2', from: 'You', text: 'That works. I am free Thursday after 6 PM.', time: 'just now', mine: true, read: true },
          { id: 'msg-m3', from: 'Maya Patel', text: 'Perfect—there is a quiet café by the hospital campus.', time: '1m ago', mine: false, read: false }
        ]
      });
    }
  }
};
