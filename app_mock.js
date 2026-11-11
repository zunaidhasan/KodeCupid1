(function () {
  const appRoot = document.getElementById('app');
  const defaultDemoUser = { id: 'u-demo', displayName: 'Aisha Morgan', age: 31, dateOfBirth: '1994-02-18', genderIdentity: 'Woman', interestedIn: ['Men', 'Everyone'], location: 'Brooklyn, NY', distanceMiles: 6, professionCategory: 'Healthcare', jobTitle: 'Physician Assistant', specialty: 'Primary Care', workplaceName: 'Riverside Clinic', workplaceType: 'Clinic', workSchedule: 'Regular weekday hours', shiftTimes: '9 AM - 5 PM', verificationStatus: 'Verified', verificationMethod: 'NPI', educationLevel: 'Master’s', credentials: ['PA-C'], relationshipGoals: ['Serious relationship'], familyPlans: 'Maybe later', drinking: 'Rarely', smoking: 'No', cannabis: 'No', exercise: '4x/week', religion: 'None', ethnicity: 'Black', politicalViews: 'Moderate', languages: ['English'], height: '5ft 7in', bodyType: 'Average', hairColor: 'Brown', eyeColor: 'Brown', bio: 'Thoughtful primary care clinician who values real connection, steady routines, and time to decompress after work.', photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'], privacySettings: { age: true, height: false, location: true, religion: false, politicalViews: false, ethnicity: false }, workplacePrivacy: { enabled: true, facility: 'Riverside Clinic', radiusMiles: 1 }, quietHours: { enabled: true, start: '21:30', end: '07:00' }, subscriptionPlan: 'Silver', profileScore: 88 };

  function getRoute() {
    const hash = location.hash || '#/';
    const path = hash.startsWith('#') ? hash.slice(1) : hash;
    return path.startsWith('/') ? path : `/${path}`;
  }

  function navigate(path) {
    location.hash = `#${path.startsWith('/') ? path : `/${path}`}`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function getCurrentUser() {
    return window.KodeCupidMockApi.getUser() || defaultDemoUser;
  }

  function setCurrentUser(user) {
    window.KodeCupidMockApi.saveUser(user);
  }

  function renderPublic(content) {
    return `
      <div class="page-shell public-shell">
        <header class="top-header">
          <div class="brand-inline">
            <div class="brand-badge">K</div>
            <div><span class="eyebrow">Verified professionals</span><h1>KodeCupid</h1></div>
          </div>
          <nav class="inline-nav">
            <button type="button" data-route="/" class="nav-link">Home</button>
            <button type="button" data-route="/faqs" class="nav-link">FAQs</button>
            <button type="button" data-route="/safety-tips" class="nav-link">Safety</button>
            <button type="button" data-route="/login" class="nav-link accent">Log in</button>
          </nav>
        </header>
        <main class="page-content">${content}</main>
      </div>
    `;
  }

  function renderAuth(content, currentPage) {
    const user = getCurrentUser();
    const items = [
      ['Discover', '/discover', '◎'], ['Matches', '/matches', '❤'], ['Messages', '/messages', '✉'], ['Micro-dates', '/micro-dates', '🗓'], ['Notifications', '/notifications', '🔔'], ['Profile', '/profile', '☰'], ['Pricing', '/pricing', '💳'], ['Admin', '/admin', '⚙']
    ];
    return `
      <div class="page-shell app-shell">
        <aside class="sidebar">
          <div class="brand-inline sidebar-brand">
            <div class="brand-badge">K</div><div><span class="eyebrow">Members</span><h2>KodeCupid</h2></div>
          </div>
          <nav class="side-nav">
            ${items.map(([label, route, icon]) => `<button type="button" data-route="${route}" class="side-nav-item ${currentPage === route ? 'active' : ''}"><span>${icon}</span><span>${label}</span></button>`).join('')}
          </nav>
          <div class="mini-panel">
            <p class="eyebrow">Member status</p>
            <h3>${escapeHtml(user.displayName)}</h3>
            <p>${escapeHtml(user.professionCategory)} • ${escapeHtml(user.location)}</p>
            <div class="mini-progress"><span></span></div>
            <small>Profile completion: 88%</small>
          </div>
        </aside>
        <main class="main-view">${content}</main>
      </div>
    `;
  }

  function renderLanding() {
    return renderPublic(`
      <section class="hero-panel">
        <div class="hero-copy"><span class="tag">Verified professionals only</span><h2>Find meaningful connection with people who understand your schedule, work, and life.</h2><p>KodeCupid brings together healthcare, education, university, and science professionals in a safer, privacy-conscious dating and social experience built around real-world routines.</p><div class="cta-row"><button type="button" class="primary-btn" data-route="/signup">Join KodeCupid</button><button type="button" class="secondary-btn" data-route="/login">Log in</button></div><ul class="feature-list compact"><li>Verified community</li><li>Shift-aware matching</li><li>Workplace privacy tools</li></ul></div>
        <div class="hero-visual-card"><div class="image-stack"><img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1000&q=80" alt="Healthcare professional portrait" /><div class="floating-card"><strong>92% match</strong><span>Dr. Maya • ICU nurse</span></div></div></div>
      </section>
      <section class="info-grid"><article class="info-card"><span class="badge-soft">Safety</span><h3>Professional verification</h3><p>Verification flows, moderation queues, and community safety tools help keep the experience trusted and respectful.</p></article><article class="info-card"><span class="badge-soft">Schedule-aware</span><h3>Shift compatibility</h3><p>Match on real life, not just vibes. Understand overlapping schedules, quiet hours, and micro-date timing.</p></article><article class="info-card"><span class="badge-soft">Privacy</span><h3>Workplace safeguards</h3><p>Protect your profession and privacy with mock workplace radius controls and quiet-hours settings.</p></article></section>
    `);
  }

  function renderSignup() {
    return renderPublic(`
      <section class="auth-panel"><div class="auth-card large-card"><p class="eyebrow center">Create account</p><h2>Welcome to KodeCupid</h2><form id="signupForm" class="stack-form"><label><span>Email</span><input type="email" name="email" placeholder="you@example.com" required /></label><label><span>Password</span><input type="password" name="password" placeholder="Create a secure password" required /></label><label><span>First name</span><input type="text" name="firstName" placeholder="Enter your first name" required /></label><label><span>City</span><input type="text" name="city" placeholder="Brooklyn, NY" required /></label><div class="check-row"><input type="checkbox" name="agree" required /> <label>I agree to the <button type="button" class="inline-link" data-route="/terms">Terms of Service</button> and <button type="button" class="inline-link" data-route="/community-pledge">Community Pledge</button>.</label></div><button type="submit" class="primary-btn full-width">Continue to onboarding</button></form><div class="auth-footer"><span>Already a member?</span><button type="button" class="inline-link" data-route="/login">Log in</button></div></div></section>
    `);
  }

  function renderLogin() {
    return renderPublic(`
      <section class="auth-panel"><div class="auth-card large-card"><p class="eyebrow center">Welcome back</p><h2>Log in to KodeCupid</h2><form id="loginForm" class="stack-form"><label><span>Email</span><input type="email" name="email" value="aisha@kodecupid.demo" required /></label><label><span>Password</span><input type="password" name="password" value="demo1234" required /></label><button type="submit" class="primary-btn full-width">Enter KodeCupid</button></form><div class="auth-footer"><span>New here?</span><button type="button" class="inline-link" data-route="/signup">Create account</button></div></div></section>
    `);
  }

  function renderStatic(title, html) {
    return renderPublic(`<article class="content-card"><p class="eyebrow">KodeCupid</p><h2>${title}</h2><div class="static-copy">${html}</div></article>`);
  }

  function renderOnboarding() {
    const user = getCurrentUser();
    return renderAuth(`
      <section class="content-card onboarding-card">
        <div class="section-header-row"><div><p class="eyebrow">Onboarding</p><h2>Tell us about you</h2></div><div class="chip-badge">Step 1 of 8</div></div>
        <form id="onboardingForm" class="stack-form onboarding-form">
          <fieldset><legend>Step 1 · Welcome & eligibility</legend><div class="check-row"><input type="checkbox" name="olderThan18" checked /> <label>I am 18 or older.</label></div><div class="check-row"><input type="checkbox" name="termsAccepted" checked /> <label>I accept the Terms and Community Guidelines.</label></div></fieldset>
          <fieldset><legend>Step 2 · Phone verification</legend><label><span>Phone number</span><input type="tel" name="phone" placeholder="(555) 123-4567" /></label><div class="inline-actions"><button type="button" class="secondary-btn">Send code</button><span class="hint">Prototype mode: any 6-digit code works.</span></div><label><span>OTP</span><input type="text" name="otp" placeholder="123456" maxlength="6" /></label></fieldset>
          <fieldset><legend>Step 3 · Basic identity</legend><div class="two-col"><label><span>Display name</span><input type="text" name="firstName" value="${escapeHtml(user.displayName.split(' ')[0])}" /></label><label><span>Date of birth</span><input type="date" name="dateOfBirth" value="1994-02-18" /></label></div><label><span>Gender identity</span><select name="genderIdentity"><option>Man</option><option selected>Woman</option><option>Non-binary</option><option>Transgender</option><option>Agender</option><option>Genderfluid</option><option>Custom</option></select></label><label><span>Interested in</span><select name="interestedIn"><option>Women</option><option selected>Men</option><option>Non-binary people</option><option>Everyone</option></select></label><label><span>City or neighborhood</span><input type="text" name="city" value="${escapeHtml(user.location)}" /></label></fieldset>
          <fieldset><legend>Step 4 · Professional identity</legend><div class="two-col"><label><span>Profession category</span><select name="professionCategory"><option selected>Healthcare</option><option>Education</option><option>College/University</option><option>Science / Public Health</option><option>Other eligible profession</option></select></label><label><span>Job title</span><input type="text" name="jobTitle" value="${escapeHtml(user.jobTitle)}" /></label></div><div class="two-col"><label><span>Specialty</span><input type="text" name="specialty" value="Primary Care" /></label><label><span>Workplace</span><input type="text" name="workplaceName" value="Riverside Clinic" /></label></div><div class="two-col"><label><span>Workplace type</span><select name="workplaceType"><option>Hospital</option><option selected>Clinic</option><option>School</option><option>College/University</option><option>Research organization</option><option>Other</option></select></label><label><span>Work schedule</span><select name="workSchedule"><option>Regular weekday hours</option><option>Days</option><option>Nights</option><option>Swings</option><option>Variable schedule</option></select></label></div><label><span>Typical shift times</span><input type="text" name="shiftTimes" value="9 AM - 5 PM" /></label></fieldset>
          <fieldset><legend>Step 5 · Verification</legend><div class="two-col"><label><span>NPI number</span><input type="text" value="1234567890" /></label><button type="button" class="secondary-btn">Verify</button></div><p class="hint">Demo status: Verified. Manual badge upload also supported in prototype mode.</p><div class="check-row"><input type="checkbox" checked /> <label>Skip for demo and assign verified status.</label></div></fieldset>
          <fieldset><legend>Step 6 · Profile details</legend><label><span>Bio</span><textarea rows="4" name="bio">Thoughtful primary care clinician who values real connection, steady routines, and time to decompress after work.</textarea></label><div class="two-col"><label><span>Height</span><input type="text" value="5ft 7in" /></label><label><span>Hair color</span><input type="text" value="Brown" /></label></div><div class="two-col"><label><span>Eye color</span><input type="text" value="Brown" /></label><label><span>Languages</span><input type="text" value="English" /></label></div></fieldset>
          <fieldset><legend>Step 7 · Relationship preferences</legend><label><span>Looking for</span><select name="relationshipGoals"><option selected>Serious relationship</option><option>Long-term relationship</option><option>Companion</option><option>Friend</option><option>Travel companion</option><option>Lunch buddy</option><option>Work friend</option><option>Partner</option></select></label></fieldset>
          <fieldset><legend>Step 8 · Privacy & notifications</legend><div class="check-row"><input type="checkbox" checked /> <label>Hide my profile near my workplace to protect my professional privacy.</label></div><label><span>Privacy radius</span><input type="range" min="1" max="10" value="1" /></label><label><span>Quiet hours</span><input type="text" value="9:30 PM - 7:00 AM" /></label></fieldset>
          <div class="action-bar"><button type="submit" class="primary-btn">Enter KodeCupid</button></div>
        </form>
      </section>
    `, 'onboarding');
  }

  function getDiscoveryProfiles() {
    const user = getCurrentUser();
    return window.KodeCupidMockApi.getProfiles().filter((profile) => profile.id !== user.id).map((profile) => ({ ...profile, compatibilityScore: window.KodeCupidMatching.matchScore(user, profile) })).sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 6);
  }

  function renderDiscover() {
    const profiles = getDiscoveryProfiles();
    const user = getCurrentUser();
    return renderAuth(`
      <section class="screen-header"><div><p class="eyebrow">Discover</p><h2>Professionals near you</h2></div><div class="chip-row"><span class="chip active">All</span><span class="chip">Healthcare</span><span class="chip">Education</span><span class="chip">Science</span></div></section>
      <section class="match-grid">
        ${profiles.map((profile) => `
          <article class="profile-card discover-card">
            <div class="profile-image-wrap"><img src="${escapeHtml(profile.photos[0])}" alt="${escapeHtml(profile.displayName)}" /><div class="profile-score">${profile.compatibilityScore}%</div></div>
            <div class="profile-card-body"><div class="profile-card-header"><div><h3>${escapeHtml(profile.displayName)}, ${profile.age}</h3><p>${escapeHtml(profile.jobTitle)} • ${escapeHtml(profile.specialty)}</p></div><span class="verification-badge">${escapeHtml(profile.verificationStatus)}</span></div><div class="meta-row clear-row"><span>${escapeHtml(profile.location)}</span><span>${escapeHtml(profile.distanceMiles)} mi</span></div><div class="meta-row clear-row"><span>${escapeHtml(profile.workplaceType)}</span><span>${escapeHtml(window.KodeCupidSchedule.getScheduleBadge(user.workSchedule, profile.workSchedule))}</span></div><p class="icebreaker">${escapeHtml(profile.icebreakerAnswers[0])}</p><div class="chip-row tags-row">${profile.icebreakerAnswers.slice(0, 2).map((answer) => `<span class="chip small">${escapeHtml(answer.split(' ')[0])}</span>`).join('')}</div><div class="action-row compact-row"><button type="button" class="ghost-btn" data-action="pass-profile" data-profile-id="${profile.id}">Pass</button><button type="button" class="ghost-btn" data-action="open-profile" data-profile-id="${profile.id}">Open</button><button type="button" class="primary-btn" data-action="like-profile" data-profile-id="${profile.id}">Like</button></div></div>
          </article>
        `).join('')}
      </section>
    `, 'discover');
  }

  function renderProfile() {
    const params = new URLSearchParams(location.hash.slice(location.hash.indexOf('?') + 1) || location.search || '');
    const profileId = params.get('id') || getCurrentUser().id;
    const profile = window.KodeCupidMockApi.getProfileById(profileId) || getCurrentUser();
    const photos = Array.isArray(profile.photos) && profile.photos.length ? profile.photos : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'];
    return renderAuth(`
      <section class="content-card profile-detail"><div class="gallery-grid">${photos.map((photo) => `<img src="${escapeHtml(photo)}" alt="${escapeHtml(profile.displayName || 'Profile photo')}" />`).join('')}</div><div class="profile-overview"><div><p class="eyebrow">Profile</p><h2>${escapeHtml(profile.displayName || 'Your profile')}, ${profile.age || 30}</h2></div><span class="verification-badge">${escapeHtml(profile.verificationStatus || 'Verified')}</span></div><div class="detail-grid"><div><p>${escapeHtml(profile.professionCategory || 'Healthcare')} • ${escapeHtml(profile.jobTitle || 'Professional')}</p><p>${escapeHtml(profile.specialty || 'General practice')} • ${escapeHtml(profile.workplaceType || 'Clinic')}</p><p>${escapeHtml(profile.location || 'City')} • ${escapeHtml(profile.distanceMiles || 5)} mi away</p></div><div class="stats-box"><strong>${profile.compatibilityScore || 91}%</strong><span>Prototype match estimate</span></div></div><p class="bio-block">${escapeHtml(profile.bio || 'Looking for meaningful connection and shared life rhythm.')}</p><div class="chips-wrap">${(profile.languages || ['English']).map((item) => `<span class="chip small">${escapeHtml(item)}</span>`).join('')}${(profile.relationshipGoals || ['Serious relationship']).map((item) => `<span class="chip small">${escapeHtml(item)}</span>`).join('')}</div><div class="action-row"><button type="button" class="ghost-btn">Report profile</button><button type="button" class="ghost-btn">Block</button><button type="button" class="primary-btn">Message</button></div></section>
    `, 'profile');
  }

  function renderMatches() {
    const matches = window.KodeCupidMockApi.getState('kodeCupidMatches', [{id:'m001',userId:'p003',name:'Maya Patel',preview:'Would love to plan a coffee outside our shifts.',unread:1,status:'active',expiresAt:Date.now()+600000},{id:'m002',userId:'p013',name:'Leah Chen',preview:'I am free after work next Thursday if you are.',unread:0,status:'active',expiresAt:Date.now()+2000000}]);
    return renderAuth(`
      <section class="screen-header"><div><p class="eyebrow">Matches</p><h2>Mutual matches</h2></div></section>
      <section class="list-panel">${matches.map((match) => `<article class="match-row" data-route="/messages"><div class="avatar-cozy">${escapeHtml(match.name.charAt(0))}</div><div class="match-copy"><strong>${escapeHtml(match.name)}</strong><p>${escapeHtml(match.preview)}</p></div><div class="match-meta"><span>${match.unread ? 'New' : 'Seen'}</span><small>${escapeHtml(match.status)}</small></div></article>`).join('')}</section>
    `, 'matches');
  }

  function renderMessages() {
    const messages = [{from:'Maya Patel',text:'Would love to grab coffee after our shifts this week.',time:'2m ago',mine:false},{from:'You',text:'That works. I am free Thursday after 6 PM.',time:'just now',mine:true},{from:'Maya Patel',text:'Perfect—there is a quiet café by the hospital campus.',time:'1m ago',mine:false}];
    return renderAuth(`
      <section class="content-card chat-card"><div class="chat-header"><div><p class="eyebrow">Messages</p><h2>Maya Patel</h2></div><span class="pill warn">Expires in 6 days</span></div><div class="message-thread">${messages.map((message) => `<div class="thread-message ${message.mine ? 'mine' : ''}"><p>${escapeHtml(message.text)}</p><small>${escapeHtml(message.time)}</small></div>`).join('')}</div><div class="composer-row"><input type="text" placeholder="Send a message..." /><button type="button" class="primary-btn">Send</button></div></section>
    `, 'messages');
  }

  function renderMicroDates() {
    const dates = window.KodeCupidMockApi.getState('kodeCupidMicroDates', [{id:'md1',date:'2026-11-17',time:'6:30 PM',location:'Cedar Lane Café',status:'Pending'}]);
    return renderAuth(`
      <section class="content-card"><div class="section-header-row"><div><p class="eyebrow">Micro-dates</p><h2>Quick, low-pressure meetups</h2></div><button type="button" class="primary-btn">New invite</button></div>${dates.length ? `<div class="date-grid">${dates.map((item) => `<article class="mini-card-item"><strong>${escapeHtml(item.date)}</strong><p>${escapeHtml(item.time)} • ${escapeHtml(item.location)}</p><span class="pill">${escapeHtml(item.status)}</span></article>`).join('')}</div>` : '<div class="empty-state"><p>No micro-dates scheduled yet.</p></div>'}</section>
    `, 'micro-dates');
  }

  function renderNotifications() {
    const notifications = window.KodeCupidMockApi.getState('kodeCupidNotifications', [{id:'n1',type:'new_match',title:'New match',message:'Maya Patel liked your profile back.',timestamp:new Date().toISOString(),read:false},{id:'n2',type:'micro_date',title:'Micro-date invitation',message:'A quiet coffee invite is ready to accept.',timestamp:new Date().toISOString(),read:false}]);
    return renderAuth(`
      <section class="content-card"><p class="eyebrow">Notifications</p><h2>Recent activity</h2><div class="list-panel">${notifications.map((item) => `<article class="notification-row ${!item.read ? 'unread' : ''}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.message)}</p><small>${new Date(item.timestamp).toLocaleString()}</small></article>`).join('')}</div></section>
    `, 'notifications');
  }

  function renderPricing() {
    return renderAuth(`
      <section class="content-card"><p class="eyebrow">Pricing</p><h2>Choose your plan</h2><div class="pricing-grid">${window.KodeCupidConstants.plans.map((plan) => `<article class="price-card ${plan.name === 'Silver' ? 'featured' : ''}"><h3>${escapeHtml(plan.name)}</h3><div class="price-row"><strong>${escapeHtml(plan.price)}</strong></div><ul>${plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul><button type="button" class="primary-btn full-width">Select plan</button></article>`).join('')}</div><div class="prototype-note">Prototype — no real charge. Mock payment providers: Stripe, Square, and PayPal.</div></section>
    `, 'pricing');
  }

  function renderAdmin() {
    return renderAuth(`
      <section class="content-card admin-panel"><p class="eyebrow">Admin</p><h2>Moderation dashboard</h2><div class="stats-grid"><div class="mini-stat"><span>Total users</span><strong>14,280</strong></div><div class="mini-stat"><span>Pending verifications</span><strong>128</strong></div><div class="mini-stat"><span>Open reports</span><strong>23</strong></div><div class="mini-stat"><span>Active matches</span><strong>2,315</strong></div><div class="mini-stat"><span>Account deletion requests</span><strong>17</strong></div></div><div class="admin-nav-grid"><button type="button" class="secondary-btn" data-route="/admin/verifications">Verifications</button><button type="button" class="secondary-btn" data-route="/admin/reports">Reports</button><button type="button" class="secondary-btn" data-route="/admin/users">Users</button><button type="button" class="secondary-btn" data-route="/admin/deletion-requests">Deletion requests</button><button type="button" class="secondary-btn" data-route="/admin/subscriptions">Subscriptions</button><button type="button" class="secondary-btn" data-route="/admin/content">Content</button></div></section>
    `, 'admin');
  }

  function renderAdminVerifications() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>Verification queue</h2><div class="list-panel"><article class="admin-row"><strong>Elena Garcia</strong><p>Manual badge upload pending.</p><div class="inline-actions"><button class="secondary-btn" type="button">Approve</button><button class="ghost-btn" type="button">Request info</button></div></article><article class="admin-row"><strong>Jordan White</strong><p>NPI result reviewed; manual follow-up required.</p><div class="inline-actions"><button class="secondary-btn" type="button">Approve</button><button class="ghost-btn" type="button">Deny</button></div></article></div></section>`, 'admin'); }
  function renderAdminReports() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>Reports & moderation</h2><div class="list-panel"><article class="admin-row"><strong>Harassment complaint</strong><p>Reported by user on profile #p018.</p><div class="inline-actions"><button class="secondary-btn" type="button">Warn</button><button class="ghost-btn" type="button">Dismiss</button></div></article></div></section>`, 'admin'); }
  function renderAdminUsers() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>User management</h2><input type="search" value="Search users, phones, or professions" /><div class="list-panel"><article class="admin-row"><strong>Ava Thompson</strong><p>Verified • ICU Nurse • Active</p><div class="inline-actions"><button class="secondary-btn" type="button">View</button><button class="ghost-btn" type="button">Suspend</button></div></article></div></section>`, 'admin'); }
  function renderAdminDeletionRequests() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>Deletion requests</h2><div class="list-panel"><article class="admin-row"><strong>user@email.com</strong><p>Reason: taking a break from dating apps.</p><div class="inline-actions"><button class="secondary-btn" type="button">Processing</button><button class="ghost-btn" type="button">Completed</button></div></article></div></section>`, 'admin'); }
  function renderAdminSubscriptions() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>Subscriptions</h2><div class="list-panel"><article class="admin-row"><strong>Silver</strong><p>Provider: Stripe • Active</p></article><article class="admin-row"><strong>Premium</strong><p>Provider: PayPal • Active</p></article></div></section>`, 'admin'); }
  function renderAdminContent() { return renderAuth(`<section class="content-card"><p class="eyebrow">Admin</p><h2>Content placeholders</h2><div class="stack-form"><label><span>Terms and Conditions</span><textarea rows="3">Placeholder content for product legal review.</textarea></label><label><span>Privacy Policy</span><textarea rows="3">Placeholder content for privacy review.</textarea></label><label><span>FAQs</span><textarea rows="3">Placeholder content for help center review.</textarea></label></div></section>`, 'admin'); }

  function renderRoute() {
    const route = getRoute();
    const publicRoutes = ['/', '/signup', '/login', '/terms', '/privacy', '/faqs', '/community-pledge', '/safety-tips', '/account-closure'];
    if (route === '/') return appRoot.innerHTML = renderLanding();
    if (route === '/signup') return appRoot.innerHTML = renderSignup();
    if (route === '/login') return appRoot.innerHTML = renderLogin();
    if (route === '/terms') return appRoot.innerHTML = renderStatic('Terms of Service', '<p>These terms are a placeholder prototype only and not final legal language.</p><ul><li>Members agree to respectful, verified communication.</li><li>Profiles are subject to community safety review.</li><li>All payments and verifications are mock-only in this prototype.</li></ul>');
    if (route === '/privacy') return appRoot.innerHTML = renderStatic('Privacy Policy', '<p>We protect professional privacy, including workplace details.</p><ul><li>Workplace radius controls are mock settings for demo purposes.</li><li>Profile visibility can be adjusted across sensitive fields.</li><li>Any real data handling would require a full production review.</li></ul>');
    if (route === '/faqs') return appRoot.innerHTML = renderStatic('FAQs', '<div class="faq-item"><h3>Who is KodeCupid for?</h3><p>Verified professionals in healthcare, education, university, and science-related communities.</p></div><div class="faq-item"><h3>How does verification work?</h3><p>Members can use mock NPI verification or a manual badge upload flow in this demo environment.</p></div>');
    if (route === '/community-pledge') return appRoot.innerHTML = renderStatic('Community Pledge', '<p>We believe in respectful connection, safety, and professionalism.</p><ul><li>Be kind and honest.</li><li>Protect workplace privacy.</li><li>Report harmful or fake behavior.</li></ul>');
    if (route === '/safety-tips') return appRoot.innerHTML = renderStatic('Safety Tips', '<p>Keep interactions safe and professional:</p><ul><li>Meet in public spaces for first dates.</li><li>Take your time before sharing private details.</li><li>Use our reporting tools if something feels wrong.</li></ul>');
    if (route === '/account-closure') return appRoot.innerHTML = renderStatic('Account closure', '<form class="stack-form"><label><span>Email or phone</span><input type="text" value="hello@example.com" /></label><label><span>Reason for closure</span><textarea rows="4">I am taking a break from dating apps.</textarea></label><div class="check-row"><input type="checkbox" checked /> <label>Confirm my request.</label></div><button type="button" class="primary-btn full-width" data-route="/">Submit request</button></form>');
    if (route === '/onboarding') return appRoot.innerHTML = renderOnboarding();
    if (route === '/discover') return appRoot.innerHTML = renderDiscover();
    if (route === '/profile') return appRoot.innerHTML = renderProfile();
    if (route === '/matches') return appRoot.innerHTML = renderMatches();
    if (route === '/messages') return appRoot.innerHTML = renderMessages();
    if (route === '/micro-dates') return appRoot.innerHTML = renderMicroDates();
    if (route === '/notifications') return appRoot.innerHTML = renderNotifications();
    if (route === '/settings') return appRoot.innerHTML = renderAuth(`<section class="content-card"><p class="eyebrow">Settings</p><h2>Privacy & notifications</h2><div class="stack-form"><div class="check-row"><input type="checkbox" checked /> <label>Enable workplace privacy</label></div><div class="check-row"><input type="checkbox" checked /> <label>Pause notifications during quiet hours</label></div><label><span>Facility</span><input type="text" value="Riverside Clinic" /></label><label><span>Privacy radius</span><input type="range" min="1" max="10" value="1" /></label><label><span>Quiet hours</span><input type="text" value="9:30 PM - 7:00 AM" /></label></div></section>`, '/settings');
    if (route === '/pricing') return appRoot.innerHTML = renderPricing();
    if (route === '/curbside-consult') return appRoot.innerHTML = renderAuth(`<section class="content-card"><p class="eyebrow">Curbside Consult</p><h2>Request a professional consult</h2><div class="stack-form"><label><span>Question</span><textarea rows="4">Would this kind of match fit my schedule and goals?</textarea></label><label><span>Optional context</span><textarea rows="3">I am balancing clinic hours and early mornings.</textarea></label><div class="prototype-note">Fee: $45.00 • Prototype — no real charge.</div><button type="button" class="primary-btn">Submit request</button></div></section>`, '/curbside-consult');
    if (route === '/admin') return appRoot.innerHTML = renderAdmin();
    if (route === '/admin/verifications') return appRoot.innerHTML = renderAdminVerifications();
    if (route === '/admin/reports') return appRoot.innerHTML = renderAdminReports();
    if (route === '/admin/users') return appRoot.innerHTML = renderAdminUsers();
    if (route === '/admin/deletion-requests') return appRoot.innerHTML = renderAdminDeletionRequests();
    if (route === '/admin/subscriptions') return appRoot.innerHTML = renderAdminSubscriptions();
    if (route === '/admin/content') return appRoot.innerHTML = renderAdminContent();
    if (route.startsWith('/profile?')) return appRoot.innerHTML = renderProfile();
    if (publicRoutes.includes(route)) return appRoot.innerHTML = renderLanding();
    appRoot.innerHTML = renderPublic('<section class="content-card"><h2>Page not found</h2><p>The route you requested does not exist in this prototype.</p></section>');
  }

  function serializeForm(form) {
    const data = {};
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) data[key] = value;
    return data;
  }

  document.addEventListener('click', (event) => {
    const routeTarget = event.target.closest('[data-route]');
    if (routeTarget) {
      event.preventDefault();
      navigate(routeTarget.dataset.route);
      return;
    }
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;
    const profileId = actionTarget.dataset.profileId;
    if (action === 'like-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      alert(profile ? `You liked ${profile.displayName}. Prototype match estimate: ${window.KodeCupidMatching.matchScore(getCurrentUser(), profile)}%` : 'You liked this profile.');
      return;
    }
    if (action === 'pass-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      alert(profile ? `You passed on ${profile.displayName}.` : 'You passed on this profile.');
      return;
    }
    if (action === 'open-profile') {
      navigate(`/profile?id=${profileId}`);
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form || !form.id) return;
    if (form.id === 'signupForm') {
      event.preventDefault();
      const data = serializeForm(form);
      setCurrentUser({ ...defaultDemoUser, displayName: data.firstName || defaultDemoUser.displayName, location: data.city || defaultDemoUser.location, email: data.email });
      window.KodeCupidStorage.set('kodeCupidOnboarding', { firstName: data.firstName, city: data.city, agree: true });
      navigate('/onboarding');
      return;
    }
    if (form.id === 'loginForm') {
      event.preventDefault();
      setCurrentUser({ ...defaultDemoUser, email: 'aisha@kodecupid.demo' });
      navigate('/discover');
      return;
    }
    if (form.id === 'onboardingForm') {
      event.preventDefault();
      const details = serializeForm(form);
      const nextUser = { ...defaultDemoUser, displayName: details.firstName || defaultDemoUser.displayName, location: details.city || defaultDemoUser.location, professionCategory: details.professionCategory || defaultDemoUser.professionCategory, jobTitle: details.jobTitle || defaultDemoUser.jobTitle, relationshipGoals: [details.relationshipGoals || 'Serious relationship'] };
      setCurrentUser(nextUser);
      window.KodeCupidStorage.set('kodeCupidOnboarding', details);
      navigate('/discover');
    }
  });

  window.addEventListener('hashchange', renderRoute);
  window.KodeCupidMockApi.seedDemoState();
  renderRoute();
})();
