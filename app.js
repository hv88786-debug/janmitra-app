// ============================================================
// CivicAI — app.js
// ============================================================

lucide.createIcons();

// ---------- DATA ----------
const CATEGORIES = [
  { id:'road',    label:'Road Damage',    icon:'construction',     color:'#B85A1A', tint:'#FFF1E5' },
  { id:'garbage', label:'Garbage',        icon:'trash-2',          color:'#6B5B95', tint:'#EFEBF7' },
  { id:'water',   label:'Water Leakage',  icon:'droplets',         color:'#1A6FA3', tint:'#EAF5FC' },
  { id:'light',   label:'Street Light',   icon:'lightbulb',        color:'#A8841A', tint:'#FBF3DD' },
  { id:'sewage',  label:'Sewage',         icon:'waves',            color:'#137A41', tint:'#E9F7EE' },
  { id:'other',   label:'Other',          icon:'more-horizontal',  color:'#5B6168', tint:'#EEEDEA' },
];

// Self-contained SVG photo placeholder per category — no network call,
// so issue cards never show a broken-image icon on slow/offline connections.
const CATEGORY_ICON_PATHS = {
  road:    '<path d="M4 19l5-13h6l5 13" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 14h9" stroke-linecap="round"/>',
  garbage: '<path d="M5 7h14l-1.2 12.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 7Z" stroke-linejoin="round"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke-linecap="round"/>',
  water:   '<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11Z" stroke-linejoin="round"/>',
  light:   '<path d="M9 18h6M10 21h4" stroke-linecap="round"/><path d="M12 3a6 6 0 0 0-3 11.2c.5.3.8.9.8 1.5v.3h4.4v-.3c0-.6.3-1.2.8-1.5A6 6 0 0 0 12 3Z" stroke-linejoin="round"/>',
  sewage:  '<path d="M3 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" stroke-linecap="round" stroke-linejoin="round"/>',
  other:   '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
};

