(function () {
  const appRoot = document.getElementById('app');
  const defaultDemoUser = { id: 'u-demo', displayName: 'Aisha Morgan', age: 31, dateOfBirth: '1994-02-18', genderIdentity: 'Woman', interestedIn: ['Men', 'Everyone'], location: 'Brooklyn, NY', distanceMiles: 6, professionCategory: 'Healthcare', jobTitle: 'Physician Assistant', specialty: 'Primary Care', workplaceName: 'Riverside Clinic', workplaceType: 'Clinic', workSchedule: 'Regular weekday hours', shiftTimes: '9 AM - 5 PM', verificationStatus: 'Verified', verificationMethod: 'NPI', educationLevel: 'Master’s', credentials: ['PA-C'], relationshipGoals: ['Serious relationship'], familyPlans: 'Maybe later', drinking: 'Rarely', smoking: 'No', cannabis: 'No', exercise: '4x/week', religion: 'None', ethnicity: 'Black', politicalViews: 'Moderate', languages: ['English'], height: '5ft 7in', bodyType: 'Average', hairColor: 'Brown', eyeColor: 'Brown', bio: 'Thoughtful primary care clinician who values real connection, steady routines, and time to decompress after work.', photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'], privacySettings: { age: true, height: false, location: true, religion: false, politicalViews: false, ethnicity: false }, workplacePrivacy: { enabled: true, facility: 'Riverside Clinic', radiusMiles: 1 }, quietHours: { enabled: true, start: '21:30', end: '07:00' }, subscriptionPlan: 'Silver', profileScore: 88 };

  function getRoute() {
    const hash = location.hash || '#/';
    const path = hash.startsWith('#') ? hash.slice(1) : hash;
    return path.startsWith('/') ? path : `/${path}`;
  }

  function getPath() {
    return getRoute().split('?')[0];
  }

  function getQuery() {
    const queryAt = getRoute().indexOf('?');
    return new URLSearchParams(queryAt < 0 ? '' : getRoute().slice(queryAt + 1));
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

  function setStateList(key, item, keyField = 'id') {
    const existing = window.KodeCupidMockApi.getState(key, []);
    const next = existing.some((entry) => entry[keyField] === item[keyField]) ? existing : [...existing, item];
    window.KodeCupidMockApi.setState(key, next);
    return next;
  }

  function showToast(message, tone = 'info') {
    const existing = document.getElementById('kodeCupidToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'kodeCupidToast';
    toast.className = `toast toast-${tone}`;
    toast.textContent = message;
    toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', tone === 'error' ? 'assertive' : 'polite');
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  function showMatchModal(profile) {
    const existing = document.getElementById('kodeCupidMatchModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'kodeCupidMatchModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="matchModalTitle">
        <div class="modal-header">
          <span class="badge-soft">It’s a match</span>
          <button type="button" class="ghost-btn modal-close" aria-label="Close">Close</button>
        </div>
        <h3 id="matchModalTitle">${escapeHtml(profile.displayName)}</h3>
        <p>${escapeHtml(profile.jobTitle)} • ${escapeHtml(profile.specialty)}</p>
        <p class="modal-copy">You both showed strong alignment on culture, timing, and workplace privacy. Start a conversation now.</p>
        <div class="action-row">
          <button type="button" class="ghost-btn modal-close">Later</button>
          <button type="button" class="primary-btn" data-route="/messages?with=${encodeURIComponent(profile.displayName)}">Message now</button>
        </div>
      </section>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
    modal.querySelector('[data-route]').addEventListener('click', () => {
      close();
      navigate(`/messages?with=${encodeURIComponent(profile.displayName)}`);
    });
    modal.querySelector('.modal-close').focus();
  }

  function showConfirmation({ title, message, confirmLabel, onConfirm }) {
    const previousFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle" aria-describedby="confirmMessage"><div class="modal-header"><h2 id="confirmTitle">${escapeHtml(title)}</h2><button type="button" class="ghost-btn modal-close" aria-label="Close dialog">Close</button></div><p id="confirmMessage">${escapeHtml(message)}</p><div class="action-row"><button type="button" class="ghost-btn modal-close">Cancel</button><button type="button" class="primary-btn modal-confirm">${escapeHtml(confirmLabel)}</button></div></section>`;
    document.body.appendChild(backdrop);
    const close = () => {
      backdrop.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
    backdrop.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', close));
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) close();
    });
    backdrop.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const focusable = [...backdrop.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    backdrop.querySelector('.modal-confirm').addEventListener('click', () => {
      close();
      onConfirm();
    });
    backdrop.querySelector('.modal-close').focus();
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
            <button type="button" data-route="/admin/login" class="nav-link">Staff demo</button>
            <button type="button" data-route="/login" class="nav-link accent">Log in</button>
          </nav>
        </header>
        <main class="page-content">${content}</main>
        <footer class="site-footer">
          <span>KodeCupid · a community for lives that do not run on one schedule.</span>
          <nav aria-label="Footer navigation">
            <button type="button" data-route="/terms">Terms</button>
            <button type="button" data-route="/privacy">Privacy</button>
            <button type="button" data-route="/faqs">FAQs</button>
            <button type="button" data-route="/community-pledge">Community pledge</button>
            <button type="button" data-route="/safety-tips">Safety</button>
            <button type="button" data-route="/contact">Contact</button>
            <button type="button" data-route="/account-closure">Data deletion</button>
          </nav>
        </footer>
      </div>
    `;
  }

  function renderAuth(content, currentPage, isAdmin = false) {
    const user = getCurrentUser();
    const items = isAdmin
      ? [['Overview', '/admin', '⌂'], ['Verifications', '/admin/verifications', '✓'], ['Reports', '/admin/reports', '!'], ['Members', '/admin/users', '○'], ['Deletion requests', '/admin/deletion-requests', '×'], ['Subscriptions', '/admin/subscriptions', '$'], ['Content', '/admin/content', '≡']]
      : [['Discover', '/discover', '◎'], ['Matches', '/matches', '♡'], ['Messages', '/messages', '✉'], ['Micro-dates', '/micro-dates', '◷'], ['Notifications', '/notifications', '•'], ['My profile', '/profile', '○'], ['Settings', '/settings', '⚙'], ['Plans', '/pricing', '$']];
    return `
      <div class="page-shell app-shell">
        <aside class="sidebar">
          <div class="brand-inline sidebar-brand">
            <div class="brand-badge">K</div><div><span class="eyebrow">${isAdmin ? 'Operations' : 'Members'}</span><h2>KodeCupid</h2></div>
          </div>
          <nav class="side-nav">
            ${items.map(([label, route, icon]) => `<button type="button" data-route="${route}" class="side-nav-item ${getPath() === route ? 'active' : ''}"><span aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('')}
          </nav>
          ${isAdmin ? `<button type="button" class="ghost-btn full-width" data-action="admin-logout">Exit admin demo</button>` : `<div class="mini-panel">
            <p class="eyebrow">Member status</p>
            <h3>${escapeHtml(user.displayName)}</h3>
            <p>${escapeHtml(user.professionCategory)} • ${escapeHtml(user.location)}</p>
            <div class="mini-progress"><span></span></div>
            <small>Profile completion: ${profileCompletion(user)}%</small>
          </div>`}
        </aside>
        <main class="main-view">${content}</main>
      </div>
    `;
  }

  function renderLanding() {
    return renderPublic(`
      <section class="hero-panel">
        <div class="hero-copy"><span class="tag">For the people who care for, teach, and discover</span><h2>Where verified professionals make real connections.</h2><p>Meet people in healthcare, education, college and university, and science/public health—who understand your work, your schedule, and the life around it.</p><div class="cta-row"><button type="button" class="primary-btn" data-route="/signup">Create your profile</button><button type="button" class="secondary-btn" data-route="/how-it-works">See how it works</button></div><p class="hero-aside">No workplace directory. No real-time location. Just thoughtful introductions shaped around your preferences.</p></div>
        <div class="hero-visual-card"><div class="image-stack"><img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1000&q=80" alt="Healthcare professional portrait" /><div class="floating-card"><strong>92% match</strong><span>Dr. Maya • ICU nurse</span></div></div></div>
      </section>
      <section class="info-grid">
        <article class="info-card"><span class="badge-soft">Trust</span><h3>A community with context</h3><p>Professional verification adds confidence while keeping credentials and workplace details private.</p></article>
        <article class="info-card"><span class="badge-soft">Timing</span><h3>Built around real schedules</h3><p>Shift-aware suggestions help you meet people without expecting every evening to be free.</p></article>
        <article class="info-card"><span class="badge-soft">Boundaries</span><h3>Your work stays yours</h3><p>Workplace privacy, quiet hours, reporting, and blocking are part of the experience—not afterthoughts.</p></article>
      </section>
      <section class="benefit-strip" aria-label="KodeCupid benefits">
        <span>Verified professional community</span><span>Shift-aware matching</span><span>Workplace privacy controls</span><span>Micro-date scheduling</span><span>Safety and moderation</span>
      </section>
      <section class="pricing-preview"><div class="section-header-row"><div><p class="eyebrow">Membership</p><h2>Choose what fits your pace.</h2></div><button type="button" class="inline-link" data-route="/pricing">Compare plans</button></div><div class="pricing-preview-grid">${window.KodeCupidConstants.plans.map((plan) => `<article><strong>${escapeHtml(plan.name)}</strong><span>${escapeHtml(plan.price)}</span></article>`).join('')}<article><strong>Gifts & coins</strong><span>Optional mock add-ons</span></article></div></section>
      <section class="how-it-works" id="how-it-works"><div><p class="eyebrow">A better first hello</p><h2>Connection that respects your real life.</h2></div><ol><li><strong>Build your profile</strong><span>Share the details that feel right to you.</span></li><li><strong>Discover with context</strong><span>See how goals, work rhythms, and preferences align.</span></li><li><strong>Meet at your pace</strong><span>Start with a conversation or plan a short, low-pressure date.</span></li></ol></section>
    `);
  }

  function profileCompletion(user) {
    const fields = ['displayName', 'location', 'professionCategory', 'jobTitle', 'bio', 'photos'];
    return Math.round(fields.filter((field) => Boolean(user[field])).length / fields.length * 100);
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
    const saved = window.KodeCupidMockApi.getState('kodeCupidOnboardingDraft', {});
    const savedStep = Math.min(8, Math.max(1, Number(window.KodeCupidMockApi.getState('kodeCupidOnboardingStep', 1)) || 1));
    return renderAuth(`
      <section class="content-card onboarding-card">
        <div class="section-header-row"><div><p class="eyebrow">Set up your profile</p><h2>Tell us about you</h2></div><div class="chip-badge" id="onboardingStepLabel">Step ${savedStep} of 8</div></div>
        <div class="wizard-progress" role="progressbar" aria-label="Profile setup progress" aria-valuemin="1" aria-valuemax="8" aria-valuenow="${savedStep}"><span id="onboardingProgress" style="width:${savedStep / 8 * 100}%"></span></div>
        <p class="hint">Your progress is saved on this device. Demo phone verification is not a real SMS service.</p>
        <form id="onboardingForm" class="stack-form onboarding-form" novalidate>
          <fieldset data-step="1"><legend>Eligibility</legend><div class="check-row"><input type="checkbox" name="olderThan18" checked required /> <label>I am 18 or older.</label></div><div class="check-row"><input type="checkbox" name="termsAccepted" checked required /> <label>I accept the <button type="button" class="inline-link" data-route="/terms">Terms</button> and <button type="button" class="inline-link" data-route="/community-pledge">Community Guidelines</button>.</label></div></fieldset>
          <fieldset data-step="2"><legend>Phone verification</legend><label><span>Phone number</span><input type="tel" name="phone" placeholder="(555) 123-4567" required /></label><div class="inline-actions"><button type="button" class="secondary-btn" data-action="send-code">Send demo code</button><span class="hint">Demo code: any six digits. Not real SMS verification.</span></div><label><span>Six-digit code</span><input type="text" name="otp" inputmode="numeric" pattern="[0-9]{6}" placeholder="123456" maxlength="6" required /></label></fieldset>
          <fieldset data-step="3"><legend>About you</legend><div class="two-col"><label><span>Display name</span><input type="text" name="firstName" value="${escapeHtml(saved.firstName || user.displayName.split(' ')[0])}" required /></label><label><span>Date of birth</span><input type="date" name="dateOfBirth" value="${escapeHtml(saved.dateOfBirth || user.dateOfBirth || '1994-02-18')}" required /></label></div><label><span>Gender identity</span><select name="genderIdentity"><option>Man</option><option selected>Woman</option><option>Non-binary</option><option>Transgender</option><option>Agender</option><option>Genderfluid</option><option>Custom</option></select></label><label><span>Interested in</span><select name="interestedIn"><option>Women</option><option selected>Men</option><option>Non-binary people</option><option>Everyone</option></select></label><label><span>City or neighborhood</span><input type="text" name="city" value="${escapeHtml(saved.city || user.location)}" required /></label><p class="hint" id="ageFeedback" aria-live="polite"></p></fieldset>
          <fieldset data-step="4"><legend>Professional identity</legend><div class="two-col"><label><span>Profession category</span><select name="professionCategory">${window.KodeCupidConstants.professionCategories.map((item) => `<option ${item === user.professionCategory ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label><label><span>Job title</span><input type="text" name="jobTitle" value="${escapeHtml(user.jobTitle)}" required /></label></div><div class="two-col"><label><span>Specialty</span><input type="text" name="specialty" value="${escapeHtml(user.specialty)}" /></label><label><span>Workplace type</span><select name="workplaceType"><option>Hospital</option><option selected>Clinic</option><option>School</option><option>College/University</option><option>Research organization</option><option>Other</option></select></label></div><label><span>Work schedule</span><select name="workSchedule">${window.KodeCupidConstants.schedules.map((item) => `<option ${item === user.workSchedule ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label><label><span>Typical shift times</span><input type="text" name="shiftTimes" value="${escapeHtml(user.shiftTimes)}" /></label></fieldset>
          <fieldset data-step="5"><legend>Professional verification</legend><label><span>NPI number (mock lookup)</span><input type="text" name="npiNumber" value="1234567890" inputmode="numeric" /></label><button type="button" class="secondary-btn" data-action="verify-profile">Run mock NPI lookup</button><label><span>Manual badge or license upload (demo only)</span><input type="file" name="verificationDocument" accept="image/*,.pdf" /></label><p class="hint" id="verificationStatus" aria-live="polite">A real service would securely review your credential. Uploaded files are not sent or saved by this demo.</p><label class="check-row"><input type="checkbox" name="skipVerification" checked /> Skip for demo and mark my profile verified.</label></fieldset>
          <fieldset data-step="6"><legend>Profile details</legend><label><span>Bio</span><textarea rows="4" name="bio">${escapeHtml(user.bio)}</textarea></label><div class="two-col"><label><span>Height</span><input type="text" name="height" value="${escapeHtml(user.height)}" /></label><label><span>Body type</span><input type="text" name="bodyType" value="${escapeHtml(user.bodyType)}" /></label></div><div class="two-col"><label><span>Hair color</span><input type="text" name="hairColor" value="${escapeHtml(user.hairColor)}" /></label><label><span>Eye color</span><input type="text" name="eyeColor" value="${escapeHtml(user.eyeColor)}" /></label></div><label><span>Languages (comma-separated)</span><input type="text" name="languages" value="${escapeHtml((user.languages || ['English']).join(', '))}" /></label><div class="two-col"><label><span>Education</span><input type="text" name="educationLevel" value="${escapeHtml(user.educationLevel)}" /></label><label><span>Credentials</span><input type="text" name="credentials" value="${escapeHtml((user.credentials || []).join(', '))}" /></label></div><label><span>Religion (optional)</span><input type="text" name="religion" value="${escapeHtml(user.religion)}" /></label><div class="two-col"><label><span>Ethnicity (optional)</span><input type="text" name="ethnicity" value="${escapeHtml(user.ethnicity)}" /></label><label><span>Political views (optional)</span><input type="text" name="politicalViews" value="${escapeHtml(user.politicalViews)}" /></label></div><div class="two-col"><label><span>Drinking</span><input type="text" name="drinking" value="${escapeHtml(user.drinking)}" /></label><label><span>Smoking</span><input type="text" name="smoking" value="${escapeHtml(user.smoking)}" /></label></div><label><span>Photos (select locally; demo only)</span><input type="file" name="photos" accept="image/*" multiple /></label></fieldset>
          <fieldset data-step="7"><legend>Relationship preferences</legend><label><span>Looking for</span><select name="relationshipGoals">${window.KodeCupidConstants.relationshipGoals.map((item) => `<option ${item === (user.relationshipGoals || [])[0] ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label><div class="check-row"><input type="checkbox" name="disableVideoChat" /> <label>Disable video chat invitations.</label></div><p class="hint">Video calling is not available in this prototype.</p></fieldset>
          <fieldset data-step="8"><legend>Privacy and notifications</legend><div class="check-row"><input type="checkbox" name="workplacePrivacy" checked /> <label>Hide my profile near my workplace.</label></div><label><span>Privacy radius</span><input type="range" name="privacyRadius" min="1" max="10" value="1" /></label><div class="two-col"><label><span>Quiet hours start</span><input type="time" name="quietStart" value="21:30" /></label><label><span>Quiet hours end</span><input type="time" name="quietEnd" value="07:00" /></label></div><p>Choose what appears on your profile:</p><div class="visibility-grid"><label><input type="checkbox" name="showAge" checked /> Age</label><label><input type="checkbox" name="showLocation" checked /> City</label><label><input type="checkbox" name="showHeight" /> Height</label><label><input type="checkbox" name="showReligion" /> Religion</label><label><input type="checkbox" name="showEthnicity" /> Ethnicity</label><label><input type="checkbox" name="showPolitics" /> Political views</label></div></fieldset>
          <section class="profile-preview" id="onboardingPreview"><p class="eyebrow">Your preview</p><h3>${escapeHtml(user.displayName)}, ${user.age}</h3><p>${escapeHtml(user.professionCategory)} · ${escapeHtml(user.jobTitle)}</p><p>${escapeHtml(user.bio)}</p></section>
          <div class="wizard-actions"><button type="button" id="onboardingBack" class="secondary-btn">Back</button><button type="button" id="onboardingNext" class="primary-btn">Continue</button><button type="submit" id="onboardingFinish" class="primary-btn">Enter KodeCupid</button></div>
        </form>
      </section>
    `, 'onboarding');
  }

  function getDiscoveryProfiles() {
    const user = getCurrentUser();
    const hiddenIds = new Set([
      ...window.KodeCupidMockApi.getState('kodeCupidLikes', []).map((item) => item.id),
      ...window.KodeCupidMockApi.getState('kodeCupidPasses', []).map((item) => item.id),
      ...window.KodeCupidMockApi.getState('kodeCupidBlockedProfiles', []).map((item) => item.id),
      ...window.KodeCupidMockApi.getState('kodeCupidMatches', []).map((item) => item.userId)
    ]);
    const filters = window.KodeCupidMockApi.getState('kodeCupidDiscoveryFilters', {});
    const batch = Number(window.KodeCupidMockApi.getState('kodeCupidDiscoveryBatch', 0)) || 0;
    const candidates = window.KodeCupidMockApi.getProfiles()
      .filter((profile) => profile.id !== user.id && !hiddenIds.has(profile.id))
      .filter((profile) => !filters.profession || profile.professionCategory === filters.profession)
      .filter((profile) => !filters.specialty || profile.specialty.toLowerCase().includes(filters.specialty.toLowerCase()))
      .filter((profile) => !filters.goal || profile.relationshipGoals.includes(filters.goal))
      .filter((profile) => !filters.schedule || window.KodeCupidSchedule.getScheduleBadge(user.workSchedule, profile.workSchedule).toLowerCase().includes(filters.schedule.toLowerCase()))
      .filter((profile) => !filters.education || profile.educationLevel.toLowerCase().includes(filters.education.toLowerCase()))
      .filter((profile) => profile.distanceMiles <= (Number(filters.distance) || 100))
      .filter((profile) => profile.age >= (Number(filters.ageMin) || 18) && profile.age <= (Number(filters.ageMax) || 99))
      .map((profile) => ({ ...profile, compatibilityScore: window.KodeCupidMatching.matchScore(user, profile) }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    if (!candidates.length) return [];
    const start = (batch * 6) % candidates.length;
    return [...candidates.slice(start), ...candidates.slice(0, start)].slice(0, 6);
  }

  function renderDiscover() {
    const profiles = getDiscoveryProfiles();
    const user = getCurrentUser();
    const filters = window.KodeCupidMockApi.getState('kodeCupidDiscoveryFilters', {});
    const isFree = user.subscriptionPlan === 'Free';
    return renderAuth(`
      <section class="screen-header"><div><p class="eyebrow">Discover</p><h2>People whose lives might fit yours.</h2><p class="hint">A match estimate is a starting point, not a promise.</p></div><div class="inline-actions"><button type="button" class="secondary-btn" data-action="toggle-filters" aria-expanded="false">Filters</button><button type="button" class="ghost-btn" data-action="refresh-discovery">Show me a new group</button></div></section>
      ${isFree ? `<aside class="notice-strip"><span>Free plan: one match each week. Member search is available on Silver.</span><button type="button" data-route="/pricing" class="inline-link">See plans</button></aside>` : ''}
      <form id="discoveryFilters" class="filter-drawer" hidden>
        <label><span>Distance</span><input type="number" name="distance" min="1" max="200" value="${escapeHtml(filters.distance || 50)}" /></label>
        <label><span>Age from</span><input type="number" name="ageMin" min="18" max="99" value="${escapeHtml(filters.ageMin || 18)}" /></label>
        <label><span>Age to</span><input type="number" name="ageMax" min="18" max="99" value="${escapeHtml(filters.ageMax || 50)}" /></label>
        <label><span>Profession</span><select name="profession"><option value="">All professions</option>${window.KodeCupidConstants.professionCategories.map((item) => `<option ${filters.profession === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label>
        <label><span>Specialty</span><input type="search" name="specialty" value="${escapeHtml(filters.specialty || '')}" placeholder="e.g. critical care" ${isFree ? 'disabled' : ''} /></label>
        <label><span>Relationship goal</span><select name="goal"><option value="">Any goal</option>${window.KodeCupidConstants.relationshipGoals.map((item) => `<option ${filters.goal === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label>
        <label><span>Schedule fit</span><select name="schedule"><option value="">Any schedule</option><option value="Great schedule overlap" ${filters.schedule === 'Great schedule overlap' ? 'selected' : ''}>Great overlap</option><option value="Some overlap" ${filters.schedule === 'Some overlap' ? 'selected' : ''}>Some overlap</option><option value="Different schedules" ${filters.schedule === 'Different schedules' ? 'selected' : ''}>Different schedules</option></select></label>
        <label><span>Education</span><select name="education"><option value="">Any education</option><option ${filters.education === 'Bachelor' ? 'selected' : ''}>Bachelor</option><option ${filters.education === 'Master' ? 'selected' : ''}>Master</option><option ${filters.education === 'Doctor' ? 'selected' : ''}>Doctor</option></select></label>
        <button type="submit" class="primary-btn">Apply filters</button><button type="button" class="ghost-btn" data-action="clear-filters">Clear</button>
      </form>
      ${isFree ? `<p class="hint">Member search is a Silver feature. Browsing suggested profiles is still available on Free.</p>` : ''}
      ${profiles.length ? `<section class="match-grid" aria-label="Suggested profiles">
        ${profiles.map((profile) => `
          <article class="profile-card discover-card">
            <div class="profile-image-wrap"><img src="${escapeHtml(profile.photos[0])}" alt="Portrait of ${escapeHtml(profile.displayName)}" /><div class="profile-score" aria-label="${profile.compatibilityScore}% estimated match">${profile.compatibilityScore}% fit</div></div>
            <div class="profile-card-body"><div class="profile-card-header"><div><h3>${escapeHtml(profile.displayName)}${profile.privacySettings.age ? `, ${profile.age}` : ''}</h3><p>${escapeHtml(profile.professionCategory)}</p></div><span class="verification-badge">${escapeHtml(profile.verificationStatus)}</span></div><p>${escapeHtml(profile.jobTitle)} · ${escapeHtml(profile.specialty)}</p><div class="meta-row clear-row"><span>${profile.privacySettings.location ? escapeHtml(profile.location) : 'Location private'}</span><span>${profile.privacySettings.location ? `${escapeHtml(profile.distanceMiles)} mi` : ''}</span></div><div class="meta-row clear-row"><span>${escapeHtml(profile.workplaceType)}</span><span>${escapeHtml(window.KodeCupidSchedule.getScheduleBadge(user.workSchedule, profile.workSchedule))}</span></div><p><strong>Looking for:</strong> ${escapeHtml((profile.relationshipGoals || []).slice(0, 2).join(', '))}</p><p class="icebreaker">${escapeHtml(profile.icebreakerAnswers[0])}</p><div class="action-row compact-row"><button type="button" class="ghost-btn" data-action="pass-profile" data-profile-id="${profile.id}">Pass</button><button type="button" class="secondary-btn" data-action="open-profile" data-profile-id="${profile.id}">View profile</button><button type="button" class="primary-btn" data-action="like-profile" data-profile-id="${profile.id}">Like</button></div></div>
          </article>
        `).join('')}
      </section>` : `<section class="empty-state discovery-empty"><span class="empty-mark" aria-hidden="true">♡</span><h3>You’ve seen everyone nearby for now.</h3><p>Change your filters or look at another group of professionals.</p><div class="action-row"><button type="button" class="secondary-btn" data-action="clear-filters">Clear filters</button><button type="button" class="primary-btn" data-action="refresh-discovery">Show another group</button></div></section>`}
    `, 'discover');
  }

  function renderProfile() {
    const profileId = getQuery().get('id') || getCurrentUser().id;
    const profile = window.KodeCupidMockApi.getProfileById(profileId) || getCurrentUser();
    const photos = Array.isArray(profile.photos) && profile.photos.length ? profile.photos : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80'];
    const isSelf = profile.id === getCurrentUser().id;
    const isMatched = window.KodeCupidMockApi.getState('kodeCupidMatches', []).some((match) => match.userId === profile.id);
    const compatibility = profile.compatibilityScore || window.KodeCupidMatching.matchScore(getCurrentUser(), profile);
    const privacy = profile.privacySettings || {};
    return renderAuth(`
      <section class="content-card profile-detail">
        <div class="gallery-grid">${photos.map((photo) => `<img src="${escapeHtml(photo)}" alt="Photo of ${escapeHtml(profile.displayName || 'member')}" />`).join('')}</div>
        <div class="profile-overview"><div><p class="eyebrow">${isSelf ? 'Your profile' : 'Professional profile'}</p><h2>${escapeHtml(profile.displayName || 'Your profile')}${privacy.age && profile.age ? `, ${profile.age}` : ''}</h2></div><span class="verification-badge">${escapeHtml(profile.verificationStatus || 'Pending review')}</span></div>
        <div class="detail-grid"><div class="profile-facts">
          <p><strong>${escapeHtml(profile.professionCategory || 'Professional')}</strong> · ${escapeHtml(profile.jobTitle || 'Member')}</p>
          <p>${escapeHtml(profile.specialty || 'Specialty not shared')} · ${escapeHtml(profile.workplaceType || 'Workplace private')}</p>
          <p>${escapeHtml(profile.educationLevel || 'Education not shared')}${profile.credentials?.length ? ` · ${escapeHtml(profile.credentials.join(', '))}` : ''}</p>
          <p>${privacy.location ? `${escapeHtml(profile.location || 'Location private')} · ${escapeHtml(profile.distanceMiles || '—')} mi away` : 'Location private'} · ${escapeHtml(profile.relationshipGoals?.[0] || 'Open to connection')}</p>
          <p><strong>Schedule fit:</strong> ${escapeHtml(window.KodeCupidSchedule.getScheduleBadge(getCurrentUser().workSchedule, profile.workSchedule || 'Variable schedule'))}</p>
          ${privacy.height && profile.height ? `<p><strong>Height:</strong> ${escapeHtml(profile.height)}</p>` : ''}
          ${privacy.religion && profile.religion ? `<p><strong>Religion:</strong> ${escapeHtml(profile.religion)}</p>` : ''}
          ${privacy.ethnicity && profile.ethnicity ? `<p><strong>Ethnicity:</strong> ${escapeHtml(profile.ethnicity)}</p>` : ''}
          ${privacy.politicalViews && profile.politicalViews ? `<p><strong>Political views:</strong> ${escapeHtml(profile.politicalViews)}</p>` : ''}
        </div><div class="stats-box"><strong>${compatibility}%</strong><span>Schedule and preference fit</span></div></div>
        <p class="bio-block">${escapeHtml(profile.bio || 'Looking for meaningful connection and shared life rhythm.')}</p>
        <blockquote class="icebreaker profile-icebreaker">${escapeHtml(profile.icebreakerAnswers?.[0] || 'What is your favorite way to recharge after a busy week?')}</blockquote>
        <div class="chips-wrap">${(profile.languages || []).map((item) => `<span class="chip small">${escapeHtml(item)}</span>`).join('')}${(profile.relationshipGoals || []).map((item) => `<span class="chip small">${escapeHtml(item)}</span>`).join('')}</div>
        ${isSelf ? `<div class="action-row"><button type="button" class="primary-btn" data-route="/settings">Edit profile and privacy</button></div>` : `<div class="action-row"><button type="button" class="ghost-btn" data-action="report-profile" data-profile-id="${profile.id}">Report profile</button><button type="button" class="ghost-btn" data-action="block-profile" data-profile-id="${profile.id}">Block</button>${isMatched ? `<button type="button" class="primary-btn" data-action="message-profile" data-profile-id="${profile.id}">Message</button>` : `<button type="button" class="primary-btn" data-action="pre-match-message" data-profile-id="${profile.id}">Send one intro · 1 mock credit</button>`}</div>`}
      </section>
    `, 'profile');
  }

  function renderMatches() {
    const blockedIds = new Set(window.KodeCupidMockApi.getState('kodeCupidBlockedProfiles', []).map((item) => item.id));
    const matches = window.KodeCupidMockApi.getState('kodeCupidMatches', []).filter((match) => !blockedIds.has(match.userId));
    return renderAuth(`
      <section class="screen-header"><div><p class="eyebrow">Matches</p><h2>Mutual interest, made simple.</h2></div></section>
      ${matches.length ? `      <section class="list-panel">${matches.map((match) => { const profile = window.KodeCupidMockApi.getProfileById(match.userId); const expiresAt = Number(match.expiresAt) || Date.now() + 1000 * 60 * 60 * 24 * 6; return `<article class="match-row"><div class="avatar-cozy">${profile?.photos?.[0] ? `<img src="${escapeHtml(profile.photos[0])}" alt="" />` : escapeHtml(match.name.charAt(0))}</div><div class="match-copy"><strong>${escapeHtml(match.name)}</strong><p>Matched ${new Date(match.matchDate || Date.now()).toLocaleDateString()} · ${escapeHtml(match.preview || 'Say hello when you are ready.')}</p></div><div class="match-meta"><span>${match.unread ? 'Unread' : 'Read'}</span><small>${match.status === 'expired' || expiresAt < Date.now() ? 'Conversation expired' : 'Active'}</small><button type="button" class="primary-btn" data-route="/messages?with=${encodeURIComponent(match.name)}">Message</button></div></article>`; }).join('')}</section>` : `<section class="empty-state"><span class="empty-mark">♡</span><h3>No matches yet. Keep discovering.</h3><p>When you both show interest, your match will appear here.</p><button type="button" class="primary-btn" data-route="/discover">Explore profiles</button></section>`}
    `, 'matches');
  }

  function renderMessages() {
    const matchName = getQuery().get('with') || 'Maya Patel';
    const threads = window.KodeCupidMockApi.getState('kodeCupidChatThreads', {});
    const match = window.KodeCupidMockApi.getState('kodeCupidMatches', []).find((item) => item.name === matchName);
    const introduction = window.KodeCupidMockApi.getState('kodeCupidPreMatchMessages', []).find((item) => item.name === matchName);
    const messages = threads[matchName] || (match ? [
      { from: matchName, text: 'Would love to grab coffee after our shifts this week.', time: '2m ago', mine: false },
      { from: 'You', text: 'That works. I am free Thursday after 6 PM.', time: 'just now', mine: true },
      { from: matchName, text: 'Perfect—there is a quiet café by the hospital campus.', time: '1m ago', mine: false }
    ] : []);
    const expired = match && (match.status === 'expired' || match.expiresAt < Date.now());
    const isMatched = Boolean(match && !expired);
    const threadsList = window.KodeCupidMockApi.getState('kodeCupidMatches', []);
    return renderAuth(`
      <section class="chat-layout"><aside class="chat-list"><h2>Conversations</h2>${threadsList.length ? threadsList.map((thread) => `<button type="button" class="chat-list-item ${thread.name === matchName ? 'active' : ''}" data-route="/messages?with=${encodeURIComponent(thread.name)}"><strong>${escapeHtml(thread.name)}</strong><span>${escapeHtml(thread.preview || 'Start a conversation')}</span><small>${thread.unread ? 'Unread' : 'Recent'}</small></button>`).join('') : '<p class="hint">No active chats yet.</p>'}</aside>
      <section class="content-card chat-card"><div class="chat-header"><div><p class="eyebrow">Messages</p><h2>${escapeHtml(matchName)}</h2></div><span class="pill ${expired ? 'warn' : ''}">${expired ? 'Conversation expired' : match ? `Expires ${new Date(Number(match.expiresAt) || Date.now() + 1000 * 60 * 60 * 24 * 6).toLocaleDateString()}` : 'Pre-match intro'}</span></div>
        ${expired ? '<div class="notice-strip">This conversation has expired. Matches remain in your history.</div>' : ''}
        ${introduction && !match ? '<div class="notice-strip">One pre-match introduction sent with a mock credit. Continue chatting after a mutual match.</div>' : ''}
        ${!match && !introduction ? '<div class="empty-state">You need a match or a one-time intro before this conversation can begin.<button type="button" class="primary-btn" data-route="/discover">Return to discovery</button></div>' : ''}
        <div class="message-thread" aria-live="polite">${messages.map((message) => `<div class="thread-message ${message.mine ? 'mine' : ''}"><p>${escapeHtml(message.text || 'Image shared in demo')}</p>${message.image ? `<span class="mock-image">Mock image: ${escapeHtml(message.image)}</span>` : ''}<small>${message.mine ? 'You' : escapeHtml(message.from)} · ${escapeHtml(message.time)}${message.mine && message.read ? ' · Read' : ''}</small>${!message.mine ? `<button type="button" class="inline-link" data-action="report-message" data-profile-id="${match?.userId || ''}">Report message</button>` : ''}</div>`).join('')}</div>
        ${isMatched ? `<p class="typing-indicator" aria-live="polite" hidden>${escapeHtml(matchName)} is typing…</p><div class="composer-row"><input id="chatComposer" type="text" aria-label="Message" placeholder="Write a thoughtful first hello" /><label class="icon-button" aria-label="Share a mock image">Photo<input id="mockImageInput" type="file" accept="image/*" hidden /></label><button type="button" class="secondary-btn" data-action="video-call">Video call</button><button type="button" class="primary-btn" data-action="send-chat-message">Send</button></div><p class="prototype-note">Text and photo sharing are demo-only. Video calling is coming soon.</p>` : ''}
        ${match || introduction ? `<div class="chat-safety-actions"><button type="button" class="ghost-btn" data-action="report-profile" data-profile-id="${match?.userId || introduction?.profileId || ''}">Report member</button><button type="button" class="ghost-btn" data-action="block-profile" data-profile-id="${match?.userId || introduction?.profileId || ''}">Block member</button></div>` : ''}
      </section></section>
    `, 'messages');
  }

  function renderMicroDates() {
    const dates = window.KodeCupidMockApi.getState('kodeCupidMicroDates', []);
    return renderAuth(`
      <section class="content-card"><div class="section-header-row"><div><p class="eyebrow">Micro-dates</p><h2>A small plan can be a good start.</h2></div><button type="button" class="primary-btn" data-action="toggle-date-form">Plan a micro-date</button></div><form id="microDateForm" class="date-form" hidden><label><span>Date</span><input name="date" type="date" required /></label><label><span>Time</span><input name="time" type="time" required /></label><label><span>Public place</span><input name="location" placeholder="A cafe or public space" required /></label><button type="submit" class="primary-btn">Send invitation</button></form>${dates.length ? `<div class="date-grid">${dates.map((item) => `<article class="mini-card-item"><strong>${escapeHtml(item.date)}</strong><p>${escapeHtml(item.time)} · ${escapeHtml(item.location)}</p><span class="pill">${escapeHtml(item.status)}</span></article>`).join('')}</div>` : '<div class="empty-state"><p>No micro-dates yet. Invite a match to a short, public meetup when it feels right.</p></div>'}<p class="prototype-note">Suggestions are mock-only. No calendar or location service is connected.</p></section>
    `, 'micro-dates');
  }

  function renderNotifications() {
    const notifications = window.KodeCupidMockApi.getState('kodeCupidNotifications', [{id:'n1',type:'new_match',title:'New match',message:'Maya Patel liked your profile back.',timestamp:new Date().toISOString(),read:false},{id:'n2',type:'micro_date',title:'Micro-date invitation',message:'A quiet coffee invite is ready to accept.',timestamp:new Date().toISOString(),read:false}]);
    return renderAuth(`
      <section class="content-card"><div class="section-header-row"><div><p class="eyebrow">Notifications</p><h2>Recent activity</h2></div><button type="button" class="secondary-btn" data-action="mark-notifications-read">Mark all read</button></div>${notifications.length ? `<div class="list-panel">${notifications.map((item) => `<article class="notification-row ${!item.read ? 'unread' : ''}"><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.message)}</p><small>${new Date(item.timestamp).toLocaleString()}</small></div><span class="status-label">${item.read ? 'Read' : 'Unread'}</span></article>`).join('')}</div>` : '<div class="empty-state">You are all caught up.</div>'}</section>
    `, 'notifications');
  }

  function renderPricing() {
    return renderAuth(`
      <section class="content-card"><p class="eyebrow">Plans</p><h2>Choose what fits your pace.</h2><div class="pricing-grid">${window.KodeCupidConstants.plans.map((plan) => `<article class="price-card ${plan.name === getCurrentUser().subscriptionPlan ? 'featured' : ''}"><h3>${escapeHtml(plan.name)}</h3><div class="price-row"><strong>${escapeHtml(plan.price)}</strong></div><ul>${plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul><button type="button" class="${plan.name === getCurrentUser().subscriptionPlan ? 'secondary-btn' : 'primary-btn'} full-width" data-action="select-plan" data-plan="${escapeHtml(plan.name)}">${plan.name === getCurrentUser().subscriptionPlan ? 'Current plan' : 'Select plan'}</button></article>`).join('')}</div><p class="prototype-note">Prototype only: selecting a plan updates local demo state; no payment is processed.</p></section>
    `, 'pricing');
  }

  function renderSettings() {
    const user = getCurrentUser();
    const privacy = user.privacySettings || {};
    const reports = window.KodeCupidMockApi.getState('kodeCupidReports', []);
    const blocked = window.KodeCupidMockApi.getState('kodeCupidBlockedProfiles', []);
    return renderAuth(`
      <section class="content-card settings-card">
        <p class="eyebrow">Your account</p><h2>Settings and privacy</h2>
        <div class="settings-summary"><div class="mini-stat"><span>Profile completeness</span><strong>${profileCompletion(user)}%</strong></div><div class="mini-stat"><span>Plan</span><strong>${escapeHtml(user.subscriptionPlan || 'Free')}</strong></div><button type="button" class="secondary-btn" data-route="/profile">Preview profile</button></div>
        <form id="settingsForm" class="stack-form">
          <fieldset><legend>Edit profile</legend><div class="two-col"><label><span>Display name</span><input name="displayName" value="${escapeHtml(user.displayName)}" /></label><label><span>City</span><input name="location" value="${escapeHtml(user.location)}" /></label></div><div class="two-col"><label><span>Profession</span><select name="professionCategory">${window.KodeCupidConstants.professionCategories.map((item) => `<option ${user.professionCategory === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label><label><span>Job title</span><input name="jobTitle" value="${escapeHtml(user.jobTitle)}" /></label></div><label><span>Bio</span><textarea name="bio">${escapeHtml(user.bio)}</textarea></label><label><span>Photos (local demo only)</span><input type="file" name="photos" accept="image/*" multiple /></label></fieldset>
          <fieldset><legend>Profile visibility</legend><div class="visibility-grid"><label><input type="checkbox" name="showAge" ${privacy.age ? 'checked' : ''} /> Age</label><label><input type="checkbox" name="showLocation" ${privacy.location ? 'checked' : ''} /> City</label><label><input type="checkbox" name="showHeight" ${privacy.height ? 'checked' : ''} /> Height</label><label><input type="checkbox" name="showReligion" ${privacy.religion ? 'checked' : ''} /> Religion</label><label><input type="checkbox" name="showEthnicity" ${privacy.ethnicity ? 'checked' : ''} /> Ethnicity</label><label><input type="checkbox" name="showPolitics" ${privacy.politicalViews ? 'checked' : ''} /> Political views</label></div><label class="check-row"><input type="checkbox" name="workplacePrivacy" ${user.workplacePrivacy?.enabled ? 'checked' : ''} /> Hide my profile near my workplace</label><label><span>Workplace privacy radius</span><input type="range" name="privacyRadius" min="1" max="10" value="${escapeHtml(user.workplacePrivacy?.radiusMiles || 1)}" /></label><label><span>Workplace name (private; used only for demo controls)</span><input name="workplaceName" value="${escapeHtml(user.workplaceName)}" /></label></fieldset>
          <fieldset><legend>Preferences and notifications</legend><div class="two-col"><label><span>Relationship goal</span><select name="relationshipGoals">${window.KodeCupidConstants.relationshipGoals.map((item) => `<option ${user.relationshipGoals?.includes(item) ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label><label><span>Work schedule</span><select name="workSchedule">${window.KodeCupidConstants.schedules.map((item) => `<option ${user.workSchedule === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('')}</select></label></div><label class="check-row"><input type="checkbox" name="pauseQuietHours" ${user.quietHours?.enabled ? 'checked' : ''} /> Pause notifications during quiet hours</label><div class="two-col"><label><span>Quiet hours begin</span><input type="time" name="quietStart" value="${escapeHtml(user.quietHours?.start || '21:30')}" /></label><label><span>Quiet hours end</span><input type="time" name="quietEnd" value="${escapeHtml(user.quietHours?.end || '07:00')}" /></label></div><label class="check-row"><input type="checkbox" name="disableVideoChat" ${user.disableVideoChat ? 'checked' : ''} /> Disable video chat invitations</label></fieldset>
          <fieldset><legend>Plan and payments</legend><p>Current plan: <strong>${escapeHtml(user.subscriptionPlan || 'Free')}</strong></p><p class="hint">Payment methods are mocked. No card details are stored.</p><button type="button" class="secondary-btn" data-route="/pricing">Manage plan</button><button type="button" class="ghost-btn" data-action="manage-payment">Payment methods</button></fieldset>
          <button type="submit" class="primary-btn">Save settings</button>
        </form>
        <div class="settings-lists"><section><h3>Blocked profiles (${blocked.length})</h3>${blocked.length ? blocked.map((item) => `<p>${escapeHtml(item.name)} <button type="button" class="inline-link" data-action="unblock-profile" data-profile-id="${item.id}">Unblock</button></p>`).join('') : '<p class="hint">You have not blocked anyone.</p>'}</section><section><h3>Report history (${reports.length})</h3>${reports.length ? reports.map((item) => `<p>${escapeHtml(item.name)} · ${escapeHtml(item.status || 'Submitted for review')}</p>`).join('') : '<p class="hint">No reports submitted.</p>'}</section></div>
        <div class="settings-footer"><button type="button" class="ghost-btn" data-route="/account-closure">Request account deletion</button><button type="button" class="ghost-btn" data-action="logout">Log out</button></div>
      </section>
    `, '/settings');
  }

  function renderAdmin() {
    const reports = window.KodeCupidMockApi.getState('kodeCupidReports', []);
    const verifications = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', []);
    const deletions = window.KodeCupidMockApi.getState('kodeCupidDeletionRequests', []);
    const matches = window.KodeCupidMockApi.getState('kodeCupidMatches', []);
    return renderAuth(`
      <section class="content-card admin-panel"><div class="section-header-row"><div><p class="eyebrow">Operations</p><h2>Community overview</h2><p class="hint">Demo metrics and member-submitted queues.</p></div><span class="pill">Staff demo</span></div><div class="stats-grid"><div class="mini-stat"><span>Total users</span><strong>${window.KodeCupidProfiles.length + 1}</strong></div><div class="mini-stat"><span>Pending verifications</span><strong>${verifications.filter((item) => item.status === 'Pending').length + 2}</strong></div><div class="mini-stat"><span>Open reports</span><strong>${reports.filter((item) => !['Resolved', 'Dismissed'].includes(item.status)).length}</strong></div><div class="mini-stat"><span>Active matches</span><strong>${matches.filter((item) => item.status === 'active' && item.expiresAt > Date.now()).length}</strong></div><div class="mini-stat"><span>Active subscriptions</span><strong>${window.KodeCupidProfiles.filter((profile) => profile.subscriptionPlan !== 'Free').length}</strong></div><div class="mini-stat"><span>Deletion requests</span><strong>${deletions.filter((item) => item.status !== 'Completed').length}</strong></div></div><div class="admin-nav-grid"><button type="button" class="secondary-btn" data-route="/admin/verifications">Verification queue</button><button type="button" class="secondary-btn" data-route="/admin/reports">Reports & moderation</button><button type="button" class="secondary-btn" data-route="/admin/users">Member management</button><button type="button" class="secondary-btn" data-route="/admin/deletion-requests">Deletion requests</button><button type="button" class="secondary-btn" data-route="/admin/subscriptions">Subscriptions</button><button type="button" class="secondary-btn" data-route="/admin/content">Content</button></div><section class="activity-panel"><h3>Recent activity</h3><p>${reports.length ? `${reports.length} member report(s) are in the queue.` : 'No new member reports.'}</p><p>${verifications.length + 2} verification submissions need review.</p></section></section>
    `, 'admin', true);
  }

  function renderAdminVerifications() {
    const queue = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', [
      { id: 'verify-elena', name: 'Elena Garcia', method: 'Manual badge upload', status: 'Pending', evidence: 'Sample credential preview' },
      { id: 'verify-jordan', name: 'Jordan White', method: 'NPI mock lookup', status: 'Pending', evidence: 'NPI result requires follow-up' }
    ]);
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Verification queue</h2><div class="list-panel">${queue.map((item) => `<article class="admin-row"><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.method)} · ${escapeHtml(item.status)}</p><details><summary>Review submission</summary><p>${escapeHtml(item.evidence || 'No document stored; uploaded files are local demo placeholders.')}</p><p>Status history: Submitted → ${escapeHtml(item.status)}</p></details></div><div class="inline-actions"><button class="secondary-btn" type="button" data-action="approve-verification" data-id="${item.id}">Approve</button><button class="ghost-btn" type="button" data-action="request-verification-info" data-id="${item.id}">Request info</button><button class="ghost-btn" type="button" data-action="deny-verification" data-id="${item.id}">Deny</button></div></article>`).join('')}</div></section>`, 'admin', true);
  }
  function renderAdminReports() {
    const reports = window.KodeCupidMockApi.getState('kodeCupidReports', []);
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Reports & moderation</h2>${reports.length ? `<div class="list-panel">${reports.map((item) => `<article class="admin-row"><div><strong>${escapeHtml(item.name || 'Reported member')}</strong><p>Category: ${escapeHtml(item.category || item.reason)} · Status: ${escapeHtml(item.status || 'New')}</p><p>Reporter: ${escapeHtml(item.reporter || 'Member')} · Evidence: ${escapeHtml(item.evidence || 'Member-submitted report')}</p></div><div class="inline-actions"><button class="secondary-btn" type="button" data-action="warn-user" data-id="${item.id}">Warn</button><button class="secondary-btn" type="button" data-action="suspend-user" data-id="${item.profileId || item.id}">Suspend</button><button class="ghost-btn" type="button" data-action="remove-report-content" data-id="${item.id}">Remove content</button><button class="ghost-btn" type="button" data-action="escalate-report" data-id="${item.id}">Escalate</button><button class="ghost-btn" type="button" data-action="dismiss-report" data-id="${item.id}">Dismiss</button><button class="ghost-btn" type="button" data-action="resolve-report" data-id="${item.id}">Resolve</button></div></article>`).join('')}</div>` : '<div class="empty-state">No member reports. New reports will appear here.</div>'}</section>`, 'admin', true);
  }
  function renderAdminUsers() {
    const suspended = new Set(window.KodeCupidMockApi.getState('kodeCupidSuspendedUsers', []).map((item) => item.id));
    const removed = new Set(window.KodeCupidMockApi.getState('kodeCupidRemovedUsers', []).map((item) => item.id));
    const notes = window.KodeCupidMockApi.getState('kodeCupidAdminNotes', {});
    const profiles = window.KodeCupidMockApi.getProfiles().filter((profile) => !removed.has(profile.id));
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Member management</h2><label><span>Search members</span><input type="search" id="adminUserSearch" placeholder="Name, profession, or city" /></label><div class="list-panel">${profiles.map((profile) => `<article class="admin-row admin-user-row" data-search="${escapeHtml(`${profile.displayName} ${profile.professionCategory} ${profile.jobTitle} ${profile.location}`.toLowerCase())}"><div><strong>${escapeHtml(profile.displayName)}</strong><p>${escapeHtml(profile.verificationStatus)} · ${escapeHtml(profile.jobTitle)} · ${suspended.has(profile.id) ? 'Suspended' : 'Active'}</p><details><summary>View profile</summary><p>${escapeHtml(profile.bio)}</p><label><span>Internal note</span><input type="text" value="${escapeHtml(notes[profile.id] || '')}" placeholder="Add a private staff note" /></label><button type="button" class="secondary-btn" data-action="save-admin-note" data-id="${profile.id}">Save note</button></details></div><div class="inline-actions"><button class="ghost-btn" type="button" data-action="suspend-user" data-id="${profile.id}">${suspended.has(profile.id) ? 'Restore' : 'Suspend'}</button><button class="ghost-btn" type="button" data-action="remove-user" data-id="${profile.id}">Remove</button></div></article>`).join('')}</div></section>`, 'admin', true);
  }
  function renderAdminDeletionRequests() {
    const requests = window.KodeCupidMockApi.getState('kodeCupidDeletionRequests', [{ id: 'delete-demo', email: 'member@example.com', reason: 'Taking a break from dating apps.', status: 'New', note: '' }]);
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Deletion requests</h2><div class="list-panel">${requests.map((item) => `<article class="admin-row"><div><strong>${escapeHtml(item.email)}</strong><p>${escapeHtml(item.reason)} · ${escapeHtml(item.status)}</p><label><span>Internal note</span><input data-deletion-note="${item.id}" value="${escapeHtml(item.note || '')}" placeholder="Add staff-only note" /></label></div><div class="inline-actions"><button class="secondary-btn" type="button" data-action="process-deletion" data-id="${item.id}">Mark processing</button><button class="ghost-btn" type="button" data-action="complete-deletion" data-id="${item.id}">Mark complete</button></div></article>`).join('')}</div></section>`, 'admin', true);
  }
  function renderAdminSubscriptions() {
    const subscribers = window.KodeCupidProfiles.filter((profile) => profile.subscriptionPlan !== 'Free');
    const changes = window.KodeCupidMockApi.getState('kodeCupidSubscriptionActions', {});
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Subscriptions</h2><p class="hint">Mock subscribers. Refund and cancellation controls do not contact payment providers.</p><div class="list-panel">${subscribers.map((profile, index) => `<article class="admin-row"><div><strong>${escapeHtml(profile.displayName)}</strong><p>${escapeHtml(profile.subscriptionPlan)} · ${escapeHtml(changes[profile.id]?.status || 'Active')} · Provider: ${index % 2 ? 'PayPal' : 'Stripe'}</p>${changes[profile.id]?.action ? `<p>${escapeHtml(changes[profile.id].action)}</p>` : ''}</div><div class="inline-actions"><button class="secondary-btn" type="button" data-action="mock-refund" data-id="${profile.id}">Mock refund</button><button class="ghost-btn" type="button" data-action="cancel-subscription" data-id="${profile.id}">Cancel</button></div></article>`).join('')}</div></section>`, 'admin', true);
  }
  function renderAdminContent() {
    const content = window.KodeCupidMockApi.getState('kodeCupidAdminContent', {});
    const sections = [['terms', 'Terms'], ['privacy', 'Privacy Policy'], ['faqs', 'FAQs'], ['pledge', 'Community Pledge'], ['safety', 'Safety Tips']];
    return renderAuth(`<section class="content-card"><p class="eyebrow">Operations</p><h2>Content management</h2><form id="adminContentForm" class="stack-form">${sections.map(([key, label]) => `<label><span>${label}</span><textarea name="${key}" rows="3">${escapeHtml(content[key] || `Draft placeholder for ${label.toLowerCase()} review.`)}</textarea></label>`).join('')}<button type="submit" class="primary-btn">Save drafts</button></form></section>`, 'admin', true);
  }

  function renderRoute() {
    const route = getRoute();
    const path = getPath();
    const publicRoutes = ['/', '/signup', '/login', '/terms', '/privacy', '/faqs', '/community-pledge', '/safety-tips', '/account-closure', '/how-it-works', '/contact'];
    const adminRoutes = ['/admin', '/admin/verifications', '/admin/reports', '/admin/users', '/admin/deletion-requests', '/admin/subscriptions', '/admin/content'];
    if (adminRoutes.includes(path) && !window.KodeCupidMockApi.getState('kodeCupidAdminSession', false)) {
      navigate('/admin/login');
      return;
    }
    if (!adminRoutes.includes(path) && path !== '/admin/login' && !publicRoutes.includes(path) && path !== '/onboarding' && !window.KodeCupidMockApi.getState('kodeCupidOnboardingComplete', false)) {
      navigate('/onboarding');
      return;
    }
    if (path === '/') appRoot.innerHTML = renderLanding();
    else if (path === '/signup') appRoot.innerHTML = renderSignup();
    else if (path === '/login') appRoot.innerHTML = renderLogin();
    else if (path === '/admin/login') appRoot.innerHTML = renderPublic(`<section class="auth-panel"><article class="auth-card large-card"><p class="eyebrow">Staff access</p><h2>KodeCupid operations</h2><p>Enter the local staff demo. This is a prototype gate, not production authentication.</p><button type="button" class="primary-btn full-width" data-action="admin-login">Enter staff demo</button><button type="button" class="ghost-btn full-width" data-route="/">Back to KodeCupid</button></article></section>`);
    else if (path === '/terms') appRoot.innerHTML = renderStatic('Terms of Service', '<p>These terms are a placeholder prototype only and not final legal language.</p><ul><li>Members agree to respectful, verified communication.</li><li>Profiles are subject to community safety review.</li><li>All payments and verifications are mock-only in this prototype.</li></ul>');
    else if (path === '/privacy') appRoot.innerHTML = renderStatic('Privacy Policy', '<p>Workplace radius controls, profile visibility, and quiet hours are simulated locally. Any production use requires a privacy and data-retention review.</p>');
    else if (path === '/faqs') appRoot.innerHTML = renderStatic('FAQs', '<div class="faq-item"><h3>Who is KodeCupid for?</h3><p>Verified professionals in healthcare, education, university, and science-related communities.</p></div><div class="faq-item"><h3>How does verification work?</h3><p>Verification in this demo is simulated and does not contact licensing databases.</p></div>');
    else if (path === '/community-pledge') appRoot.innerHTML = renderStatic('Community Pledge', '<p>We believe in respectful connection, safety, and professionalism.</p><ul><li>Be kind and honest.</li><li>Protect workplace privacy.</li><li>Report harmful or fake behavior.</li></ul>');
    else if (path === '/safety-tips') appRoot.innerHTML = renderStatic('Safety Tips', '<p>Meet in public spaces for first dates, keep personal details private until you feel comfortable, and use reporting or blocking if something feels wrong.</p>');
    else if (path === '/account-closure') appRoot.innerHTML = renderStatic('Account closure and data deletion', '<form id="deletionRequestForm" class="stack-form"><label><span>Email or phone</span><input name="email" type="email" value="hello@example.com" required /></label><label><span>Reason for closure</span><textarea name="reason" rows="4">I am taking a break from dating apps.</textarea></label><label class="check-row"><input type="checkbox" name="confirm" required /> Confirm my request.</label><button type="submit" class="primary-btn full-width">Submit deletion request</button></form>');
    else if (path === '/how-it-works') appRoot.innerHTML = renderStatic('How KodeCupid works', '<ol><li>Create a profile with the details you choose to share.</li><li>Discover people with compatible goals and schedules.</li><li>Start a conversation and plan a short, low-pressure date when you are ready.</li></ol>');
    else if (path === '/contact') appRoot.innerHTML = renderStatic('Contact', '<p>For this prototype, contact details are not connected. A production launch should add a monitored member-support channel and response policy.</p>');
    else if (path === '/onboarding') appRoot.innerHTML = renderOnboarding();
    else if (path === '/discover') appRoot.innerHTML = renderDiscover();
    else if (path === '/profile') appRoot.innerHTML = renderProfile();
    else if (path === '/matches') appRoot.innerHTML = renderMatches();
    else if (path === '/messages') appRoot.innerHTML = renderMessages();
    else if (path === '/micro-dates') appRoot.innerHTML = renderMicroDates();
    else if (path === '/notifications') appRoot.innerHTML = renderNotifications();
    else if (path === '/settings') appRoot.innerHTML = renderSettings();
    else if (path === '/pricing') appRoot.innerHTML = renderPricing();
    else if (path === '/admin') appRoot.innerHTML = renderAdmin();
    else if (path === '/admin/verifications') appRoot.innerHTML = renderAdminVerifications();
    else if (path === '/admin/reports') appRoot.innerHTML = renderAdminReports();
    else if (path === '/admin/users') appRoot.innerHTML = renderAdminUsers();
    else if (path === '/admin/deletion-requests') appRoot.innerHTML = renderAdminDeletionRequests();
    else if (path === '/admin/subscriptions') appRoot.innerHTML = renderAdminSubscriptions();
    else if (path === '/admin/content') appRoot.innerHTML = renderAdminContent();
    else appRoot.innerHTML = renderPublic('<section class="content-card"><h2>Page not found</h2><p>The route you requested does not exist in this prototype.</p></section>');
    if (path === '/onboarding') initializeOnboarding();
    if (path === '/discover') {
      const drawer = document.getElementById('discoveryFilters');
      if (drawer) drawer.hidden = !window.KodeCupidMockApi.getState('kodeCupidFiltersOpen', false);
      const button = document.querySelector('[data-action="toggle-filters"]');
      if (button) button.setAttribute('aria-expanded', String(Boolean(drawer && !drawer.hidden)));
    }
  }

  function serializeForm(form) {
    const data = {};
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) continue;
      data[key] = value;
    }
    form.querySelectorAll('input[type="checkbox"][name]').forEach((input) => {
      data[input.name] = input.checked;
    });
    return data;
  }

  function updateReport(id, status) {
    const reports = window.KodeCupidMockApi.getState('kodeCupidReports', []);
    const report = reports.find((item) => item.id === id);
    if (report) {
      report.status = status;
      report.updatedAt = new Date().toISOString();
      window.KodeCupidMockApi.setState('kodeCupidReports', reports);
    }
  }

  document.addEventListener('input', (event) => {
    if (event.target.id === 'adminUserSearch') {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll('.admin-user-row').forEach((row) => {
        row.hidden = !row.dataset.search.includes(query);
      });
    }
    if (event.target.id === 'chatComposer') {
      const indicator = document.querySelector('.typing-indicator');
      if (indicator) {
        indicator.hidden = !event.target.value.trim();
        clearTimeout(indicator.hideTimer);
        indicator.hideTimer = setTimeout(() => { indicator.hidden = true; }, 1100);
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.target.id === 'chatComposer' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      document.querySelector('[data-action="send-chat-message"]')?.click();
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.id === 'mockImageInput' && event.target.files?.[0]) {
      const matchName = getQuery().get('with') || 'Maya Patel';
      const threads = window.KodeCupidMockApi.getState('kodeCupidChatThreads', {});
      threads[matchName] = threads[matchName] || [];
      threads[matchName].push({ id: `img-${Date.now()}`, from: 'You', text: '', image: event.target.files[0].name, time: 'just now', mine: true, read: false });
      window.KodeCupidMockApi.setState('kodeCupidChatThreads', threads);
      renderRoute();
      showToast('Mock image shared. The file stayed on this device.', 'success');
    }
  });

  function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const birth = new Date(`${dateOfBirth}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1;
    return age;
  }

  function initializeOnboarding() {
    const form = document.getElementById('onboardingForm');
    if (!form) return;
    const fieldsets = [...form.querySelectorAll('fieldset[data-step]')];
    let step = Math.min(fieldsets.length, Math.max(1, Number(window.KodeCupidMockApi.getState('kodeCupidOnboardingStep', 1)) || 1));
    const saved = window.KodeCupidMockApi.getState('kodeCupidOnboardingDraft', {});
    for (const [name, value] of Object.entries(saved)) {
      const control = form.elements.namedItem(name);
      if (!control || control instanceof RadioNodeList) continue;
      if (control.type === 'checkbox') control.checked = Boolean(value);
      else if (control.type !== 'file') control.value = String(value);
    }

    const updateAge = () => {
      const age = calculateAge(form.elements.namedItem('dateOfBirth').value);
      const feedback = document.getElementById('ageFeedback');
      if (feedback) feedback.textContent = age === null ? 'Enter your date of birth.' : age < 18 ? 'You must be at least 18 to join.' : `You are ${age}.`;
      return age;
    };

    const persist = () => {
      window.KodeCupidMockApi.setState('kodeCupidOnboardingDraft', serializeForm(form));
      const preview = document.getElementById('onboardingPreview');
      if (preview) {
        const values = serializeForm(form);
        const profile = getCurrentUser();
        preview.innerHTML = `<p class="eyebrow">Your preview</p><h3>${escapeHtml(values.firstName || profile.displayName)}${updateAge() >= 18 ? `, ${updateAge()}` : ''}</h3><p>${escapeHtml(values.professionCategory || profile.professionCategory)} · ${escapeHtml(values.jobTitle || profile.jobTitle)}</p><p>${escapeHtml(values.bio || profile.bio)}</p>`;
      }
    };

    const showStep = () => {
      fieldsets.forEach((fieldset) => { fieldset.hidden = Number(fieldset.dataset.step) !== step; });
      const progress = document.getElementById('onboardingProgress');
      const label = document.getElementById('onboardingStepLabel');
      const back = document.getElementById('onboardingBack');
      const next = document.getElementById('onboardingNext');
      const finish = document.getElementById('onboardingFinish');
      progress.style.width = `${step / fieldsets.length * 100}%`;
      progress.parentElement.setAttribute('aria-valuenow', String(step));
      label.textContent = `Step ${step} of ${fieldsets.length}`;
      back.disabled = step === 1;
      next.hidden = step === fieldsets.length;
      finish.hidden = step !== fieldsets.length;
      if (step === 3) updateAge();
    };

    const validateStep = () => {
      if (step === 1 && (!form.elements.namedItem('olderThan18').checked || !form.elements.namedItem('termsAccepted').checked)) {
        showToast('Confirm that you are 18+ and accept the community terms to continue.', 'error');
        return false;
      }
      if (step === 2 && (!form.elements.namedItem('phone').value.trim() || !/^\d{6}$/.test(form.elements.namedItem('otp').value.trim()))) {
        showToast('Enter a phone number and a six-digit demo code.', 'error');
        return false;
      }
      if (step === 3) {
        const age = updateAge();
        if (age === null || age < 18) {
          showToast(age !== null && age < 18 ? 'You must be at least 18 to create an account.' : 'Enter a valid date of birth.', 'error');
          return false;
        }
        if (!form.elements.namedItem('firstName').value.trim() || !form.elements.namedItem('city').value.trim()) {
          showToast('Add a display name and city before continuing.', 'error');
          return false;
        }
      }
      if (step === 4 && (!form.elements.namedItem('professionCategory').value || !form.elements.namedItem('jobTitle').value.trim())) {
        showToast('Add your profession category and job title.', 'error');
        return false;
      }
      return true;
    };

    form.addEventListener('input', persist);
    form.addEventListener('change', persist);
    form.elements.namedItem('dateOfBirth').addEventListener('change', updateAge);
    document.getElementById('onboardingBack').addEventListener('click', () => {
      persist();
      step = Math.max(1, step - 1);
      window.KodeCupidMockApi.setState('kodeCupidOnboardingStep', step);
      showStep();
    });
    document.getElementById('onboardingNext').addEventListener('click', () => {
      if (!validateStep()) return;
      persist();
      step = Math.min(fieldsets.length, step + 1);
      window.KodeCupidMockApi.setState('kodeCupidOnboardingStep', step);
      showStep();
    });
    showStep();
    persist();
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
      if (!profile) return;
      const score = window.KodeCupidMatching.matchScore(getCurrentUser(), profile);
      setStateList('kodeCupidLikes', { id: profile.id, name: profile.displayName, createdAt: new Date().toISOString() }, 'id');
      const currentUser = getCurrentUser();
      const matches = window.KodeCupidMockApi.getState('kodeCupidMatches', []);
      const monday = new Date();
      monday.setHours(0, 0, 0, 0);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      const matchesThisWeek = matches.filter((item) => new Date(item.matchDate || 0) >= monday && item.status === 'active').length;
      if (score >= 70 && currentUser.subscriptionPlan === 'Free' && matchesThisWeek >= 1) {
        window.KodeCupidMockApi.setState('kodeCupidLikes', window.KodeCupidMockApi.getState('kodeCupidLikes', []));
        showToast('Your Free plan includes one match each week. Upgrade to keep matching.', 'info');
        renderRoute();
        return;
      }
      if (score >= 70) {
        setStateList('kodeCupidMatches', { id: `m-${profile.id}`, userId: profile.id, name: profile.displayName, preview: 'You both showed interest. Say hello when you are ready.', unread: 1, matchDate: new Date().toISOString(), status: 'active', expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 }, 'id');
        showMatchModal(profile);
      } else {
        showToast('Profile liked.', 'success');
      }
      renderRoute();
      return;
    }

    if (action === 'pass-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      if (!profile) return;
      setStateList('kodeCupidPasses', { id: profile.id, name: profile.displayName, createdAt: new Date().toISOString() }, 'id');
      showToast('Profile passed.', 'success');
      renderRoute();
      return;
    }

    if (action === 'open-profile') {
      navigate(`/profile?id=${profileId}`);
      return;
    }

    if (action === 'message-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      if (!profile || !window.KodeCupidMockApi.getState('kodeCupidMatches', []).some((match) => match.userId === profile.id)) {
        showToast('Messaging opens after a mutual match. You can send one mock-credit intro.', 'info');
        return;
      }
      navigate(`/messages?with=${encodeURIComponent(profile.displayName)}`);
      return;
    }

    if (action === 'pre-match-message') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      if (!profile) return;
      const credits = Number(window.KodeCupidMockApi.getState('kodeCupidPreMatchCredits', 1)) || 0;
      if (!credits) {
        showToast('You are out of mock intro credits. Choose a plan to continue.', 'info');
        navigate('/pricing');
        return;
      }
      showConfirmation({ title: `Send one intro to ${profile.displayName}?`, message: 'This prototype uses one local demo credit. No real payment is made. The intro cannot be edited after sending.', confirmLabel: 'Use 1 mock credit', onConfirm: () => {
        window.KodeCupidMockApi.setState('kodeCupidPreMatchCredits', credits - 1);
        setStateList('kodeCupidPreMatchMessages', { id: `intro-${profile.id}`, profileId: profile.id, name: profile.displayName, sentAt: new Date().toISOString() }, 'id');
        const threads = window.KodeCupidMockApi.getState('kodeCupidChatThreads', {});
        threads[profile.displayName] = [{ id: `intro-message-${Date.now()}`, from: 'You', text: 'Hi! Your profile caught my attention. I would be glad to get to know you.', time: 'just now', mine: true, read: false }];
        window.KodeCupidMockApi.setState('kodeCupidChatThreads', threads);
        showToast('One-time introduction sent.', 'success');
        navigate(`/messages?with=${encodeURIComponent(profile.displayName)}`);
      } });
      return;
    }

    if (action === 'report-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId) || getCurrentUser();
      showConfirmation({ title: 'Report this profile?', message: 'A report will be added to the staff review queue. This does not notify the reported member in this demo.', confirmLabel: 'Submit report', onConfirm: () => {
        setStateList('kodeCupidReports', { id: `report-${profile.id}-${Date.now()}`, profileId: profile.id, name: profile.displayName, reason: 'Member safety concern', category: 'Other', reporter: getCurrentUser().displayName, evidence: 'Submitted from profile detail', status: 'New', createdAt: new Date().toISOString() }, 'id');
        showToast('Report submitted for review.', 'success');
      } });
      return;
    }

    if (action === 'block-profile') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId) || getCurrentUser();
      showConfirmation({ title: `Block ${profile.displayName}?`, message: 'They will no longer appear in discovery or your matches. You can unblock them later in Settings.', confirmLabel: 'Block member', onConfirm: () => {
        setStateList('kodeCupidBlockedProfiles', { id: profile.id, name: profile.displayName, blockedAt: new Date().toISOString() }, 'id');
        window.KodeCupidMockApi.setState('kodeCupidMatches', window.KodeCupidMockApi.getState('kodeCupidMatches', []).filter((item) => item.userId !== profile.id));
        showToast('User blocked.', 'success');
        if (getPath() === '/discover' || getPath() === '/matches') renderRoute();
      } });
      return;
    }

    if (action === 'send-chat-message') {
      const composer = document.getElementById('chatComposer');
      const messageText = (composer ? composer.value : '').trim();
      if (!messageText) {
        showToast('Type a message before sending.', 'info');
        return;
      }

      const matchName = getQuery().get('with') || 'Maya Patel';
      const thread = window.KodeCupidMockApi.getState('kodeCupidChatThreads', {});
      const targetThread = thread[matchName] || [{ from: matchName, text: 'Would love to grab coffee after our shifts this week.', time: '2m ago', mine: false }, { from: 'You', text: 'That works. I am free Thursday after 6 PM.', time: 'just now', mine: true }];
      targetThread.push({ id: `msg-${Date.now()}`, from: 'You', text: messageText, time: 'just now', mine: true, read: false });
      thread[matchName] = targetThread;
      window.KodeCupidMockApi.setState('kodeCupidChatThreads', thread);
      const matches = window.KodeCupidMockApi.getState('kodeCupidMatches', []);
      const matchIndex = matches.findIndex((item) => item.name === matchName);
      if (matchIndex >= 0) {
        matches[matchIndex].preview = messageText;
        matches[matchIndex].unread = 0;
        window.KodeCupidMockApi.setState('kodeCupidMatches', matches);
      }
      showToast(`Message sent to ${matchName}.`, 'success');
      renderRoute();
      return;
    }

    if (action === 'send-code') {
      showToast('Verification code sent. Demo code: 123456', 'success');
      return;
    }

    if (action === 'verify-profile') {
      window.KodeCupidMockApi.setState('kodeCupidVerificationStatus', 'Pending');
      const skip = document.querySelector('[name="skipVerification"]');
      if (skip) skip.checked = false;
      const queue = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', []);
      const user = getCurrentUser();
      if (!queue.some((item) => item.id === `verify-${user.id}`)) {
        queue.push({ id: `verify-${user.id}`, name: user.displayName, method: 'NPI mock lookup', status: 'Pending', evidence: 'Demo submission; no credential database was contacted.', history: ['Submitted'] });
      }
      window.KodeCupidMockApi.setState('kodeCupidVerificationQueue', queue);
      const status = document.getElementById('verificationStatus');
      if (status) status.textContent = 'Demo submission received. Status: Pending review. No external credential lookup occurred.';
      showToast('Verification request submitted for review.', 'success');
      return;
    }

    if (action === 'approve-verification') {
      const queue = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', [
        { id: 'verify-elena', name: 'Elena Garcia', method: 'Manual badge upload', status: 'Pending', evidence: 'Sample credential preview' },
        { id: 'verify-jordan', name: 'Jordan White', method: 'NPI mock lookup', status: 'Pending', evidence: 'NPI result requires follow-up' }
      ]);
      const record = queue.find((item) => item.id === actionTarget.dataset.id);
      if (record) { record.status = 'Approved'; record.history = [...(record.history || ['Submitted']), 'Approved']; }
      window.KodeCupidMockApi.setState('kodeCupidVerificationQueue', queue);
      showToast('Verification approved.', 'success');
      renderRoute();
      return;
    }

    if (action === 'request-verification-info') {
      const queue = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', [
        { id: 'verify-elena', name: 'Elena Garcia', method: 'Manual badge upload', status: 'Pending', evidence: 'Sample credential preview' },
        { id: 'verify-jordan', name: 'Jordan White', method: 'NPI mock lookup', status: 'Pending', evidence: 'NPI result requires follow-up' }
      ]);
      const record = queue.find((item) => item.id === actionTarget.dataset.id);
      if (record) { record.status = 'More information requested'; record.history = [...(record.history || ['Submitted']), 'More information requested']; }
      window.KodeCupidMockApi.setState('kodeCupidVerificationQueue', queue);
      showToast('Request for more information sent.', 'success');
      renderRoute();
      return;
    }

    if (action === 'deny-verification') {
      const queue = window.KodeCupidMockApi.getState('kodeCupidVerificationQueue', [
        { id: 'verify-elena', name: 'Elena Garcia', method: 'Manual badge upload', status: 'Pending', evidence: 'Sample credential preview' },
        { id: 'verify-jordan', name: 'Jordan White', method: 'NPI mock lookup', status: 'Pending', evidence: 'NPI result requires follow-up' }
      ]);
      const record = queue.find((item) => item.id === actionTarget.dataset.id);
      if (record) { record.status = 'Denied'; record.history = [...(record.history || ['Submitted']), 'Denied']; }
      window.KodeCupidMockApi.setState('kodeCupidVerificationQueue', queue);
      showToast('Verification denied.', 'info');
      renderRoute();
      return;
    }

    if (action === 'warn-user') {
      updateReport(actionTarget.dataset.id, 'In review');
      showToast('Warning recorded for staff review.', 'success');
      renderRoute();
      return;
    }

    if (action === 'dismiss-report') {
      updateReport(actionTarget.dataset.id, 'Dismissed');
      showToast('Report dismissed.', 'info');
      renderRoute();
      return;
    }

    if (action === 'resolve-report') {
      updateReport(actionTarget.dataset.id, 'Resolved');
      showToast('Report marked resolved.', 'success');
      renderRoute();
      return;
    }

    if (action === 'escalate-report') {
      updateReport(actionTarget.dataset.id, 'Escalated');
      showToast('Report escalated for senior review.', 'success');
      renderRoute();
      return;
    }

    if (action === 'remove-report-content') {
      updateReport(actionTarget.dataset.id, 'Content removed');
      showToast('Content removal recorded in demo.', 'success');
      renderRoute();
      return;
    }

    if (action === 'view-user') {
      showToast('User profile reviewed in admin queue.', 'success');
      return;
    }

    if (action === 'suspend-user') {
      if (actionTarget.textContent.trim() === 'Restore') {
        window.KodeCupidMockApi.setState('kodeCupidSuspendedUsers', window.KodeCupidMockApi.getState('kodeCupidSuspendedUsers', []).filter((item) => item.id !== actionTarget.dataset.id));
        renderRoute();
        showToast('Member access restored in demo.', 'success');
      } else {
        showConfirmation({ title: 'Suspend this member?', message: 'This demo action records a local moderation note. No account is actually disabled.', confirmLabel: 'Record suspension', onConfirm: () => { setStateList('kodeCupidSuspendedUsers', { id: actionTarget.dataset.id, createdAt: new Date().toISOString() }, 'id'); updateReport(actionTarget.dataset.id, 'In review'); showToast('Suspension recorded in demo.', 'success'); renderRoute(); } });
      }
      return;
    }

    if (action === 'remove-user') {
      showConfirmation({ title: 'Remove this profile from the demo?', message: 'The profile will be added to your blocked list for this local demo.', confirmLabel: 'Remove profile', onConfirm: () => {
        const profile = window.KodeCupidMockApi.getProfileById(actionTarget.dataset.id);
        if (profile) {
          setStateList('kodeCupidRemovedUsers', { id: profile.id, removedAt: new Date().toISOString() }, 'id');
          setStateList('kodeCupidBlockedProfiles', { id: profile.id, name: profile.displayName, blockedAt: new Date().toISOString() }, 'id');
        }
        showToast('Profile removed from the demo list.', 'success');
        renderRoute();
      } });
      return;
    }

    if (action === 'process-deletion' || action === 'complete-deletion') {
      const requests = window.KodeCupidMockApi.getState('kodeCupidDeletionRequests', [{ id: 'delete-demo', email: 'member@example.com', reason: 'Taking a break from dating apps.', status: 'New', note: '' }]);
      const request = requests.find((item) => item.id === actionTarget.dataset.id);
      if (request) {
        request.status = action === 'process-deletion' ? 'Processing' : 'Completed';
        const note = document.querySelector(`[data-deletion-note="${CSS.escape(request.id)}"]`);
        if (note) request.note = note.value;
      }
      window.KodeCupidMockApi.setState('kodeCupidDeletionRequests', requests);
      showToast(action === 'process-deletion' ? 'Deletion request marked as processing.' : 'Deletion request completed.', 'success');
      renderRoute();
      return;
    }

    if (action === 'toggle-filters') {
      const drawer = document.getElementById('discoveryFilters');
      const isOpen = Boolean(drawer && drawer.hidden);
      window.KodeCupidMockApi.setState('kodeCupidFiltersOpen', isOpen);
      if (drawer) drawer.hidden = !isOpen;
      actionTarget.setAttribute('aria-expanded', String(isOpen));
      return;
    }

    if (action === 'toggle-date-form') {
      const form = document.getElementById('microDateForm');
      if (form) form.hidden = !form.hidden;
      return;
    }

    if (action === 'mark-notifications-read') {
      const notifications = window.KodeCupidMockApi.getState('kodeCupidNotifications', []).map((item) => ({ ...item, read: true }));
      window.KodeCupidMockApi.setState('kodeCupidNotifications', notifications);
      renderRoute();
      showToast('Notifications marked read.', 'success');
      return;
    }

    if (action === 'clear-filters') {
      window.KodeCupidMockApi.setState('kodeCupidDiscoveryFilters', {});
      window.KodeCupidMockApi.setState('kodeCupidDiscoveryBatch', 0);
      renderRoute();
      showToast('Filters cleared.', 'success');
      return;
    }

    if (action === 'refresh-discovery') {
      window.KodeCupidMockApi.setState('kodeCupidDiscoveryBatch', (Number(window.KodeCupidMockApi.getState('kodeCupidDiscoveryBatch', 0)) || 0) + 1);
      renderRoute();
      showToast('Here is another group to explore.', 'success');
      return;
    }

    if (action === 'select-plan') {
      const user = getCurrentUser();
      user.subscriptionPlan = actionTarget.dataset.plan;
      setCurrentUser(user);
      renderRoute();
      showToast(`${actionTarget.dataset.plan} plan selected. No payment was processed.`, 'success');
      return;
    }

    if (action === 'manage-payment') {
      showToast('Payment methods are mocked. No card data is collected.', 'info');
      return;
    }

    if (action === 'logout') {
      window.KodeCupidMockApi.setState('kodeCupidOnboardingComplete', false);
      localStorage.removeItem('kodeCupidCurrentUser');
      navigate('/');
      return;
    }

    if (action === 'admin-login') {
      window.KodeCupidMockApi.setState('kodeCupidAdminSession', true);
      navigate('/admin');
      return;
    }

    if (action === 'admin-logout') {
      window.KodeCupidMockApi.setState('kodeCupidAdminSession', false);
      navigate('/admin/login');
      return;
    }

    if (action === 'unblock-profile') {
      window.KodeCupidMockApi.setState('kodeCupidBlockedProfiles', window.KodeCupidMockApi.getState('kodeCupidBlockedProfiles', []).filter((item) => item.id !== profileId));
      renderRoute();
      showToast('Profile unblocked.', 'success');
      return;
    }

    if (action === 'report-message') {
      const profile = window.KodeCupidMockApi.getProfileById(profileId);
      setStateList('kodeCupidReports', { id: `message-report-${Date.now()}`, profileId, name: profile?.displayName || 'Chat message', reason: 'Inappropriate message', category: 'Inappropriate message', reporter: getCurrentUser().displayName, evidence: 'Message reported in conversation', status: 'New', createdAt: new Date().toISOString() }, 'id');
      showToast('Message reported for review.', 'success');
      return;
    }

    if (action === 'video-call') {
      showToast(getCurrentUser().disableVideoChat ? 'Video chat is disabled in Settings.' : 'Video calling is coming soon. This demo does not start a call.', 'info');
      return;
    }

    if (action === 'mock-refund' || action === 'cancel-subscription') {
      showConfirmation({ title: action === 'mock-refund' ? 'Record a mock refund?' : 'Cancel this mock subscription?', message: 'This only updates the operations demo. No payment provider is contacted.', confirmLabel: action === 'mock-refund' ? 'Record refund' : 'Cancel plan', onConfirm: () => {
        const changes = window.KodeCupidMockApi.getState('kodeCupidSubscriptionActions', {});
        changes[actionTarget.dataset.id] = { status: action === 'cancel-subscription' ? 'Cancelled' : 'Active', action: action === 'mock-refund' ? 'Mock refund recorded' : 'Cancellation recorded', updatedAt: new Date().toISOString() };
        window.KodeCupidMockApi.setState('kodeCupidSubscriptionActions', changes);
        showToast(action === 'mock-refund' ? 'Mock refund recorded.' : 'Mock subscription cancelled.', 'success');
        renderRoute();
      } });
      return;
    }

    if (action === 'save-admin-note') {
      const row = actionTarget.closest('.admin-row');
      const note = row.querySelector('input').value;
      const notes = window.KodeCupidMockApi.getState('kodeCupidAdminNotes', {});
      notes[actionTarget.dataset.id] = note;
      window.KodeCupidMockApi.setState('kodeCupidAdminNotes', notes);
      showToast('Staff note saved locally.', 'success');
      return;
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form || !form.id) return;
    if (form.id === 'signupForm') {
      event.preventDefault();
      const data = serializeForm(form);
      if (!data.email || !data.password || !data.firstName || !data.city) {
        showToast('Please fill out all signup fields to continue.', 'error');
        return;
      }
      setCurrentUser({ ...defaultDemoUser, displayName: data.firstName || defaultDemoUser.displayName, location: data.city || defaultDemoUser.location, email: data.email });
      window.KodeCupidMockApi.setState('kodeCupidOnboardingComplete', false);
      window.KodeCupidMockApi.setState('kodeCupidOnboardingDraft', { firstName: data.firstName, city: data.city });
      showToast('Account created. Continue onboarding.', 'success');
      navigate('/onboarding');
      return;
    }
    if (form.id === 'loginForm') {
      event.preventDefault();
      const data = serializeForm(form);
      if (!data.email || !data.password) {
        showToast('Please enter your email and password.', 'error');
        return;
      }
      setCurrentUser({ ...defaultDemoUser, email: data.email || 'aisha@kodecupid.demo' });
      window.KodeCupidMockApi.setState('kodeCupidOnboardingComplete', true);
      showToast('Welcome back, Aisha.', 'success');
      navigate('/discover');
      return;
    }
    if (form.id === 'discoveryFilters') {
      event.preventDefault();
      const filters = serializeForm(form);
      if (Number(filters.ageMin) < 18 || Number(filters.ageMax) < Number(filters.ageMin)) {
        showToast('Choose a valid age range of 18 or older.', 'error');
        return;
      }
      if (form.id === 'microDateForm') {
        event.preventDefault();
        const data = serializeForm(form);
        setStateList('kodeCupidMicroDates', { id: `micro-date-${Date.now()}`, date: data.date, time: data.time, location: data.location, status: 'Invitation sent' }, 'id');
        renderRoute();
        showToast('Micro-date invitation sent.', 'success');
        return;
      }
      const { education, ...criteria } = filters;
      window.KodeCupidMockApi.setState('kodeCupidDiscoveryFilters', { ...criteria, education });
      window.KodeCupidMockApi.setState('kodeCupidDiscoveryBatch', 0);
      renderRoute();
      showToast('Discovery filters updated.', 'success');
      return;
    }
    if (form.id === 'settingsForm') {
      event.preventDefault();
      const data = serializeForm(form);
      const user = getCurrentUser();
      const photos = data.photos ? user.photos : user.photos;
      setCurrentUser({
        ...user,
        displayName: data.displayName,
        location: data.location,
        professionCategory: data.professionCategory,
        jobTitle: data.jobTitle,
        bio: data.bio,
        photos,
        relationshipGoals: [data.relationshipGoals],
        workSchedule: data.workSchedule,
        workplaceName: data.workplaceName,
        workplacePrivacy: { enabled: Boolean(data.workplacePrivacy), facility: data.workplaceName, radiusMiles: Number(data.privacyRadius) || 1 },
        quietHours: { enabled: Boolean(data.pauseQuietHours), start: data.quietStart || '21:30', end: data.quietEnd || '07:00' },
        disableVideoChat: Boolean(data.disableVideoChat),
        privacySettings: { age: Boolean(data.showAge), location: Boolean(data.showLocation), height: Boolean(data.showHeight), religion: Boolean(data.showReligion), ethnicity: Boolean(data.showEthnicity), politicalViews: Boolean(data.showPolitics) }
      });
      renderRoute();
      showToast('Settings saved.', 'success');
      return;
    }
    if (form.id === 'adminContentForm') {
      event.preventDefault();
      window.KodeCupidMockApi.setState('kodeCupidAdminContent', serializeForm(form));
      showToast('Content drafts saved locally.', 'success');
      return;
    }
    if (form.id === 'deletionRequestForm') {
      event.preventDefault();
      const data = serializeForm(form);
      if (!data.confirm) {
        showToast('Confirm that you want to request account deletion.', 'error');
        return;
      }
      setStateList('kodeCupidDeletionRequests', { id: `delete-${Date.now()}`, email: data.email, reason: data.reason, status: 'New', note: '', createdAt: new Date().toISOString() }, 'id');
      showToast('Deletion request submitted.', 'success');
      navigate('/');
      return;
    }
    if (form.id === 'onboardingForm') {
      event.preventDefault();
      if (Number(window.KodeCupidMockApi.getState('kodeCupidOnboardingStep', 1)) !== 8) {
        showToast('Complete each onboarding step before entering KodeCupid.', 'error');
        return;
      }
      const details = serializeForm(form);
      const age = calculateAge(details.dateOfBirth);
      if (!details.olderThan18 || !details.termsAccepted) {
        showToast('You must confirm the age and community requirements before continuing.', 'error');
        return;
      }
      if (!details.phone || !/^\d{6}$/.test(details.otp || '')) {
        showToast('Add a phone number and a valid six-digit demo code.', 'error');
        return;
      }
      if (age === null || age < 18) {
        showToast('You must be at least 18 to create an account.', 'error');
        return;
      }
      if (!details.firstName || !details.city || !details.professionCategory || !details.jobTitle) {
        showToast('Complete the required profile details before entering the app.', 'error');
        return;
      }
      const nextUser = {
        ...getCurrentUser(),
        displayName: details.firstName || defaultDemoUser.displayName,
        age,
        dateOfBirth: details.dateOfBirth,
        location: details.city || defaultDemoUser.location,
        professionCategory: details.professionCategory || defaultDemoUser.professionCategory,
        jobTitle: details.jobTitle || defaultDemoUser.jobTitle,
        relationshipGoals: [details.relationshipGoals || 'Serious relationship'],
        bio: details.bio || defaultDemoUser.bio,
        workSchedule: details.workSchedule || defaultDemoUser.workSchedule,
        workplaceType: details.workplaceType || defaultDemoUser.workplaceType,
        workplaceName: details.workplaceName || defaultDemoUser.workplaceName,
        shiftTimes: details.shiftTimes || defaultDemoUser.shiftTimes,
        genderIdentity: details.genderIdentity || defaultDemoUser.genderIdentity,
        interestedIn: details.interestedIn ? [details.interestedIn] : defaultDemoUser.interestedIn,
        educationLevel: details.educationLevel || defaultDemoUser.educationLevel,
        credentials: (details.credentials || '').split(',').map((item) => item.trim()).filter(Boolean),
        languages: (details.languages || '').split(',').map((item) => item.trim()).filter(Boolean),
        height: details.height || '',
        bodyType: details.bodyType || '',
        hairColor: details.hairColor || '',
        eyeColor: details.eyeColor || '',
        religion: details.religion || '',
        ethnicity: details.ethnicity || '',
        politicalViews: details.politicalViews || '',
        drinking: details.drinking || '',
        smoking: details.smoking || '',
        verificationStatus: details.skipVerification ? 'Verified' : window.KodeCupidMockApi.getState('kodeCupidVerificationStatus', 'Pending'),
        privacySettings: { age: Boolean(details.showAge), location: Boolean(details.showLocation), height: Boolean(details.showHeight), religion: Boolean(details.showReligion), ethnicity: Boolean(details.showEthnicity), politicalViews: Boolean(details.showPolitics) },
        workplacePrivacy: { enabled: Boolean(details.workplacePrivacy), facility: details.workplaceName || '', radiusMiles: Number(details.privacyRadius) || 1 },
        quietHours: { enabled: true, start: details.quietStart || '21:30', end: details.quietEnd || '07:00' },
        disableVideoChat: Boolean(details.disableVideoChat)
      };
      setCurrentUser(nextUser);
      window.KodeCupidMockApi.setState('kodeCupidOnboardingComplete', true);
      window.KodeCupidMockApi.setState('kodeCupidOnboarding', details);
      window.KodeCupidMockApi.setState('kodeCupidOnboardingDraft', details);
      showToast('Profile created. Your match queue is ready.', 'success');
      navigate('/discover');
    }
  });

  window.addEventListener('hashchange', renderRoute);
  window.KodeCupidMockApi.seedDemoState();
  renderRoute();
})();