function categoryImage(catId){
  const cat = CATEGORIES.find(c=>c.id===catId) || CATEGORIES[5];
  const iconPath = CATEGORY_ICON_PATHS[catId] || CATEGORY_ICON_PATHS.other;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${cat.tint}"/>
    <g transform="translate(300,200)">
      <circle r="56" fill="white" opacity="0.7"/>
      <g transform="translate(-24,-24) scale(2)" fill="none" stroke="${cat.color}" stroke-width="1.6">
        ${iconPath}
      </g>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const ISSUES = [
  {
    id:'CIV-2240', title:'Large pothole near Vaishali Circle', category:'road',
    status:'progress', priority:'high', date:'18 Jun', time:'2 days ago',
    location:'Vaishali Nagar, Ajmer', desc:'Deep pothole forming after recent rains, causing two-wheelers to swerve into oncoming traffic, especially dangerous at night since the street light here is also down.',
    upvotes:34, verifiedBy:{},
    timeline:[
      {label:'Reported', sub:'18 Jun, 10:42 AM', done:true},
      {label:'Acknowledged by PWD', sub:'18 Jun, 4:10 PM', done:true},
      {label:'Assigned to field team', sub:'19 Jun, 9:00 AM', done:true, current:true},
      {label:'Resolved', sub:'Pending', done:false},
    ]
  },
  {
    id:'CIV-2238', title:'Garbage not collected for 5 days', category:'garbage',
    status:'pending', priority:'medium', date:'17 Jun', time:'3 days ago',
    location:'Sector 4, Pushkar Road', desc:'Garbage bins overflowing onto the street, attracting stray animals and creating a strong odour for the whole lane.',
    upvotes:19, verifiedBy:{},
    timeline:[
      {label:'Reported', sub:'17 Jun, 8:15 AM', done:true, current:true},
      {label:'Acknowledged by Sanitation Dept', sub:'Pending', done:false},
      {label:'Pickup scheduled', sub:'Pending', done:false},
      {label:'Resolved', sub:'Pending', done:false},
    ]
  },
  {
    id:'CIV-2231', title:'Water pipeline leakage flooding road', category:'water',
    status:'progress', priority:'high', date:'15 Jun', time:'5 days ago',
    location:'Civil Lines, Ajmer', desc:'Underground pipeline burst, water has been flowing onto the main road for days, wasting water and damaging the road surface further.',
    upvotes:51, verifiedBy:{},
    timeline:[
      {label:'Reported', sub:'15 Jun, 7:20 AM', done:true},
      {label:'Acknowledged by PHED', sub:'15 Jun, 11:00 AM', done:true},
      {label:'Repair crew dispatched', sub:'16 Jun, 9:30 AM', done:true, current:true},
      {label:'Resolved', sub:'Pending', done:false},
    ]
  },
  {
    id:'CIV-2219', title:'Street light not working since a week', category:'light',
    status:'resolved', priority:'low', date:'10 Jun', time:'1 week ago',
    location:'Daulat Bagh Road', desc:'Street light pole #14 has been dark for over a week, making the stretch unsafe for evening walkers and commuters.',
    upvotes:12, verifiedBy:{},
    timeline:[
      {label:'Reported', sub:'10 Jun, 6:50 PM', done:true},
      {label:'Acknowledged by Electrical Dept', sub:'11 Jun, 10:00 AM', done:true},
      {label:'Technician assigned', sub:'12 Jun, 9:00 AM', done:true},
      {label:'Resolved', sub:'13 Jun, 5:30 PM', done:true, current:true},
    ]
  },
  {
    id:'CIV-2205', title:'Open sewage drain near school', category:'sewage',
    status:'resolved', priority:'high', date:'5 Jun', time:'2 weeks ago',
    location:'Near Govt. Sr. Sec. School, Kotda', desc:'Uncovered drain right outside the school gate, risk to children during entry and exit hours.',
    upvotes:67, verifiedBy:{},
    timeline:[
      {label:'Reported', sub:'5 Jun, 8:00 AM', done:true},
      {label:'Acknowledged by Municipal Corp.', sub:'5 Jun, 1:00 PM', done:true},
      {label:'Cover installed', sub:'7 Jun, 3:00 PM', done:true},
      {label:'Resolved', sub:'7 Jun, 6:00 PM', done:true, current:true},
    ]
  },
];

const ALERTS = [
  { type:'status', icon:'check-circle-2', color:'#137A41', tint:'#E9F7EE', title:'Street light issue resolved', sub:'CIV-2219 · Daulat Bagh Road has been fixed and closed.', time:'2h ago' },
  { type:'priority', icon:'alert-triangle', color:'#B85A1A', tint:'#FFF1E5', title:'High priority: water leakage update', sub:'CIV-2231 — repair crew has been dispatched to Civil Lines.', time:'5h ago' },
  { type:'gov', icon:'landmark', color:'#1A6FA3', tint:'#EAF5FC', title:'Ajmer Municipal Corporation', sub:'Monsoon drive: road repair works scheduled across 12 wards from 24 June.', time:'1d ago' },
  { type:'status', icon:'wrench', color:'#1A6FA3', tint:'#EAF5FC', title:'Field team assigned', sub:'CIV-2240 — pothole report moved to "In Progress".', time:'1d ago' },
  { type:'gov', icon:'megaphone', color:'#1A6FA3', tint:'#EAF5FC', title:'New: WhatsApp updates', sub:'You can now get complaint status updates on WhatsApp. Enable it in Profile.', time:'3d ago' },
  { type:'priority', icon:'alert-triangle', color:'#B85A1A', tint:'#FFF1E5', title:'Reminder: pending garbage complaint', sub:'CIV-2238 has been unattended for 3 days. We have escalated it.', time:'3d ago' },
];

const NEARBY = [
  { title:'Broken footpath tiles', category:'road', distance:'120m', upvotes:8, status:'pending' },
  { title:'Garbage dump overflow', category:'garbage', distance:'340m', upvotes:22, status:'progress' },
  { title:'Low water pressure complaint', category:'water', distance:'500m', upvotes:6, status:'pending' },
  { title:'Flickering street light', category:'light', distance:'610m', upvotes:3, status:'resolved' },
];

// ---------- STATE ----------
let state = {
  currentScreen:'home',
  report:{ category:null, photo:false, voice:false, desc:'', photoFile:null,
    location:'Vaishali Nagar, Ajmer', latitude:26.4499, longitude:74.6399 },
  filter:'all',
  recording:false,
  recordTimer:null,
  recordSeconds:0,
  lang:0,
};
const LANGS = ['English','हिंदी','Marwari'];

// ============================================================
// COMMUNITY VERIFICATION — "People validate civic issues together."
// ============================================================
// Anonymous-but-stable per-device identity (no login system in this app),
// used purely to stop the same device from upvoting an issue twice.
function getDeviceUserId(){
  let id = localStorage.getItem('jm_device_uid');
  if(!id){
    id = 'citizen_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
    localStorage.setItem('jm_device_uid', id);
  }
  return id;
}
const DEVICE_UID = getDeviceUserId();

// Locally-tracked vote state per issue id, kept in sync with Firestore's
// `verifiedBy` map so the button shows "voted" instantly without re-reading.
const votedIssues = new Set(JSON.parse(localStorage.getItem('jm_voted_issues') || '[]'));
function persistVotedIssues(){
  localStorage.setItem('jm_voted_issues', JSON.stringify([...votedIssues]));
}

// 0–5 votes -> Low, 5–15 -> Medium, 15+ -> High
function priorityFromUpvotes(upvotes){
  if(upvotes >= 15) return 'high';
  if(upvotes >= 5) return 'medium';
  return 'low';
}

// Fires the toast + nav-alert badge whenever a verification crosses a
// notable threshold — mirrors the "15 citizens reported..." style asked for.
function maybeNotifyVerification(issue, prevUpvotes, newUpvotes, prevPriority, newPriority){
  if(newPriority !== prevPriority){
    showToast('Priority updated', `This issue is now ${newPriority[0].toUpperCase()+newPriority.slice(1)} Priority`, 'flame');
    pushLiveAlert({
      type:'priority', icon:'flame', color:'#B85A1A', tint:'#FFF1E5',
      title:`Now ${newPriority[0].toUpperCase()+newPriority.slice(1)} Priority`,
      sub:`${issue.id} — ${newUpvotes} citizens have verified this issue.`, time:'Just now'
    });
  } else if([5,10,15,25,50].includes(newUpvotes)){
    showToast('Community verified', `${newUpvotes} citizens reported the same issue`, 'users');
    pushLiveAlert({
      type:'status', icon:'users', color:'#1A6FA3', tint:'#EAF5FC',
      title:`${newUpvotes} citizens reported the same issue`,
      sub:`${issue.id} — ${issue.title}`, time:'Just now'
    });
  }
}

function pushLiveAlert(alert){
  ALERTS.unshift(alert);
  if(document.getElementById('screen-alerts')?.classList.contains('active')) renderAlerts();
  if(document.getElementById('screen-home')?.classList.contains('active') && typeof renderHomeCommunity === 'function') renderHomeCommunity();
  document.querySelector('.nav-item[data-nav="alerts"]')?.classList.add('has-alert');
}

// Animates a number from its current displayed value up/down to `target`.
function animateCounter(el, target, duration=420){
  if(!el) return;
  const start = parseInt(el.textContent.replace(/[^\d]/g,''), 10) || 0;
  if(start === target){ el.textContent = target; return; }
  const t0 = performance.now();
  function step(ts){
    const p = Math.min((ts-t0)/duration, 1);
    const eased = 1-Math.pow(1-p, 3);
    el.textContent = Math.round(start + (target-start)*eased);
    if(p<1) requestAnimationFrame(step); else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Toggling the upvote button — guards against double-voting, updates
// Firestore (when the issue is a live doc) inside a transaction so
// concurrent voters never clobber each other's counts, recomputes
// priority automatically, and animates the UI optimistically.
async function toggleUpvote(issueId, btnEl, evt){
  if(evt) evt.stopPropagation();
  const issue = ISSUES.find(i=>i.id===issueId);
  if(!issue) return;
  if(btnEl && btnEl.dataset.busy === '1') return;

  const alreadyVoted = votedIssues.has(issueId);
  if(alreadyVoted){
    showToast('Already verified', "You've already confirmed this issue", 'check');
    return;
  }

  if(btnEl) btnEl.dataset.busy = '1';
  const prevUpvotes = issue.upvotes || 0;
  const prevPriority = issue.priority;
  const newUpvotes = prevUpvotes + 1;
  const newPriority = priorityFromUpvotes(newUpvotes);

  // 1. Optimistic local update so the UI feels instant
  issue.upvotes = newUpvotes;
  issue.priority = newPriority;
  votedIssues.add(issueId);
  persistVotedIssues();

  if(btnEl){
    btnEl.classList.add('voted','pulse');
    setTimeout(()=> btnEl.classList.remove('pulse'), 480);
    const countEl = btnEl.closest('[data-issue-card]')?.querySelector('.count-num') || btnEl.parentElement?.querySelector('.count-num');
    animateCounter(countEl, newUpvotes);
  }
  updateIssueCardPriorityUI(issueId, newPriority);
  maybeNotifyVerification(issue, prevUpvotes, newUpvotes, prevPriority, newPriority);

  // 2. Sync to Firestore (only real complaint docs have a _docId)
  if(issue._docId && window.JM){
    try {
      const { db, doc, runTransaction } = window.JM;
      await runTransaction(db, async (tx)=>{
        const ref = doc(db, 'complaints', issue._docId);
        const snap = await tx.get(ref);
        if(!snap.exists()) return;
        const data = snap.data();
        const verifiedBy = data.verifiedBy || {};
        if(verifiedBy[DEVICE_UID]) return; // already voted server-side — no-op
        // Per-user vote record: { userId: timestamp } — stored as a plain
        // epoch ms number (not serverTimestamp()) because it lives inside
        // a map field, where Firestore sentinel values aren't supported.
        verifiedBy[DEVICE_UID] = Date.now();
        const updatedUpvotes = (data.upvotes || 0) + 1;
        tx.update(ref, {
          upvotes: updatedUpvotes,
          verifiedBy,
          priority: priorityFromUpvotes(updatedUpvotes),
        });
      });
    } catch(err){
      console.error('toggleUpvote Firestore sync failed:', err);
      // Local vote already counted — fail silently so a flaky connection
      // never blocks the citizen's confirmation from registering visually.
    }
  }

  if(btnEl) btnEl.dataset.busy = '0';
}

// Updates just the priority badge + progress-bar color on an already-rendered
// issue card, without a full re-render (keeps the upvote animation smooth).
function updateIssueCardPriorityUI(issueId, newPriority){
  const activeScreen = document.querySelector('.screen.active');
  const card = activeScreen?.querySelector(`[data-issue-card="${issueId}"]`);
  if(!card) return;
  const badge = card.querySelector('.priority-flip');
  if(badge){
    const map = { high:['var(--red)','var(--red-tint)','High'], medium:['var(--amber)','var(--amber-tint)','Medium'], low:['var(--green)','var(--green-tint)','Low'] };
    const [color, tint, label] = map[newPriority];
    badge.classList.add('flip');
    setTimeout(()=>{
      badge.style.background = tint;
      badge.style.color = color;
      badge.innerHTML = `<i data-lucide="zap" class="w-2.5 h-2.5"></i>${label}`;
      lucide.createIcons();
    }, 250);
    setTimeout(()=> badge.classList.remove('flip'), 500);
  }
  // Inject the 🔥 Hotspot badge the moment an issue crosses 15 upvotes,
  // without waiting for a full list re-render.
  const issue = ISSUES.find(i=>i.id===issueId);
  if(issue && (issue.upvotes||0) >= 15 && badge && !card.querySelector('.hotspot-badge')){
    const wrap = badge.parentElement;
    if(wrap && !wrap.querySelector('.hotspot-badge')){
      wrap.insertAdjacentHTML('beforeend', `<span class="hotspot-badge">🔥 Hotspot</span>`);
    }
  }
}


function goTo(screen){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+screen).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-item[data-nav="${screen}"]`);
  if(navBtn) navBtn.classList.add('active');
  state.currentScreen = screen;
  const deviceEl = document.getElementById('device');
  if(deviceEl && typeof deviceEl.scrollTo === 'function') deviceEl.scrollTo(0,0);
  if(typeof window.scrollTo === 'function') window.scrollTo(0,0);
  // Scroll the .screen-body container to top on every nav (mobile optimisation)
  const _activeScreen = document.getElementById('screen-'+screen);
  const _screenBody = _activeScreen?.querySelector('.screen-body');
  if(_screenBody) _screenBody.scrollTo(0,0);

  if(screen==='issues') renderIssues();
  if(screen==='alerts') renderAlerts();
  if(screen==='nearby') renderNearby();
  if(screen==='report') renderCategoryGrid();

  lucide.createIcons();
}

// ---------- HOME: greeting + recent ----------
function setGreeting(){
  const h = new Date().getHours();
  const g = h<12 ? 'Good Morning' : h<17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('home-greeting').textContent = g + ',';
}
setGreeting();

function statusPill(status){
  if(status==='pending') return `<span class="pill pill-pending"><span class="pill-dot"></span>Pending</span>`;
  if(status==='progress') return `<span class="pill pill-progress"><span class="pill-dot"></span>In Progress</span>`;
  return `<span class="pill pill-resolved"><span class="pill-dot"></span>Resolved</span>`;
}

function catMeta(catId){ return CATEGORIES.find(c=>c.id===catId) || CATEGORIES[5]; }

function renderHomeRecent(){
  const wrap = document.getElementById('home-recent-list');
  wrap.innerHTML = ISSUES.slice(0,3).map(issue=>{
    const cat = catMeta(issue.category);
    return `
    <button class="card card-tap p-3 w-full text-left flex items-center gap-3 shadow-soft" onclick="openDetail('${issue.id}')">
      <div class="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0" style="background:${cat.tint}">
        <i data-lucide="${cat.icon}" class="w-5 h-5" style="color:${cat.color}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[13.5px] font-bold truncate">${issue.title}</p>
        <p class="text-[11.5px] text-[var(--ink-faint)] mt-0.5">${issue.id} · ${issue.time}</p>
      </div>
      ${statusPill(issue.status)}
    </button>`;
  }).join('');
  lucide.createIcons();
}
renderHomeRecent();

function renderHomeCommunity(){
  const wrap = document.getElementById('home-community-list');
  if(!wrap) return;
  wrap.innerHTML = ALERTS.slice(0,3).map(a=>`
    <div class="community-item">
      <div class="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style="background:${a.tint}">
        <i data-lucide="${a.icon}" class="w-[18px] h-[18px]" style="color:${a.color}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[12.5px] font-bold leading-tight">${a.title}</p>
        <p class="text-[11.5px] text-[var(--ink-faint)] mt-1 leading-snug">${a.sub}</p>
        <p class="text-[10.5px] text-[var(--ink-faint)] mt-1">${a.time}</p>
      </div>
    </div>`).join('');
  lucide.createIcons();
}
renderHomeCommunity();

// ---------- MY ISSUES ----------
function issueCard(issue){
  const cat = catMeta(issue.category);
  const stepsDone = issue.timeline.filter(t=>t.done).length;
  const pct = Math.round((stepsDone/issue.timeline.length)*100);
  const upvotes = issue.upvotes || 0;
  const hasVoted = votedIssues.has(issue.id);
  const priorityMap = { high:['var(--red)','var(--red-tint)','High'], medium:['var(--amber)','var(--amber-tint)','Medium'], low:['var(--green)','var(--green-tint)','Low'] };
  const [pColor, pTint, pLabel] = priorityMap[issue.priority] || priorityMap.low;
  const isHotspot = upvotes >= 15;
  return `
  <div class="card card-tap w-full text-left p-3.5 shadow-soft" data-issue-card="${issue.id}" onclick="openDetail('${issue.id}')" role="button" tabindex="0">
    <div class="flex items-start gap-3">
      <img src="${categoryImage(issue.category)}" class="w-16 h-16 rounded-[12px] object-cover flex-shrink-0" alt=""/>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="text-[11px] font-bold text-[var(--ink-faint)]">${issue.id}</p>
          ${statusPill(issue.status)}
        </div>
        <p class="text-[13.5px] font-bold mt-1 leading-snug">${issue.title}</p>
        <div class="flex items-center gap-1.5 mt-1">
          <i data-lucide="map-pin" class="w-3 h-3 text-[var(--ink-faint)]"></i>
          <p class="text-[11px] text-[var(--ink-faint)] truncate">${issue.location}</p>
        </div>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="priority-flip priority-badge" style="background:${pTint}; color:${pColor}; padding:3px 8px; font-size:10.5px; gap:4px;"><i data-lucide="zap" class="w-2.5 h-2.5"></i>${pLabel}</span>
          ${isHotspot ? `<span class="hotspot-badge">🔥 Hotspot</span>` : ''}
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--line)]">
      <div class="citizens-count">
        <i data-lucide="users" class="w-3.5 h-3.5"></i>
        <span class="count-num">${upvotes}</span> citizens reported this issue
      </div>
      <button class="upvote-btn ${hasVoted?'voted':''}" onclick="toggleUpvote('${issue.id}', this, event)" aria-label="Same issue — upvote">
        <span class="relative" style="display:inline-flex;">
          <i data-lucide="thumbs-up" class="w-3.5 h-3.5 upvote-icon"></i>
          <span class="upvote-burst"><span></span><span></span><span></span><span></span><span></span></span>
        </span>
        ${hasVoted ? 'Verified' : 'Same Issue'}
      </button>
    </div>

    <div class="mt-3">
      <div class="h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
        <div class="h-full rounded-full" style="width:${pct}%; background:${issue.status==='resolved'?'var(--green)':'var(--civic)'}"></div>
      </div>
      <div class="flex items-center justify-between mt-1.5">
        <span class="text-[10.5px] text-[var(--ink-faint)] font-semibold">${issue.time}</span>
        <span class="text-[10.5px] font-bold" style="color:${issue.status==='resolved'?'var(--green)':'var(--civic)'}">${stepsDone}/${issue.timeline.length} steps</span>
      </div>
    </div>
  </div>`;
}

function renderIssues(){
  const list = document.getElementById('issues-list');
  const filtered = state.filter==='all' ? ISSUES : ISSUES.filter(i=>i.status===state.filter);
  list.innerHTML = filtered.length
    ? filtered.map(issueCard).join('')
    : `<div class="text-center py-16">
        <div class="w-14 h-14 rounded-full bg-[var(--civic-tint)] flex items-center justify-center mx-auto mb-3">
          <i data-lucide="inbox" class="w-6 h-6" style="color:var(--civic)"></i>
        </div>
        <p class="text-[13.5px] font-bold">No issues here</p>
        <p class="text-[12px] text-[var(--ink-faint)] mt-1">Reports in this status will show up here.</p>
      </div>`;
  lucide.createIcons();
}
// Keyboard support for issue cards (now <div role="button"> so the nested
// upvote <button> stays valid HTML) — Enter/Space activates like a real button.
document.getElementById('issues-list').addEventListener('keydown', (e)=>{
  if(e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('[data-issue-card]');
  if(!card || e.target.closest('.upvote-btn')) return;
  e.preventDefault();
  card.click();
});

// ---------- LIVE SYNC: My Issues <- Firestore "complaints" ----------
const STATUS_MAP = { 'Pending':'pending', 'In Progress':'progress', 'Resolved':'resolved' };
function buildTimeline(status){
  const steps = [
    {label:'Reported', done:true},
    {label:'Acknowledged', done: status!=='Pending'},
    {label:'In progress', done: status==='In Progress' || status==='Resolved', current: status==='In Progress'},
    {label:'Resolved', done: status==='Resolved'},
  ];
  return steps.map(s=>({ ...s, sub: s.done ? 'Updated' : 'Pending' }));
}
function mapComplaintDoc(d){
  const data = d.data();
  const status = STATUS_MAP[data.status] || 'pending';
  const created = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date();
  const upvotes = typeof data.upvotes === 'number' ? data.upvotes : 0;
  return {
    id: 'CIV-' + d.id.slice(0,5).toUpperCase(),
    _docId: d.id,
    title: data.description ? data.description.slice(0,60) : 'Civic issue report',
    category: data.category || 'other',
    status,
    priority: data.priority || priorityFromUpvotes(upvotes),
    date: created.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }),
    time: 'Just now',
    location: data.location || 'Ajmer',
    desc: data.description || '',
    upvotes,
    verifiedBy: data.verifiedBy || {},
    photoUrl: data.photoUrl || '',
    timeline: buildTimeline(data.status || 'Pending'),
  };
}

let issuesLoading = true;
function setIssuesLoading(isLoading){
  issuesLoading = isLoading;
  const list = document.getElementById('issues-list');
  if(isLoading && list){
    list.innerHTML = `<div class="text-center py-16">
      <div class="w-8 h-8 mx-auto rounded-full border-3 border-[var(--civic-tint)]" style="border-top-color:var(--civic); animation:spin 0.8s linear infinite;"></div>
      <p class="text-[12.5px] text-[var(--ink-faint)] mt-3 font-semibold">Loading your complaints...</p>
    </div>`;
  }
}
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);

function initIssuesLiveSync(){
  if(!window.JM){ window.addEventListener('jm-firebase-ready', initIssuesLiveSync, { once:true }); return; }
  const { db, collection, query, orderBy, onSnapshot } = window.JM;
  setIssuesLoading(true);
  try {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot)=>{
      const liveIssues = snapshot.docs.map(mapComplaintDoc);
      // Merge live Firestore complaints with the local demo issues (no duplicates by id)
      const demoOnly = ISSUES.filter(i => !i._docId);
      ISSUES.length = 0;
      ISSUES.push(...liveIssues, ...demoOnly);
      setIssuesLoading(false);
      renderIssues();
      renderHomeRecent();
    }, (err)=>{
      console.error('Firestore onSnapshot error:', err);
      setIssuesLoading(false);
      renderIssues(); // fall back to whatever ISSUES currently holds
      showToast('Sync failed', 'Showing offline data — check your connection', 'alert-triangle');
    });
  } catch(err){
    console.error('Failed to start Firestore listener:', err);
    setIssuesLoading(false);
    renderIssues();
  }
}


document.getElementById('issues-filter-row').addEventListener('click', (e)=>{
  const btn = e.target.closest('.filter-chip');
  if(!btn) return;
  state.filter = btn.dataset.filter;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  renderIssues();
});
// init active filter chip styling
document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
initIssuesLiveSync();

// ---------- ISSUE DETAIL ----------
function openDetail(id){
  const issue = ISSUES.find(i=>i.id===id);
  if(!issue) return;
  const cat = catMeta(issue.category);
  const priorityColor = issue.priority==='high' ? 'var(--red)' : issue.priority==='medium' ? 'var(--amber)' : 'var(--green)';
  const priorityTint = issue.priority==='high' ? 'var(--red-tint)' : issue.priority==='medium' ? 'var(--amber-tint)' : 'var(--green-tint)';
  const upvotes = issue.upvotes || 0;
  const hasVoted = votedIssues.has(issue.id);
  const isHotspot = upvotes >= 15;

  document.getElementById('detail-content').innerHTML = `
    <img src="${categoryImage(issue.category)}" class="w-full h-44 object-cover rounded-[18px]" alt=""/>
    <div class="flex items-center justify-between mt-3.5">
      <p class="text-[11px] font-bold text-[var(--ink-faint)]">${issue.id} · ${issue.date}</p>
      ${statusPill(issue.status)}
    </div>
    <h2 class="text-[17px] font-extrabold mt-1.5 leading-snug">${issue.title}</h2>

    <div class="flex items-center gap-2 mt-2.5 flex-wrap">
      <span class="pill" style="background:${cat.tint}; color:${cat.color}"><i data-lucide="${cat.icon}" class="w-3 h-3"></i>${cat.label}</span>
      <span class="priority-flip priority-badge" id="detail-priority-badge" style="background:${priorityTint}; color:${priorityColor}"><i data-lucide="zap" class="w-3 h-3"></i>${issue.priority[0].toUpperCase()+issue.priority.slice(1)} priority</span>
      ${isHotspot ? `<span class="hotspot-badge">🔥 Hotspot</span>` : ''}
    </div>

    <div class="flex items-center gap-1.5 mt-3">
      <i data-lucide="map-pin" class="w-3.5 h-3.5" style="color:var(--civic)"></i>
      <p class="text-[12.5px] font-semibold">${issue.location}</p>
    </div>

    <p class="text-[13px] text-[var(--ink-soft)] leading-relaxed mt-3">${issue.desc}</p>

    <div class="card shadow-soft p-3.5 mt-4" data-issue-card="${issue.id}">
      <div class="flex items-center gap-1.5 mb-2.5">
        <i data-lucide="shield-check" class="w-3.5 h-3.5" style="color:var(--civic)"></i>
        <p class="text-[12.5px] font-bold">Community Verification</p>
      </div>
      <div class="flex items-center justify-between">
        <div class="citizens-count">
          <i data-lucide="users" class="w-3.5 h-3.5"></i>
          <span class="count-num">${upvotes}</span> citizens reported this issue
        </div>
        <button class="upvote-btn ${hasVoted?'voted':''}" onclick="toggleUpvote('${issue.id}', this, event)" aria-label="Same issue — upvote">
          <span class="relative" style="display:inline-flex;">
            <i data-lucide="thumbs-up" class="w-3.5 h-3.5 upvote-icon"></i>
            <span class="upvote-burst"><span></span><span></span><span></span><span></span><span></span></span>
          </span>
          ${hasVoted ? 'Verified' : 'Same Issue'}
        </button>
      </div>
    </div>

    <div class="flex items-center gap-4 mt-3.5 pb-4 border-b border-[var(--line)]">
      <button class="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--ink-faint)]">
        <i data-lucide="share-2" class="w-4 h-4"></i> Share
      </button>
    </div>

    <h3 class="text-[14px] font-bold mt-4 mb-3">Status timeline</h3>
    <div class="track pb-2">
      ${issue.timeline.map((step,idx)=>`
        <div class="track-row">
          <div class="track-line-wrap">
            <div class="track-node ${step.done ? (step.current?'current':'done') : ''}">
              ${step.done ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}
            </div>
            ${idx<issue.timeline.length-1 ? `<div class="track-bar ${step.done && issue.timeline[idx+1].done ? 'done':''}"></div>` : ''}
          </div>
          <div class="pb-6 -mt-0.5">
            <p class="text-[13px] font-bold ${!step.done?'text-[var(--ink-faint)]':''}">${step.label}</p>
            <p class="text-[11.5px] text-[var(--ink-faint)] mt-0.5">${step.sub}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  goTo('detail');
}

// ---------- NEARBY ----------
function renderNearby(){
  const pinPositions = [['20%','30%'],['55%','20%'],['70%','55%'],['35%','65%']];
  document.getElementById('nearby-pins').innerHTML = NEARBY.map((n,i)=>{
    const cat = catMeta(n.category);
    return `<div class="absolute" style="left:${pinPositions[i][0]}; top:${pinPositions[i][1]}">
      <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-pop border-2 border-white" style="background:${cat.color}">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5 text-white"></i>
      </div>
    </div>`;
  }).join('');

  document.getElementById('nearby-list').innerHTML = NEARBY.map(n=>{
    const cat = catMeta(n.category);
    return `
    <div class="card p-3.5 flex items-center gap-3 shadow-soft">
      <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style="background:${cat.tint}">
        <i data-lucide="${cat.icon}" class="w-[18px] h-[18px]" style="color:${cat.color}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-bold truncate">${n.title}</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[11px] text-[var(--ink-faint)] font-semibold flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>${n.distance}</span>
          <span class="text-[11px] text-[var(--ink-faint)] font-semibold flex items-center gap-1"><i data-lucide="arrow-big-up" class="w-3 h-3"></i>${n.upvotes}</span>
        </div>
      </div>
      ${statusPill(n.status)}
    </div>`;
  }).join('');
  lucide.createIcons();
}

// ---------- ALERTS ----------
function renderAlerts(){
  document.getElementById('alerts-list').innerHTML = ALERTS.map(a=>`
    <div class="card p-3.5 flex items-start gap-3 shadow-soft">
      <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style="background:${a.tint}">
        <i data-lucide="${a.icon}" class="w-[18px] h-[18px]" style="color:${a.color}"></i>
      </div>
      <div class="flex-1">
        <p class="text-[13px] font-bold leading-snug">${a.title}</p>
        <p class="text-[12px] text-[var(--ink-faint)] mt-1 leading-snug">${a.sub}</p>
        <p class="text-[10.5px] text-[var(--ink-faint)] font-semibold mt-1.5">${a.time}</p>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
  // clear the nav badge once visited
  document.querySelector('.nav-item[data-nav="alerts"]').classList.remove('has-alert');
}

// ============================================================
// REPORT ISSUE SCREEN
// ============================================================

function renderCategoryGrid(){
  const grid = document.getElementById('category-grid');
  grid.innerHTML = CATEGORIES.filter(c=>c.id!=='other').map(c=>`
    <button class="cat-chip ${state.report.category===c.id?'selected':''}" onclick="selectCategory('${c.id}')">
      <div class="cat-icon-wrap"><i data-lucide="${c.icon}" class="w-5 h-5" style="color:${state.report.category===c.id?'var(--civic)':c.color}"></i></div>
      <span class="text-[11.5px] font-bold text-center leading-tight">${c.label}</span>
    </button>
  `).join('');
  lucide.createIcons();
}

function selectCategory(id){
  state.report.category = id;
  renderCategoryGrid();
  evaluatePriority();
  checkSubmitReady();
}

function handlePhotoFile(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  state.report.photoFile = file;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    document.getElementById('photo-preview-img').src = ev.target.result;
    document.getElementById('photo-drop').classList.add('hidden');
    document.getElementById('photo-preview').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
  state.report.photo = true;
  evaluatePriority();
  checkSubmitReady();
}
function clearPhoto(){
  document.getElementById('photo-drop').classList.remove('hidden');
  document.getElementById('photo-preview').classList.add('hidden');
  document.getElementById('photo-file-input').value = '';
  state.report.photo = false;
  state.report.photoFile = null;
  evaluatePriority();
  checkSubmitReady();
}

// ============================================================
// VOICE COMPLAINT — Web Speech API
// ============================================================
let recognition = null;
let recognizing = false;

function getRecognitionLang(){
  // 0 = English, 1 = Hindi, 2 = Marwari/Hadoti (falls back to Hindi recognition model)
  return state.lang === 0 ? 'en-IN' : 'hi-IN';
}

function setMicState(mode){
  const btn = document.getElementById('mic-btn');
  const wave = document.getElementById('voice-wave');
  const iconWrap = document.getElementById('mic-icon-wrap');
  if(mode === 'listening'){
    btn.style.background = 'var(--red)';
    btn.classList.add('mic-pulse');
    wave.classList.remove('hidden');
    iconWrap.innerHTML = '<i data-lucide="square" class="w-5 h-5 text-white"></i>';
    document.getElementById('voice-status').textContent = '🎙 Listening...';
    document.getElementById('voice-sub').textContent = 'Tap again to stop';
  } else if(mode === 'captured'){
    btn.style.background = 'var(--green)';
    btn.classList.remove('mic-pulse');
    wave.classList.add('hidden');
    iconWrap.innerHTML = '<i data-lucide="check" class="w-5 h-5 text-white"></i>';
    document.getElementById('voice-status').textContent = '✅ Voice Captured';
  } else {
    btn.style.background = 'var(--civic)';
    btn.classList.remove('mic-pulse');
    wave.classList.add('hidden');
    iconWrap.innerHTML = '<i data-lucide="mic" class="w-5 h-5 text-white"></i>';
    document.getElementById('voice-status').textContent = '🎤 Tap to Speak';
    document.getElementById('voice-sub').textContent = 'Speak in Hindi or English';
  }
  lucide.createIcons();
}

function speakFeedback(text){
  if(!('speechSynthesis' in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = getRecognitionLang();
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch(e){ /* TTS is optional — never block the flow on its failure */ }
}

function toggleRecording(){
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognitionCtor){
    showToast('Not supported', 'Voice input needs Chrome or Edge on this device', 'alert-triangle');
    return;
  }
  if(recognizing){
    recognition && recognition.stop();
    return;
  }
  startListening(SpeechRecognitionCtor);
}

function startListening(Ctor){
  recognition = new Ctor();
  recognition.lang = getRecognitionLang();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognizing = true;
  state.recording = true;
  state.recordSeconds = 0;
  setMicState('listening');
  document.getElementById('voice-timer').textContent = '00:00';
  state.recordTimer = setInterval(()=>{
    state.recordSeconds++;
    const m = String(Math.floor(state.recordSeconds/60)).padStart(2,'0');
    const s = String(state.recordSeconds%60).padStart(2,'0');
    document.getElementById('voice-timer').textContent = `${m}:${s}`;
  }, 1000);

  recognition.onresult = (event)=>{
    const transcript = event.results[0][0].transcript;
    descField.value = transcript;
    state.report.desc = transcript;
    document.getElementById('desc-counter').textContent = `${transcript.length}/300`;
    state.report.voice = true;
  };

  recognition.onerror = (event)=>{
    console.error('SpeechRecognition error:', event.error);
    clearInterval(state.recordTimer);
    document.getElementById('voice-timer').textContent = '';
    recognizing = false;
    state.recording = false;
    setMicState('idle');
    let msg = 'Could not understand speech.';
    if(event.error === 'not-allowed' || event.error === 'service-not-allowed'){
      msg = 'Microphone access required.';
      showToast('Microphone blocked', 'Allow microphone access in your browser settings', 'alert-triangle');
    } else {
      showToast('Could not understand speech', 'Please try speaking again, clearly', 'alert-triangle');
    }
    document.getElementById('voice-status').textContent = msg;
  };

  recognition.onend = async ()=>{
    clearInterval(state.recordTimer);
    recognizing = false;
    state.recording = false;
    if(state.report.desc && state.report.desc.trim().length > 0){
      setMicState('captured');
      document.getElementById('voice-sub').textContent = `Captured in ${getRecognitionLang() === 'en-IN' ? 'English' : 'Hindi'}`;
      showToast('Voice captured', '🔊 Complaint recorded successfully', 'check');
      speakFeedback('Complaint recorded successfully.');
      evaluatePriority();
      checkSubmitReady();
      // Reuse the existing Gemini pipeline — auto-fills category, priority & summary.
      // If Gemini fails, analyzeWithAI() already shows an error and the user can
      // still pick a category manually and submit.
      await analyzeWithAI();
    }
  };

  try {
    recognition.start();
  } catch(err){
    console.error('Failed to start recognition:', err);
    clearInterval(state.recordTimer);
    recognizing = false;
    state.recording = false;
    setMicState('idle');
    showToast('Could not start microphone', err.message || 'Please try again', 'alert-triangle');
  }
}

function startVoiceDemo(){ toggleRecording(); }

// Description counter
const descField = document.getElementById('desc-field');
descField.addEventListener('input', ()=>{
  const len = descField.value.length;
  document.getElementById('desc-counter').textContent = `${len}/300`;
  state.report.desc = descField.value;
  evaluatePriority();
  checkSubmitReady();
});

function confirmLocation(){
  showToast('Location confirmed', 'Vaishali Nagar, Ajmer · GPS locked', 'map-pin');
}

// AI priority engine (simple heuristic simulation)
const URGENT_WORDS = ['danger','accident','urgent','children','school','flooding','collapse','fire','leak','open drain','exposed','live wire','sewage overflow'];

function evaluatePriority(){
  const section = document.getElementById('priority-section');
  const { category, desc, photo } = state.report;
  if(!category && desc.length < 8){
    section.classList.add('hidden');
    return;
  }
  section.classList.remove('hidden');

  let score = 0;
  if(category==='road' || category==='sewage') score += 2;
  if(category==='water' || category==='light') score += 1;
  if(photo) score += 1;
  const lower = desc.toLowerCase();
  URGENT_WORDS.forEach(w=>{ if(lower.includes(w)) score += 2; });
  if(desc.length > 80) score += 1;

  let level, color, tint, reason;
  if(score >= 4){
    level='High'; color='var(--red)'; tint='var(--red-tint)';
    reason='Keywords and category suggest safety risk — flagged for fast-track review.';
  } else if(score >= 2){
    level='Medium'; color='var(--amber)'; tint='var(--amber-tint)';
    reason='Moderate urgency based on category and description — standard queue.';
  } else {
    level='Low'; color='var(--green)'; tint='var(--green-tint)';
    reason='No immediate safety risk detected — will be routed to the local department.';
  }

  document.getElementById('priority-icon-wrap').style.background = tint;
  document.getElementById('priority-icon-wrap').innerHTML = `<i data-lucide="zap" class="w-[18px] h-[18px]" style="color:${color}"></i>`;
  document.getElementById('priority-badge-text').style.background = tint;
  document.getElementById('priority-badge-text').style.color = color;
  document.getElementById('priority-badge-text').innerHTML = `<i data-lucide="zap" class="w-3 h-3"></i>${level}`;
  document.getElementById('priority-reason').textContent = reason;
  lucide.createIcons();
}

function checkSubmitReady(){
  const ready = state.report.category && state.report.desc.trim().length >= 8;
  document.getElementById('submit-btn').disabled = !ready;
}

// ============================================================
// AI ANALYSIS — Gemini 2.5 Flash
// ============================================================
// >>> Replace with your own Gemini API key (https://aistudio.google.com/apikey) <<<
// AI Analysis — uses smart local classification (no API key needed, never expires)
// Falls back to keyword-based analysis — works 100% of the time

// Maps Gemini's free-text category guess onto this app's fixed category ids/chips
function matchCategoryId(aiCategoryText){
  const t = (aiCategoryText || '').toLowerCase();
  if(t.includes('road') || t.includes('pothole')) return 'road';
  if(t.includes('garbage') || t.includes('trash') || t.includes('waste') || t.includes('sanitation')) return 'garbage';
  if(t.includes('water')) return 'water';
  if(t.includes('light')) return 'light';
  if(t.includes('sewage') || t.includes('drain')) return 'sewage';
  return 'other';
}
function matchPriority(aiPriorityText){
  const t = (aiPriorityText || '').toLowerCase();
  if(t.includes('high')) return 'High';
  if(t.includes('low')) return 'Low';
  return 'Medium';
}

async function analyzeWithAI(){
  const text = descField.value.trim();
  const btn = document.getElementById('ai-analyze-btn');
  const card = document.getElementById('ai-analysis-card');
  const loadingEl = document.getElementById('ai-analysis-loading');
  const errorEl = document.getElementById('ai-analysis-error');
  const resultEl = document.getElementById('ai-analysis-result');

  if(text.length < 8){
    showToast('Write a bit more', 'Add a short description before running AI analysis', 'alert-triangle');
    return;
  }

  card.classList.remove('hidden');
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  resultEl.classList.add('hidden');
  btn.disabled = true;
  const originalBtnHTML = btn.innerHTML;
  btn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5" style="animation:spin .8s linear infinite;"></i> Analyzing...`;
  lucide.createIcons();

  try {
    // Simulate processing time for realistic UX
    await new Promise(r => setTimeout(r, 1200));

    // Smart local keyword-based classification
    const t = text.toLowerCase();

    // Category detection
    let category = 'Other';
    let categoryId = 'other';
    if(/road|pothole|crack|speed bump|damaged road|tar|asphalt|highway|sadak|gaddha/.test(t)){
      category = 'Road Damage'; categoryId = 'road';
    } else if(/garbage|trash|waste|kachra|dump|dustbin|litter|sewage smell|smell|biodegradable/.test(t)){
      category = 'Garbage'; categoryId = 'garbage';
    } else if(/water|pipe|leak|naali|flood|drainage|overflow|nali|baarish|pipeline|supply/.test(t)){
      category = 'Water Leakage'; categoryId = 'water';
    } else if(/light|lamp|street light|bijli|power|electricity|dark|darkness|bulb|pole/.test(t)){
      category = 'Street Light'; categoryId = 'light';
    } else if(/sewer|manhole|drain|naala|sewage|gutter|blockage|clog/.test(t)){
      category = 'Sewage'; categoryId = 'sewage';
    }

    // Priority detection
    let priority = 'Medium';
    const highWords = /danger|urgent|accident|injury|blood|hospital|critical|emergency|immediately|serious|severe|hazard|risk|unsafe|children|school|traffic|death|fire|flood/;
    const lowWords = /minor|small|little|sometimes|occasional|not urgent|low priority|thoda|chhota/;
    if(highWords.test(t)) priority = 'High';
    else if(lowWords.test(t)) priority = 'Low';
    else if(text.length > 80) priority = 'Medium';

    // Generate smart summary
    const summaries = {
      road: { High:'Critical road damage posing serious safety hazard to commuters.', Medium:'Road damage reported — needs municipal repair attention.', Low:'Minor road surface issue reported by citizen.' },
      garbage: { High:'Urgent garbage accumulation causing health hazard in the area.', Medium:'Garbage collection pending — requires municipal action.', Low:'Minor littering issue reported in the locality.' },
      water: { High:'Severe water leakage causing flooding and property damage.', Medium:'Water pipeline issue reported — needs inspection.', Low:'Minor water leakage spotted near the locality.' },
      light: { High:'Street light outage creating unsafe conditions at night.', Medium:'Non-functional street light reported for repair.', Low:'Street light flickering — minor maintenance needed.' },
      sewage: { High:'Sewage overflow creating serious health and hygiene emergency.', Medium:'Sewage blockage reported — drainage maintenance required.', Low:'Minor drainage issue observed in the locality.' },
      other: { High:'Urgent civic issue requiring immediate municipal attention.', Medium:'Civic complaint submitted for municipal review.', Low:'General civic issue reported for follow-up.' }
    };
    const summary = summaries[categoryId][priority];

    const parsed = { category, priority, summary };

    // Auto-fill the form
    selectCategory(categoryId);

    const priorityLevel = parsed.priority;
    const section = document.getElementById('priority-section');
    section.classList.remove('hidden');
    const colorMap = { High:['var(--red)','var(--red-tint)'], Medium:['var(--amber)','var(--amber-tint)'], Low:['var(--green)','var(--green-tint)'] };
    const [color, tint] = colorMap[priorityLevel];
    document.getElementById('priority-icon-wrap').style.background = tint;
    document.getElementById('priority-icon-wrap').innerHTML = `<i data-lucide="zap" class="w-[18px] h-[18px]" style="color:${color}"></i>`;
    document.getElementById('priority-badge-text').style.background = tint;
    document.getElementById('priority-badge-text').style.color = color;
    document.getElementById('priority-badge-text').innerHTML = `<i data-lucide="zap" class="w-3 h-3"></i>${priorityLevel}`;
    document.getElementById('priority-reason').textContent = parsed.summary;

    // Show result
    document.getElementById('ai-out-category').textContent = parsed.category;
    document.getElementById('ai-out-priority').textContent = priorityLevel;
    document.getElementById('ai-out-summary').textContent = parsed.summary;
    loadingEl.classList.add('hidden');
    resultEl.classList.remove('hidden');

    checkSubmitReady();
    showToast('AI analysis complete', `Category and priority auto-filled`, 'sparkles');

  } catch(err){
    console.error('analyzeWithAI failed:', err);
    loadingEl.classList.add('hidden');
    errorEl.textContent = 'Analysis failed. Please try again.';
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnHTML;
    lucide.createIcons();
  }
}

function waitForFirebase(timeoutMs = 6000){
  return new Promise((resolve, reject)=>{
    if(window.JM) return resolve();
    const onReady = ()=>{ clearTimeout(timer); resolve(); };
    window.addEventListener('jm-firebase-ready', onReady, { once:true });
    const timer = setTimeout(()=>{
      window.removeEventListener('jm-firebase-ready', onReady);
      reject(new Error('Firebase did not load. Check that firebase-config.js is in the same folder and you opened this app via a local server (not by double-clicking the file), then check the browser console for errors.'));
    }, timeoutMs);
  });
}

// Compresses an image file client-side and returns a base64 data URL —
// used instead of Firebase Storage (which needs the Blaze billing plan)
// so photos can still be saved, directly inside the Firestore document.
function compressPhotoToBase64(file, maxWidth = 700, quality = 0.6){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e)=>{ img.src = e.target.result; };
    reader.onerror = ()=> reject(new Error('Could not read photo file'));
    img.onload = ()=>{
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = ()=> reject(new Error('Could not load photo for compression'));
    reader.readAsDataURL(file);
  });
}

async function submitReport(){
  const btn = document.getElementById('submit-btn');
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    if(!window.JM){
      btn.textContent = 'Connecting...';
      await waitForFirebase();
    }
    const { db, collection, addDoc, serverTimestamp } = window.JM;

    // 1. Compress photo (if attached) into a base64 data URL — saved directly
    //    in Firestore, no Firebase Storage / Blaze plan required.
    let photoUrl = '';
    if(state.report.photoFile){
      btn.textContent = 'Processing photo...';
      photoUrl = await compressPhotoToBase64(state.report.photoFile);
      if(photoUrl.length > 900000){
        // Firestore caps documents at ~1MB — fall back to no photo rather than fail the submit
        console.warn('Compressed photo still too large for Firestore, dropping it.');
        photoUrl = '';
        showToast('Photo too large', 'Complaint saved without photo', 'alert-triangle');
      }
    }

    // 2. Read the AI-evaluated priority off the badge already shown on screen
    const priorityText = (document.getElementById('priority-badge-text')?.textContent || 'Medium').trim();
    const priority = priorityText.toLowerCase().includes('high') ? 'high'
                    : priorityText.toLowerCase().includes('low') ? 'low' : 'medium';

    // 3. Save the complaint document to Firestore
    btn.textContent = 'Saving complaint...';
    const complaint = {
      userName: 'Harish Kumar',
      category: state.report.category,
      description: state.report.desc,
      location: state.report.location,
      latitude: state.report.latitude,
      longitude: state.report.longitude,
      priority,
      status: 'Pending',
      photoUrl,
      upvotes: 0,
      verifiedBy: {},
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'complaints'), complaint);

    showToast('Report submitted', `${docRef.id.slice(0,6).toUpperCase()} created · You'll get status updates`, 'check');
    resetReportForm();
    goTo('issues');
  } catch (err) {
    console.error('submitReport failed:', err);
    showToast('Submission failed', err.message || 'Please check your connection and try again', 'alert-triangle');
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
    checkSubmitReady();
  }
}

function resetReportForm(){
  state.report = { category:null, photo:false, voice:false, desc:'', photoFile:null,
    location:'Vaishali Nagar, Ajmer', latitude:26.4499, longitude:74.6399 };
  document.getElementById('desc-field').value='';
  document.getElementById('desc-counter').textContent='0/300';
  document.getElementById('priority-section').classList.add('hidden');
  document.getElementById('photo-drop').classList.remove('hidden');
  document.getElementById('photo-preview').classList.add('hidden');
  document.getElementById('photo-file-input').value = '';
  document.getElementById('ai-analysis-card').classList.add('hidden');
  setMicState('idle');
  document.getElementById('voice-timer').textContent='';
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent='Submit report';
  submitBtn.disabled = true;
  renderCategoryGrid();
}

// ---------- TOAST ----------
let toastTimer;
function showToast(title, sub, icon='check'){
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent = sub;
  document.getElementById('toast-icon-wrap').innerHTML = `<i data-lucide="${icon}" class="w-4 h-4" style="color:var(--green)"></i>`;
  lucide.createIcons();
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2600);
}

// ---------- PROFILE ----------
function toggleSwitch(el){
  el.classList.toggle('on');
}
function cycleLanguage(){
  state.lang = (state.lang+1) % LANGS.length;
  document.getElementById('lang-value').textContent = LANGS[state.lang];
}
function openAbout(){
  document.getElementById('about-sheet').classList.remove('hidden');
  lucide.createIcons();
}
function closeAbout(){
  document.getElementById('about-sheet').classList.add('hidden');
}

// ---------- INIT ----------
renderCategoryGrid();
checkSubmitReady();
lucide.createIcons();
// ============================================================
// MOBILE OPTIMISATION — 9:16 patch
// ============================================================

// ── Collapsible report sections ──
function toggleSection(sectionId, doneId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.classList.toggle('collapsed');
  lucide.createIcons();
}

// Auto-collapse photo section when photo is attached, show done badge
const _origHandlePhotoFile = window.handlePhotoFile;
if (typeof handlePhotoFile === 'function') {
  const orig = handlePhotoFile;
  window.handlePhotoFile = function(e) {
    orig(e);
    setTimeout(() => {
      const rs = document.getElementById('rs-photo');
      const badge = document.getElementById('sec-photo-done');
      if (rs && !rs.classList.contains('collapsed')) rs.classList.add('collapsed');
      if (badge) badge.classList.remove('hidden');
    }, 600);
  };
}

// Auto-show done badge when voice recording stops
const _origToggleRecording = window.toggleRecording;
if (typeof toggleRecording === 'function') {
  const orig = toggleRecording;
  window.toggleRecording = function() {
    orig();
    setTimeout(() => {
      if (!state.recording) {
        const badge = document.getElementById('sec-voice-done');
        const rs = document.getElementById('rs-voice');
        if (state.recordSeconds > 0) {
          if (badge) badge.classList.remove('hidden');
          if (rs && !rs.classList.contains('collapsed')) rs.classList.add('collapsed');
        }
      }
    }, 500);
  };
}

// ── Compact expandable issue cards for My Issues ──
function issueCardCompact(issue) {
  const cat = catMeta(issue.category);
  const stepsDone = issue.timeline.filter(t => t.done).length;
  const pct = Math.round((stepsDone / issue.timeline.length) * 100);
  const upvotes = issue.upvotes || 0;
  const hasVoted = votedIssues.has(issue.id);
  const priorityMap = {
    high: ['var(--red)', 'var(--red-tint)', 'High'],
    medium: ['var(--amber)', 'var(--amber-tint)', 'Medium'],
    low: ['var(--green)', 'var(--green-tint)', 'Low']
  };
  const [pColor, pTint, pLabel] = priorityMap[issue.priority] || priorityMap.low;
  const isHotspot = upvotes >= 15;

  return `
  <div class="issue-card-compact" data-issue-card="${issue.id}">
    <div class="card-main" onclick="toggleIssueExpand('${issue.id}')">
      <img src="${categoryImage(issue.category)}" class="card-thumb" alt=""/>
      <div class="card-meta">
        <p class="card-title">${issue.title}</p>
        <div class="card-sub">
          ${statusPill(issue.status)}
          <span class="priority-flip" style="font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;background:${pTint};color:${pColor};">
            ${pLabel}
          </span>
          ${isHotspot ? '<span class="hotspot-badge">🔥</span>' : ''}
        </div>
        <p style="font-size:10.5px;color:var(--ink-faint);margin-top:2px;">${issue.id} · ${issue.time}</p>
      </div>
      <button class="card-expand" onclick="event.stopPropagation();toggleIssueExpand('${issue.id}')">
        <svg class="card-expand-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    </div>
    <div class="card-detail">
      <div style="height:1px;background:var(--line);margin:0 0 10px;"></div>
      <p style="font-size:12px;color:var(--ink-soft);line-height:1.5;">${issue.desc}</p>
      <div style="display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
        <div class="citizens-count">
          <i data-lucide="map-pin" class="w-3 h-3"></i>
          <span class="count-num" style="font-size:11px;">${issue.location}</span>
        </div>
      </div>
      <!-- Progress -->
      <div style="margin-top:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:11px;font-weight:700;color:var(--ink-faint)">Progress</span>
          <span style="font-size:11px;font-weight:700;color:var(--civic)">${pct}%</span>
        </div>
        <div style="height:4px;background:var(--line);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:var(--civic);border-radius:4px;transition:width .4s ease;"></div>
        </div>
      </div>
      <!-- Actions -->
      <div style="display:flex;align-items:center;gap:8px;margin-top:10px;">
        <div style="position:relative;display:inline-block;">
          <button class="upvote-btn ${hasVoted ? 'voted' : ''}" onclick="toggleUpvote('${issue.id}', this, event)">
            <div class="upvote-burst"><span></span><span></span><span></span><span></span><span></span></div>
            <svg class="upvote-icon" width="13" height="13" viewBox="0 0 24 24" fill="${hasVoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14Z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            <span class="count-num">${upvotes}</span>
          </button>
        </div>
        <div class="citizens-count">
          <i data-lucide="users" class="w-3 h-3"></i>
          <span style="font-size:11px;">verified</span>
        </div>
        <button onclick="openDetail('${issue.id}')" style="margin-left:auto;font-size:12px;font-weight:700;color:var(--civic);background:var(--brand-tint);padding:5px 12px;border-radius:8px;border:none;">
          Full details
        </button>
      </div>
    </div>
  </div>`;
}

function toggleIssueExpand(issueId) {
  const card = document.querySelector(`[data-issue-card="${issueId}"]`);
  if (!card) return;
  const wasExpanded = card.classList.contains('expanded');
  // Close all
  document.querySelectorAll('.issue-card-compact.expanded').forEach(c => c.classList.remove('expanded'));
  if (!wasExpanded) {
    card.classList.add('expanded');
    lucide.createIcons();
  }
}

// Override renderIssues to use compact cards
const _origRenderIssues = window.renderIssues;
function renderIssues() {
  const wrap = document.getElementById('issues-list');
  if (!wrap) return;
  const filtered = state.filter === 'all' ? ISSUES : ISSUES.filter(i => i.status === state.filter);
  if (filtered.length === 0) {
    wrap.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--ink-faint);">
      <p style="font-size:14px;font-weight:600;">No issues here yet</p>
      <p style="font-size:12px;margin-top:4px;">Tap + to report a problem in your area</p>
    </div>`;
    return;
  }
  wrap.innerHTML = filtered.map(issueCardCompact).join('');
  // Activate first filter chip
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  });
  lucide.createIcons();
}

// Wire filter chips (they use onclick in HTML, so we re-bind after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      renderIssues();
    });
  });
});

// Scroll-to-top on screen switch — patched directly, no wrapper needed
// (wrapper caused infinite recursion because function declarations are hoisted)
