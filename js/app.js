/* ===== KEY2READ DASHBOARD SPA ===== */

// ---- Utility: HTML Escaping ----
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- Grade Level Display Helper ----
function displayGradeLevel(level) {
  if (!level) return '';
  const map = { 'K-2': 'Ages 6–10', 'k-2': 'Ages 6–10', 'K–2': 'Ages 6–10' };
  return map[level] || level;
}

// ---- SVG Icons (stroke-based, no emoji) ----
const IC = {
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="M10.5 10.5L21 21"/><path d="M16 16l5 0"/><path d="M19 13l0 6"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.97 0 8-3.03 8-8 0-4.42-4-7.03-4-12a7.77 7.77 0 0 0-4 4c-1-1-2-4-2-4-2 4-6 6.58-6 12 0 4.97 3.03 8 8 8z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
};

// ---- Interest Categories ----
const interestCategories = [
  { id: 'humor',       label: 'Funny',           icon: IC.star,     color: 'gold'   },
  { id: 'mystery',     label: 'Mystery',         icon: IC.search,   color: 'red'    },
  { id: 'animals',     label: 'Animals',         icon: IC.eye,      color: 'green'  },
  { id: 'fantasy',     label: 'Fantasy',         icon: IC.star,     color: 'purple' },
  { id: 'sports',      label: 'Sports',          icon: IC.target,   color: 'blue'   },
  { id: 'adventure',   label: 'Adventure',       icon: IC.fire,     color: 'orange' },
];

// ---- Data (loaded from API on init) ----
let students = [];
let assignments = [];


let goals = [];

// Default store items (teacher can customize)
let storeItems = [
  { name: 'Homework Pass',    stock: 10, price: 50, icon: '📝', image_url: '/public/Homework_Pass.jpg' },
  { name: 'Extra Recess',     stock: 5,  price: 75, icon: '⏰' },
  { name: 'Class DJ',         stock: 3,  price: 30, icon: '🎵' },
  { name: 'Sit With a Friend', stock: 10, price: 20, icon: '👫' },
  { name: 'Candy Jar',        stock: 15, price: 15, icon: '🍬', image_url: '/public/Candy.jpg' },
  { name: 'Sticker Pack',     stock: 20, price: 10, icon: '⭐', image_url: '/public/Stickers_.jpg' },
];

// Books loaded from API (populated on init)
let books = [];
let selectedBookId = null; // For book detail view
let bookChapters = []; // Chapters for selected book
let completedChapters = []; // Chapter numbers the student has completed for current book
let studentFavorites = []; // Array of favorite book IDs (student only)
let showFavoritesOnly = false; // Filter toggle state

// Sort books: Book 1 with quizzes first (randomized), then Book 2+ with quizzes, then Coming Soon at end
function sortBooksForDisplay(bookList) {
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const book1Live = bookList.filter(b => b.book_number === 1 && b.has_quizzes !== false);
  const restLive = bookList.filter(b => b.book_number !== 1 && b.has_quizzes !== false);
  const comingSoon = bookList.filter(b => b.has_quizzes === false);
  return [...shuffle(book1Live), ...shuffle(restLive), ...shuffle(comingSoon)];
}

let quizHistory = [];

// ---- API Cache: Avoid redundant network requests ----
// Cache quiz results so modals don't re-fetch the same data
const _apiCache = {
  quizResults: null,
  quizResultsAt: 0,
};
const CACHE_TTL = 60000; // 60 seconds — data refreshes after this

/** Get quiz results from cache or API. Avoids 3+ redundant calls from modals. */
async function getCachedQuizResults(studentId) {
  const now = Date.now();
  if (_apiCache.quizResults && (now - _apiCache.quizResultsAt) < CACHE_TTL) {
    return _apiCache.quizResults;
  }
  const results = await API.getQuizResults(studentId);
  _apiCache.quizResults = results;
  _apiCache.quizResultsAt = now;
  return results;
}

/** Invalidate quiz results cache (call after quiz completion or purchase) */
function invalidateQuizResultsCache() {
  _apiCache.quizResults = null;
  _apiCache.quizResultsAt = 0;
}

// ---- Growth Data (weekly: last 8 weeks) ----
const weeks = (() => {
  const labels = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
})();
const months = weeks; // alias for backward compat
let growthData = {};

// ---- State ----
let page = 'teacher-dashboard';
let detailId = null;
let studentId = null;
let onboardingStep = 0;
let onboardingStudent = null;
let selectedInterests = [];
let selectedReadingStyle = 'detailed';
let reportStudentId = null;
let currentUser = null; // { role: 'teacher'|'student'|'principal'|'owner', name, ... }
let userRole = 'teacher'; // Default role

// Owner dashboard data (loaded from API for owner role)
let ownerStats = { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalQuizzes: 0 };
let ownerGenres = [];
let ownerTeachers = [];
let ownerStudents = [];

// ---- Helpers ----
function scoreBadge(acc) {
  if (acc >= 90) return { label: 'Excellent', cls: 'excellent', barColor: 'var(--green)' };
  if (acc >= 80) return { label: 'Good',      cls: 'good',      barColor: '#5BBF8E' };
  if (acc >= 70) return { label: 'Fair',      cls: 'fair',      barColor: 'var(--gold)' };
  return { label: 'Poor', cls: 'poor', barColor: 'var(--red)' };
}

function statusPill(status) {
  const map = { complete: 'Complete', partial: 'In Progress', pending: 'Pending' };
  const cls = status === 'complete' ? 'complete' : status === 'partial' ? 'in-progress' : 'pending';
  return `<span class="status-pill ${cls}"><span class="status-dot"></span>${map[status]}</span>`;
}

function distBar(dist) {
  if (!dist) return '<span style="color:var(--g400);font-size:0.8125rem">\u2014</span>';
  return `<div class="score-dist">
    <div class="score-dist-seg excellent" style="width:${dist.ex}%"></div>
    <div class="score-dist-seg good" style="width:${dist.gd}%"></div>
    <div class="score-dist-seg fair" style="width:${dist.fr}%"></div>
    <div class="score-dist-seg poor" style="width:${dist.pr}%"></div>
    ${dist.pn ? `<div class="score-dist-seg pending" style="width:${dist.pn}%"></div>` : ''}
  </div>`;
}

function avatar(s, size) {
  const cls = size === 'lg' ? 'avatar lg' : 'avatar';
  return `<div class="${cls}" style="background:${s.color}">${s.initials}</div>`;
}

function warnTag(s) {
  return s.struggling ? `<span class="warn-tag">${IC.warn}Needs support</span>` : '';
}

function keysDisp(k) {
  if (k === '\u2014' || k === null || k === undefined) return '<span style="color:var(--g400)">\u2014</span>';
  return `<span class="keys-display">${IC.key}${typeof k === 'number' ? k.toLocaleString() : k}</span>`;
}

function streakDisp(s) {
  if (!s || s === '\u2014') return '<span style="color:var(--g400)">\u2014</span>';
  return `<span class="streak-display">${IC.fire}${s}</span>`;
}

function pct(current, target) {
  return Math.min(Math.round((current / target) * 100), 100);
}

// ---- Data Mapping (API → Frontend) ----
function mapStudentFromAPI(s) {
  const tags = typeof s.interest_tags === 'string' ? JSON.parse(s.interest_tags || '[]') : (s.interest_tags || []);
  const onboarded = !!s.onboarded;
  return {
    id: s.id,
    name: s.name || 'Student',
    initials: s.initials || s.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??',
    color: s.color || '#2563EB',
    grade: s.grade || '4th',
    level: s.reading_level || 3.0,
    score: s.reading_score || 500,
    accuracy: s.accuracy || 0,
    keys: s.keys_earned || 0,
    quizzes: s.quizzes_completed || 0,
    streak: s.streak_days || 0,
    struggling: (s.quizzes_completed || 0) > 0 && ((s.reading_score || 500) < 400 || (s.accuracy || 0) < 50),
    joined: s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '—',
    interests: onboarded ? {
      tags: tags,
      readingStyle: s.reading_style || 'detailed',
      favoriteGenre: s.favorite_genre || '',
      onboarded: true
    } : null,
    onboarded: onboarded,
    // Keep raw fields for edits
    _raw: s
  };
}

function mapAssignmentFromAPI(a) {
  return {
    id: a.id,
    name: a.name || a.book_title || 'Assignment',
    date: a.created_at ? new Date(a.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '—',
    due_date: a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '—',
    due: a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '—',
    type: 'quiz',
    label: 'Quiz',
    status: a.status || 'pending',
    done: 0,
    total: students.length,
    keys: a.keys_earned || '—',
    keys_earned: a.keys_earned || 0,
    book_id: a.book_id,
    book_title: a.book_title || '',
    book_author: a.book_author || '',
    chapter_start: a.chapter_start || 1,
    chapter_end: a.chapter_end || 1,
    dist: null
  };
}

// ---- Personalization Helpers ----
function interestTags(s) {
  if (!s.interests || !s.interests.tags.length) {
    return '<span class="interest-empty">No interests set</span>';
  }
  return s.interests.tags.map(tagId => {
    const cat = interestCategories.find(c => c.id === tagId);
    if (!cat) return '';
    return `<span class="interest-tag ${cat.color}">${cat.label}</span>`;
  }).join('');
}

function interestTagsCompact(s, max) {
  if (!s.interests || !s.interests.onboarded || !s.interests.tags.length) return '';
  const shown = s.interests.tags.slice(0, max || 2);
  const extra = s.interests.tags.length - shown.length;
  let html = shown.map(tagId => {
    const cat = interestCategories.find(c => c.id === tagId);
    if (!cat) return '';
    return `<span class="interest-tag-sm ${cat.color}">${cat.label}</span>`;
  }).join('');
  if (extra > 0) html += `<span class="interest-tag-more">+${extra}</span>`;
  return html;
}

function growthArrow(start, end) {
  if (start === 0) return '';
  const change = Math.round(((end - start) / start) * 100);
  if (change > 0) return `<span class="growth-arrow up">${IC.arrowUp}+${change}%</span>`;
  if (change < 0) return `<span class="growth-arrow down">${IC.arrowDown}${change}%</span>`;
  return `<span class="growth-arrow steady">\u2014 0%</span>`;
}

function miniChart(data, color, w, h) {
  w = w || 80; h = h || 28;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return `<svg class="mini-chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Vertical bar chart for teacher dashboard
function svgBarChart(data, labels, w, h) {
  w = w || 620; h = h || 500;
  const pad = { top: 30, right: 20, bottom: 36, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data);
  const minVal = Math.max(0, Math.min(...data) - 50);
  const range = maxVal - minVal || 1;
  const barCount = data.length;
  const gap = cw * 0.15 / barCount;
  const barW = (cw - gap * (barCount + 1)) / barCount;

  const barColors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];

  // Gridlines
  const gridCount = 4;
  let gridLines = '';
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + (i / gridCount) * ch;
    const val = Math.round(maxVal + 20 - (i / gridCount) * (range + 20));
    gridLines += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4,4"/>`;
    gridLines += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="#9CA3AF" font-size="11">${val}</text>`;
  }

  let bars = '';
  let barLabels = '';
  let xLabels = '';
  data.forEach((v, i) => {
    const x = pad.left + gap + i * (barW + gap);
    const barH = ((v - minVal) / range) * ch;
    const y = pad.top + ch - barH;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="6" fill="${barColors[i % barColors.length]}"/>`;
    barLabels += `<text x="${x + barW / 2}" y="${y - 10}" text-anchor="middle" fill="${barColors[i % barColors.length]}" font-size="13" font-weight="700">${v}</text>`;
    xLabels += `<text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" fill="#6B7280" font-size="11" font-weight="500">${labels[i]}</text>`;
  });

  return `<svg class="svg-chart svg-chart-stretch" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
    ${gridLines}
    ${bars}
    ${barLabels}
    ${xLabels}
  </svg>`;
}

// Line chart for teacher dashboard
function svgLineChart(data, labels, w, h) {
  w = w || 620; h = h || 500;
  const pad = { top: 30, right: 20, bottom: 36, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const min = Math.min(...data) - 20;
  const max = Math.max(...data) + 20;
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((v - min) / range) * ch;
    return { x, y, v };
  });

  const linePoints = pts.map(p => p.x + ',' + p.y).join(' ');

  // Gridlines
  const gridCount = 4;
  let gridLines = '';
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + (i / gridCount) * ch;
    const val = Math.round(max - (i / gridCount) * range);
    gridLines += '<line x1="' + pad.left + '" y1="' + y + '" x2="' + (w - pad.right) + '" y2="' + y + '" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4,4"/>';
    gridLines += '<text x="' + (pad.left - 8) + '" y="' + (y + 4) + '" text-anchor="end" fill="#9CA3AF" font-size="11">' + val + '</text>';
  }

  var xLabels = labels.map(function(l, i) {
    var x = pad.left + (i / (labels.length - 1)) * cw;
    return '<text x="' + x + '" y="' + (h - 8) + '" text-anchor="middle" fill="#6B7280" font-size="11" font-weight="500">' + l + '</text>';
  }).join('');

  var dots = pts.map(function(p) {
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="7" fill="#2563EB" stroke="#fff" stroke-width="3"/>';
  }).join('');

  var dotLabels = pts.map(function(p) {
    return '<text x="' + p.x + '" y="' + (p.y - 16) + '" text-anchor="middle" fill="#2563EB" font-size="13" font-weight="700">' + p.v + '</text>';
  }).join('');

  return '<svg class="svg-chart svg-chart-stretch" viewBox="0 0 ' + w + ' ' + h + '" width="100%" preserveAspectRatio="xMidYMid meet">' +
    gridLines +
    '<polyline points="' + linePoints + '" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    dots + dotLabels + xLabels +
  '</svg>';
}

// (svgAreaChart defined below at line ~644 — single definition to avoid duplicates)

// Colorful gradient area chart for teacher dashboard
function svgGradientAreaChart(data, labels, w, h) {
  w = w || 600; h = h || 220;
  const pad = { top: 24, right: 20, bottom: 30, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const min = dataMin - 20;
  const max = dataMax + 20;
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((v - min) / range) * ch;
    return { x, y, v };
  });

  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${pts[0].x},${pad.top + ch} ${linePoints} ${pts[pts.length-1].x},${pad.top + ch}`;

  // Gridlines
  const gridCount = 4;
  let gridLines = '';
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + (i / gridCount) * ch;
    const val = Math.round(max - (i / gridCount) * range);
    gridLines += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4,4"/>`;
    gridLines += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="#9CA3AF" font-size="11">${val}</text>`;
  }

  let xLabels = labels.map((l, i) => {
    const x = pad.left + (i / (labels.length - 1)) * cw;
    return `<text x="${x}" y="${h - 6}" text-anchor="middle" fill="#6B7280" font-size="11" font-weight="500">${l}</text>`;
  }).join('');

  // Colorful dots with varying colors
  const dotColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  let dots = pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="6" fill="${dotColors[i % dotColors.length]}" stroke="#fff" stroke-width="3"/>`).join('');
  let dotLabels = pts.map((p, i) => `<text x="${p.x}" y="${p.y - 14}" text-anchor="middle" fill="${dotColors[i % dotColors.length]}" font-size="12" font-weight="700">${p.v}</text>`).join('');

  return `<svg class="svg-chart svg-chart-stretch" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#2563EB"/>
        <stop offset="25%" stop-color="#10B981"/>
        <stop offset="50%" stop-color="#F59E0B"/>
        <stop offset="75%" stop-color="#EF4444"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563EB" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#93C5FD" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <polygon points="${areaPoints}" fill="url(#areaFill)"/>
    <polyline points="${linePoints}" fill="none" stroke="url(#areaGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${dotLabels}
    ${xLabels}
  </svg>`;
}

function svgPieChart(slices, size) {
  size = size || 220;
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 10;
  const innerR = outerR * 0.6; // donut hole
  let total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No data yet</div>';

  // Gradient color pairs: lighter → darker for each base color
  const gradientMap = {
    '#EF4444': ['#F87171', '#DC2626'], // red
    '#F59E0B': ['#FBBF24', '#D97706'], // amber/orange
    '#10B981': ['#34D399', '#059669'], // green
    '#2563EB': ['#60A5FA', '#1D4ED8'], // blue
  };

  // Calculate "on/above level" percentage (On Track + Advanced)
  let onAboveCount = 0;
  slices.forEach(sl => {
    if (sl.label && (sl.label.includes('On Track') || sl.label.includes('Advanced'))) {
      onAboveCount += sl.value;
    }
  });
  const onAbovePct = Math.round((onAboveCount / total) * 100);

  // Build gradient defs
  let defs = '<defs>';
  slices.forEach((sl, i) => {
    const pair = gradientMap[sl.color] || [sl.color, sl.color];
    defs += `<linearGradient id="donut-grad-${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${pair[0]}"/>
      <stop offset="100%" stop-color="${pair[1]}"/>
    </linearGradient>`;
  });
  defs += '</defs>';

  let startAngle = -Math.PI / 2;
  let paths = '';
  let sliceIdx = 0;
  slices.forEach((sl, i) => {
    if (sl.value === 0) return;
    const pct = sl.value / total;
    const endAngle = startAngle + pct * 2 * Math.PI;
    const largeArc = pct > 0.5 ? 1 : 0;
    const fillRef = `url(#donut-grad-${i})`;
    // Outer arc points
    const ox1 = cx + outerR * Math.cos(startAngle);
    const oy1 = cy + outerR * Math.sin(startAngle);
    const ox2 = cx + outerR * Math.cos(endAngle);
    const oy2 = cy + outerR * Math.sin(endAngle);
    // Inner arc points (reversed)
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);

    if (pct >= 0.999) {
      // Full circle donut
      paths += `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="${fillRef}"/>`;
      paths += `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#fff"/>`;
    } else {
      paths += `<path d="M${ox1},${oy1} A${outerR},${outerR} 0 ${largeArc} 1 ${ox2},${oy2} L${ix1},${iy1} A${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2} Z" fill="${fillRef}" stroke="#fff" stroke-width="2"/>`;
    }

    // Label with count on the arc
    const midAngle = startAngle + (pct * Math.PI);
    const labelR = (outerR + innerR) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    if (pct >= 0.05) {
      paths += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="${Math.round(size * 0.055)}" font-weight="700">${sl.value}</text>`;
    }

    startAngle = endAngle;
    sliceIdx++;
  });

  // Center text
  const centerText = `
    <text x="${cx}" y="${cy - size * 0.06}" text-anchor="middle" dominant-baseline="central" fill="#1B5E20" font-size="${Math.round(size * 0.12)}" font-weight="800">${onAbovePct}%</text>
    <text x="${cx}" y="${cy + size * 0.06}" text-anchor="middle" dominant-baseline="central" fill="#6B7280" font-size="${Math.round(size * 0.042)}" font-weight="600">ON / ABOVE</text>
    <text x="${cx}" y="${cy + size * 0.1}" text-anchor="middle" dominant-baseline="central" fill="#6B7280" font-size="${Math.round(size * 0.042)}" font-weight="600">LEVEL</text>`;

  const legend = slices.filter(sl => sl.value > 0).map(sl => {
    const pair = gradientMap[sl.color] || [sl.color, sl.color];
    const pct = Math.round((sl.value / total) * 100);
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <div style="width:12px;height:12px;border-radius:3px;background:linear-gradient(135deg, ${pair[0]}, ${pair[1]});flex-shrink:0"></div>
      <span style="font-size:0.8rem;color:var(--g600)">${sl.label}</span>
      <span style="margin-left:auto;font-size:0.8rem;font-weight:700;color:var(--navy)">${sl.value} (${pct}%)</span>
    </div>`;
  }).join('');

  return `<div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="flex-shrink:0">${defs}${paths}${centerText}</svg>
    <div style="flex:1;min-width:140px">${legend}</div>
  </div>`;
}

function svgAreaChart(data, labels, colorOrW, wArg, hArg) {
  // Support both (data, labels, w, h) and (data, labels, color, w, h) signatures
  let color, w, h;
  if (typeof colorOrW === 'string' && colorOrW.startsWith('#')) {
    color = colorOrW; w = wArg || 620; h = hArg || 300;
  } else {
    color = '#60A5FA'; w = colorOrW || 620; h = wArg || 300;
  }
  const pad = { top: 30, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const min = Math.max(0, dataMin - 40);
  const max = dataMax + 40;
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = data.length === 1 ? pad.left + cw / 2 : pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((v - min) / range) * ch;
    return { x, y, v };
  });

  // Gridlines — light horizontal lines
  const gridCount = 4;
  let gridLines = '';
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + (i / gridCount) * ch;
    const val = Math.round(max - (i / gridCount) * range);
    gridLines += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#F0F0F0" stroke-width="1"/>`;
    gridLines += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="#B0B0B0" font-size="11">${val}</text>`;
  }

  // X labels
  const xLabels = labels.map((l, i) => {
    const x = data.length === 1 ? pad.left + cw / 2 : pad.left + (i / (labels.length - 1)) * cw;
    return `<text x="${x}" y="${h - 8}" text-anchor="middle" fill="#9CA3AF" font-size="11" font-weight="500">${l}</text>`;
  }).join('');

  // Dots and value labels
  const dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#3B82F6" stroke="#fff" stroke-width="2.5"/>`).join('');
  const dotLabels = pts.map(p => `<text x="${p.x}" y="${p.y - 12}" text-anchor="middle" fill="#3B82F6" font-size="12" font-weight="700">${p.v}</text>`).join('');

  // Line and gradient-filled area
  let lineEl = '';
  let areaEl = '';
  if (pts.length > 1) {
    const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${pts[0].x},${pad.top + ch} ${linePoints} ${pts[pts.length-1].x},${pad.top + ch}`;
    lineEl = `<polyline points="${linePoints}" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    areaEl = `<polygon points="${areaPoints}" fill="url(#trendAreaGrad)"/>`;
  }

  return `<svg class="svg-chart svg-chart-stretch" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#BFDBFE" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#EFF6FF" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    ${gridLines}
    ${areaEl}
    ${lineEl}
    ${dots}
    ${dotLabels}
    ${xLabels}
  </svg>`;
}

// ---- Render Sidebar ----
function renderSidebar() {
  let items;
  if (userRole === 'student' || userRole === 'child') {
    items = [
      { section: 'My Learning' },
      { id: 'student-dashboard', icon: IC.target, label: 'My Dashboard' },
      { id: 'student-quizzes',   icon: IC.clip,   label: 'My Quizzes', badge: assignments.length > 0 ? String(assignments.length) : '', badgeCls: 'red' },
      { id: 'library',           icon: IC.book,   label: 'Book Library' },
      { id: 'student-progress',  icon: IC.chart,  label: 'My Progress' },
      { section: 'Fun' },
      { id: 'store',             icon: IC.bag,    label: 'Store', badge: storeItems.length > 0 ? String(storeItems.length) : '', badgeCls: 'gold' },
      { id: 'student-badges',    icon: IC.star,   label: 'My Badges' },
    ];
  } else if (userRole === 'owner') {
    items = [
      { section: 'Platform Overview' },
      { id: 'owner-dashboard',  icon: IC.target,   label: 'Dashboard' },
      { id: 'owner-teachers',   icon: IC.user,     label: 'Teachers', badge: ownerStats.totalTeachers > 0 ? String(ownerStats.totalTeachers) : '', badgeCls: 'blue' },
      { id: 'owner-students',   icon: IC.users,    label: 'Students', badge: ownerStats.totalStudents > 0 ? String(ownerStats.totalStudents) : '', badgeCls: 'green' },
      { section: 'Tools' },
      { id: 'library',          icon: IC.book,     label: 'Book Library' },
      { id: 'owner-gallery',    icon: IC.bag,      label: 'Reward Gallery', badge: rewardGallery.length > 0 ? String(rewardGallery.length) : '', badgeCls: 'gold' },
      { id: 'owner-settings',   icon: IC.gear,     label: 'Settings' },
    ];
  } else if (userRole === 'principal') {
    items = [
      { section: 'School Overview' },
      { id: 'principal-dashboard', icon: IC.target, label: 'Dashboard' },
      { id: 'principal-classes',   icon: IC.users,  label: 'All Classes', badge: '4', badgeCls: 'blue' },
      { id: 'reports',             icon: IC.chart,  label: 'Growth Reports' },
      { section: 'Management' },
      { id: 'principal-teachers',  icon: IC.user,   label: 'Teachers' },
      { id: 'library',             icon: IC.book,   label: 'Book Library' },
      { section: 'Tools' },
      { id: 'principal-settings',  icon: IC.gear,   label: 'School Settings' },
    ];
  } else if (userRole === 'parent') {
    items = [
      { id: 'teacher-dashboard', icon: IC.home, label: 'My Dashboard', isHome: true },
      { section: 'My Family' },
      { id: 'quizzes',    icon: IC.clip,  label: 'Quizzes & Assessments', badge: assignments.length > 0 ? String(assignments.length) : '', badgeCls: 'red' },
      { id: 'students',   icon: IC.users, label: 'My Children',           badge: students.length > 0 ? String(students.length) : '', badgeCls: 'blue' },
      { id: 'reports',    icon: IC.chart, label: 'Growth Reports' },
      { section: 'Management' },
      { id: 'store',      icon: IC.bag,   label: 'Family Store',          badge: String(storeItems.length), badgeCls: 'gold' },
      { id: 'purchases',  icon: IC.key,   label: 'Recent Purchases',      badge: window._purchaseCount > 0 ? String(window._purchaseCount) : '', badgeCls: 'purple' },
      { id: 'library',    icon: IC.book,  label: 'Book Library' },
      { section: 'Tools' },
      { id: 'class-goals', icon: IC.trend, label: 'Family Goals' },
      { id: 'celebrate',  icon: IC.star,  label: 'Celebrate Children' },
      { id: 'aitools',    icon: IC.bulb,  label: 'Parent Tools' },
    ];
  } else if (userRole === 'guest') {
    items = [
      { id: 'guest-browse', icon: IC.book, label: 'Browse Books' },
    ];
  } else {
    items = [
      { id: 'teacher-dashboard', icon: IC.home, label: 'My Dashboard', isHome: true },
      { section: 'Classroom' },
      { id: 'quizzes',    icon: IC.clip,  label: 'Quizzes & Assessments', badge: assignments.length > 0 ? String(assignments.length) : '', badgeCls: 'red' },
      { id: 'students',   icon: IC.users, label: 'Students',             badge: students.length > 0 ? String(students.length) : '', badgeCls: 'blue' },
      { id: 'reports',    icon: IC.chart, label: 'Growth Reports' },
      { section: 'Management' },
      { id: 'store',      icon: IC.bag,   label: 'Class Store',          badge: String(storeItems.length), badgeCls: 'gold' },
      { id: 'purchases',  icon: IC.key,   label: 'Recent Purchases',     badge: window._purchaseCount > 0 ? String(window._purchaseCount) : '', badgeCls: 'purple' },
      { id: 'library',    icon: IC.book,  label: 'Book Library' },
      { section: 'Tools' },
      { id: 'class-goals', icon: IC.trend, label: 'Class Goals' },
      { id: 'celebrate',  icon: IC.star,  label: 'Celebrate Students' },
      { id: 'aitools',    icon: IC.bulb,  label: 'Teaching Tools' },
    ];
  }

  const userName = currentUser?.name || 'Student';
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const roleLabel = userRole === 'student' ? (currentUser?.grade || '4th') + ' Grade Student' :
                    userRole === 'child' ? (currentUser?.grade || '4th') + ' Grade Reader' :
                    userRole === 'owner' ? 'Platform Owner' :
                    userRole === 'principal' ? 'School Principal' :
                    userRole === 'parent' ? 'Parent' :
                    (currentUser?.grade || '4th') + ' Grade Teacher';

  let html = `
    <nav class="sidebar-nav" style="margin-top:12px">`;

  items.forEach(item => {
    if (item.section) {
      html += `<div class="sidebar-section"><div class="sidebar-section-label">${item.section}</div></div>`;
      return;
    }
    const active = page === item.id ? 'active' : '';
    const badge = item.badge ? `<span class="item-badge ${item.badgeCls}">${item.badge}</span>` : '';
    if (item.isHome) {
      html += `<button class="sidebar-item sidebar-home ${active}" onclick="navigate('${item.id}')" style="font-size:1.05rem;font-weight:700;padding:12px 16px;margin-bottom:8px"><span class="sidebar-home-icon" style="width:28px;height:28px;display:inline-flex">${item.icon}</span><span>${item.label}</span></button>`;
    } else {
      html += `<button class="sidebar-item ${active}" onclick="navigate('${item.id}')">${item.icon}<span>${item.label}</span>${badge}</button>`;
    }
  });

  html += `</nav>`;

  // Total Progress compact stats in sidebar for student/child
  if ((userRole === 'student' || userRole === 'child') && currentUser) {
    const tp = {
      keys: currentUser.keys_earned || 0,
      totalKeys: currentUser?.weeklyStats?.totalKeysEarned || currentUser.keys_earned || 0,
      quizzes: currentUser.quizzes_completed || 0,
      books: currentUser.totalBooksCompleted || 0
    };
    // Insert right after the nav, before footer — but we want it near top
    // We'll prepend it before the nav
    html = `
    <div style="padding:16px 16px 12px">
      <div style="display:flex;align-items:center;gap:10px">
        <img src="/public/Star_Icon_.png" alt="" style="width:48px;height:48px;object-fit:contain">
        <div style="color:#fff;font-size:1.1rem;font-weight:800;letter-spacing:0.5px">Total Progress</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">
        <div onclick="showKeysBreakdown()" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255,255,255,0.08);border-radius:8px">
          <img src="/public/Key_Icon.png" alt="Keys" style="width:20px;height:20px;object-fit:contain">
          <span style="color:rgba(255,255,255,0.7);font-size:0.8rem;flex:1">Total Keys</span>
          <span style="color:#fff;font-weight:700;font-size:0.875rem">${tp.totalKeys}</span>
        </div>
        <div onclick="showCompletedQuizzes()" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255,255,255,0.08);border-radius:8px">
          <img src="/public/Paper_Icon_.png" alt="Quizzes" style="width:20px;height:20px;object-fit:contain">
          <span style="color:rgba(255,255,255,0.7);font-size:0.8rem;flex:1">Quizzes</span>
          <span style="color:#fff;font-weight:700;font-size:0.875rem">${tp.quizzes}</span>
        </div>
        <div onclick="showCompletedBooks()" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255,255,255,0.08);border-radius:8px">
          <img src="/public/Red_Book_Icon_.png" alt="Books" style="width:20px;height:20px;object-fit:contain">
          <span style="color:rgba(255,255,255,0.7);font-size:0.8rem;flex:1">Books</span>
          <span style="color:#fff;font-weight:700;font-size:0.875rem">${tp.books}</span>
        </div>
      </div>
      <div onclick="navigate('store')" style="cursor:pointer;display:flex;flex-direction:column;align-items:center;margin-top:14px;padding:12px;background:rgba(255,255,255,0.12);border-radius:10px">
        <img src="/public/Key_Circle_Icon.png" alt="Keys" style="width:72px;height:72px;object-fit:contain">
        <div style="color:#FFD700;font-size:2rem;font-weight:800;margin-top:4px">${tp.keys}</div>
        <div style="color:rgba(255,255,255,0.6);font-size:0.75rem;font-weight:600">Keys to Spend</div>
      </div>
    </div>` + html;
  }

  if (userRole === 'guest') {
    html += `
    <div class="sidebar-footer" style="flex-direction:column;gap:8px;padding:16px">
      <a href="/index.html" style="display:flex;align-items:center;gap:6px;color:var(--g400);font-size:0.8125rem;text-decoration:none;padding:6px 0;margin-bottom:4px">${IC.arrowLeft} Back to Home</a>
      <a href="signin.html" class="btn btn-primary" style="width:100%;text-align:center;text-decoration:none">Sign In</a>
      <a href="signup.html" class="btn btn-outline" style="width:100%;text-align:center;text-decoration:none">Create Account</a>
    </div>`;
  } else {
    html += `
    <div class="sidebar-footer">
    </div>`;
  }

  document.getElementById('sidebar').innerHTML = html;
}

// ---- Render Header ----
function renderHeader() {
  const header = document.getElementById('dash-header');
  const main = document.querySelector('.dash-main');
  const dashboard = document.querySelector('.dashboard');
  if (userRole === 'guest') {
    header.style.display = '';
    dashboard.style.gridTemplateRows = '';
    main.style.gridRow = '';
    main.style.maxHeight = '';
    header.innerHTML = `
      <div style="display:flex;align-items:center;padding-left:8px">
        <img src="/public/logo.png" alt="key2read" style="height:52px;width:auto;cursor:pointer" onclick="navigate('guest-browse')">
      </div>
      <div></div>
      <div></div>`;
    return;
  }
  header.style.display = '';
  dashboard.style.gridTemplateRows = '';
  main.style.gridRow = '';
  main.style.maxHeight = '';
  const hUserName = currentUser?.name || 'User';
  const hInitials = hUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const hRole = userRole === 'student' ? (currentUser?.grade || '4th') + ' Grade Student' :
                userRole === 'child' ? (currentUser?.grade || '4th') + ' Grade Reader' :
                userRole === 'owner' ? 'Platform Owner' :
                userRole === 'principal' ? 'School Principal' :
                userRole === 'parent' ? 'Parent' :
                (currentUser?.grade || '4th') + ' Grade Teacher';
  document.getElementById('dash-header').innerHTML = `
    <div class="header-tabs">
      <button class="mobile-menu-btn" onclick="toggleMobileSidebar()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="header-search">
      ${IC.search}
      <input type="text" id="global-search-input" placeholder="${(userRole === 'student' || userRole === 'child') ? 'Search books, quizzes...' : userRole === 'parent' ? 'Search children, books, quizzes...' : 'Search students, books, quizzes...'}" oninput="handleGlobalSearch(this.value)">
    </div>
    <div class="header-actions">
      ${(userRole === 'teacher' || userRole === 'parent') ? `<button class="dash-icon-btn" onclick="navigate('purchases')" title="Recent Purchases">
        <span style="width:20px;height:20px;display:inline-flex">${IC.bell}</span>
        ${window._purchaseCount > 0 ? `<span class="dash-icon-badge">${window._purchaseCount}</span>` : ''}
      </button>
      <button class="dash-icon-btn" onclick="navigate('${userRole === 'parent' ? 'parent-settings' : 'teacher-settings'}')" title="Settings">
        <span style="width:20px;height:20px;display:inline-flex">${IC.gear}</span>
      </button>` : ''}
      <div class="header-profile-dropdown" style="position:relative">
        <button class="header-profile-btn" onclick="toggleProfileDropdown()" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:4px">
          <div class="header-avatar">${hInitials}</div>
        </button>
        <div id="profile-dropdown-menu" class="profile-dropdown-menu" style="display:none">
          <div style="padding:12px 16px;border-bottom:1px solid var(--g100)">
            <div style="font-weight:600;color:var(--navy);font-size:0.875rem">${escapeHtml(hUserName)}</div>
            <div style="font-size:0.75rem;color:var(--g400)">${hRole}</div>
          </div>
          ${userRole === 'teacher' ? `<button class="profile-dropdown-item" onclick="navigate('teacher-settings'); closeProfileDropdown()">
            <span style="width:16px;height:16px;display:inline-flex">${IC.gear}</span> Settings
          </button>` : userRole === 'parent' ? `<button class="profile-dropdown-item" onclick="navigate('parent-settings'); closeProfileDropdown()">
            <span style="width:16px;height:16px;display:inline-flex">${IC.gear}</span> Settings
          </button>` : ''}
          <button class="profile-dropdown-item profile-dropdown-item-danger" onclick="handleLogout()">
            <span style="width:16px;height:16px;display:inline-flex">${IC.logout}</span> Sign Out
          </button>
        </div>
      </div>
    </div>`;
}

// ---- Logout ----
async function handleLogout() {
  try { await API.logout(); } catch(e) { /* ignore */ }
  // Clear all auto-signin localStorage
  localStorage.removeItem('k2r_student_name');
  localStorage.removeItem('k2r_student_classcode');
  localStorage.removeItem('k2r_child_name');
  localStorage.removeItem('k2r_child_familycode');
  localStorage.removeItem('k2r_remember_creds');
  localStorage.removeItem('k2r_remember_email');
  window.location.href = 'signin.html';
}

// ---- Profile Dropdown ----
function toggleProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (!menu) return;
  const isOpen = menu.style.display !== 'none';
  menu.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', closeProfileDropdownOutside, { once: true });
    }, 0);
  }
}

function closeProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) menu.style.display = 'none';
}

function closeProfileDropdownOutside(e) {
  const dropdown = document.querySelector('.header-profile-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    closeProfileDropdown();
  } else if (dropdown && dropdown.contains(e.target)) {
    // Re-attach listener if click was inside
    document.addEventListener('click', closeProfileDropdownOutside, { once: true });
  }
}

// ---- Mobile Sidebar Toggle ----
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('mobile-open');
  let overlay = document.querySelector('.mobile-overlay');
  if (isOpen) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      overlay.onclick = () => toggleMobileSidebar();
      document.querySelector('.dashboard').appendChild(overlay);
    }
    // Force reflow then add active class for transition
    requestAnimationFrame(() => overlay.classList.add('active'));
  } else {
    if (overlay) overlay.classList.remove('active');
  }
}

// ---- Refresh student data from server ----
async function refreshStudentData() {
  if (!currentUser?.studentId) return;
  try {
    const [ws, bp, studentData] = await Promise.all([
      API.getWeeklyStats(currentUser.studentId),
      API.getBookProgress(currentUser.studentId),
      API.getStudent(currentUser.studentId)
    ]);
    currentUser.weeklyStats = ws;
    currentUser.totalBooksCompleted = ws.totalBooksCompleted || 0;
    currentUser.bookProgress = bp;
    // Sync keys and quizzes from server so dashboard stays accurate
    if (studentData) {
      currentUser.keys_earned = studentData.keys_earned || 0;
      currentUser.quizzes_completed = studentData.quizzes_completed || 0;
      currentUser.reading_score = studentData.reading_score || currentUser.reading_score;
      currentUser.accuracy = studentData.accuracy || currentUser.accuracy;
    }
    // Initialize badge tracking if not yet done
    if (Object.keys(_shownBadges || {}).length === 0) initShownBadges();
  } catch(e) {
    console.warn('refreshStudentData error:', e);
  }
}

// ---- Navigate ----
let _prevPage = null;
function navigate(p, detail, sid) {
  _prevPage = page;
  page = p;
  detailId = detail != null ? detail : null;
  studentId = sid != null ? sid : null;
  if (p !== 'reports') reportStudentId = null;
  // Close mobile sidebar if open
  document.querySelector('.sidebar')?.classList.remove('mobile-open');
  document.querySelector('.mobile-overlay')?.classList.remove('active');
  renderSidebar();
  renderMain();
  // Refresh data from server when navigating to student pages from quiz player
  if (_prevPage === 'quiz-player' && (userRole === 'student' || userRole === 'child') &&
      (p === 'student-dashboard' || p === 'student-quizzes' || p === 'student-progress')) {
    refreshStudentData().then(() => renderMain());
  }
}

// ---- Render Main ----
function renderMain() {
  const el = document.getElementById('dash-main');
  switch (page) {
    // Teacher pages
    case 'teacher-dashboard': el.innerHTML = renderTeacherDashboard(); loadTeacherDashboardData(); break;
    case 'quizzes':
      if (detailId) { el.innerHTML = renderAssignmentDetail(); break; }
      el.innerHTML = renderQuizzes();
      break;
    case 'students':
      if (studentId !== null) { el.innerHTML = renderStudentProfile(); break; }
      el.innerHTML = renderStudents();
      break;
    case 'store':      el.innerHTML = (userRole === 'student' || userRole === 'child') ? renderStudentStore() : renderStore(); if (userRole === 'student' || userRole === 'child') loadStudentRecentPurchases(); else loadStorePurchaseNotifications(); break;
    case 'purchases':
      if (!window._purchaseData && currentUser?.classId) {
        API.getRecentPurchases(currentUser.classId).then(data => {
          window._purchaseData = data || [];
          window._purchaseCount = (data || []).length;
          renderSidebar();
          el.innerHTML = renderPurchasesPage();
        });
        el.innerHTML = '<div style="text-align:center;padding:60px 0;color:var(--g400)">Loading purchases...</div>';
      } else {
        el.innerHTML = renderPurchasesPage();
      }
      break;
    case 'library':    el.innerHTML = renderLibrary(); initLibrarySearch(); break;
    case 'book-detail': el.innerHTML = renderBookDetail(); break;
    case 'celebrate':  el.innerHTML = renderCelebrate(); loadCertificateData(); break;
    case 'aitools':    el.innerHTML = renderAITools(); break;
    case 'class-goals': el.innerHTML = renderClassGoals(); loadClassGoalsData(); break;
    case 'teacher-settings': el.innerHTML = renderTeacherSettings(); break;
    case 'parent-settings': el.innerHTML = renderParentSettings(); break;
    case 'reports':
      if (reportStudentId !== null) { el.innerHTML = renderStudentReport(); break; }
      el.innerHTML = renderReports();
      loadReportsChartData();
      break;
    case 'quiz-player':
      el.innerHTML = '<div id="quiz-player-root"></div>';
      break;
    // Guest pages
    case 'guest-browse':
      el.innerHTML = renderGuestBrowse();
      initBookSearch();
      break;
    // Student pages
    case 'student-dashboard':  el.innerHTML = renderStudentDashboard(); initStudentBookSearch(); break;
    case 'student-quizzes':    el.innerHTML = renderStudentQuizzes(); break;
    case 'student-progress':   el.innerHTML = renderStudentProgress(); break;
    case 'student-badges':     el.innerHTML = renderStudentBadges(); break;
    // Principal pages
    case 'principal-dashboard': el.innerHTML = renderPrincipalDashboard(); break;
    case 'principal-classes':   el.innerHTML = renderPrincipalClasses(); break;
    case 'principal-teachers':  el.innerHTML = renderPrincipalTeachers(); break;
    case 'principal-settings':  el.innerHTML = renderPrincipalSettings(); break;
    // Owner pages
    case 'owner-dashboard': el.innerHTML = renderOwnerDashboard(); break;
    case 'owner-teachers':  el.innerHTML = renderOwnerTeachers(); break;
    case 'owner-students':  el.innerHTML = renderOwnerStudents(); break;
    case 'owner-settings':  el.innerHTML = renderOwnerSettings(); break;
    case 'owner-gallery':   el.innerHTML = renderOwnerGallery(); break;
    default:
      if (userRole === 'guest') { el.innerHTML = renderGuestBrowse(); initBookSearch(); }
      else if (userRole === 'student' || userRole === 'child') el.innerHTML = renderStudentDashboard();
      else if (userRole === 'owner') el.innerHTML = renderOwnerDashboard();
      else if (userRole === 'principal') el.innerHTML = renderPrincipalDashboard();
      else { el.innerHTML = renderTeacherDashboard(); loadTeacherDashboardData(); }
  }
}

// ---- Launch Quiz Player ----
async function launchQuiz(bookId, chapterNum, sid) {
  // Find student — check students array first, then fall back to currentUser for student role
  let s = sid != null ? students.find(st => st.id === sid) : students[0];
  if (!s && (userRole === 'student' || userRole === 'child') && currentUser) {
    s = {
      id: currentUser.studentId,
      name: currentUser.name,
      grade: currentUser.grade || '4th',
      reading_score: currentUser.reading_score || 500,
      accuracy: currentUser.accuracy || 0,
      keys: currentUser.keys_earned || 0,
      quizzes: currentUser.quizzes_completed || 0
    };
  }
  // Teacher quiz mode — create/get shadow student
  if (!s && (userRole === 'teacher' || userRole === 'owner' || userRole === 'principal')) {
    try {
      const result = await API.startTeacherQuiz();
      s = {
        id: result.studentId,
        name: result.student?.name || 'Teacher Demo',
        grade: '4th',
        reading_score: result.student?.reading_score || 500,
        accuracy: result.student?.accuracy || 0,
        keys: result.student?.keys_earned || 0,
        quizzes: result.student?.quizzes_completed || 0
      };
      sid = result.studentId;
    } catch(e) {
      console.error('Teacher quiz mode error:', e);
    }
  }
  // Guests get no student object — quiz uses local scoring
  page = 'quiz-player';
  renderSidebar();
  renderMain();

  const playerRoot = document.getElementById('quiz-player-root');
  if (playerRoot) playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">📖</div>Loading quiz...<br><small>Loading chapter questions</small></div>';

  try {
    const quizData = await API.getChapterQuiz(bookId, chapterNum);
    // Get book info (use globally cached books array — no extra API call)
    let book = books.find(b => b.id === bookId);
    if (!book) book = { title: 'Book Quiz', author: '' };

    // Determine if there's a next chapter
    const totalChapters = book.chapter_count || bookChapters.length || 0;
    const nextChapterInfo = chapterNum < totalChapters ? { bookId, chapterNum: chapterNum + 1, studentId: sid } : null;

    QuizEngine.start({ chapter: quizData.chapter, questions: quizData.questions, book }, s, async (results) => {
      // Quiz completed callback — refresh student data
      if (s) {
        s.score = results.newReadingScore || s.score;
        s.reading_level = results.newReadingLevel || s.reading_level;
        s.keys = (s.keys || 0) + (results.keysEarned || 0);
        s.quizzes = (s.quizzes || 0) + 1;
      }
      // Invalidate cached quiz results so modals fetch fresh data
      invalidateQuizResultsCache();
      // Update currentUser so dashboard shows new scores immediately
      if (currentUser && (userRole === 'student' || userRole === 'child')) {
        currentUser.reading_score = results.newReadingScore || currentUser.reading_score;
        currentUser.reading_level = results.newReadingLevel || currentUser.reading_level;
        currentUser.keys_earned = (currentUser.keys_earned || 0) + (results.keysEarned || 0);
        currentUser.quizzes_completed = (currentUser.quizzes_completed || 0) + 1;
        if (results.score != null) {
          const oldAcc = currentUser.accuracy || 0;
          const oldQuizzes = (currentUser.quizzes_completed || 1) - 1;
          currentUser.accuracy = oldQuizzes > 0 ? Math.round((oldAcc * oldQuizzes + results.score) / currentUser.quizzes_completed) : Math.round(results.score);
        }
        // Update weekly stats so Weekly Wins + Total Progress stay in sync
        if (currentUser.weeklyStats) {
          currentUser.weeklyStats.keysThisWeek = (currentUser.weeklyStats.keysThisWeek || 0) + (results.keysEarned || 0);
          currentUser.weeklyStats.quizzesThisWeek = (currentUser.weeklyStats.quizzesThisWeek || 0) + 1;
        }
      }
      // Update completed chapters so next chapter unlocks
      if (!completedChapters.includes(chapterNum)) {
        completedChapters.push(chapterNum);
      }
      // Check if ALL chapters for this book are now completed
      if (completedChapters.length >= bookChapters.length && bookChapters.length > 0) {
        if (currentUser.weeklyStats) currentUser.weeklyStats.booksCompletedThisWeek = (currentUser.weeklyStats.booksCompletedThisWeek || 0) + 1;
        try { setTimeout(() => showBookCompletionCelebration(book, results), 600); } catch(err) { console.error('Celebration error:', err); }
      }
      // Refresh all student data from server so My Quizzes, dashboard, and Weekly Wins stay in sync
      await refreshStudentData();
      // Check if any new badges were earned
      checkAndShowNewBadges();
    }, nextChapterInfo);
    QuizEngine.render();
  } catch(e) {
    playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">⚠️</div>Could not load quiz.<br><small>' + (e.message || 'Check that the server is running') + '</small><br><br><button class="btn btn-outline" onclick="navigate(\'guest-browse\')">Back to Books</button></div>';
  }
}

// ---- Page: Quizzes & Assessments ----
// ---- Teacher Dashboard (Overview) ----
function renderTeacherDashboard() {
  const avgAcc = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.accuracy || 0), 0) / students.length) : 0;
  const totalKeys = students.reduce((s, st) => s + (st.keys_earned || st.keys || 0), 0);
  const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.reading_score || st.score || 0), 0) / students.length) : 0;
  const totalQuizzes = students.reduce((s, st) => s + (st.quizzes_completed || 0), 0);

  if (students.length === 0) {
    return `
      <div class="page-header"><h1><img src="/public/logo.png" alt="key2read" style="height:44px;width:auto;vertical-align:middle;margin-right:10px">Dashboard</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.users}</div>
        <h2>Welcome to key2read!</h2>
        <p>Your dashboard will come alive once students join your class and start taking quizzes.</p>
        <button class="btn btn-primary" onclick="navigate('quizzes')">${IC.clip} Go to Quizzes</button>
      </div>`;
  }

  // Trend chart placeholder — will be populated with real data from API
  const trendChart = '<div id="trend-chart-container" style="display:flex;align-items:center;justify-content:center;min-height:200px;color:var(--g400);font-size:0.875rem">Loading chart...</div>';

  // Build reading score pie chart
  const needsSupport = students.filter(s => (s.reading_score || s.score || 0) < 400).length;
  const developing = students.filter(s => { const sc = s.reading_score || s.score || 0; return sc >= 400 && sc < 600; }).length;
  const onTrack = students.filter(s => { const sc = s.reading_score || s.score || 0; return sc >= 600 && sc < 800; }).length;
  const advanced = students.filter(s => (s.reading_score || s.score || 0) >= 800).length;
  const pieChart = svgPieChart([
    { label: 'Needs Support (0–399)', value: needsSupport, color: '#EF4444' },
    { label: 'Developing (400–599)', value: developing, color: '#F59E0B' },
    { label: 'On Track (600–799)', value: onTrack, color: '#10B981' },
    { label: 'Advanced (800+)', value: advanced, color: '#2563EB' }
  ], 280);

  return `
    <div class="page-header">
      <h1><img src="/public/logo.png" alt="key2read" style="height:44px;width:auto;vertical-align:middle;margin-right:10px">Dashboard</h1>
      <div class="page-header-actions" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="openModal('dashboard-help')" style="font-size:0.8rem;padding:6px 14px;border-radius:20px">&#10067; How This Dashboard Works</button>
        <span style="font-size:0.875rem;color:var(--g500)">${currentUser?.name || 'Teacher'}'s ${userRole === 'parent' ? 'Family' : 'Class'}</span>
        ${currentUser?.classCode ? `<div style="display:flex;align-items:center;gap:8px;background:var(--blue-p, #EFF6FF);padding:8px 16px;border-radius:10px;border:2px dashed var(--blue)">
          <span style="font-size:0.75rem;color:var(--g500)">${userRole === 'parent' ? 'Family Code:' : 'Class Code:'}</span>
          <span style="font-size:1.1rem;font-weight:800;color:var(--blue);letter-spacing:0.08em;user-select:all;cursor:text" oncontextmenu="navigator.clipboard.writeText('${currentUser.classCode}')">${currentUser.classCode}</span>
          <button class="btn btn-sm btn-ghost" style="padding:2px 8px;font-size:0.7rem" onclick="navigator.clipboard.writeText('${currentUser.classCode}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy',1500)">Copy</button>
        </div>` : ''}
      </div>
    </div>

    <div class="stat-cards stat-cards-5">
      <div class="stat-card clickable-card" onclick="document.getElementById('dashboard-roster')?.scrollIntoView({behavior:'smooth'})">
        <div class="stat-card-icon"><img src="/public/Student_Outline_Icon.png" alt="${userRole === 'parent' ? 'Children' : 'Students'}"></div>
        <div class="stat-card-label">${userRole === 'parent' ? 'Children' : 'Students'} <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('${userRole === 'parent' ? 'Children' : 'Students'}', 'The total number of ${userRole === 'parent' ? 'children in your family' : 'students in your class'}. Click to scroll to your ${userRole === 'parent' ? 'children' : 'student'} roster.')">?</button></div>
        <div class="stat-card-value">${students.length}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('reports')">
        <div class="stat-card-icon"><img src="/public/Book_Outline_Icon.png" alt="Reading Score"></div>
        <div class="stat-card-label">Average Reading Score <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Reading Score', 'A score from 0 to 1000 that measures how well your class is reading overall. It\\'s based on quiz scores, reading effort, independence (using fewer hints), vocabulary growth, and persistence. Click to see Growth Reports.')">?</button></div>
        <div class="stat-card-value">${avgScore}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('reports')">
        <div class="stat-card-icon"><img src="/public/Comprehension_Outline_Icon.png" alt="Comprehension"></div>
        <div class="stat-card-label">Average Comprehension <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Comprehension', 'The average percentage of quiz questions your students answer correctly. A higher number means students are understanding what they read. Click to see Growth Reports.')">?</button></div>
        <div class="stat-card-value">${avgAcc}%</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('store')">
        <div class="stat-card-icon"><img src="/public/Key_Outline_Icon.png" alt="Keys Earned"></div>
        <div class="stat-card-label">Total Keys Earned <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Total Keys Earned', 'Keys are rewards students earn by passing quizzes with 80% or higher. Students can spend keys in the Class Store to redeem prizes you set up. Click to manage the store.')">?</button></div>
        <div class="stat-card-value">${totalKeys.toLocaleString()}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('quizzes')">
        <div class="stat-card-icon"><img src="/public/Quiz_Outline_Icon.png" alt="Quizzes"></div>
        <div class="stat-card-label">Quizzes Completed <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Quizzes Completed', 'The total number of chapter quizzes all your students have completed. Each book chapter has its own quiz. Click to view assignments.')">?</button></div>
        <div class="stat-card-value">${totalQuizzes}</div>
      </div>
    </div>

    <div class="teacher-dashboard-charts">
      <div class="list-card" style="padding:24px">
        <h3 style="margin:0 0 4px 0;display:flex;align-items:center"><img src="/public/Book_Outline_Icon_Black.png" alt="" style="width:32px;height:32px;margin-right:8px">Reading Score Distribution</h3>
        <p style="font-size:0.8rem;color:var(--g400);margin:0 0 16px 0">How your students are performing across reading levels</p>
        ${pieChart}
      </div>
      <div class="list-card" style="padding:24px;cursor:pointer;display:flex;flex-direction:column" onclick="navigate('reports')">
        <h3 style="margin:0 0 4px 0;display:flex;align-items:center"><img src="/public/Growth_Outline_.png" alt="" style="width:32px;height:32px;margin-right:8px">Class Reading Score Trend</h3>
        <p style="font-size:0.8rem;color:var(--g400);margin:0 0 8px 0">This week's daily average · <span style="color:var(--blue);font-weight:600">View Full Report →</span></p>
        <div style="flex:1;min-height:200px">${trendChart}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
      <div class="list-card" style="padding:24px">
        <h3 style="margin:0 0 4px 0;display:flex;align-items:center"><img src="/public/Stacked_Book_Outline.png" alt="" style="width:32px;height:32px;margin-right:8px">Top 3 Books</h3>
        <p style="font-size:0.8rem;color:var(--g400);margin:0 0 16px 0">The most popular books your students are reading of all time</p>
        <div id="popular-books-chart">
          <div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Loading...</div>
        </div>
      </div>
      <div class="list-card" style="padding:24px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <h3 style="margin:0 0 4px 0;display:flex;align-items:center"><img src="/public/Single_Book_Outline_.png" alt="" style="width:32px;height:32px;margin-right:8px">Books Ranked by Popularity</h3>
          <button class="btn btn-sm btn-outline" onclick="showTop10BooksModal()" style="font-size:0.7rem">View Top 10 of All Time</button>
        </div>
        <p style="font-size:0.8rem;color:var(--g400);margin:0 0 16px 0">All-time books ranked by popularity</p>
        <div id="popular-books-list">
          <div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Loading...</div>
        </div>
      </div>
    </div>

    ${renderDashboardRoster()}

    <div class="list-card" style="padding:24px;margin-top:20px">
      <h3 style="margin:0 0 4px 0;display:flex;align-items:center"><img src="/public/Key_Outline_Icon_Blk.png" alt="" style="width:32px;height:32px;margin-right:8px">Store Purchases</h3>
      <p style="font-size:0.8rem;color:var(--g400);margin:0 0 16px 0">Students who spent their Keys in the Class Store</p>
      <div id="purchase-notifications">
        <div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">Loading...</div>
      </div>
    </div>

    <div class="list-card teacher-dashboard-activity" style="padding:24px;margin-top:20px">
      <h3 style="margin:0 0 16px 0;display:flex;align-items:center"><img src="/public/Recent_Outline_Icon_.png" alt="" style="width:32px;height:32px;margin-right:8px">Recent Activity</h3>
      <div id="recent-activity-feed">
        <div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">Loading...</div>
      </div>
    </div>
  `;
}

// Load async data for teacher dashboard
function loadTeacherDashboardData() {
  const classId = currentUser?.classId;
  if (!classId) return;

  // Weekly growth chart (real data from reading_level_history) — dashboard always shows this week
  API.getWeeklyGrowth(classId, 'week').then(function(data) {
    var container = document.getElementById('trend-chart-container');
    if (!container) return;
    console.log('[Dashboard] Weekly growth data:', JSON.stringify(data));
    if (!data || data.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No quiz data yet — chart will appear once students start taking quizzes!</div>';
      return;
    }
    // Data already filtered to only weeks with actual data
    var scores = data.map(function(w) { return w.avgScore; });
    var labels = data.map(function(w) { return w.label; });
    if (scores.length === 1) {
      // Single data point — show as line from starting score (500) to current
      scores.unshift(500);
      labels.unshift('Start');
    }
    container.innerHTML = svgAreaChart(scores, labels, 620, 340);
  }).catch(function(err) {
    console.error('[Dashboard] Weekly growth error:', err);
    var container = document.getElementById('trend-chart-container');
    if (container) container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Could not load chart data</div>';
  });

  // Popular books
  API.getPopularBooks(classId).then(data => {
    const el = document.getElementById('popular-books-chart');
    if (!el) return;
    if (!data || data.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No book data yet — students need to complete some quizzes!</div>';
      const listEl = document.getElementById('popular-books-list');
      if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No data yet</div>';
      return;
    }
    // Store data globally so click handler can access it
    window._popularBooksData = data;
    const top3 = data.slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const borderColors = ['#F59E0B', '#94A3B8', '#CD7F32'];
    el.innerHTML = `<div style="display:flex;gap:14px;justify-content:center">
      ${top3.map((b, i) => {
        const cover = b.coverUrl
          ? `<img src="${b.coverUrl}" alt="${escapeHtml(b.title)}" style="width:100%;height:auto;border-radius:8px;display:block" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : '';
        return `<div style="text-align:center;cursor:pointer;flex:1;min-width:0;max-width:160px" onclick="showPopularBookDetail(${i})">
          <div style="position:relative;margin-bottom:8px">
            <div style="border:3px solid ${borderColors[i]};border-radius:10px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.12);background:#fff">
              ${cover}
              <div style="display:${b.coverUrl ? 'none' : 'flex'};width:100%;height:180px;background:linear-gradient(135deg, var(--blue), var(--purple));align-items:center;justify-content:center;color:#fff;font-weight:700;padding:10px;font-size:0.75rem;text-align:center">${escapeHtml(b.title)}</div>
            </div>
            <span style="position:absolute;top:-18px;left:-18px;font-size:2.75rem">${medals[i]}</span>
          </div>
          <p style="font-size:0.85rem;font-weight:700;color:var(--g800);margin:0 0 3px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(b.title)}</p>
          <p style="font-size:0.7rem;color:var(--g400);margin:0">${b.studentCount} ${b.studentCount === 1 ? 'reader' : 'readers'} · ${b.quizCount} ${b.quizCount === 1 ? 'quiz' : 'quizzes'}</p>
        </div>`;
      }).join('')}
    </div>`;
    // Populate the ranked list on the right
    const listEl = document.getElementById('popular-books-list');
    if (listEl) {
      listEl.innerHTML = data.slice(0, 10).map((b, i) => {
        const rankColors = ['#F59E0B', '#94A3B8', '#CD7F32'];
        const rankBg = i < 3 ? rankColors[i] : 'var(--navy)';
        const namesList = (b.studentNames || []).slice(0, 3).map(n => n.split(' ')[0]).join(', ');
        const extra = (b.studentNames || []).length > 3 ? ' +' + ((b.studentNames || []).length - 3) + ' more' : '';
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;' + (i < data.slice(0,10).length - 1 ? 'border-bottom:1px solid var(--g100);' : '') + '">' +
          '<div style="width:28px;height:28px;border-radius:50%;background:' + rankBg + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;flex-shrink:0">' + (i + 1) + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:0.8rem;font-weight:700;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(b.title) + '</div>' +
            '<div style="font-size:0.7rem;color:var(--g400)">' + b.studentCount + ' ' + (b.studentCount === 1 ? 'reader' : 'readers') + ' · ' + b.quizCount + ' ' + (b.quizCount === 1 ? 'quiz' : 'quizzes') + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  }).catch(() => {
    const el = document.getElementById('popular-books-chart');
    if (el) el.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--g400);font-size:0.875rem">Could not load book data</div>';
    const listEl = document.getElementById('popular-books-list');
    if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--g400);font-size:0.875rem">Could not load book data</div>';
  });

  // Recent activity
  API.getRecentActivity(classId).then(data => {
    const el = document.getElementById('recent-activity-feed');
    if (!el) return;
    if (!data || data.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">No activity yet — once students start taking quizzes, their progress will show up here!</div>';
      return;
    }
    el.innerHTML = data.map(a => {
      const timeAgo = formatTimeAgo(a.completedAt);
      const scoreCls = a.score >= 80 ? 'green' : a.score >= 60 ? 'gold' : 'red';
      return `<div class="activity-row">
        <span class="activity-time">${timeAgo}</span>
        <span class="activity-desc"><strong>${escapeHtml(a.studentName)}</strong> completed Chapter ${a.chapterNumber}: ${escapeHtml(a.chapterTitle)} of <em>${escapeHtml(a.bookTitle)}</em></span>
        <span class="activity-score ${scoreCls}">${a.score}%</span>
        <span class="activity-keys">🔑 ${a.keysEarned}</span>
      </div>`;
    }).join('');
  }).catch(() => {
    const el = document.getElementById('recent-activity-feed');
    if (el) el.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--g400);font-size:0.875rem">Could not load activity</div>';
  });

  // Purchase notifications — always fetch fresh
  window._purchaseData = null;
  API.getRecentPurchases(classId).then(data => {
    console.log('Purchase data loaded:', data?.length || 0, 'items');
    window._purchaseData = data || [];
    window._purchaseCount = (data || []).filter(p => !p.fulfilled).length;
    renderSidebar(); // refresh badge count
    const el = document.getElementById('purchase-notifications');
    if (!el) return;
    if (!data || data.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">No purchases yet — when students spend Keys in the store, you\'ll see them here!</div>';
      return;
    }
    el.innerHTML = data.map(p => {
      const timeAgo = formatTimeAgo(p.purchasedAt);
      const dateStr = p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
      const st = students.find(s => s.name === p.studentName);
      const initials = p.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const color = st ? st.color : '#8B5CF6';
      const checkedAttr = p.fulfilled ? 'checked' : '';
      const fulfilledStyle = p.fulfilled ? 'opacity:0.6;' : '';
      return '<div id="purchase-row-' + p.id + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--g100);' + fulfilledStyle + '">' +
        '<label style="display:flex;align-items:center;cursor:pointer;flex-shrink:0" title="' + (p.fulfilled ? 'Prize given' : 'Mark as given') + '">' +
          '<input type="checkbox" ' + checkedAttr + ' onchange="togglePurchaseFulfilled(' + p.id + ', this.checked)" style="width:18px;height:18px;accent-color:var(--green, #10B981);cursor:pointer">' +
        '</label>' +
        '<div style="width:32px;height:32px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.65rem;flex-shrink:0">' + escapeHtml(initials) + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div><span style="font-weight:600;color:var(--navy)">' + escapeHtml(p.studentName) + '</span>' +
          ' <span style="color:var(--g500)">purchased</span> ' +
          '<span style="font-weight:600;color:var(--purple)">' + escapeHtml(p.itemName) + '</span>' +
          ' <span style="color:var(--g500)">for</span> ' +
          '<span style="font-weight:600;color:var(--gold)">\uD83D\uDD11 ' + p.price + ' Keys</span></div>' +
          '<div style="font-size:0.72rem;color:var(--g400);margin-top:2px">' + dateStr + ' · ' + timeAgo + (p.fulfilled ? ' · <span style="color:var(--green, #10B981);font-weight:600">✓ Prize given</span>' : '') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }).catch(() => {
    const el = document.getElementById('purchase-notifications');
    if (el) el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">No purchases yet — when students spend Keys in the store, you\'ll see them here!</div>';
  });
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function togglePurchaseFulfilled(purchaseId, fulfilled) {
  try {
    await API.fulfillPurchase(purchaseId, fulfilled);
    // Update cached data
    if (window._purchaseData) {
      const item = window._purchaseData.find(p => p.id === purchaseId);
      if (item) item.fulfilled = fulfilled;
    }
    // Update unfulfilled count and sidebar badge
    window._purchaseCount = (window._purchaseData || []).filter(p => !p.fulfilled).length;
    renderSidebar();
    const row = document.getElementById('purchase-row-' + purchaseId);
    if (row) {
      row.style.opacity = fulfilled ? '0.6' : '1';
      // Update the status text
      const statusEl = row.querySelector('[data-fulfilled-status]');
      if (statusEl) statusEl.innerHTML = fulfilled ? ' · <span style="color:var(--green, #10B981);font-weight:600">✓ Prize given</span>' : '';
    }
    // Also update the store purchases page if it's visible
    const storeRow = document.getElementById('store-purchase-row-' + purchaseId);
    if (storeRow) {
      storeRow.style.opacity = fulfilled ? '0.6' : '1';
    }
    // Also update the dedicated purchases page row if visible
    const pageRow = document.getElementById('purchases-page-row-' + purchaseId);
    if (pageRow) {
      pageRow.style.opacity = fulfilled ? '0.6' : '1';
    }
  } catch (e) {
    console.error('Failed to toggle fulfilled:', e);
    // Revert the checkbox and cached data
    if (window._purchaseData) {
      const item = window._purchaseData.find(p => p.id === purchaseId);
      if (item) item.fulfilled = !fulfilled;
    }
    window._purchaseCount = (window._purchaseData || []).filter(p => !p.fulfilled).length;
    renderSidebar();
    const row = document.getElementById('purchase-row-' + purchaseId);
    if (row) {
      const cb = row.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = !fulfilled;
    }
  }
}

function showStatHelp(title, description) {
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:380px">
        <div class="modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:20px">
          <p style="font-size:0.9rem;color:var(--g600);line-height:1.7;margin:0">${description}</p>
        </div>
      </div>
    </div>`;
}

function renderDashboardRoster() {
  if (students.length === 0) return '';

  // Sort by reading score ascending (kids who need the most help first)
  const sorted = [...students].sort((a, b) => (a.reading_score || a.score || 0) - (b.reading_score || b.score || 0));
  const show = sorted.slice(0, 5);
  const remaining = students.length - show.length;

  return `
    <div id="dashboard-roster" class="list-card" style="padding:24px;margin-top:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <h3 style="margin:0 0 2px 0;display:flex;align-items:center"><img src="/public/Student_Outline_Icon_Blk.png" alt="" style="width:32px;height:32px;margin-right:8px">Student Roster</h3>
          <p style="font-size:0.8rem;color:var(--g400);margin:0">Sorted by who needs the most help</p>
        </div>
        <button class="btn btn-sm btn-outline" onclick="navigate('students')">View all ${students.length} students →</button>
      </div>
      <div class="dashboard-roster">
        ${show.map(s => {
          const score = s.reading_score || s.score || 0;
          const accuracy = s.accuracy || 0;
          const initials = s.initials || s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          const comp = s.comprehension_label || 'No Data';
          const quizzes = s.quizzes_completed || 0;
          const keys = s.keys_earned || s.keys || 0;

          // Status indicator
          let statusLabel, statusBg, statusColor;
          if (score < 500 || accuracy < 60) {
            statusLabel = 'Needs Support'; statusBg = '#FEE2E2'; statusColor = '#DC2626';
          } else if (score < 700) {
            statusLabel = 'Developing'; statusBg = '#FEF9C3'; statusColor = '#92400E';
          } else {
            statusLabel = 'On Track'; statusBg = '#ECFDF5'; statusColor = '#059669';
          }

          return `<div class="roster-row" onclick="navigate('students', null, ${s.id})">
            <div class="roster-avatar" style="background:${s.color || '#2563EB'}">${escapeHtml(initials)}</div>
            <div class="roster-info">
              <div class="roster-name">${escapeHtml(s.name)}</div>
              <div class="roster-stats">
                <span>Score: <strong>${score}</strong></span>
                <span>Accuracy: <strong>${accuracy}%</strong></span>
                <span>Quizzes: <strong>${quizzes}</strong></span>
                <span>Keys: <strong>${keys}</strong> 🔑</span>
              </div>
            </div>
            <span class="roster-status" style="background:${statusBg};color:${statusColor}">${statusLabel}</span>
          </div>`;
        }).join('')}
      </div>
      ${remaining > 0 ? `<div style="text-align:center;margin-top:12px">
        <button class="btn btn-ghost btn-sm" onclick="navigate('students')" style="color:var(--blue)">+ ${remaining} more student${remaining > 1 ? 's' : ''} — View all →</button>
      </div>` : ''}
    </div>`;
}

function showPopularBookDetail(idx) {
  const data = window._popularBooksData;
  if (!data || !data[idx]) return;
  const b = data[idx];

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:420px">
        <div class="modal-header">
          <h3>📚 ${escapeHtml(b.title)}</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:24px">
          <div style="display:flex;gap:16px;margin-bottom:16px">
            <div style="padding:12px;background:var(--blue-p, #EFF6FF);border-radius:10px;text-align:center;flex:1">
              <div style="font-size:1.5rem;font-weight:800;color:var(--navy)">${b.studentCount}</div>
              <div style="font-size:0.75rem;color:var(--g500)">Students Reading</div>
            </div>
            <div style="padding:12px;background:var(--green-p, #ECFDF5);border-radius:10px;text-align:center;flex:1">
              <div style="font-size:1.5rem;font-weight:800;color:var(--green)">${b.quizCount}</div>
              <div style="font-size:0.75rem;color:var(--g500)">Quizzes Taken</div>
            </div>
          </div>
          <h4 style="font-size:0.9rem;margin:0 0 10px 0;color:var(--g600)">Students reading this book:</h4>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${(b.studentNames || []).map(name => {
              const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const st = students.find(s => s.name === name);
              const color = st ? st.color : '#2563EB';
              return `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--g50);border-radius:8px;cursor:pointer" onclick="closeModal(); navigate('students', null, ${st ? st.id : 'null'})">
                <div style="width:28px;height:28px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.65rem;flex-shrink:0">${escapeHtml(initials)}</div>
                <span style="font-size:0.875rem;font-weight:600;color:var(--navy)">${escapeHtml(name)}</span>
                <span style="margin-left:auto;font-size:0.75rem;color:var(--g400)">View profile →</span>
              </div>`;
            }).join('')}
          </div>
          ${b.bookId ? `<button class="btn btn-outline btn-sm" style="margin-top:16px;width:100%" onclick="closeModal(); openBook(${b.bookId})">View Book Details</button>` : ''}
        </div>
      </div>
    </div>`;
}

function showTop10BooksModal() {
  const data = window._popularBooksData;
  if (!data || data.length === 0) { showToast('No book data yet'); return; }
  const top10 = data.slice(0, 10);
  const borderColors = ['#F59E0B', '#94A3B8', '#CD7F32'];
  const modal = document.getElementById('modal-root');
  modal.innerHTML = '<div class="modal-overlay" onclick="closeModal(event)">' +
    '<div class="modal" onclick="event.stopPropagation()" style="max-width:700px">' +
      '<div class="modal-header"><h3>📚 Top 10 Books of All Time</h3><button class="modal-close" onclick="closeModal()">' + IC.x + '</button></div>' +
      '<div class="modal-body" style="padding:24px">' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(110px, 1fr));gap:16px">' +
          top10.map(function(b, i) {
            var coverHtml = b.coverUrl
              ? '<img src="' + b.coverUrl + '" alt="' + escapeHtml(b.title) + '" style="width:100%;height:auto;border-radius:6px;display:block" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
              : '';
            var border = i < 3 ? borderColors[i] : 'var(--g200)';
            var rankBg = i < 3 ? borderColors[i] : 'var(--navy)';
            var numberBadge = '<span style="position:absolute;top:-12px;left:-12px;width:34px;height:34px;border-radius:50%;background:' + rankBg + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.95rem;font-weight:900;box-shadow:0 2px 6px rgba(0,0,0,0.2)">' + (i+1) + '</span>';
            return '<div style="text-align:center;cursor:pointer" onclick="closeModal();showPopularBookDetail(' + i + ')">' +
              '<div style="position:relative;margin-bottom:6px">' +
                '<div style="border:2px solid ' + border + ';border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);background:#fff">' +
                  coverHtml +
                  '<div style="display:' + (b.coverUrl ? 'none' : 'flex') + ';width:100%;height:140px;background:linear-gradient(135deg,var(--blue),var(--purple));align-items:center;justify-content:center;color:#fff;font-weight:700;padding:8px;font-size:0.65rem;text-align:center">' + escapeHtml(b.title) + '</div>' +
                '</div>' +
                numberBadge +
              '</div>' +
              '<p style="font-size:0.7rem;font-weight:700;color:var(--g800);margin:0 0 2px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(b.title) + '</p>' +
              '<p style="font-size:0.6rem;color:var(--g400);margin:0">' + b.studentCount + ' ' + (b.studentCount === 1 ? 'reader' : 'readers') + '</p>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div></div>';
}

function renderQuizzes() {
  const classCode = currentUser?.classCode || '';
  const isParent = userRole === 'parent';
  const codeLabel = isParent ? 'Family Code' : 'Class Code';
  const memberLabel = isParent ? 'children' : 'students';
  const memberSingular = isParent ? 'child' : 'student';
  const MemberLabel = isParent ? 'Children' : 'Students';
  const groupLabel = isParent ? 'family' : 'class';
  const avgAcc = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.accuracy || 0), 0) / students.length) : 0;
  const totalKeys = students.reduce((s, st) => s + (st.keys_earned || st.keys || 0), 0);
  const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.reading_score || st.score || 0), 0) / students.length) : 0;

  // Class/Family code banner
  let html = '';
  if (classCode) {
    html += `
    <div class="class-code-banner">
      <div class="class-code-banner-left">
        <div class="class-code-banner-icon">${IC.users}</div>
        <div>
          <div class="class-code-banner-label">Your ${codeLabel}</div>
          <div class="class-code-banner-desc">Share this code with ${memberLabel} so they can join your ${groupLabel}.</div>
        </div>
      </div>
      <div class="class-code-banner-right">
        <span class="class-code-value">${classCode}</span>
        <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText('${classCode}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy',1500)">Copy</button>
      </div>
    </div>`;
  }

  // Empty state — no students/children yet
  if (students.length === 0) {
    html += `
    <div class="empty-state">
      <div class="empty-state-icon">${IC.users}</div>
      <h2>Welcome to key2read!</h2>
      <p>Your ${groupLabel} is set up and ready to go. Here's how to get started:</p>
      <div class="getting-started-steps">
        <div class="gs-step">
          <div class="gs-step-num">1</div>
          <div>
            <strong>Share your ${codeLabel.toLowerCase()}</strong>
            <p>Give ${memberLabel} the code <strong>${classCode}</strong> so they can join your ${groupLabel}.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">2</div>
          <div>
            <strong>${MemberLabel} sign up</strong>
            <p>They go to the signup page, choose "${isParent ? 'Child' : 'Student'}", and enter the ${codeLabel.toLowerCase()}.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">3</div>
          <div>
            <strong>${MemberLabel} read &amp; take quizzes</strong>
            <p>${MemberLabel} pick books from the library, read chapters, and take quizzes after each one.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">4</div>
          <div>
            <strong>Track growth</strong>
            <p>Watch your ${memberLabel}'s reading scores, comprehension, vocabulary, and independence grow on this dashboard.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">5</div>
          <div>
            <strong>Celebrate success</strong>
            <p>Print certificates when students complete books!</p>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:24px">
        <button class="btn btn-primary" onclick="navigate('library')">${IC.book} Browse Book Library</button>
      </div>
    </div>`;
    return html;
  }

  // Normal teacher dashboard with students
  html += `
    <div class="page-header">
      <h1>Quizzes & Assessments <span class="badge badge-blue">${assignments.length}</span></h1>
      <div class="page-header-actions">
        <button class="btn btn-ghost btn-sm" onclick="openModal('dashboard-help')" title="How this dashboard works">&#10067; How it works</button>
      </div>
    </div>

    <div class="stat-cards stat-cards-5">
      <div class="stat-card clickable-card" onclick="navigate('teacher-dashboard')">
        <div class="stat-card-icon"><img src="/public/Student_Outline_Icon.png" alt="Students"></div>
        <div class="stat-card-label">Students</div>
        <div class="stat-card-value">${students.length}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('reports')">
        <div class="stat-card-icon"><img src="/public/Book_Outline_Icon.png" alt="Reading Score"></div>
        <div class="stat-card-label">Average Reading Score <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Reading Score', 'A composite score (0–1000) based on quiz accuracy, reading effort, independence (fewer hints), vocabulary growth, and persistence. Each quiz adjusts the score up or down based on performance. Click to see Growth Reports.')">?</button></div>
        <div class="stat-card-value">${avgScore}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('reports')">
        <div class="stat-card-icon"><img src="/public/Comprehension_Outline_Icon.png" alt="Comprehension"></div>
        <div class="stat-card-label">Average Comprehension <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Comprehension', 'The average percentage of quiz questions your students answer correctly. A higher number means students are understanding what they read.')">?</button></div>
        <div class="stat-card-value">${avgAcc}%</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('store')">
        <div class="stat-card-icon"><img src="/public/Key_Outline_Icon.png" alt="Keys Earned"></div>
        <div class="stat-card-label">Total Keys Earned <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Total Keys Earned', 'Keys are rewards students earn by passing quizzes with 80% or higher. Students can spend keys in the Class Store to redeem prizes you set up.')">?</button></div>
        <div class="stat-card-value">${totalKeys.toLocaleString()}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('library')">
        <div class="stat-card-icon"><img src="/public/Book_Outline_Icon.png" alt="Books"></div>
        <div class="stat-card-label">Books Available</div>
        <div class="stat-card-value">${books.length}</div>
      </div>
    </div>

    <div class="list-card" style="padding:24px;margin-bottom:20px">
      <h3 style="margin:0 0 4px 0;font-size:1.25rem;font-weight:700;color:var(--navy);display:flex;align-items:center"><img src="/public/Comprehension_Outline_Black_Icon_.png" alt="" style="width:36px;height:36px;margin-right:10px;object-fit:contain">How Does the Software Work?</h3>
      <p style="margin:0 0 16px 0;font-size:0.8rem;color:var(--g400)">Students must read the physical book first · <a href="https://www.dianealber.com/pages/keychapterbooks" target="_blank" style="color:var(--blue);text-decoration:none;font-weight:600">Purchase books here →</a></p>
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px">
        <div style="text-align:center;padding:16px 12px;background:var(--blue-p, #EFF6FF);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Stacked_Book_Outline.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">1. Pick a Book</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">Students choose a chapter book from the library</div>
        </div>
        <div style="text-align:center;padding:16px 12px;background:var(--gold-l, #FFFBEB);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Quiz_Outline_Icon_Blk.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">2. Take the Quiz</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">5 questions test comprehension, vocabulary, and reasoning</div>
        </div>
        <div style="text-align:center;padding:16px 12px;background:var(--purple-l, #F5F3FF);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Key_Outline_Icon_Blk.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">3. Earn Keys & Grow</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">Score 80%+ to earn Keys and boost their Reading Score</div>
        </div>
      </div>
    </div>

    ${assignments.length > 0 ? `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Assigned</th><th>Due</th><th>Activity</th><th>Results</th><th>Keys</th><th></th></tr></thead>
        <tbody>
          ${assignments.map(a => `
            <tr onclick="navigate('quizzes','${a.id}')">
              <td>${a.date || '—'}</td>
              <td>${a.due_date || '—'}</td>
              <td><div class="activity-cell"><span class="type-label quiz">Quiz</span><span class="activity-name">${a.name}</span></div></td>
              <td><span class="results-count">${a.status || 'pending'}</span></td>
              <td>${keysDisp(a.keys_earned || '—')}</td>
              <td><button class="btn btn-sm btn-ghost">${IC.eye} View</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="list-card" style="padding:32px;text-align:center;color:var(--g400)">
      <p>Browse the book in your <a href="#" onclick="event.preventDefault();navigate('library')" style="color:var(--blue)">library</a> to see and take a quiz.</p>
    </div>`}`;

  return html;
}

// ---- Page: Assignment Detail ----
function renderAssignmentDetail() {
  const a = assignments.find(x => x.id === detailId);
  if (!a) return '<p>Assignment not found.</p>';

  return `
    <button class="back-btn" onclick="navigate('quizzes')">${IC.arrowLeft} Back to Quizzes</button>

    <div class="detail-header">
      <div class="detail-header-bar ${a.type}"></div>
      <div class="detail-header-body">
        <div class="detail-header-top">
          <div>
            <span class="badge badge-${a.type === 'quiz' ? 'blue' : a.type === 'assessment' ? 'purple' : 'orange'}">${a.label}</span>
            <h2>${a.name}</h2>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-ghost btn-sm">${IC.printer} Print</button>
            <button class="btn btn-outline btn-sm">${IC.download} Export</button>
          </div>
        </div>
        <div class="detail-header-meta">
          <span>${IC.calendar} Assigned: ${a.date}</span>
          <span>${IC.calendar} Due: ${a.due}</span>
          <span>${statusPill(a.status)}</span>
        </div>
        <div class="detail-header-stats">
          <div class="detail-stat">
            <div class="detail-stat-value">${a.done}/${a.total}</div>
            <div class="detail-stat-label">Completed</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-value">${keysDisp(a.keys)}</div>
            <div class="detail-stat-label">Keys Earned</div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Level</th>
            <th>Reading Score</th>
            <th>Accuracy</th>
            <th>Keys</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(s => {
            const sb = scoreBadge(s.accuracy);
            return `
            <tr onclick="navigate('students',null,${s.id})">
              <td><div class="student-cell">${avatar(s)} <span class="student-name">${s.name}</span> ${warnTag(s)}</div></td>
              <td>${s.level}</td>
              <td>${s.score}</td>
              <td>
                <span class="score-badge ${sb.cls}">${s.accuracy}% ${sb.label}</span>
                <div class="mini-progress"><div class="mini-progress-bar" style="width:${s.accuracy}%;background:${sb.barColor}"></div></div>
              </td>
              <td>${keysDisp(s.keys)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ---- Page: Students ----
function renderStudents() {
  const isParent = userRole === 'parent';
  const membersTitle = isParent ? 'My Children' : 'Students';
  const memberLabel = isParent ? 'Child' : 'Student';
  const noMembersTitle = isParent ? 'No Children Yet' : 'No Students Yet';
  const codeLabel = isParent ? 'family code' : 'class code';
  const groupLabel = isParent ? 'family' : 'class';

  if (students.length === 0) {
    const classCode = currentUser?.classCode || '';
    return `
      <div class="page-header">
        <h1>${membersTitle} <span class="badge badge-blue">0</span></h1>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.users}</div>
        <h2>${noMembersTitle}</h2>
        <p>Share your ${codeLabel} <strong>${classCode}</strong> with ${isParent ? 'children' : 'students'} so they can sign up and join your ${groupLabel}.</p>
        <button class="btn btn-primary" onclick="navigate('quizzes')">${IC.arrowLeft} Go to Dashboard</button>
      </div>`;
  }

  const sorted = [...students].sort((a, b) => (b.score || 0) - (a.score || 0));

  return `
    <div class="page-header">
      <h1>${membersTitle} <span class="badge badge-blue">${students.length}</span></h1>
    </div>

    <div class="data-table-wrap">
      <table class="data-table students-analytics-table">
        <thead>
          <tr>
            <th>${memberLabel}</th>
            <th class="th-has-tooltip">Reading Score <span class="th-info" title="Overall reading ability on a 0-1000 scale">&#9432;</span></th>
            <th class="th-has-tooltip">Comprehension <span class="th-info" title="How well the student understands what they read">&#9432;</span></th>
            <th class="th-has-tooltip">Reasoning <span class="th-info" title="Ability to make inferences, find causes, and choose best answers">&#9432;</span></th>
            <th class="th-has-tooltip">Vocabulary Growth <span class="th-info" title="Number of unique words the student has explored">&#9432;</span></th>
            <th class="th-has-tooltip">Independence <span class="th-info" title="How often the student works without using hints">&#9432;</span></th>
            <th class="th-has-tooltip">Persistence <span class="th-info" title="Whether the student keeps trying after getting an answer wrong">&#9432;</span></th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(s => {
            // Read precomputed analytics from the student record (stored at quiz submission time)
            const raw = s._raw || {};
            const scoreTrend = raw.score_trend || 'stable';
            const trendArrow = scoreTrend === 'up' ? '<span class="trend-arrow trend-up">&#9650;</span>' : scoreTrend === 'down' ? '<span class="trend-arrow trend-down">&#9660;</span>' : '<span class="trend-arrow trend-stable">&#9472;</span>';
            const compLabel = raw.comprehension_label || null;
            const reasonLabel = raw.reasoning_label || null;
            const vocabCount = raw.vocab_words_learned || 0;
            const indLabel = raw.independence_label || null;
            const persLabel = raw.persistence_label || null;
            return `
            <tr onclick="navigate('students',null,${s.id})">
              <td><div class="student-cell">${avatar(s)} <span class="student-name">${s.name}</span> ${warnTag(s)}</div></td>
              <td class="reading-score-cell"><strong>${s.score || 500}</strong> ${trendArrow}</td>
              <td>${skillPill(compLabel)}</td>
              <td>${skillPill(reasonLabel)}</td>
              <td class="vocab-count-cell">${vocabCount > 0 ? vocabCount + ' words' : skillPill(null)}</td>
              <td>${skillPill(indLabel)}</td>
              <td>${skillPill(persLabel)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function skillPill(label) {
  if (!label) return '<span class="skill-pill skill-pill--nodata">No Data</span>';
  const cls = label === 'Strong' || label === 'High' ? 'strong' :
              label === 'Developing' || label === 'Improving' || label === 'Moderate' ? 'developing' :
              'needs-support';
  return '<span class="skill-pill skill-pill--' + cls + '">' + label + '</span>';
}

// ---- Page: Student Profile (Individual Student Dashboard) ----
function renderStudentProfile() {
  const s = students.find(x => x.id === studentId);
  if (!s) return '<p>Student not found.</p>';

  // Show loading skeleton, then fetch performance data async
  setTimeout(() => loadStudentPerformance(s), 0);

  return `
    <button class="back-btn" onclick="navigate('students')">${IC.arrowLeft} Back to Students</button>

    <div class="profile-header">
      ${avatar(s, 'lg')}
      <div class="profile-info">
        <h2>${s.name} ${warnTag(s)}</h2>
        <div class="profile-meta">
          <span>Grade: ${s.grade}</span>
          <span>Level ${s.level}</span>
          <span>Joined: ${s.joined}</span>
        </div>
      </div>
    </div>

    <div id="student-perf-container">
      <div class="perf-loading" style="text-align:center;padding:48px">
        <div class="spinner"></div>
        <p style="color:var(--g400);margin-top:12px">Loading performance data...</p>
      </div>
    </div>`;
}

async function loadStudentPerformance(s) {
  const container = document.getElementById('student-perf-container');
  if (!container) return;

  try {
    const [perf, bookProgress] = await Promise.all([
      API.getStudentPerformance(s.id),
      API.getBookProgress(s.id).catch(() => [])
    ]);
    container.innerHTML = renderPerformanceDashboard(s, perf, bookProgress);
  } catch(e) {
    console.error('Performance load error:', e);
    // Fallback to basic stats
    container.innerHTML = renderBasicStudentStats(s);
  }
}

function renderPerformanceDashboard(s, perf, bookProgress) {
  const trendIcon = perf.trend === 'improving' ? `<span class="trend-up">&#9650;</span>` :
                    perf.trend === 'declining' ? `<span class="trend-down">&#9660;</span>` :
                    `<span class="trend-stable">&#9472;</span>`;
  const trendLabel = perf.trend === 'improving' ? 'Improving' : perf.trend === 'declining' ? 'Declining' : 'Stable';
  const changeSign = perf.scoreChangeThisWeek >= 0 ? '+' : '';
  const lastChangeSign = perf.scoreChangeLastWeek >= 0 ? '+' : '';

  // Component config
  const compConfig = {
    comprehension: { name: 'Comprehension', icon: IC.bookOpen, color: 'var(--blue)', borderColor: 'var(--blue)' },
    effort:        { name: 'Quiz Effort', icon: '<img src="/public/Recent_Outline_Icon_.png" alt="" style="width:20px;height:20px;object-fit:contain">', color: 'var(--green)', borderColor: 'var(--green)' },
    independence:  { name: 'Independence', icon: IC.star, color: 'var(--orange)', borderColor: 'var(--orange)' },
    vocabulary:    { name: 'Vocabulary', icon: IC.hash, color: 'var(--purple)', borderColor: 'var(--purple)' },
    persistence:   { name: 'Persistence', icon: IC.fire, color: 'var(--gold)', borderColor: 'var(--gold)' }
  };

  // Sparkline
  const sparkline = perf.sparklineData && perf.sparklineData.length >= 2
    ? miniChart(perf.sparklineData, 'var(--blue)', 120, 32)
    : '<span style="color:var(--g400);font-size:0.8125rem">Not enough data yet</span>';

  // Derive labels directly from component scores so they always match
  function scoreToPill(score, key) {
    if (key === 'independence') return score >= 750 ? 'High' : score >= 450 ? 'Improving' : 'Needs Support';
    if (key === 'persistence') return score >= 750 ? 'High' : score >= 450 ? 'Moderate' : 'Low';
    return score >= 750 ? 'Strong' : score >= 450 ? 'Developing' : 'Needs Support';
  }

  // Component cards
  const componentCards = Object.entries(perf.components).map(([key, comp]) => {
    const cfg = compConfig[key];
    const tIcon = comp.trend === 'up' ? `<span class="trend-up">&#9650;</span>` :
                  comp.trend === 'down' ? `<span class="trend-down">&#9660;</span>` :
                  `<span class="trend-stable">&#9472;</span>`;
    const label = key !== 'vocabulary' ? scoreToPill(comp.score, key) : null;
    return `
      <div class="component-card" onclick="toggleComponentDetail('${key}')" style="border-top:3px solid ${cfg.borderColor}">
        <div class="component-card-header">
          <span class="component-icon" style="color:${cfg.color}">${cfg.icon}</span>
          <span class="component-name">${cfg.name}</span>
          <span class="component-weight">${comp.weight}%</span>
        </div>
        <div class="component-score-row">
          <span class="component-score">${comp.score}</span>
          ${tIcon}
        </div>
        ${label ? `<div style="margin:6px 0">${skillPill(label)}</div>` : ''}
        <div class="component-insight">${comp.insight}</div>
        <div class="component-detail" id="detail-${key}" style="display:none">
          ${renderComponentDetail(key, comp)}
        </div>
      </div>`;
  }).join('');

  // Key Activity
  const keyActivity = perf.keyActivity || {};

  // Quiz History
  const quizHistoryHtml = perf.quizHistory && perf.quizHistory.length > 0 ? `
    <div class="section-header" style="margin-top:24px"><h3>Quiz History</h3></div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Book / Chapter</th>
            <th>Score</th>
            <th>Hints</th>
            <th>Time</th>
            <th>Keys</th>
          </tr>
        </thead>
        <tbody>
          ${perf.quizHistory.map(q => {
            const qsb = scoreBadge(q.score);
            const date = q.completedAt ? new Date(q.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            const mins = q.timeTaken ? Math.floor(q.timeTaken / 60) : 0;
            const secs = q.timeTaken ? q.timeTaken % 60 : 0;
            return `
            <tr>
              <td>${date}</td>
              <td><strong>${q.bookTitle}</strong> — Ch. ${q.chapterNumber}</td>
              <td><span class="score-badge ${qsb.cls}">${Math.round(q.score)}% ${qsb.label}</span></td>
              <td>${q.hintsUsed > 0 ? q.hintsUsed : '<span style="color:var(--g400)">0</span>'}</td>
              <td>${mins}:${secs.toString().padStart(2,'0')}</td>
              <td>${keysDisp(q.keysEarned)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="info-panel" style="text-align:center;padding:32px;margin-top:24px">
      <p style="color:var(--g500);margin:0">${IC.bookOpen} No quiz history yet. Quizzes will appear here as ${s.name} completes them.</p>
    </div>`;

  return `
    <div class="student-overview">
      <div class="overview-score-section">
        <div class="overview-score-main">
          <div class="overview-score-number">${perf.readingScore}</div>
          <div class="overview-score-label">Reading Score</div>
          <button class="score-explain-toggle" onclick="toggleScoreExplanation()">&#128269; How is this calculated?</button>
        </div>
        <div class="overview-score-meta">
          <div class="overview-change">
            ${trendIcon} <strong>${changeSign}${perf.scoreChangeThisWeek}</strong> this week
            <span class="overview-change-secondary">(${lastChangeSign}${perf.scoreChangeLastWeek} last week)</span>
          </div>
          <div class="overview-trend">Trend: ${trendLabel}</div>
          <div class="overview-sparkline">${sparkline}</div>
        </div>
      </div>
    </div>

    <div class="score-explanation" id="score-explanation" style="display:none">
      <div class="score-explanation-inner">
        <h4>&#128202; How the Reading Score Works</h4>
        <p>Your student's Reading Score (0&ndash;1000) combines five areas of reading growth:</p>
        <ul>
          <li><strong>Comprehension (30%)</strong> &mdash; How well they understand what they read</li>
          <li><strong>Quiz Effort (20%)</strong> &mdash; Whether they take their time and answer thoughtfully</li>
          <li><strong>Independence (20%)</strong> &mdash; How often they work without using hints</li>
          <li><strong>Vocabulary (15%)</strong> &mdash; How many new words they explore and learn</li>
          <li><strong>Persistence (15%)</strong> &mdash; Whether they keep trying after getting answers wrong</li>
        </ul>
        <p>A score of <strong>500</strong> is average for a new reader. Scores improve as students read more, answer questions carefully, and build good habits.</p>
      </div>
    </div>

    <div class="section-header"><h3>Score Breakdown</h3></div>
    <div class="score-breakdown-grid">
      ${componentCards}
    </div>

    <div class="section-header" style="margin-top:24px"><h3>Key Activity</h3></div>
    <div class="key-activity-section">
      <div class="key-stat">
        <span class="key-stat-icon">${IC.key}</span>
        <div>
          <div class="key-stat-value">${keyActivity.balance || 0}</div>
          <div class="key-stat-label">Balance</div>
        </div>
      </div>
      <div class="key-stat">
        <span class="key-stat-icon trend-up">+</span>
        <div>
          <div class="key-stat-value">${keyActivity.earnedThisWeek || 0}</div>
          <div class="key-stat-label">Earned This Week</div>
        </div>
      </div>
      <div class="key-stat">
        <span class="key-stat-icon trend-down">-</span>
        <div>
          <div class="key-stat-value">${keyActivity.spentThisWeek || 0}</div>
          <div class="key-stat-label">Spent This Week</div>
        </div>
      </div>
    </div>

    ${(() => {
      const isTeacher = userRole === 'teacher' || userRole === 'owner' || userRole === 'principal' || userRole === 'parent';
      if (!isTeacher) return '';
      const raw = s._raw || {};
      let animalsArr = [];
      try { animalsArr = typeof raw.favorite_animals === 'string' ? JSON.parse(raw.favorite_animals || '[]') : (raw.favorite_animals || []); } catch(e) { animalsArr = []; }
      if (!animalsArr || animalsArr.length === 0) return '';
      const followed = animalsArr.length <= 3;
      const icon = followed ? '&#9989;' : '&#9888;&#65039;';
      const statusText = followed ? 'Yes — followed instructions' : 'No — selected ' + animalsArr.length + ' (instruction said "Pick up to 3")';
      const statusColor = followed ? 'var(--green, #22C55E)' : 'var(--orange, #F59E0B)';
      const bgColor = followed ? '#F0FDF4' : '#FFFBEB';
      const borderColor = followed ? '#BBF7D0' : '#FDE68A';
      return `
        <div class="section-header" style="margin-top:24px"><h3>&#128203; Instruction Following</h3></div>
        <div style="background:${bgColor};border:1px solid ${borderColor};border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px">
          <span style="font-size:1.5rem">${icon}</span>
          <div>
            <div style="font-weight:700;color:${statusColor};font-size:0.95rem">${statusText}</div>
            <div style="color:var(--g500);font-size:0.8rem;margin-top:2px">Based on onboarding survey: "Favorite Animals (Pick up to 3)" — student selected ${animalsArr.length} animal${animalsArr.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        ${raw.likes_reading ? `
        <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-top:12px">
          <span style="font-size:1.5rem">${raw.likes_reading === 'yes' ? '👍' : raw.likes_reading === 'no' ? '👎' : '🤷'}</span>
          <div>
            <div style="font-weight:700;color:var(--navy);font-size:0.95rem">Likes reading: ${raw.likes_reading.charAt(0).toUpperCase() + raw.likes_reading.slice(1)}</div>
            <div style="color:var(--g500);font-size:0.8rem;margin-top:2px">From onboarding survey: "Do you like reading?"</div>
          </div>
        </div>` : ''}
        ${raw.reading_feeling ? `
        <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-top:12px">
          <span style="font-size:1.5rem">${raw.reading_feeling === 'confident' ? '💪' : raw.reading_feeling === 'frustrated' ? '😤' : raw.reading_feeling === 'calm' ? '😌' : raw.reading_feeling === 'bored' ? '😴' : '📖'}</span>
          <div>
            <div style="font-weight:700;color:var(--navy);font-size:0.95rem">Reading makes them feel: ${raw.reading_feeling.charAt(0).toUpperCase() + raw.reading_feeling.slice(1)}</div>
            <div style="color:var(--g500);font-size:0.8rem;margin-top:2px">From onboarding survey: "How does reading make you feel?"</div>
          </div>
        </div>` : ''}`;
    })()}

    ${quizHistoryHtml}

    ${(() => {
      const isTeacherView = userRole === 'teacher' || userRole === 'owner' || userRole === 'principal' || userRole === 'parent';
      if (!isTeacherView || !bookProgress) return '';
      const completedBooks = (bookProgress || []).filter(p => p.isComplete);
      if (completedBooks.length === 0) {
        return `
          <div class="section-header" style="margin-top:24px"><h3>&#127942; Completed Books</h3></div>
          <div class="info-panel" style="text-align:center;padding:24px">
            <p style="color:var(--g500);margin:0">No books completed yet. Certificates will appear here as ${escapeHtml(s.name)} finishes books.</p>
          </div>`;
      }
      const history = perf.quizHistory || [];
      return `
        <div class="section-header" style="margin-top:24px"><h3>&#127942; Completed Books &amp; Certificates</h3></div>
        <div class="completed-books-grid">
          ${completedBooks.map(p => {
            const b = books.find(bk => bk.id === p.bookId);
            if (!b) return '';
            const bookQuizzes = history.filter(q => q.bookTitle === b.title);
            const avgScore = bookQuizzes.length > 0 ? Math.round(bookQuizzes.reduce((sum, q) => sum + q.score, 0) / bookQuizzes.length) : null;
            const certParams = JSON.stringify({ studentName: s.name, bookTitle: b.title, bookAuthor: b.author || '', score: avgScore, coverUrl: b.cover_url || '' }).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            return `
            <div class="completed-book-card">
              <div class="completed-book-cover">
                ${b.cover_url ? '<img src="' + b.cover_url + '" alt="' + escapeHtml(b.title) + '" onerror="this.style.display=&quot;none&quot;">' : ''}
                <div class="completed-book-badge">&#10004; COMPLETED</div>
              </div>
              <div class="completed-book-info">
                <div class="completed-book-title">${escapeHtml(b.title)}</div>
                ${avgScore !== null ? '<div class="completed-book-score">Avg Score: ' + avgScore + '%</div>' : ''}
                <div class="completed-book-actions">
                  <button class="btn btn-sm btn-primary" onclick="printCertificate(JSON.parse(decodeHTMLEntities(this.dataset.params)))" data-params="${certParams}">&#128424; Print</button>
                  <button class="btn btn-sm btn-outline" onclick="downloadCertificatePDF(JSON.parse(decodeHTMLEntities(this.dataset.params)))" data-params="${certParams}">&#128229; PDF</button>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>`;
    })()}`;
}

function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function renderComponentDetail(key, comp) {
  const d = comp.details || {};
  const score = comp.score || 0;
  let statsHtml = '';
  let measureHtml = '';
  let improveHtml = '';
  let focusHtml = '';
  let noteHtml = '';

  switch(key) {
    case 'comprehension':
      statsHtml = `
        <div class="detail-row"><span>Avg Quiz Score</span><strong>${d.avgQuizScore != null ? d.avgQuizScore + '%' : '—'}</strong></div>
        <div class="detail-row"><span>Best This Week</span><strong>${d.bestThisWeek != null ? Math.round(d.bestThisWeek) + '%' : '—'}</strong></div>
        <div class="detail-row"><span>Lowest This Week</span><strong>${d.lowestThisWeek != null ? Math.round(d.lowestThisWeek) + '%' : '—'}</strong></div>
        <div class="detail-row"><span>Total Quizzes</span><strong>${d.totalQuizzes || 0}</strong></div>
        <div class="detail-row"><span>Consistency</span><strong>${d.consistency || '—'}</strong></div>`;
      measureHtml = `
        <li>Understanding of events and story details</li>
        <li>Cause and effect relationships</li>
        <li>Character motivation and inference questions</li>
        <li>Average quiz score, improvement over time, and consistency</li>`;
      improveHtml = `
        <li>Answering comprehension questions correctly</li>
        <li>Showing improvement over time</li>
        <li>Performing consistently across quizzes</li>`;
      if (score < 500) focusHtml = 'Work on cause-and-effect questions.';
      break;
    case 'effort':
      statsHtml = `
        <div class="detail-row"><span>Avg Time / Question</span><strong>${d.avgTimePerQuestion || 0}s</strong></div>
        <div class="detail-row"><span>Completion Rate</span><strong>${d.completionRate || 0}%</strong></div>
        <div class="detail-row"><span>Rushing Rate</span><strong>${d.rushingRate || 0}%</strong></div>`;
      measureHtml = `
        <li>Average time spent per question</li>
        <li>Total quiz completion time</li>
        <li>Time consistency (not rushing through questions)</li>`;
      improveHtml = `
        <li>Steady, thoughtful pacing</li>
        <li>Avoiding rushed, low-score quizzes</li>
        <li>Completing quizzes carefully</li>`;
      noteHtml = 'This score rewards thoughtful effort &mdash; not speed.';
      if (score < 500) focusHtml = 'Encourage the student to slow down and read each question carefully.';
      break;
    case 'independence':
      statsHtml = `
        <div class="detail-row"><span>Avg Hints / Quiz</span><strong>${d.avgHintsPerQuiz != null ? d.avgHintsPerQuiz : '—'}</strong></div>
        <div class="detail-row"><span>Zero-Hint Quizzes</span><strong>${d.zeroHintRate || 0}%</strong></div>
        <div class="detail-row"><span>Hints This Week</span><strong>${d.hintsThisWeek || 0}</strong></div>`;
      measureHtml = `
        <li>Average hints used per quiz</li>
        <li>Trend of hint usage over time</li>
        <li>Percentage of quizzes completed without hints</li>`;
      improveHtml = `
        <li>Using fewer hints over time</li>
        <li>Completing quizzes independently</li>
        <li>Reducing reliance on support</li>`;
      if (score < 500) focusHtml = 'Encourage the student to try answering before using hints.';
      break;
    case 'vocabulary':
      statsHtml = `
        <div class="detail-row"><span>Unique Words Explored</span><strong>${d.uniqueWordsLooked || 0}</strong></div>
        <div class="detail-row"><span>Words Repeated</span><strong>${d.wordsRepeated || 0}</strong></div>
        ${d.recentWords && d.recentWords.length > 0 ? `<div class="detail-row"><span>Recent Words</span><strong>${d.recentWords.join(', ')}</strong></div>` : ''}`;
      measureHtml = `
        <li>Words tapped for definitions</li>
        <li>Repeated vocabulary exposures</li>
        <li>Mastery of previously challenging words</li>`;
      improveHtml = `
        <li>Learning new Tier 2 words</li>
        <li>Reducing repeated hinting on the same words</li>
        <li>Mastering previously difficult words</li>`;
      if (!d.uniqueWordsLooked) noteHtml = 'Vocabulary data will build as the student interacts with highlighted words during quizzes.';
      if (score < 500) focusHtml = 'Encourage tapping and reviewing new words.';
      break;
    case 'persistence':
      statsHtml = `
        <div class="detail-row"><span>Avg Attempts / Question</span><strong>${d.avgAttemptsPerQuiz || '—'}</strong></div>
        <div class="detail-row"><span>Improved After Retry</span><strong>${d.improvedAfterRetry || 0}%</strong></div>
        <div class="detail-row"><span>First-Attempt Mastery</span><strong>${d.firstAttemptMastery || 0}%</strong></div>`;
      measureHtml = `
        <li>Number of quiz retries ("Try Agains")</li>
        <li>Improvement after retries</li>
        <li>Best score achieved</li>`;
      improveHtml = `
        <li>Retaking quizzes to improve understanding</li>
        <li>Increasing score after retry</li>
        <li>Demonstrating mastery over time</li>`;
      noteHtml = 'This score rewards growth and perseverance.';
      if (score < 500) focusHtml = 'Encourage the student to retry quizzes they found challenging.';
      break;
    default:
      return '';
  }

  return `
    <div class="detail-stats">${statsHtml}</div>
    ${noteHtml ? `<div class="explain-note">${noteHtml}</div>` : ''}
    <div class="explain-section">
      <div class="explain-heading">How this is measured</div>
      <ul class="explain-list">${measureHtml}</ul>
    </div>
    <div class="explain-section">
      <div class="explain-heading">What improves this score</div>
      <ul class="explain-list">${improveHtml}</ul>
    </div>
    ${focusHtml ? `<div class="explain-focus">&#128204; <strong>Suggested Focus:</strong> ${focusHtml}</div>` : ''}`;
}

function toggleComponentDetail(key) {
  const el = document.getElementById('detail-' + key);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleScoreExplanation() {
  const el = document.getElementById('score-explanation');
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

async function refreshStudentList() {
  try {
    const rawStudents = await API.getStudents();
    students = rawStudents.filter(s => !s.is_teacher_demo).map(mapStudentFromAPI);
    // Also refresh analytics
    try {
      const analytics = await API.getClassAnalytics(currentUser.classId);
      if (analytics && analytics.length > 0) {
        const analyticsMap = {};
        for (const a of analytics) { analyticsMap[a.id] = a; }
        for (const s of students) {
          const a = analyticsMap[s.id];
          if (a) {
            if (a.readingScore) s.score = a.readingScore;
            if (s._raw) {
              s._raw.comprehension_label = a.comprehension !== 'No Data' ? a.comprehension : null;
              s._raw.reasoning_label = a.reasoning !== 'No Data' ? a.reasoning : null;
              s._raw.vocab_words_learned = a.vocabWordsLearned || 0;
              s._raw.independence_label = a.independence !== 'No Data' ? a.independence : null;
              s._raw.persistence_label = a.persistence !== 'No Data' ? a.persistence : null;
              s._raw.score_trend = a.scoreTrend || 'stable';
            }
          }
        }
      }
    } catch(e) { /* analytics refresh optional */ }
    navigate('students');
  } catch(e) {
    console.error('Refresh error:', e);
  }
}

function renderBasicStudentStats(s) {
  // Fallback if performance API fails
  return `
    <div class="profile-stats">
      <div class="profile-stat-card">
        <div class="stat-icon blue">${IC.barChart}</div>
        <div class="profile-stat-value">${s.score}</div>
        <div class="profile-stat-label">Reading Score</div>
      </div>
      <div class="profile-stat-card">
        <div class="stat-icon green">${IC.check}</div>
        <div class="profile-stat-value">${s.accuracy}%</div>
        <div class="profile-stat-label">Accuracy</div>
      </div>
      <div class="profile-stat-card">
        <div class="stat-icon gold">${IC.key}</div>
        <div class="profile-stat-value">${s.keys}</div>
        <div class="profile-stat-label">Keys</div>
      </div>
      <div class="profile-stat-card">
        <div class="stat-icon orange">${IC.fire}</div>
        <div class="profile-stat-value">${s.streak === '\u2014' ? '0' : s.streak}</div>
        <div class="profile-stat-label">Streak</div>
      </div>
      <div class="profile-stat-card">
        <div class="stat-icon purple">${IC.hash}</div>
        <div class="profile-stat-value">${s.quizzes}</div>
        <div class="profile-stat-label">Quizzes</div>
      </div>
    </div>
    <div class="info-panel" style="text-align:center;padding:32px">
      <p style="color:var(--g500);margin:0">Could not load detailed performance data. Showing basic stats.</p>
    </div>`;
}

// ---- Page: Class Store ----
let storeEditing = null; // index of item being edited, or null
let storeAddingNew = false;
let storeNewImageMode = 'emoji'; // 'emoji', 'upload', 'gallery'
let storeNewImagePreview = null; // base64 data URL for new item
let storeNewGalleryUrl = null; // selected gallery image URL
let storeEditImageMode = 'emoji';
let storeEditImagePreview = null;
let storeEditGalleryUrl = null;
let storeLoaded = false; // whether we've loaded from API
let rewardGallery = []; // admin-uploaded images
let galleryLoaded = false;

async function loadStoreItems() {
  if (storeLoaded) return;
  const classId = currentUser?.classId;
  if (!classId) return;
  try {
    const items = await API.getStoreItems(classId);
    if (items && items.length > 0) {
      // Merge image_url from hardcoded defaults for known items
      const defaultImages = { 'Homework Pass': '/public/Homework_Pass.jpg', 'Candy Jar': '/public/Candy.jpg', 'Sticker Pack': '/public/Stickers_.jpg' };
      items.forEach(item => { if (!item.image_url && defaultImages[item.name]) item.image_url = defaultImages[item.name]; });
      storeItems = items;
    } else if (items && items.length === 0 && storeItems.length > 0 && storeItems[0].id === undefined) {
      // First time: seed defaults to DB
      await seedDefaultStoreItems(classId);
    }
    storeLoaded = true;
  } catch(e) {
    console.warn('Could not load store items:', e);
    // Keep using hardcoded defaults
  }
  // Also load reward gallery (admin-uploaded images)
  await loadRewardGallery();
}

async function seedDefaultStoreItems(classId) {
  const defaults = [
    { name: 'Homework Pass',     stock: 10, price: 50, icon: '📝', image_url: '/public/Homework_Pass.jpg' },
    { name: 'Extra Recess',      stock: 5,  price: 75, icon: '⏰' },
    { name: 'Class DJ',          stock: 3,  price: 30, icon: '🎵' },
    { name: 'Sit With a Friend', stock: 10, price: 20, icon: '👫' },
    { name: 'Candy Jar',         stock: 15, price: 15, icon: '🍬', image_url: '/public/Candy.jpg' },
    { name: 'Sticker Pack',      stock: 20, price: 10, icon: '⭐', image_url: '/public/Stickers_.jpg' },
  ];
  const created = [];
  for (const d of defaults) {
    try {
      const item = await API.createStoreItem({ classId, ...d });
      if (item) created.push(item);
    } catch(e) { console.warn('Seed store item error:', e); }
  }
  if (created.length > 0) storeItems = created;
}

async function loadRewardGallery() {
  if (galleryLoaded) return;
  try {
    rewardGallery = await API.getRewardGallery();
    galleryLoaded = true;
  } catch(e) {
    console.warn('Could not load reward gallery:', e);
    rewardGallery = [];
  }
}

function storeItemIcon(item, size) {
  size = size || 48;
  if (item.image_url) {
    return `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:var(--radius-sm)">`;
  }
  return `<span style="font-size:${Math.round(size * 0.65)}px;line-height:1;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">${item.icon || '🎁'}</span>`;
}

function renderPurchasesPage() {
  const data = window._purchaseData || [];
  const purchaseRows = data.length === 0
    ? '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No purchases yet — when students spend Keys in the store, you\'ll see them here!</div>'
    : data.map(function(p) {
        var timeAgo = formatTimeAgo(p.purchasedAt);
        var dateStr = p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        var st = students.find(function(s) { return s.name === p.studentName; });
        var initials = p.studentName.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
        var color = st ? st.color : '#8B5CF6';
        var checkedAttr = p.fulfilled ? 'checked' : '';
        var fulfilledStyle = p.fulfilled ? 'opacity:0.6;' : '';
        return '<div id="purchases-page-row-' + p.id + '" style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid var(--g100);' + fulfilledStyle + '">' +
          '<label style="display:flex;align-items:center;cursor:pointer;flex-shrink:0" title="' + (p.fulfilled ? 'Prize given' : 'Mark as given') + '">' +
            '<input type="checkbox" ' + checkedAttr + ' onchange="togglePurchaseFulfilled(' + p.id + ', this.checked)" style="width:20px;height:20px;accent-color:var(--green, #10B981);cursor:pointer">' +
          '</label>' +
          '<div style="width:36px;height:36px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;flex-shrink:0">' + escapeHtml(initials) + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div><span style="font-weight:700;color:var(--navy)">' + escapeHtml(p.studentName) + '</span> <span style="color:var(--g500)">purchased</span> <span style="font-weight:700;color:var(--purple)">' + escapeHtml(p.itemName) + '</span></div>' +
            '<div style="font-size:0.75rem;color:var(--g400);margin-top:2px">' + dateStr + ' · ' + timeAgo + (p.fulfilled ? ' · <span style="color:var(--green, #10B981);font-weight:600">✓ Prize given</span>' : '') + '</div>' +
          '</div>' +
          '<div style="font-weight:700;color:var(--gold);font-size:0.9rem;flex-shrink:0">🔑 ' + p.price + '</div>' +
        '</div>';
      }).join('');

  return '<div class="page-header"><h1>🔑 Recent Purchases</h1></div>' +
    '<div class="list-card" style="margin-top:8px">' +
      '<div style="padding:16px 20px;border-bottom:1px solid var(--g150);display:flex;align-items:center;justify-content:space-between">' +
        '<span style="font-weight:700;color:var(--navy)">' + data.length + ' purchase' + (data.length !== 1 ? 's' : '') + (window._purchaseCount > 0 ? ' · <span style="color:var(--purple);font-size:0.85rem">' + window._purchaseCount + ' to give out</span>' : ' · <span style="color:var(--green, #10B981);font-size:0.85rem">All given out ✓</span>') + '</span>' +
        '<span style="font-size:0.8rem;color:var(--g400)">Check off prizes as you give them to students</span>' +
      '</div>' +
      purchaseRows +
    '</div>';
}

function renderStore() {
  return `
    <div class="page-header">
      <h1>Class Store <span class="badge badge-gold">${storeItems.length}</span></h1>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="storeAddingNew=true; storeNewImageMode=false; storeNewImagePreview=null; renderMain()">${IC.plus} Add Reward</button>
      </div>
    </div>

    <div class="info-panel" style="margin-bottom:20px">
      <h4>${IC.info} How the Class Store Works</h4>
      <p>Students spend their earned Keys on rewards you create. You can use an emoji icon or upload a custom image for each reward.</p>
    </div>

    ${storeAddingNew ? renderStoreAddForm() : ''}

    <div class="list-card">
      ${storeItems.length === 0 ? `
        <div style="padding:48px;text-align:center;color:var(--g400)">
          <p>No rewards yet. Click "Add Reward" to create your first class store item!</p>
        </div>` :
      storeItems.map((item, idx) => {
        if (storeEditing === idx) return renderStoreEditRow(item, idx);
        return `
        <div class="list-item">
          <div class="list-item-info" style="display:flex;align-items:center;gap:12px;flex-direction:row">
            ${storeItemIcon(item, 48)}
            <div>
              <span class="list-item-name">${escapeHtml(item.name)}</span>
              <span class="list-item-sub">${item.stock} in stock</span>
            </div>
          </div>
          <div class="list-item-right">
            ${keysDisp(item.price)}
            <button class="btn btn-sm btn-ghost" onclick="storeStartEdit(${idx})" title="Edit">${IC.gear}</button>
            <button class="btn btn-sm btn-ghost" onclick="storeRemoveItem(${idx})" title="Remove" style="color:var(--red)">${IC.x}</button>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="list-card" style="padding:24px;margin-top:20px">
      <h3 style="margin:0 0 4px 0">🔔 Recent Purchases</h3>
      <p style="font-size:0.8rem;color:var(--g400);margin:0 0 16px 0">Notifications when students redeem their Keys</p>
      <div id="store-purchase-notifications">
        <div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">Loading...</div>
      </div>
    </div>`;
}

function loadStorePurchaseNotifications() {
  const classId = currentUser?.classId;
  if (!classId) return;
  // Reuse cached purchase data if available, otherwise fetch
  var fetchPromise = window._purchaseData ? Promise.resolve(window._purchaseData) : API.getRecentPurchases(classId);
  fetchPromise.then(data => {
    window._purchaseData = data || [];
    window._purchaseCount = (data || []).filter(p => !p.fulfilled).length;
    const el = document.getElementById('store-purchase-notifications');
    if (!el) return;
    if (!data || data.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">No purchases yet — when students spend Keys, their purchases will show up here!</div>';
      return;
    }
    el.innerHTML = data.map(p => {
      const timeAgo = formatTimeAgo(p.purchasedAt);
      const dateStr = p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
      const st = students.find(s => s.name === p.studentName);
      const initials = p.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const color = st ? st.color : '#8B5CF6';
      const checkedAttr = p.fulfilled ? 'checked' : '';
      const fulfilledStyle = p.fulfilled ? 'opacity:0.6;' : '';
      return '<div id="store-purchase-row-' + p.id + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--g100);' + fulfilledStyle + '">' +
        '<label style="display:flex;align-items:center;cursor:pointer;flex-shrink:0" title="' + (p.fulfilled ? 'Prize given' : 'Mark as given') + '">' +
          '<input type="checkbox" ' + checkedAttr + ' onchange="togglePurchaseFulfilled(' + p.id + ', this.checked)" style="width:18px;height:18px;accent-color:var(--green, #10B981);cursor:pointer">' +
        '</label>' +
        '<div style="width:32px;height:32px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.65rem;flex-shrink:0">' + escapeHtml(initials) + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div><span style="font-weight:600;color:var(--navy)">' + escapeHtml(p.studentName) + '</span>' +
          ' <span style="color:var(--g500)">redeemed</span> ' +
          '<span style="font-weight:600;color:var(--purple)">' + escapeHtml(p.itemName) + '</span>' +
          ' <span style="color:var(--g500)">for</span> ' +
          '<span style="font-weight:600;color:var(--gold)">\uD83D\uDD11 ' + p.price + ' Keys</span></div>' +
          '<div style="font-size:0.72rem;color:var(--g400);margin-top:2px">' + dateStr + ' · ' + timeAgo + (p.fulfilled ? ' · <span style="color:var(--green, #10B981);font-weight:600">\u2713 Prize given</span>' : '') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }).catch(() => {
    const el = document.getElementById('store-purchase-notifications');
    if (el) el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--g400);font-size:0.875rem">No purchases yet — when students spend Keys, their purchases will show up here!</div>';
  });
}

function renderStoreAddForm() {
  const hasGallery = rewardGallery.length > 0;
  return `
    <div class="store-edit-card" style="background:#fff;border:2px solid var(--blue);border-radius:var(--radius-md);padding:20px;margin-bottom:16px">
      <h4 style="margin-bottom:12px;font-size:0.9375rem;font-weight:600;color:var(--g900)">New Reward</h4>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button class="btn btn-sm ${storeNewImageMode === 'emoji' ? 'btn-primary' : 'btn-ghost'}" onclick="storeNewImageMode='emoji'; storeNewImagePreview=null; storeNewGalleryUrl=null; renderMain()">Use Emoji</button>
        ${hasGallery ? `<button class="btn btn-sm ${storeNewImageMode === 'gallery' ? 'btn-primary' : 'btn-ghost'}" onclick="storeNewImageMode='gallery'; storeNewImagePreview=null; renderMain()">Choose Image</button>` : ''}
        <button class="btn btn-sm ${storeNewImageMode === 'upload' ? 'btn-primary' : 'btn-ghost'}" onclick="storeNewImageMode='upload'; storeNewGalleryUrl=null; renderMain()">Upload Image</button>
      </div>

      ${storeNewImageMode === 'gallery' ? `
        <div style="margin-bottom:12px">
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:8px">Select a reward image:</label>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px;max-height:200px;overflow-y:auto;padding:4px">
            ${rewardGallery.map(g => `
              <div style="cursor:pointer;border:2px solid ${storeNewGalleryUrl === g.image_url ? 'var(--blue)' : 'var(--g200)'};border-radius:var(--radius-sm);padding:4px;text-align:center;transition:border-color .15s" onclick="storeNewGalleryUrl='${escapeHtml(g.image_url)}'; renderMain()">
                <img src="${escapeHtml(g.image_url)}" style="width:56px;height:56px;object-fit:cover;border-radius:4px">
                <div style="font-size:0.625rem;color:var(--g500);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(g.name)}</div>
              </div>
            `).join('')}
          </div>
        </div>` : ''}

      <div style="display:grid;grid-template-columns:auto 1fr 100px 100px auto;gap:12px;align-items:end">
        <div>
          ${storeNewImageMode === 'upload' ? `
            <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Image</label>
            <div style="position:relative;width:64px;height:64px;border:2px dashed var(--g300);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;background:var(--g50)" onclick="document.getElementById('store-new-file').click()">
              ${storeNewImagePreview
                ? `<img src="${storeNewImagePreview}" style="width:100%;height:100%;object-fit:cover">`
                : `<span style="font-size:1.5rem;color:var(--g400)">+</span>`}
              <input id="store-new-file" type="file" accept="image/*" style="display:none" onchange="storePreviewNewImage(this)">
            </div>
          ` : storeNewImageMode === 'gallery' ? `
            <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Selected</label>
            <div style="width:64px;height:64px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--g50)">
              ${storeNewGalleryUrl ? `<img src="${storeNewGalleryUrl}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:0.75rem;color:var(--g400)">Pick one</span>`}
            </div>
          ` : `
            <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Icon</label>
            <input id="store-new-icon" type="text" value="🎁" maxlength="4" style="width:48px;padding:8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:1.25rem;text-align:center">
          `}
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Reward Name</label>
          <input id="store-new-name" type="text" placeholder="e.g. Extra Recess" style="width:100%;padding:8px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Price (Keys)</label>
          <input id="store-new-price" type="number" value="25" min="1" style="width:100%;padding:8px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Stock</label>
          <input id="store-new-stock" type="number" value="10" min="0" style="width:100%;padding:8px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="storeAddItem()">Add</button>
          <button class="btn btn-ghost btn-sm" onclick="storeAddingNew=false; storeNewImagePreview=null; storeNewGalleryUrl=null; renderMain()">Cancel</button>
        </div>
      </div>
    </div>`;
}

function renderStoreEditRow(item, idx) {
  const hasGallery = rewardGallery.length > 0;
  const currentImgUrl = storeEditImagePreview || storeEditGalleryUrl || item.image_url;
  return `
    <div class="list-item" style="background:var(--blue-p);flex-direction:column;gap:12px;align-items:stretch">
      <div style="display:flex;gap:6px;margin-bottom:4px">
        <button class="btn btn-sm ${storeEditImageMode === 'emoji' ? 'btn-primary' : 'btn-ghost'}" style="font-size:0.7rem;padding:2px 8px" onclick="storeEditImageMode='emoji'; storeEditImagePreview=null; storeEditGalleryUrl=null; renderMain()">Emoji</button>
        ${hasGallery ? `<button class="btn btn-sm ${storeEditImageMode === 'gallery' ? 'btn-primary' : 'btn-ghost'}" style="font-size:0.7rem;padding:2px 8px" onclick="storeEditImageMode='gallery'; storeEditImagePreview=null; renderMain()">Choose Image</button>` : ''}
        <button class="btn btn-sm ${storeEditImageMode === 'upload' ? 'btn-primary' : 'btn-ghost'}" style="font-size:0.7rem;padding:2px 8px" onclick="storeEditImageMode='upload'; storeEditGalleryUrl=null; renderMain()">Upload</button>
      </div>
      ${storeEditImageMode === 'gallery' ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:6px;max-height:140px;overflow-y:auto;padding:4px">
          ${rewardGallery.map(g => `
            <div style="cursor:pointer;border:2px solid ${storeEditGalleryUrl === g.image_url ? 'var(--blue)' : 'var(--g200)'};border-radius:var(--radius-sm);padding:3px;text-align:center" onclick="storeEditGalleryUrl='${escapeHtml(g.image_url)}'; renderMain()">
              <img src="${escapeHtml(g.image_url)}" style="width:48px;height:48px;object-fit:cover;border-radius:3px">
            </div>
          `).join('')}
        </div>` : ''}
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div>
          ${storeEditImageMode === 'upload' ? `
            <div style="position:relative;width:48px;height:48px;border:2px dashed var(--g300);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;background:var(--g50)" onclick="document.getElementById('store-edit-file').click()">
              ${(storeEditImagePreview || item.image_url)
                ? `<img src="${storeEditImagePreview || item.image_url}" style="width:100%;height:100%;object-fit:cover">`
                : `<span style="font-size:1.25rem;color:var(--g400)">+</span>`}
              <input id="store-edit-file" type="file" accept="image/*" style="display:none" onchange="storePreviewEditImage(this)">
            </div>
          ` : storeEditImageMode === 'gallery' ? `
            <div style="width:48px;height:48px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);overflow:hidden;background:var(--g50);display:flex;align-items:center;justify-content:center">
              ${storeEditGalleryUrl ? `<img src="${storeEditGalleryUrl}" style="width:100%;height:100%;object-fit:cover">` : (item.image_url ? `<img src="${item.image_url}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:0.7rem;color:var(--g400)">Pick</span>`)}
            </div>
          ` : `
            <input id="store-edit-icon" type="text" value="${item.icon || '🎁'}" maxlength="4" style="width:44px;padding:6px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:1.125rem;text-align:center">
          `}
        </div>
        <input id="store-edit-name" type="text" value="${escapeHtml(item.name)}" style="flex:1;min-width:120px;padding:6px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        <div style="display:flex;align-items:center;gap:4px">
          <span style="font-size:0.75rem;color:var(--g500)">Price:</span>
          <input id="store-edit-price" type="number" value="${item.price}" min="1" style="width:70px;padding:6px 8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div style="display:flex;align-items:center;gap:4px">
          <span style="font-size:0.75rem;color:var(--g500)">Stock:</span>
          <input id="store-edit-stock" type="number" value="${item.stock}" min="0" style="width:70px;padding:6px 8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="storeSaveEdit(${idx})">Save</button>
          <button class="btn btn-ghost btn-sm" onclick="storeEditing=null; storeEditImageMode='emoji'; storeEditImagePreview=null; storeEditGalleryUrl=null; renderMain()">Cancel</button>
        </div>
      </div>
    </div>`;
}

function storeStartEdit(idx) {
  storeEditing = idx;
  const item = storeItems[idx];
  storeEditImageMode = item.image_url ? 'upload' : 'emoji';
  storeEditImagePreview = null;
  storeEditGalleryUrl = null;
  renderMain();
}

function storePreviewNewImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    resizeImage(e.target.result, 200, 200, (resized) => {
      storeNewImagePreview = resized;
      renderMain();
    });
  };
  reader.readAsDataURL(file);
}

function storePreviewEditImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    resizeImage(e.target.result, 200, 200, (resized) => {
      storeEditImagePreview = resized;
      renderMain();
    });
  };
  reader.readAsDataURL(file);
}

function resizeImage(dataUrl, maxW, maxH, callback) {
  const img = new Image();
  img.onload = () => {
    let w = img.width, h = img.height;
    if (w > maxW || h > maxH) {
      const ratio = Math.min(maxW / w, maxH / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/png', 0.9));
  };
  img.src = dataUrl;
}

async function storeAddItem() {
  const name = document.getElementById('store-new-name')?.value?.trim();
  const price = parseInt(document.getElementById('store-new-price')?.value) || 25;
  const stock = parseInt(document.getElementById('store-new-stock')?.value) || 10;
  if (!name) { alert('Please enter a reward name.'); return; }

  let icon = '🎁';
  let image_url = null;

  if (storeNewImageMode === 'upload' && storeNewImagePreview) {
    // Upload image
    try {
      const result = await API.uploadStoreImage(storeNewImagePreview, name.replace(/\s+/g, '-').toLowerCase());
      image_url = result.url;
    } catch(e) {
      console.warn('Image upload failed, using base64 fallback');
      image_url = storeNewImagePreview;
    }
  } else if (storeNewImageMode === 'gallery' && storeNewGalleryUrl) {
    image_url = storeNewGalleryUrl;
  } else {
    icon = document.getElementById('store-new-icon')?.value || '🎁';
  }

  try {
    const classId = currentUser?.classId;
    const item = await API.createStoreItem({ classId, name, price, stock, icon, image_url });
    if (item) {
      storeItems.push(item);
    } else {
      storeItems.push({ name, stock, price, icon, image_url });
    }
  } catch(e) {
    storeItems.push({ name, stock, price, icon, image_url });
  }

  storeAddingNew = false;
  storeNewImagePreview = null;
  storeNewGalleryUrl = null;
  storeNewImageMode = 'emoji';
  renderMain();
}

async function storeSaveEdit(idx) {
  const name = document.getElementById('store-edit-name')?.value?.trim();
  const price = parseInt(document.getElementById('store-edit-price')?.value) || storeItems[idx].price;
  const stock = parseInt(document.getElementById('store-edit-stock')?.value) || 0;
  if (!name) { alert('Please enter a reward name.'); return; }

  let icon = storeItems[idx].icon;
  let image_url = storeItems[idx].image_url;

  if (storeEditImageMode === 'upload') {
    if (storeEditImagePreview) {
      try {
        const result = await API.uploadStoreImage(storeEditImagePreview, name.replace(/\s+/g, '-').toLowerCase());
        image_url = result.url;
      } catch(e) {
        image_url = storeEditImagePreview;
      }
    }
  } else if (storeEditImageMode === 'gallery' && storeEditGalleryUrl) {
    image_url = storeEditGalleryUrl;
  } else {
    icon = document.getElementById('store-edit-icon')?.value || storeItems[idx].icon;
    image_url = null; // Switched to emoji mode, clear image
  }

  const updates = { name, price, stock, icon, image_url };

  if (storeItems[idx].id) {
    try {
      const updated = await API.updateStoreItem(storeItems[idx].id, updates);
      if (updated) storeItems[idx] = updated;
      else Object.assign(storeItems[idx], updates);
    } catch(e) {
      Object.assign(storeItems[idx], updates);
    }
  } else {
    Object.assign(storeItems[idx], updates);
  }

  storeEditing = null;
  storeEditImageMode = 'emoji';
  storeEditImagePreview = null;
  storeEditGalleryUrl = null;
  renderMain();
}

async function storeRemoveItem(idx) {
  if (!confirm(`Remove "${storeItems[idx].name}" from the store?`)) return;
  if (storeItems[idx].id) {
    try { await API.deleteStoreItem(storeItems[idx].id); } catch(e) { console.warn('Delete store item error:', e); }
  }
  storeItems.splice(idx, 1);
  renderMain();
}

// ---- Student Store View ----
function renderStudentStore() {
  const myKeys = currentUser?.keys_earned || 0;
  return `
    <div class="page-header">
      <h1>Class Store</h1>
    </div>

    <div class="student-store-balance">
      <div class="student-store-balance-icon"><img src="/public/Key_Icon.png" alt="Keys" style="width:48px;height:48px;object-fit:contain"></div>
      <div class="student-store-balance-info">
        <div class="student-store-balance-label">My Keys</div>
        <div class="student-store-balance-value">${myKeys.toLocaleString()}</div>
      </div>
    </div>

    ${storeItems.length === 0 ? `
      <div style="padding:48px;text-align:center;color:var(--g400)">
        <p style="font-size:1.125rem">No rewards available yet!</p>
        <p style="font-size:0.875rem">Your teacher will add rewards soon.</p>
      </div>` : `
      <div class="student-store-grid">
        ${storeItems.map((item, idx) => {
          const canAfford = myKeys >= item.price;
          const soldOut = item.stock <= 0;
          let stateClass = '';
          if (soldOut) stateClass = ' sold-out';
          else if (!canAfford) stateClass = ' insufficient';
          return `
          <div class="student-store-card${stateClass}" onclick="showStoreItemPreview(${idx})" style="cursor:pointer">
            ${item.image_url
              ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" class="student-store-card-img">`
              : `<div class="student-store-card-icon">${item.icon || '🎁'}</div>`}
            <div class="student-store-card-name">${escapeHtml(item.name)}</div>
            <div class="student-store-card-price">${keysDisp(item.price)}</div>
            <div class="student-store-card-stock">${soldOut ? 'Sold Out' : item.stock + ' left'}</div>
          </div>`;
        }).join('')}
      </div>`}

    <div style="margin-top:24px">
      <h3 style="font-size:1rem;font-weight:700;color:var(--g700);margin:0 0 12px 0">🛒 My Recent Purchases</h3>
      <div id="student-recent-purchases">
        <div style="text-align:center;padding:16px;color:var(--g400);font-size:0.85rem">Loading...</div>
      </div>
    </div>`;
}

async function storeBuyItem(idx) {
  const item = storeItems[idx];
  if (!item || !currentUser) return;
  if (!confirm(`Buy "${item.name}" for ${item.price} keys?`)) return;
  try {
    const result = await API.purchaseReward({
      studentId: currentUser.studentId,
      classId: currentUser.classId,
      itemName: item.name,
      price: item.price
    });
    if (result.success) {
      currentUser.keys_earned = result.newBalance;
      invalidateQuizResultsCache(); // Balance changed — clear cached results
      // Clear purchase cache so teacher dashboard and sidebar badge refresh
      window._purchaseData = null;
      window._purchaseCount = 0;
      const newStock = Math.max(0, storeItems[idx].stock - 1);
      storeItems[idx].stock = newStock;
      // Update stock in DB
      if (storeItems[idx].id) {
        try { await API.updateStoreItem(storeItems[idx].id, { stock: newStock }); } catch(e) {}
      }
      renderMain();
    } else {
      alert(result.error || 'Purchase failed.');
    }
  } catch (e) {
    alert(e.message || 'Purchase failed. Please try again.');
  }
}

// ---- Load student's recent purchases for store page ----
function loadStudentRecentPurchases() {
  var classId = currentUser?.classId;
  if (!classId) return;
  API.getRecentPurchases(classId).then(function(data) {
    var el = document.getElementById('student-recent-purchases');
    if (!el) return;
    // Filter to only this student's purchases
    var myPurchases = (data || []).filter(function(p) { return p.studentName === currentUser?.name; });
    if (myPurchases.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--g400);font-size:0.85rem">No purchases yet \u2014 spend your keys on a reward!</div>';
      return;
    }
    el.innerHTML = myPurchases.slice(0, 10).map(function(p) {
      var dateStr = p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      var timeAgo = formatTimeAgo(p.purchasedAt);
      var statusText = p.fulfilled ? '<span style="color:var(--green, #10B981);font-weight:600">\u2713 Prize received</span>' : '<span style="color:var(--g400)">Waiting for teacher</span>';
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--g100)">' +
        '<div style="font-size:1.5rem">\uD83C\uDF81</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div><span style="font-weight:600;color:var(--purple)">' + escapeHtml(p.itemName) + '</span>' +
          ' <span style="color:var(--g500)">for</span> ' +
          '<span style="font-weight:600;color:var(--gold)">\uD83D\uDD11 ' + p.price + ' Keys</span></div>' +
          '<div style="font-size:0.72rem;color:var(--g400);margin-top:2px">' + dateStr + ' \u00b7 ' + timeAgo + ' \u00b7 ' + statusText + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }).catch(function() {
    var el = document.getElementById('student-recent-purchases');
    if (el) el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--g400);font-size:0.85rem">Could not load purchases</div>';
  });
}

// ---- Store Sneak Peek (Student Dashboard) ----
function renderStoreSneak() {
  if (!storeItems || storeItems.length === 0) return '';
  const peek = storeItems.slice(0, 5);
  return `
    <div class="store-peek-section">
      <div class="store-peek-header">
        <div class="store-peek-title"><img src="/public/Chest_Icon.png" alt="">Store</div>
        <span class="store-peek-link" onclick="navigate('store')">See all rewards &rarr;</span>
      </div>
      <div class="store-peek-grid">
        ${peek.map((item, idx) => `
          <div class="store-peek-item" onclick="event.stopPropagation(); showStoreItemPreview(${idx})">
            ${item.image_url
              ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" class="store-peek-item-img">`
              : `<div class="store-peek-item-icon">${item.icon || '🎁'}</div>`}
            <div class="store-peek-item-details">
              <div class="store-peek-item-name">${escapeHtml(item.name)}</div>
              <div class="store-peek-item-price">${item.price}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function showStoreItemPreview(idx) {
  const item = storeItems[idx];
  if (!item) return;
  const myKeys = currentUser?.keys_earned || 0;
  const canAfford = myKeys >= item.price;
  const soldOut = item.stock <= 0;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:400px">
        <div class="modal-header">
          <h3>${escapeHtml(item.name)}</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:24px">
          ${item.image_url
            ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" style="width:200px;height:200px;object-fit:cover;border-radius:var(--radius-lg);margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">`
            : `<div style="font-size:5rem;margin-bottom:16px">${item.icon || '🎁'}</div>`}
          <div style="font-size:1.25rem;font-weight:800;color:var(--navy);margin-bottom:8px">${escapeHtml(item.name)}</div>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:16px">
            <img src="/public/Key_Icon.png" alt="Keys" style="width:24px;height:24px;object-fit:contain">
            <span style="font-size:1.25rem;font-weight:800;color:#D97706">${item.price} Keys</span>
          </div>
          <div style="font-size:0.8125rem;color:var(--g400);margin-bottom:20px">${soldOut ? 'Sold Out' : item.stock + ' left in stock'}</div>
          ${soldOut
            ? `<button class="btn btn-ghost w-full" disabled>Sold Out</button>`
            : canAfford
              ? `<button class="btn btn-primary w-full" onclick="closeModal(); storeBuyItem(${idx})">Buy for ${item.price} Keys</button>`
              : `<button class="btn btn-ghost w-full" disabled>Need ${item.price - myKeys} more keys</button>`}
        </div>
      </div>
    </div>`;
}

// ---- Page: Book Library ----
// ---- Guest Browse Page ----
function renderGuestBrowse() {
  return `
    <div style="padding:8px 0 24px">
      <div style="text-align:center;margin-bottom:28px">
        <h2 style="margin:0 0 4px;color:var(--navy);font-size:1.5rem">Browse Books & Take Quizzes</h2>
        <p style="color:var(--g500);margin:0;font-size:0.9375rem">No account needed — pick a book and start reading!</p>
      </div>

      <div style="max-width:480px;margin:0 auto 24px;position:relative">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:20px;height:20px;color:var(--g400);pointer-events:none">${IC.search}</span>
        <input type="text" id="book-search-input" placeholder="Search books by title, author, or genre..."
          style="width:100%;padding:12px 16px 12px 42px;border:2px solid var(--g200);border-radius:var(--radius-lg);font-size:1rem;outline:none;transition:border-color .2s"
          onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--g200)'">
      </div>

      <div id="guest-book-count" style="margin-bottom:16px;color:var(--g500);font-size:0.875rem">
        ${books.length} book${books.length !== 1 ? 's' : ''} available
      </div>

      <div class="book-grid" id="guest-book-grid">
        ${books.length === 0 ? `
          <div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--g400)">
            <p>Loading books...</p>
          </div>
        ` : books.map(b => renderGuestBookCard(b)).join('')}
      </div>
    </div>`;
}

function renderGuestBookCard(b) {
  const coverUrl = b.cover_url || '';
  const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
  const genre = b.genre || '';
  const comingSoon = b.has_quizzes === false;
  return `
    <div class="book-card${comingSoon ? ' book-card-coming-soon' : ''}" ${comingSoon ? '' : `onclick="openBook(${b.id})"`}>
      <div class="book-card-cover">
        ${comingSoon ? '<div class="coming-soon-ribbon">Coming Soon</div>' : ''}
        ${coverUrl
          ? `<img src="${coverUrl}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="book-card-cover-fallback" ${coverUrl ? 'style="display:none"' : ''}>
          <span style="font-size:0.875rem;font-weight:600;color:var(--g500);padding:12px;text-align:center;line-height:1.4">${b.title}</span>
        </div>
      </div>
      <div class="book-card-info">
        <h4 class="book-card-title">${b.title}</h4>
        <p class="book-card-author">${b.author || ''}</p>
        <div class="book-card-meta">
          ${level ? `<span class="badge badge-blue">${level}</span>` : ''}
          ${genre ? `<span class="badge badge-outline">${genre}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function initBookSearch() {
  const input = document.getElementById('book-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const grid = document.getElementById('guest-book-grid');
    const countEl = document.getElementById('guest-book-count');
    if (!grid) return;
    const filtered = q
      ? books.filter(b =>
          (b.title || '').toLowerCase().includes(q) ||
          (b.author || '').toLowerCase().includes(q) ||
          (b.genre || '').toLowerCase().includes(q) ||
          (b.grade_level || '').toLowerCase().includes(q)
        )
      : books;
    grid.innerHTML = filtered.length === 0
      ? `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--g400)">
           <p style="font-size:1.125rem;margin-bottom:4px">No books found</p>
           <p style="font-size:0.875rem">Try a different search term</p>
         </div>`
      : filtered.map(b => renderGuestBookCard(b)).join('');
    if (countEl) countEl.textContent = `${filtered.length} book${filtered.length !== 1 ? 's' : ''} available`;
  });
}

function handleGlobalSearch(query) {
  const q = query.toLowerCase().trim();
  // Dashboard roster search
  const rosterEl = document.querySelector('.dashboard-roster');
  if (rosterEl) {
    const rows = rosterEl.querySelectorAll('.roster-row');
    rows.forEach(row => {
      const name = row.querySelector('.roster-name')?.textContent?.toLowerCase() || '';
      const stats = row.querySelector('.roster-stats')?.textContent?.toLowerCase() || '';
      const status = row.querySelector('.roster-status')?.textContent?.toLowerCase() || '';
      row.style.display = (!q || name.includes(q) || stats.includes(q) || status.includes(q)) ? '' : 'none';
    });
  }
  // Students page search
  const studentRows = document.querySelectorAll('.data-table tbody tr');
  if (studentRows.length > 0 && page === 'students') {
    studentRows.forEach(row => {
      const text = row.textContent?.toLowerCase() || '';
      row.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  }
}

function initLibrarySearch() {
  const input = document.getElementById('library-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const grid = document.getElementById('library-book-grid');
    const countEl = document.getElementById('library-book-count');
    if (!grid) return;
    const isStudent = userRole === 'student' || userRole === 'child';
    const base = isStudent && showFavoritesOnly ? books.filter(b => studentFavorites.some(fid => Number(fid) === Number(b.id))) : books;
    const filtered = q
      ? base.filter(b =>
          (b.title || '').toLowerCase().includes(q) ||
          (b.author || '').toLowerCase().includes(q) ||
          (b.genre || '').toLowerCase().includes(q) ||
          (b.grade_level || '').toLowerCase().includes(q)
        )
      : base;
    if (isStudent) {
      grid.innerHTML = filtered.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--g400)">
             <p style="font-size:1rem;margin-bottom:4px">No books found</p>
             <p style="font-size:0.8125rem">Try a different search term</p>
           </div>`
        : filtered.map(b => renderStudentBookCard(b)).join('');
    } else {
      grid.innerHTML = filtered.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--g400)">
             <p style="font-size:1.125rem;margin-bottom:4px">No books found</p>
             <p style="font-size:0.875rem">Try a different search term</p>
           </div>`
        : filtered.map(b => {
            const coverUrl = b.cover_url || '';
            const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
            const genre = b.genre || '';
            return `<div class="book-card" onclick="openBook(${b.id})">
              <div class="book-card-cover">${coverUrl ? `<img src="${coverUrl}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}<div class="book-card-cover-fallback" ${coverUrl ? 'style="display:none"' : ''}><span style="font-size:0.875rem;font-weight:600;color:var(--g500);padding:12px;text-align:center;line-height:1.4">${b.title}</span></div></div>
              <div class="book-card-info"><h4 class="book-card-title">${b.title}</h4><p class="book-card-author">${b.author || ''}</p><div class="book-card-meta">${level ? `<span class="badge badge-blue">${level}</span>` : ''}${genre ? `<span class="badge badge-outline">${genre}</span>` : ''}</div></div>
            </div>`;
          }).join('');
    }
    if (countEl) countEl.textContent = filtered.length;
  });
}

function renderStudentBookCard(b) {
  const coverUrl = b.cover_url || '';
  const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
  const genre = b.genre || '';
  const comingSoon = b.has_quizzes === false;
  const isFav = studentFavorites.some(fid => Number(fid) === Number(b.id));
  return `
    <div class="book-card${comingSoon ? ' book-card-coming-soon' : ''}" ${comingSoon ? '' : `onclick="openBook(${b.id})" style="cursor:pointer"`}>
      <div class="book-card-cover" style="height:200px">
        ${comingSoon ? '<div class="coming-soon-ribbon">Coming Soon</div>' : ''}
        <button class="book-fav-btn${isFav ? ' active' : ''}" data-book-id="${b.id}" onclick="event.stopPropagation(); toggleFavoriteBook(${b.id})" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          ${isFav
            ? '<svg viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}
        </button>
        ${coverUrl
          ? `<img src="${coverUrl}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="book-card-cover-fallback" ${coverUrl ? 'style="display:none"' : ''}>
          <span style="font-size:0.8125rem;font-weight:600;color:var(--g500);padding:12px;text-align:center;line-height:1.4">${b.title}</span>
        </div>
      </div>
      <div class="book-card-info" style="padding:10px 12px 12px">
        <h4 class="book-card-title" style="font-size:0.8125rem">${b.title}</h4>
        <p class="book-card-author">${b.author || ''}</p>
        <div class="book-card-meta">
          ${level ? `<span class="badge badge-blue" style="font-size:0.6875rem">${level}</span>` : ''}
          ${genre ? `<span class="badge badge-outline" style="font-size:0.6875rem">${genre}</span>` : ''}
        </div>
      </div>
    </div>`;
}

// ─── Favorites localStorage helpers ───
function _studentId() { return currentUser?.studentId || currentUser?.id; }
function _favKey() { return 'k2r_favorites_' + (_studentId() || 'unknown'); }
function _saveFavsLocal(favs) { try { localStorage.setItem(_favKey(), JSON.stringify(favs)); } catch(e) {} }
function _loadFavsLocal() { try { return JSON.parse(localStorage.getItem(_favKey()) || '[]'); } catch(e) { return []; } }

async function toggleFavoriteBook(bookId) {
  if (!_studentId()) return;
  const numId = Number(bookId);
  // Optimistic update: toggle immediately in UI
  const wasFav = studentFavorites.some(id => Number(id) === numId);
  if (wasFav) {
    studentFavorites = studentFavorites.filter(id => Number(id) !== numId);
  } else {
    studentFavorites = [...studentFavorites, numId];
  }
  // Save to localStorage immediately (reliable even if DB column missing)
  _saveFavsLocal(studentFavorites);
  // Update just the heart buttons without full re-render (preserves scroll)
  document.querySelectorAll(`.book-fav-btn[data-book-id="${bookId}"]`).forEach(btn => {
    btn.classList.toggle('active', !wasFav);
    btn.title = !wasFav ? 'Remove from favorites' : 'Add to favorites';
    btn.innerHTML = !wasFav
      ? '<svg viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  });
  // Try to persist to server (may fail if favorite_books column missing)
  try {
    await API.toggleFavorite(_studentId(), bookId);
  } catch(e) {
    console.warn('Server favorites sync failed, using localStorage:', e.message);
  }
}

function initStudentBookSearch() {
  const input = document.getElementById('student-book-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const grid = document.getElementById('student-book-grid');
    const countEl = document.getElementById('student-book-count');
    if (!grid) return;
    const base = showFavoritesOnly ? books.filter(b => studentFavorites.some(fid => Number(fid) === Number(b.id))) : books;
    const filtered = q
      ? base.filter(b =>
          (b.title || '').toLowerCase().includes(q) ||
          (b.author || '').toLowerCase().includes(q) ||
          (b.genre || '').toLowerCase().includes(q) ||
          (b.grade_level || '').toLowerCase().includes(q)
        )
      : base;
    grid.innerHTML = filtered.length === 0
      ? `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--g400)">
           <p style="font-size:1rem;margin-bottom:4px">No books found</p>
           <p style="font-size:0.8125rem">Try a different search term</p>
         </div>`
      : filtered.map(b => renderStudentBookCard(b)).join('');
    if (countEl) countEl.textContent = `${filtered.length} books`;
  });
}

function renderLibrary() {
  if (books.length === 0) {
    return `
      <div class="page-header">
        <h1>Book Library</h1>
      </div>
      <div class="list-card" style="padding:48px;text-align:center;color:var(--g400)">
        <p>Loading books...</p>
      </div>`;
  }

  const isStudent = userRole === 'student' || userRole === 'child';
  const displayBooks = isStudent && showFavoritesOnly ? books.filter(b => studentFavorites.some(fid => Number(fid) === Number(b.id))) : books;

  return `
    <div class="page-header">
      <h1>Book Library <span class="badge badge-blue" id="library-book-count">${displayBooks.length}</span></h1>
    </div>

    ${isStudent ? `
    <div class="book-filter-toggle" style="margin-bottom:12px">
      <button class="book-filter-btn${!showFavoritesOnly ? ' active' : ''}" onclick="showFavoritesOnly=false; renderMain()">All Books</button>
      <button class="book-filter-btn${showFavoritesOnly ? ' active' : ''}" onclick="showFavoritesOnly=true; renderMain()">&#10084;&#65039; My Favorites</button>
    </div>` : ''}

    <div style="position:relative;margin-bottom:20px;max-width:480px">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--g400);pointer-events:none">${IC.search}</span>
      <input type="text" id="library-search-input" placeholder="Search books by title, author, or genre..."
        style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--g200);border-radius:var(--radius-md);font-size:0.875rem;outline:none;transition:border-color .2s"
        onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--g200)'">
    </div>

    <div class="list-card" style="padding:24px;margin-bottom:20px">
      <h3 style="margin:0 0 4px 0;font-size:1.25rem;font-weight:700;color:var(--navy);display:flex;align-items:center"><img src="/public/Comprehension_Outline_Black_Icon_.png" alt="" style="width:36px;height:36px;margin-right:10px;object-fit:contain">How Does the Software Work?</h3>
      <p style="margin:0 0 16px 0;font-size:0.8rem;color:var(--g400)">Students must read the physical book first · <a href="https://www.dianealber.com/pages/keychapterbooks" target="_blank" style="color:var(--blue);text-decoration:none;font-weight:600">Purchase books here →</a></p>
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px">
        <div style="text-align:center;padding:16px 12px;background:var(--blue-p, #EFF6FF);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Stacked_Book_Outline.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">1. Pick a Book</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">Students choose a chapter book from the library</div>
        </div>
        <div style="text-align:center;padding:16px 12px;background:var(--gold-l, #FFFBEB);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Quiz_Outline_Icon_Blk.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">2. Take the Quiz</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">5 questions test comprehension, vocabulary, and reasoning</div>
        </div>
        <div style="text-align:center;padding:16px 12px;background:var(--purple-l, #F5F3FF);border-radius:var(--radius-md)">
          <div style="margin-bottom:8px;display:flex;justify-content:center"><img src="/public/Key_Outline_Icon_Blk.png" alt="" style="width:56px;height:56px;object-fit:contain"></div>
          <div style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:4px">3. Earn Keys & Grow</div>
          <div style="font-size:0.75rem;color:var(--g500);line-height:1.4">Score 80%+ to earn Keys and boost their Reading Score</div>
        </div>
      </div>
    </div>

    <div class="book-grid" id="library-book-grid">
      ${isStudent
        ? (displayBooks.length > 0 ? displayBooks.map(b => renderStudentBookCard(b)).join('') : showFavoritesOnly
          ? `<p style="grid-column:1/-1;color:var(--g500);text-align:center;padding:24px">No favorites yet! Tap the &#10084;&#65039; on any book to add it here.</p>`
          : `<p style="grid-column:1/-1;color:var(--g500);text-align:center;padding:24px">No books available yet.</p>`)
        : books.map(b => {
        const coverUrl = b.cover_url || '';
        const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
        const genre = b.genre || '';
        const comingSoon = b.has_quizzes === false;
        return `
        <div class="book-card${comingSoon ? ' book-card-coming-soon' : ''}" ${comingSoon ? '' : `onclick="openBook(${b.id})"`}>
          <div class="book-card-cover">
            ${comingSoon ? '<div class="coming-soon-ribbon">Coming Soon</div>' : ''}
            ${coverUrl
              ? `<img src="${coverUrl}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
              : ''}
            <div class="book-card-cover-fallback" ${coverUrl ? 'style="display:none"' : ''}>
              <span style="font-size:0.875rem;font-weight:600;color:var(--g500);padding:12px;text-align:center;line-height:1.4">${b.title}</span>
            </div>
          </div>
          <div class="book-card-info">
            <h4 class="book-card-title">${b.title}</h4>
            <p class="book-card-author">${b.author || ''}</p>
            <div class="book-card-meta">
              ${level ? `<span class="badge badge-blue">${level}</span>` : ''}
              ${genre ? `<span class="badge badge-outline">${genre}</span>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ---- Open Book Detail ----
async function openBook(bookId) {
  // Preserve in-memory completed chapters if re-opening the same book
  const prevCompleted = selectedBookId === bookId ? [...completedChapters] : [];
  selectedBookId = bookId;
  bookChapters = [];
  completedChapters = prevCompleted;
  page = 'book-detail';
  renderSidebar();
  renderMain();
  // Load chapters and completed progress in parallel
  try {
    const sid = currentUser?.studentId || 0;
    const [chapters, progress] = await Promise.all([
      API.getChapters(bookId),
      sid ? API.getCompletedChapters(sid, bookId).catch(() => ({ completed: [] })) : Promise.resolve({ completed: [] })
    ]);
    bookChapters = chapters;
    // Merge server-side completed with in-memory completed (in case submit was slow)
    const serverCompleted = progress.completed || [];
    completedChapters = [...new Set([...prevCompleted, ...serverCompleted])];
  } catch(e) {
    if (bookChapters.length === 0) bookChapters = [];
    // Keep prevCompleted if fetch fails
    if (prevCompleted.length > 0) completedChapters = prevCompleted;
  }
  renderMain();
}

function renderBookDetail() {
  const b = books.find(x => x.id === selectedBookId);
  if (!b) return '<p>Book not found.</p>';
  const coverUrl = b.cover_url || '';
  const sid = currentUser?.studentId || 0;
  const chapCount = bookChapters.length || b.chapter_count || 0;

  return `
    <button class="back-btn" onclick="navigate('${userRole === 'guest' ? 'guest-browse' : (userRole === 'student' || userRole === 'child') ? 'student-dashboard' : 'library'}')">${IC.arrowLeft} Back to ${userRole === 'guest' ? 'Books' : (userRole === 'student' || userRole === 'child') ? 'Dashboard' : 'Library'}</button>

    <div style="display:flex;gap:32px;margin-top:16px;flex-wrap:wrap">
      <div style="flex-shrink:0;width:200px">
        <div style="width:200px;height:280px;background:var(--g100);border-radius:var(--radius-md);overflow:hidden;display:flex;align-items:center;justify-content:center">
          ${coverUrl ? `<img src="${coverUrl}" alt="${b.title}" style="width:100%;height:100%;object-fit:contain">` : `<div style="color:var(--g500);font-size:0.875rem;font-weight:600;padding:12px;text-align:center">${b.title}</div>`}
        </div>
      </div>
      <div style="flex:1;min-width:280px">
        <h2 style="margin-bottom:4px;color:var(--navy)">${b.title}</h2>
        <p style="color:var(--g500);margin-bottom:12px">by ${b.author || 'Unknown'}</p>
        ${b.description ? `<p style="color:var(--g600);margin-bottom:16px;line-height:1.6">${b.description}</p>` : ''}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
          ${b.grade_level ? `<span class="badge badge-blue">${displayGradeLevel(b.grade_level)}</span>` : ''}
          ${b.genre ? `<span class="badge badge-outline">${b.genre}</span>` : ''}
          <span class="badge badge-outline">${chapCount} ${/diary|diaries/i.test(b.title) ? 'Entries' : 'Chapters'}</span>
        </div>
      </div>
    </div>

    <div style="margin-top:28px">
      <h3 style="margin-bottom:20px;font-size:1.25rem;font-weight:700">${/diary|diaries/i.test(b.title) ? 'Entries' : 'Chapters'}</h3>
      ${bookChapters.length === 0 ? `
        <div class="list-card" style="padding:32px;text-align:center;color:var(--g400)">
          <p>Loading chapters...</p>
        </div>
      ` : `
        <div class="list-card">
          ${bookChapters.map((ch, i) => {
            const isTeacher = userRole === 'teacher' || userRole === 'owner' || userRole === 'principal';
            const isCompleted = completedChapters.includes(ch.chapter_number);
            const isUnlocked = isTeacher || ch.chapter_number === 1 || completedChapters.includes(ch.chapter_number - 1);
            const isLocked = !isUnlocked && !isCompleted;

            if (isLocked) {
              return `
              <div class="list-item" style="cursor:not-allowed;opacity:0.5">
                <div class="list-item-info" style="display:flex;align-items:center;gap:12px;flex-direction:row">
                  <div style="width:44px;height:44px;border-radius:50%;background:var(--g200);color:var(--g400);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem;flex-shrink:0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <div>
                    <span class="list-item-name" style="color:var(--g400)">${/diary|diaries/i.test(b.title) ? 'Entry' : 'Chapter'} ${ch.chapter_number}: ${ch.title}</span>
                    <span class="list-item-sub">Complete ${/diary|diaries/i.test(b.title) ? 'Entry' : 'Chapter'} ${ch.chapter_number - 1} first!</span>
                  </div>
                </div>
                <div class="list-item-right">
                  <span class="btn btn-sm btn-outline" style="opacity:0.4;pointer-events:none">🔒 Locked</span>
                </div>
              </div>`;
            }

            return `
            <div class="list-item" style="cursor:pointer" onclick="launchQuiz(${b.id}, ${ch.chapter_number}, ${sid})">
              <div class="list-item-info" style="display:flex;align-items:center;gap:12px;flex-direction:row">
                <div style="width:44px;height:44px;border-radius:50%;background:${isCompleted ? 'var(--green-p, #dcfce7)' : 'var(--blue-p)'};color:${isCompleted ? 'var(--green, #16a34a)' : 'var(--blue)'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem;flex-shrink:0">
                  ${isCompleted ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ch.chapter_number}
                </div>
                <div>
                  <span class="list-item-name">${/diary|diaries/i.test(b.title) ? 'Entry' : 'Chapter'} ${ch.chapter_number}: ${ch.title}</span>
                  <span class="list-item-sub">${isCompleted ? '✅ Completed!' : (ch.summary ? ch.summary.substring(0, 80) + '...' : '5 questions')}</span>
                </div>
              </div>
              <div class="list-item-right" style="display:flex;gap:8px;align-items:center">
                ${isCompleted ? `<span class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showQuizResult(${b.id}, ${ch.chapter_number})" style="font-size:0.75rem">View Results</span>` : ''}
                <span class="btn btn-sm ${isCompleted ? 'btn-outline' : 'btn-primary'}">${isCompleted ? 'Retake Quiz' : 'Take Quiz'}</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      `}
    </div>

    ${(() => {
      if (completedChapters.length < chapCount || chapCount === 0 || !currentUser) return '';
      const certData = JSON.stringify({
        bookTitle: b.title || 'Book',
        bookAuthor: b.author || '',
        studentName: currentUser?.name || 'Student',
        coverUrl: b.cover_url || '',
        dateStr: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }).replace(/"/g, '&quot;');
      return `
      <div class="list-card" style="padding:28px;margin-top:24px;text-align:center;background:linear-gradient(135deg, #FEFCE8 0%, #FFF7ED 50%, #FEFCE8 100%);border:2px solid #FDE68A">
        <div style="font-size:2.5rem;margin-bottom:8px">🏆</div>
        <h3 style="margin:0 0 6px;font-size:1.25rem;color:var(--navy)">Book Completed!</h3>
        <p style="margin:0 0 20px;color:var(--g500);font-size:0.9rem">Congratulations on finishing all ${chapCount} ${/diary|diaries/i.test(b.title) ? 'entries' : 'chapters'} of <strong>${escapeHtml(b.title)}</strong>!</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" data-cert="${certData}" onclick="downloadCertificatePDF(JSON.parse(this.dataset.cert))">📥 Download Certificate PDF</button>
          <button class="btn btn-outline" data-cert="${certData}" onclick="printCertificate(JSON.parse(this.dataset.cert))">🖨️ Print Certificate</button>
        </div>
      </div>`;
    })()}`;
}

async function launchFullBookQuiz(bookId, sid) {
  // Find student
  let s = sid != null ? students.find(st => st.id === sid) : students[0];
  if (!s && (userRole === 'student' || userRole === 'child') && currentUser) {
    s = {
      id: currentUser.studentId,
      name: currentUser.name,
      grade: currentUser.grade || '4th',
      reading_score: currentUser.reading_score || 500,
      accuracy: currentUser.accuracy || 0,
      keys: currentUser.keys_earned || 0,
      quizzes: currentUser.quizzes_completed || 0
    };
  }

  selectedBookId = bookId; // Ensure selectedBookId is set for certificate PDF
  page = 'quiz-player';
  renderSidebar();
  renderMain();

  const playerRoot = document.getElementById('quiz-player-root');
  if (playerRoot) playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">📖</div>Loading full book quiz...<br><small>Gathering 20 questions from all chapters</small></div>';

  try {
    const quizData = await API.getFullBookQuiz(bookId);
    // Use globally cached books array — no extra API call
    let book = books.find(b => b.id === bookId);
    if (!book) book = { title: 'Book Quiz', author: '' };

    // Build a synthetic chapter for the full book quiz
    const fullChapter = {
      id: null,
      chapter_number: 0,
      title: 'Full Book Quiz',
      key_vocabulary: []
    };

    // Merge all chapter vocabularies
    if (quizData.chapters) {
      const allVocab = [];
      quizData.chapters.forEach(ch => {
        if (ch.key_vocabulary) {
          const vocab = typeof ch.key_vocabulary === 'string' ? (() => { try { return JSON.parse(ch.key_vocabulary); } catch(e) { return ch.key_vocabulary; } })() : ch.key_vocabulary;
          if (Array.isArray(vocab)) allVocab.push(...vocab);
        }
      });
      fullChapter.key_vocabulary = allVocab;
    }

    QuizEngine.start({ chapter: fullChapter, questions: quizData.questions, book }, s, async (results) => {
      if (s) {
        s.score = results.newReadingScore || s.score;
        s.reading_level = results.newReadingLevel || s.reading_level;
        s.keys = (s.keys || 0) + (results.keysEarned || 0);
        s.quizzes = (s.quizzes || 0) + 1;
      }
      // Invalidate cached quiz results so modals fetch fresh data
      invalidateQuizResultsCache();
      if (currentUser && (userRole === 'student' || userRole === 'child')) {
        currentUser.reading_score = results.newReadingScore || currentUser.reading_score;
        currentUser.reading_level = results.newReadingLevel || currentUser.reading_level;
        currentUser.keys_earned = (currentUser.keys_earned || 0) + (results.keysEarned || 0);
        currentUser.quizzes_completed = (currentUser.quizzes_completed || 0) + 1;
        if (results.score != null) {
          const oldAcc = currentUser.accuracy || 0;
          const oldQuizzes = (currentUser.quizzes_completed || 1) - 1;
          currentUser.accuracy = oldQuizzes > 0 ? Math.round((oldAcc * oldQuizzes + results.score) / currentUser.quizzes_completed) : Math.round(results.score);
        }
        // Update weekly stats so Weekly Wins + Total Progress stay in sync
        if (currentUser.weeklyStats) {
          currentUser.weeklyStats.keysThisWeek = (currentUser.weeklyStats.keysThisWeek || 0) + (results.keysEarned || 0);
          currentUser.weeklyStats.quizzesThisWeek = (currentUser.weeklyStats.quizzesThisWeek || 0) + 1;
        }
      }
      // Full book quiz = book is complete
      if (currentUser?.weeklyStats) currentUser.weeklyStats.booksCompletedThisWeek = (currentUser.weeklyStats.booksCompletedThisWeek || 0) + 1;
      try { setTimeout(() => showBookCompletionCelebration(book, results), 600); } catch(err) { console.error('Celebration error:', err); }
      // Refresh all student data from server
      await refreshStudentData();
    }, null);
    QuizEngine.render();
  } catch(e) {
    playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">⚠️</div>Could not load full book quiz.<br><small>' + (e.message || 'Check that the server is running') + '</small><br><br><button class="btn btn-outline" onclick="openBook(' + bookId + ')">Back to Book</button></div>';
  }
}

// ---- Gated Persistence Modal (shown only when guest tries to save/keep/track) ----
function showPersistenceGate(action) {
  const modal = document.getElementById('modal-root-2');
  if (!modal) return;

  const messages = {
    save: {
      icon: 'logo',
      title: 'Save Your Progress',
      desc: 'You need a paid plan to save your progress, earn certificates, and track your growth.'
    },
    keys: {
      icon: '🔑',
      title: 'Keep Your Keys',
      desc: 'Create a free account to collect keys and spend them in your classroom store.'
    },
    history: {
      icon: '📚',
      title: 'View Your Reading History',
      desc: 'Create a free account to see all your past quizzes, scores, and reading progress.'
    },
    certificate: {
      icon: '🏆',
      title: 'Print Your Certificate',
      desc: 'Create a free account to download and print certificates for your achievements.'
    }
  };

  const msg = messages[action] || messages.save;

  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)document.getElementById('modal-root-2').innerHTML=''">
      <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:40px 32px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative">
        ${msg.icon === 'logo'
          ? '<img src="/public/logo.png" alt="key2read" style="height:48px;width:auto;margin-bottom:16px">'
          : '<div style="font-size:2.5rem;margin-bottom:12px">' + msg.icon + '</div><img src="/public/logo.png" alt="key2read" style="height:36px;width:auto;margin-bottom:20px">'}
        <h2 style="margin:0 0 10px;color:var(--navy);font-size:1.375rem">${msg.title}</h2>
        <p style="color:var(--g500);margin:0 0 28px;font-size:0.9375rem;line-height:1.6">${msg.desc}</p>
        <a href="signup.html" class="btn btn-primary" style="width:100%;text-align:center;text-decoration:none;font-size:1rem;padding:14px 24px;margin-bottom:12px;display:block">Create Free Account</a>
        <button onclick="document.getElementById('modal-root-2').innerHTML=''" style="background:none;border:none;color:var(--g400);cursor:pointer;font-size:0.875rem;padding:8px">Maybe later</button>
      </div>
    </div>`;
}

// ---- Book Completion Celebration + Certificate ----
function showBookCompletionCelebration(book, results) {
  const modal = document.getElementById('modal-root-2');
  if (!modal) return;

  // Fire confetti burst if library is loaded
  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 } }), 300);
  }

  let content;
  if (!currentUser) {
    content = buildGuestCelebration(book);
  } else if (currentUser.plan === false) {
    // Future-proofed: currently all auth users treated as active
    content = buildLockedCelebration(book);
  } else {
    content = buildCertificateCelebration(book, results);
  }

  modal.innerHTML = `
    <div class="celebration-overlay" onclick="if(event.target===this)closeCelebration()">
      ${content}
    </div>`;
}

function buildGuestCelebration(book) {
  const title = book.title || 'the Book';
  return `
    <div class="celebration-modal">
      <div class="celebration-icon">🎉</div>
      <h2 class="celebration-title">You Finished ${escapeHtml(title)}!</h2>
      <p class="celebration-message">Amazing work completing all the quizzes! Create a free account to save your progress, earn certificates, and track your reading growth.</p>
      <div class="celebration-actions">
        <a href="signup.html" class="btn btn-primary" style="text-decoration:none;flex:1;text-align:center">Create Free Account</a>
      </div>
      <button class="celebration-dismiss" onclick="closeCelebration()">Maybe later</button>
    </div>`;
}

function buildLockedCelebration(book) {
  const title = book.title || 'the Book';
  return `
    <div class="celebration-modal">
      <div class="celebration-icon">🎉</div>
      <h2 class="celebration-title">You Finished ${escapeHtml(title)}!</h2>
      <p class="celebration-message">Great job! Upgrade your plan to download and print your achievement certificate.</p>
      <div class="celebration-actions">
        <a href="pricing.html" class="btn btn-primary" style="text-decoration:none;flex:1;text-align:center">View Plans</a>
      </div>
      <button class="celebration-dismiss" onclick="closeCelebration()">Maybe later</button>
    </div>`;
}

function buildCertificateCelebration(book, results) {
  const title = book.title || 'the Book';
  const author = book.author || '';
  const studentName = currentUser.name || 'Student';
  const score = results ? Math.round(results.score) : 0;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <div class="celebration-modal celebration-modal--cert">
      <div class="celebration-icon">🎉</div>
      <h2 class="celebration-title">You Finished ${escapeHtml(title)}!</h2>
      <p class="celebration-message">Congratulations! Here's your achievement certificate.</p>

      <div class="celebration-cert-preview">
        <div class="celebration-cert-inner">
          <div class="celebration-cert-badge">🏆</div>
          <h3 class="celebration-cert-title">Certificate of Achievement</h3>
          <p class="celebration-cert-desc">This certifies that</p>
          <p class="celebration-cert-name">${escapeHtml(studentName)}</p>
          <p class="celebration-cert-desc">has successfully completed all quizzes for</p>
          <p class="celebration-cert-book">${escapeHtml(title)}</p>
          ${author ? `<p class="celebration-cert-author">by ${escapeHtml(author)}</p>` : ''}
          <div class="celebration-cert-meta">
            <span>${dateStr}</span>
            <span>Score: ${score}%</span>
          </div>
          <div class="celebration-cert-brand">
            <img src="/public/logo.png" alt="key2read" style="height:24px;width:auto">
          </div>
        </div>
      </div>

      <div class="celebration-actions">
        <button class="btn btn-primary" onclick="downloadCertificatePDF({bookTitle:'${escapeHtml(title).replace(/'/g,"\\'")}',bookAuthor:'${escapeHtml(author).replace(/'/g,"\\'")}',studentName:'${escapeHtml(studentName).replace(/'/g,"\\'")}',coverUrl:'${(book.cover_url||'').replace(/'/g,"\\'")}',score:${score},dateStr:'${dateStr}'})">Download PDF</button>
        <button class="btn btn-outline" onclick="printCertificate({bookTitle:'${escapeHtml(title).replace(/'/g,"\\'")}',bookAuthor:'${escapeHtml(author).replace(/'/g,"\\'")}',studentName:'${escapeHtml(studentName).replace(/'/g,"\\'")}',coverUrl:'${(book.cover_url||'').replace(/'/g,"\\'")}',score:${score},dateStr:'${dateStr}'})">Print Certificate</button>
      </div>
      <button class="celebration-dismiss" onclick="closeCelebration()">Close</button>
    </div>`;
}

function closeCelebration() {
  const modal = document.getElementById('modal-root-2');
  if (modal) modal.innerHTML = '';
}

async function downloadCertificatePDF(params) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    // Lazy-load jsPDF if not available
    try {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    } catch(e) {
      alert('Could not load PDF library. Please check your internet connection and try again.');
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library failed to initialize. Please refresh the page and try again.');
      return;
    }
  }
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = 297, h = 210;
    const book = params ? { title: params.bookTitle || 'Book', author: params.bookAuthor || '' } : (books.find(b => b.id === selectedBookId) || { title: 'Book', author: '' });
    const studentName = params ? params.studentName : (currentUser?.name || 'Student');
    const coverUrl = params?.coverUrl || '';
    const dateStr = params ? (params.dateStr || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const safe = (str) => str.replace(/[^\x00-\xFF]/g, '');

    // Helper: load image as data URL (no crossOrigin for same-origin images)
    function loadImage(url, useCors) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        if (useCors) img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch(e) {
            // Canvas tainted — try without CORS
            if (useCors) {
              loadImage(url, false).then(resolve).catch(reject);
            } else {
              reject(e);
            }
          }
        };
        img.onerror = () => reject(new Error('Image load failed: ' + url));
        img.src = url;
      });
    }

    // Load the certificate background image (same-origin, no CORS needed)
    const bgDataUrl = await loadImage('/public/Certificate.png', false);
    doc.addImage(bgDataUrl, 'PNG', 0, 0, w, h);

    // Student name — centered, positioned below "This is to certify that"
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 46);
    doc.text(safe(studentName), w / 2, h * 0.47, { align: 'center' });

    // Book title — centered, positioned below "has successfully completed all the quizzes for"
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(26, 26, 46);
    doc.text(safe(book.title || 'Book'), w / 2, h * 0.63, { align: 'center' });

    // Date — bottom center
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(safe(dateStr), w / 2, h * 0.92, { align: 'center' });

    // Book cover — centered below the book title
    if (coverUrl) {
      try {
        const coverDataUrl = await loadImage(coverUrl, true);
        const coverW = 52;
        const coverH = 68;
        doc.addImage(coverDataUrl, 'PNG', (w - coverW) / 2, h * 0.68, coverW, coverH);
      } catch(e) { console.log('Could not load book cover for PDF:', e); }
    }

    // Save
    const safeTitle = (book.title || 'Book').replace(/[^a-zA-Z0-9]/g, '-');
    doc.save(safeTitle + '-Certificate.pdf');
  } catch(e) {
    console.error('Certificate PDF error:', e);
    alert('Could not generate PDF: ' + e.message);
  }
}

function printCertificate(params) {
  const book = params ? { title: params.bookTitle || 'Book', author: params.bookAuthor || '' } : (books.find(b => b.id === selectedBookId) || { title: 'Book', author: '' });
  const studentName = params ? params.studentName : (currentUser?.name || 'Student');
  const coverUrl = params?.coverUrl || '';
  const dateStr = params ? (params.dateStr || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html><html><head><title>Certificate - ${book.title}</title>
    <style>
      @page { size: landscape; margin: 0; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Arial', 'Helvetica', sans-serif; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
      .cert { width: 270mm; height: 190mm; position: relative; overflow: hidden; }
      .cert-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .cert-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; }
      .student-name { position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%); font-size: 36px; font-weight: 800; color: #1a1a2e; text-align: center; width: 70%; }
      .book-name { position: absolute; top: 62%; left: 50%; transform: translate(-50%, -50%); font-size: 26px; font-weight: 700; color: #1a1a2e; font-style: italic; text-align: center; width: 70%; }
      .book-cover { position: absolute; top: 68%; left: 50%; transform: translateX(-50%); width: 110px; height: 145px; object-fit: cover; border-radius: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.25); border: 2px solid #fff; }
      .cert-date { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); font-size: 11px; color: #777; }
    </style>
  </head><body>
    <div class="cert">
      <img class="cert-bg" src="/public/Certificate.png" alt="Certificate Background">
      <div class="cert-content">
        <div class="student-name">${studentName}</div>
        <div class="book-name">${book.title || 'Book'}</div>
        ${coverUrl ? '<img class="book-cover" src="' + coverUrl + '" alt="Book Cover">' : ''}
        <div class="cert-date">${dateStr}</div>
      </div>
    </div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();

  // Wait for all images to load before printing
  const images = iframe.contentDocument.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve; // don't block print if an image fails
    });
  });
  Promise.all(imagePromises).then(() => {
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => iframe.remove(), 2000);
    }, 200);
  });
}

// ---- Page: Celebrate Students ----
function renderCelebrate() {
  if (students.length === 0) {
    return `
      <div class="page-header"><h1>Celebrate Students</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.star}</div>
        <h2>No Students Yet</h2>
        <p>Once students join your class and start taking quizzes, their achievements will appear here!</p>
        <button class="btn btn-primary" onclick="navigate('quizzes')">${IC.arrowLeft} Go to Dashboard</button>
      </div>`;
  }

  const sorted = [...students].sort((a, b) => b.score - a.score);
  const byStreak = [...students].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  const byQuizzes = [...students].sort((a, b) => (b.quizzes || 0) - (a.quizzes || 0));

  const topReader = sorted[0];
  const mostImproved = sorted[Math.min(1, sorted.length - 1)];
  const longestStreak = byStreak[0];
  const mostQuizzes = byQuizzes[0];

  const awards = [
    { title: 'Top Reader',     icon: 'gold',   student: topReader,     stat: `Score: ${topReader.score}` },
    { title: 'Most Improved',  icon: 'green',  student: mostImproved,  stat: `+${Math.max(0, mostImproved.accuracy - 50)}% growth` },
    { title: 'Longest Streak', icon: 'orange', student: longestStreak, stat: `${longestStreak.streak || 0} days` },
    { title: 'Most Quizzes',   icon: 'blue',   student: mostQuizzes,   stat: `${mostQuizzes.quizzes || 0} quizzes` },
  ];

  return `
    <div class="page-header">
      <h1>Celebrate Students</h1>
    </div>

    <div class="awards-grid">
      ${awards.map(aw => `
        <div class="award-card">
          <div class="award-card-icon ${aw.icon}">${IC.star}</div>
          <h3>${aw.title}</h3>
          <div class="award-student">
            ${avatar(aw.student)}
            <span class="award-student-name">${aw.student.name}</span>
            <span class="award-student-score">${aw.stat}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="list-card" style="padding:24px;margin-top:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px">
        <div>
          <h3 style="margin:0 0 2px 0">🏆 Book Certificates</h3>
          <p style="font-size:0.8rem;color:var(--g400);margin:0">Print or download certificates for students who completed a book</p>
        </div>
        <div style="position:relative;min-width:200px">
          <input type="text" id="cert-search" placeholder="Search student or book..." oninput="filterCertificates(this.value)" style="width:100%;padding:8px 12px 8px 34px;border:1px solid var(--g200);border-radius:8px;font-size:0.85rem;outline:none">
          <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--g400);pointer-events:none">${IC.search}</span>
        </div>
      </div>
      <div id="certificate-list">
        <div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Loading completed books...</div>
      </div>
    </div>`;
}

let _allCerts = []; // stored globally for search filtering

function loadCertificateData() {
  const el = document.getElementById('certificate-list');
  if (!el) return;

  Promise.all(students.map(s =>
    API.getBookProgress(s.id).then(progress => ({ student: s, progress: progress || [] })).catch(() => ({ student: s, progress: [] }))
  )).then(results => {
    _allCerts = [];
    results.forEach(({ student, progress }) => {
      (progress || []).filter(p => p.isComplete).forEach(p => {
        const b = books.find(bk => bk.id === p.bookId);
        if (b) _allCerts.push({ student, book: b, progress: p });
      });
    });

    if (_allCerts.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No books completed yet. Certificates will appear here as students finish all chapters of a book.</div>';
      return;
    }

    _allCerts.sort((a, b) => a.student.name.localeCompare(b.student.name) || a.book.title.localeCompare(b.book.title));
    renderCertificateList(_allCerts);
  });
}

function renderCertificateList(certs) {
  const el = document.getElementById('certificate-list');
  if (!el) return;
  if (certs.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--g400);font-size:0.85rem">No matching certificates found.</div>';
    return;
  }
  el.innerHTML = certs.map(c => {
    const certParams = JSON.stringify({
      studentName: c.student.name,
      bookTitle: c.book.title,
      bookAuthor: c.book.author || '',
      coverUrl: c.book.cover_url || '',
      score: null
    }).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    const initials = c.student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const color = c.student.color || '#2563EB';
    return `<div style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-bottom:1px solid var(--g100);border-radius:8px">
      <div style="width:36px;height:36px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0">${escapeHtml(initials)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:0.9rem;color:var(--navy)">${escapeHtml(c.student.name)}</div>
        <div style="font-size:0.8rem;color:var(--g500)">Completed <strong>${escapeHtml(c.book.title)}</strong></div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <button class="btn btn-sm btn-primary" onclick="printCertificate(JSON.parse(decodeHTMLEntities(this.dataset.params)))" data-params="${certParams}">🖨️ Print</button>
        <button class="btn btn-sm btn-outline" onclick="downloadCertificatePDF(JSON.parse(decodeHTMLEntities(this.dataset.params)))" data-params="${certParams}">📥 PDF</button>
      </div>
    </div>`;
  }).join('');
}

function filterCertificates(query) {
  if (!query || query.trim() === '') {
    renderCertificateList(_allCerts);
    return;
  }
  const q = query.toLowerCase().trim();
  const filtered = _allCerts.filter(c =>
    c.student.name.toLowerCase().includes(q) || c.book.title.toLowerCase().includes(q)
  );
  renderCertificateList(filtered);
}

// ---- Page: Teaching Tools ----
function renderTeacherSettings() {
  const user = currentUser || {};
  const grades = ['K','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];
  const gradeOptions = grades.map(g => `<option value="${g}" ${user.grade === g ? 'selected' : ''}>${g === 'K' ? 'Kindergarten' : g + ' Grade'}</option>`).join('');

  return `
  <div class="page-header">
    <h1>${IC.gear} Settings</h1>
  </div>
  <div style="max-width:560px">
    <div class="card" style="padding:28px">
      <h3 style="margin:0 0 20px;font-size:1.1rem;font-weight:600">Account Settings</h3>
      <form id="settings-form" style="display:flex;flex-direction:column;gap:16px">
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:var(--g600);margin-bottom:6px">Full Name</label>
          <input type="text" id="settings-name" class="form-input" value="${user.name || ''}" style="width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:10px;font-size:0.95rem">
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:var(--g600);margin-bottom:6px">Email Address</label>
          <input type="email" id="settings-email" class="form-input" value="${user.email || ''}" disabled style="width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:10px;font-size:0.95rem;background:var(--g50);color:var(--g400)">
          <small style="color:var(--g400);margin-top:4px;display:block">Email cannot be changed.</small>
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:var(--g600);margin-bottom:6px">Grade Level</label>
          <select id="settings-grade" class="form-input" style="width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:10px;font-size:0.95rem;appearance:auto">
            <option value="">Select grade...</option>
            ${gradeOptions}
          </select>
        </div>
        <div style="margin-top:8px">
          <button type="submit" class="btn btn-primary" id="settings-save-btn" style="padding:10px 28px">Save Changes</button>
          <span id="settings-saved-msg" style="display:none;color:var(--green);font-size:0.875rem;margin-left:12px;font-weight:500">Saved!</span>
        </div>
      </form>
    </div>

    <div class="card" style="padding:28px;margin-top:20px">
      <h3 style="margin:0 0 12px;font-size:1.1rem;font-weight:600;color:var(--g600)">Account</h3>
      <p style="color:var(--g500);font-size:0.875rem;margin:0 0 16px">Log out of your account on this device.</p>
      <button class="btn" style="background:var(--red-l);color:var(--red);border:1px solid var(--red);padding:8px 20px" onclick="logoutAndRedirect()">
        ${IC.logout} Log Out
      </button>
    </div>
  </div>

  <script>
  (function() {
    const form = document.getElementById('settings-form');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('settings-save-btn');
      const msg = document.getElementById('settings-saved-msg');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const res = await fetch('/api/auth/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('settings-name').value.trim(),
            grade: document.getElementById('settings-grade').value
          })
        });
        const data = await res.json();
        if (data.success) {
          // Update local currentUser
          if (data.user) {
            currentUser.name = data.user.name || currentUser.name;
            if (data.user.grade) currentUser.grade = data.user.grade;
          }
          msg.textContent = '✅ Saved!';
          msg.style.display = 'inline';
          setTimeout(() => msg.style.display = 'none', 4000);
          renderSidebar();
          renderHeader();
          renderMain();
        } else {
          alert(data.error || 'Failed to save settings.');
        }
      } catch(err) {
        alert('Failed to save. Please try again.');
      }
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    });
  })();
  <\/script>`;
}

function logoutAndRedirect() {
  // Clear student/child auto-login data
  localStorage.removeItem('k2r_student_name');
  localStorage.removeItem('k2r_student_classcode');
  localStorage.removeItem('k2r_child_name');
  localStorage.removeItem('k2r_child_familycode');
  fetch('/api/auth/logout', { method: 'POST' })
    .then(() => window.location.href = '/pages/signin.html');
}

function renderParentSettings() {
  const user = currentUser || {};
  const familyCode = user.familyCode || user.classCode || '';

  return `
  <div class="page-header">
    <h1>${IC.gear} Settings</h1>
  </div>
  <div style="max-width:560px">
    ${familyCode ? `
    <div class="card" style="padding:28px;margin-bottom:20px">
      <h3 style="margin:0 0 16px;font-size:1.1rem;font-weight:600">Family Code</h3>
      <p style="color:var(--g500);font-size:0.875rem;margin:0 0 16px">Share this code with your child so they can sign up and start reading.</p>
      <div style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--g50);border-radius:12px;border:2px dashed var(--g200)">
        <span style="font-size:1.75rem;font-weight:700;letter-spacing:2px;color:var(--blue);font-family:monospace">${familyCode}</span>
        <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText('${familyCode}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy',1500)" style="margin-left:auto">Copy</button>
      </div>
      <div style="margin-top:16px;padding:14px;background:#FFF7ED;border-radius:10px;border:1px solid #FED7AA">
        <p style="margin:0;font-size:0.8125rem;color:#9A3412"><strong>How to add your child:</strong></p>
        <ol style="margin:8px 0 0;padding-left:20px;font-size:0.8125rem;color:#9A3412;line-height:1.6">
          <li>Go to the <a href="signup.html" style="color:#2563EB;text-decoration:underline">signup page</a></li>
          <li>Select <strong>Child</strong> role</li>
          <li>Enter your child's name, the family code <strong>${familyCode}</strong>, and their grade</li>
        </ol>
      </div>
    </div>` : ''}

    <div class="card" style="padding:28px">
      <h3 style="margin:0 0 20px;font-size:1.1rem;font-weight:600">Account Settings</h3>
      <form id="parent-settings-form" style="display:flex;flex-direction:column;gap:16px">
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:var(--g600);margin-bottom:6px">Full Name</label>
          <input type="text" id="parent-settings-name" class="form-input" value="${user.name || ''}" style="width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:10px;font-size:0.95rem">
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:var(--g600);margin-bottom:6px">Email Address</label>
          <input type="email" class="form-input" value="${user.email || ''}" disabled style="width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:10px;font-size:0.95rem;background:var(--g50);color:var(--g400)">
          <small style="color:var(--g400);margin-top:4px;display:block">Email cannot be changed.</small>
        </div>
        <div style="margin-top:8px">
          <button type="submit" class="btn btn-primary" id="parent-settings-save" style="padding:10px 28px">Save Changes</button>
          <span id="parent-settings-msg" style="display:none;color:var(--green);font-size:0.875rem;margin-left:12px;font-weight:500">Saved!</span>
        </div>
      </form>
    </div>

    <div class="card" style="padding:28px;margin-top:20px">
      <h3 style="margin:0 0 12px;font-size:1.1rem;font-weight:600;color:var(--g600)">Account</h3>
      <p style="color:var(--g500);font-size:0.875rem;margin:0 0 16px">Log out of your account on this device.</p>
      <button class="btn" style="background:var(--red-l);color:var(--red);border:1px solid var(--red);padding:8px 20px" onclick="logoutAndRedirect()">
        ${IC.logout} Log Out
      </button>
    </div>
  </div>

  <script>
  (function() {
    const form = document.getElementById('parent-settings-form');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('parent-settings-save');
      const msg = document.getElementById('parent-settings-msg');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const res = await fetch('/api/auth/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: document.getElementById('parent-settings-name').value.trim() })
        });
        const data = await res.json();
        if (data.success) {
          if (data.user) currentUser.name = data.user.name || currentUser.name;
          msg.style.display = 'inline';
          setTimeout(() => msg.style.display = 'none', 3000);
          renderSidebar();
          renderHeader();
        } else {
          alert(data.error || 'Failed to save settings.');
        }
      } catch(err) {
        alert('Failed to save. Please try again.');
      }
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    });
  })();
  <\/script>`;
}

// ─── CLASS GOALS (localStorage-based) ──────────────────────────
let classGoalsData = [];

function getGoalsStorageKey() {
  return 'k2r_goals_' + (currentUser?.classId || 'default');
}

function loadGoalsFromStorage() {
  try {
    const raw = localStorage.getItem(getGoalsStorageKey());
    classGoalsData = raw ? JSON.parse(raw) : [];
  } catch (e) { classGoalsData = []; }
}

function saveGoalsToStorage() {
  try {
    localStorage.setItem(getGoalsStorageKey(), JSON.stringify(classGoalsData));
  } catch (e) { console.error('Error saving goals:', e); }
}

function getGoalCompletions(goal) {
  // Calculate who completed the goal from the already-loaded students array
  const completed = [];
  for (const s of students) {
    if (goal.goal_type === 'quizzes') {
      if ((s.quizzes_completed || 0) >= goal.target_count) {
        completed.push({ name: s.name, id: s.id });
      }
    }
    // For book goals we also check quizzes_completed as a proxy
    // (full book tracking would require chapter-level data)
    if (goal.goal_type === 'book') {
      if ((s.quizzes_completed || 0) >= 1) {
        completed.push({ name: s.name, id: s.id });
      }
    }
  }
  return completed;
}

function renderClassGoals() {
  loadGoalsFromStorage();
  return `
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="margin:0;font-size:1.5rem">&#127919; Class Goals</h2>
        <p style="color:var(--g400);margin:4px 0 0;font-size:0.85rem">Set goals for your class and track progress together</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openCreateGoalModal()">&#10133; New Goal</button>
    </div>

    <div id="class-goals-list" style="margin-top:24px"></div>

    ${renderCreateGoalModal()}
    ${renderGoalProgressModal()}
  `;
}

function renderCreateGoalModal() {
  return `
    <div id="create-goal-modal" class="modal-overlay" style="display:none">
      <div class="modal-box" style="max-width:480px">
        <div class="modal-header">
          <h3 style="margin:0">&#127919; Create Class Goal</h3>
          <button class="modal-close" onclick="closeGoalModal('create-goal-modal')">&times;</button>
        </div>
        <div style="padding:20px">
          <div style="margin-bottom:16px">
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:0.85rem">Goal Title</label>
            <input type="text" id="goal-title" placeholder="e.g. Everyone takes 1 quiz this week" style="width:100%;padding:10px 12px;border:1px solid var(--g200);border-radius:var(--radius-sm);font-size:0.9rem" />
          </div>
          <div style="margin-bottom:16px">
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:0.85rem">Goal Type</label>
            <select id="goal-type" onchange="toggleGoalBookField()" style="width:100%;padding:10px 12px;border:1px solid var(--g200);border-radius:var(--radius-sm);font-size:0.9rem">
              <option value="quizzes">Complete Quizzes</option>
              <option value="book">Complete a Book</option>
            </select>
          </div>
          <div id="goal-target-field" style="margin-bottom:16px">
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:0.85rem">How many quizzes?</label>
            <input type="number" id="goal-target" value="1" min="1" max="50" style="width:100%;padding:10px 12px;border:1px solid var(--g200);border-radius:var(--radius-sm);font-size:0.9rem" />
          </div>
          <div id="goal-book-field" style="margin-bottom:16px;display:none">
            <label style="display:block;font-weight:600;margin-bottom:6px;font-size:0.85rem">Which Book?</label>
            <select id="goal-book" style="width:100%;padding:10px 12px;border:1px solid var(--g200);border-radius:var(--radius-sm);font-size:0.9rem">
              ${(window.books || []).map(b => `<option value="${b.id}">${escapeHtml(b.title)}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
            <button class="btn btn-ghost btn-sm" onclick="closeGoalModal('create-goal-modal')">Cancel</button>
            <button class="btn btn-primary btn-sm" onclick="submitClassGoal()">Create Goal</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGoalProgressModal() {
  return `
    <div id="goal-progress-modal" class="modal-overlay" style="display:none">
      <div class="modal-box" style="max-width:500px">
        <div class="modal-header">
          <h3 id="goal-progress-title" style="margin:0">Goal Progress</h3>
          <button class="modal-close" onclick="closeGoalModal('goal-progress-modal')">&times;</button>
        </div>
        <div id="goal-progress-content" style="padding:20px"></div>
      </div>
    </div>
  `;
}

function toggleGoalBookField() {
  const type = document.getElementById('goal-type')?.value;
  const targetField = document.getElementById('goal-target-field');
  const bookField = document.getElementById('goal-book-field');
  if (type === 'book') {
    if (targetField) targetField.style.display = 'none';
    if (bookField) bookField.style.display = 'block';
  } else {
    if (targetField) targetField.style.display = 'block';
    if (bookField) bookField.style.display = 'none';
  }
}

function openCreateGoalModal() {
  const m = document.getElementById('create-goal-modal');
  if (m) m.style.display = 'flex';
}

function submitClassGoal() {
  const title = document.getElementById('goal-title')?.value?.trim();
  const goalType = document.getElementById('goal-type')?.value || 'quizzes';
  const targetCount = parseInt(document.getElementById('goal-target')?.value) || 1;
  const bookId = goalType === 'book' ? parseInt(document.getElementById('goal-book')?.value) : null;
  const bookTitle = goalType === 'book' ? document.getElementById('goal-book')?.selectedOptions?.[0]?.text : null;

  if (!title) { alert('Please enter a goal title'); return; }

  const goal = {
    id: Date.now(),
    title,
    goal_type: goalType,
    target_count: targetCount,
    book_id: bookId,
    book_title: bookTitle,
    created_at: new Date().toISOString()
  };

  classGoalsData.push(goal);
  saveGoalsToStorage();
  closeGoalModal('create-goal-modal');
  document.getElementById('goal-title').value = '';
  renderGoalsList();
}

function loadClassGoalsData() {
  loadGoalsFromStorage();
  renderGoalsList();
}

function renderGoalsList() {
  const el = document.getElementById('class-goals-list');
  if (!el) return;

  if (classGoalsData.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="font-size:3rem;margin-bottom:12px">&#127919;</div>
        <h3 style="margin:0 0 8px;color:var(--g600)">No Goals Yet</h3>
        <p style="color:var(--g400);margin:0 0 20px;font-size:0.9rem">Create a class goal to motivate your students and track progress together!</p>
        <button class="btn btn-primary btn-sm" onclick="openCreateGoalModal()">&#10133; Create First Goal</button>
      </div>
    `;
    return;
  }

  const totalStudents = students.length;

  el.innerHTML = classGoalsData.map(goal => {
    const typeLabel = goal.goal_type === 'book'
      ? '&#128218; Complete a Book' + (goal.book_title ? ' — ' + escapeHtml(goal.book_title) : '')
      : `&#128221; Complete ${goal.target_count} Quiz${goal.target_count > 1 ? 'zes' : ''}`;
    const completed = getGoalCompletions(goal);
    const pct = totalStudents > 0 ? Math.round((completed.length / totalStudents) * 100) : 0;
    const barColor = pct >= 100 ? 'linear-gradient(90deg,#10B981,#34D399)' : pct >= 50 ? 'linear-gradient(90deg,#2563EB,#60A5FA)' : 'linear-gradient(90deg,#F59E0B,#FBBF24)';

    return `
      <div class="list-card" style="margin-bottom:16px;padding:0;overflow:hidden">
        <div style="padding:20px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px">
            <div>
              <h3 style="margin:0 0 4px;font-size:1.1rem">${escapeHtml(goal.title)}</h3>
              <span style="font-size:0.8rem;color:var(--g400)">${typeLabel}</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="confirmDeleteGoal(${goal.id})" style="color:var(--g400);font-size:0.75rem;padding:4px 8px" title="Remove goal">&#128465;</button>
          </div>

          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:0.8rem;font-weight:600;color:var(--g500)">${completed.length} of ${totalStudents} completed (${pct}%)</span>
              <span style="font-size:0.75rem;color:var(--g400)">${totalStudents} students</span>
            </div>
            <div style="background:var(--g100);border-radius:999px;height:24px;overflow:hidden;position:relative">
              <div style="background:${barColor};height:100%;border-radius:999px;transition:width 0.6s ease;width:${pct}%"></div>
            </div>
          </div>

          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn-outline btn-sm" onclick="showGoalCompletions(${goal.id})" style="font-size:0.78rem;padding:4px 12px">&#128065; Who Completed It</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showGoalCompletions(goalId) {
  const goal = classGoalsData.find(g => g.id === goalId);
  if (!goal) return;

  const titleEl = document.getElementById('goal-progress-title');
  if (titleEl) titleEl.textContent = goal.title;

  const completed = getGoalCompletions(goal);
  const totalStudents = students.length;
  const pct = totalStudents > 0 ? Math.round((completed.length / totalStudents) * 100) : 0;

  const contentEl = document.getElementById('goal-progress-content');
  if (contentEl) {
    if (completed.length === 0) {
      contentEl.innerHTML = `
        <div style="text-align:center;padding:20px">
          <div style="font-size:2.5rem;margin-bottom:8px">&#128564;</div>
          <p style="color:var(--g400);margin:0">No students have completed this goal yet.</p>
        </div>
      `;
    } else {
      contentEl.innerHTML = `
        <div style="margin-bottom:16px;text-align:center">
          <div style="font-size:2rem;font-weight:700;color:var(--blue)">${pct}%</div>
          <div style="font-size:0.85rem;color:var(--g400)">${completed.length} of ${totalStudents} students</div>
        </div>
        <div style="max-height:300px;overflow-y:auto">
          ${completed.map((s, i) => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--g100);${i === 0 ? 'border-top:1px solid var(--g100);' : ''}">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--blue);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0">${(s.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:0.9rem">${escapeHtml(s.name)}</div>
              </div>
              <div style="color:#10B981;font-size:1.1rem">&#10003;</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  document.getElementById('goal-progress-modal').style.display = 'flex';
}

function closeGoalModal(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
}

function confirmDeleteGoal(goalId) {
  if (!confirm('Remove this goal?')) return;
  classGoalsData = classGoalsData.filter(g => g.id !== goalId);
  saveGoalsToStorage();
  renderGoalsList();
}

function renderAITools() {
  const tools = [
    { name: 'Student Progress Report',   desc: 'Generate a printable 8.5×11 progress report for any student with scores, skills, and suggestions.', barColor: 'blue',   iconColor: 'blue',   icon: IC.printer, action: 'showProgressReportPicker()' },
    { name: 'Struggling Reader Report',  desc: 'See which students need additional support based on their quiz scores and reading levels.', barColor: 'red',    iconColor: 'red',    icon: IC.warn, action: 'showStrugglingReaderReport()' },
    { name: 'Parent Report Generator',   desc: 'Generate a parent-friendly progress report for any student with actionable insights.', barColor: 'orange', iconColor: 'orange', icon: IC.download, action: 'showParentReportPicker()' },
  ];

  const badgeList = [
    { img: '/public/Learned_About_You.png',    name: 'Learned About You',    desc: 'Awarded when a student fills out their profile for the first time.' },
    { img: '/public/Quiz_Streak_Badge_.png',   name: 'Quiz Streak',          desc: 'Awarded for completing 3 quizzes in a row.' },
    { img: '/public/Book_Boss_Badge.png',      name: 'Book Boss',            desc: 'Awarded for completing 3 books.' },
    { img: '/public/Genre_Jumper_Badge.png',   name: 'Genre Jumper',         desc: 'Awarded for reading books from 3 different genres.' },
    { img: '/public/First_Book_Badge.png',     name: 'First Book Done',      desc: 'Awarded for finishing their very first book.' },
    { img: '/public/Quiz_Conqueror_Badge.png', name: 'Quiz Conqueror',       desc: 'Awarded for completing 10 quizzes.' },
    { img: '/public/Grow_Hero_Badge.png',      name: 'Grow Hero',            desc: 'Awarded for completing 2 books and growing their reading score.' },
    { img: '/public/Ultimate_Key_Badge.png',   name: 'Ultimate Key Reader',  desc: 'Awarded for earning 500 keys.' },
  ];

  const badgesHtml = badgeList.map(b => '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--g50);border-radius:12px">' +
    '<img src="' + b.img + '" alt="' + b.name + '" style="width:64px;height:64px;object-fit:contain;flex-shrink:0">' +
    '<div>' +
    '<div style="font-size:0.9rem;font-weight:700;color:var(--navy);margin-bottom:3px">' + b.name + '</div>' +
    '<div style="font-size:0.8rem;color:var(--g500);line-height:1.4">' + b.desc + '</div>' +
    '</div></div>'
  ).join('');

  return `
    <div class="page-header">
      <h1>${IC.bulb} Teaching Tools</h1>
    </div>

    <div class="tools-grid">
      ${tools.map(t => `
        <div class="tool-card" style="cursor:pointer" onclick="${t.action}">
          <div class="tool-card-bar ${t.barColor}"></div>
          <div class="tool-card-body">
            <div class="tool-card-icon ${t.iconColor}">${t.icon}</div>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
            <button class="btn btn-sm btn-outline" style="margin-top:12px">Generate Report</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="list-card" style="padding:24px;margin-top:24px">
      <h3 style="margin:0 0 4px 0">🏅 Student Badges</h3>
      <p style="font-size:0.8rem;color:var(--g400);margin:0 0 20px 0">These are the badges your students can earn through reading and quizzes</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:16px">
        ${badgesHtml}
      </div>
    </div>`;
}

// ---- Printable Student Progress Report ----
function showProgressReportPicker() {
  if (students.length === 0) {
    showToast('No students in your class yet.');
    return;
  }
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:420px">
        <div class="modal-header">
          <h3>Student Progress Report</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:20px">
          <p style="font-size:0.875rem;color:var(--g600);margin:0 0 16px">Select a student to generate a printable progress report:</p>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${students.map(s => {
              const initials = (s.initials || s.name.split(' ').map(n => n[0]).join('').substring(0, 2)).toUpperCase();
              return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--g50);border-radius:8px;cursor:pointer" onclick="printStudentProgressReport(${s.id})">
                <div style="width:32px;height:32px;border-radius:50%;background:${s.color || '#2563EB'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;flex-shrink:0">${escapeHtml(initials)}</div>
                <span style="font-size:0.9rem;font-weight:600;color:var(--navy)">${escapeHtml(s.name)}</span>
                <span style="margin-left:auto;font-size:0.75rem;color:var(--g400)">Print →</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function printStudentProgressReport(studentId) {
  const s = students.find(st => st.id === studentId);
  if (!s) return;

  const score = s.reading_score || s.score || 0;
  const accuracy = s.accuracy || 0;
  const quizzes = s.quizzes_completed || 0;
  const keys = s.keys_earned || s.keys || 0;
  const comp = s.comprehension_label || 'No Data';
  const reason = s.reasoning_label || 'No Data';
  const indep = s.independence_label || 'No Data';
  const persist = s.persistence_label || 'No Data';
  const vocab = s.vocab_words_learned || 0;
  const teacherName = currentUser?.name || 'Teacher';
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  let overallStatus, statusColor;
  if (score >= 700 && accuracy >= 70) { overallStatus = 'On Track'; statusColor = '#059669'; }
  else if (score >= 500 && accuracy >= 50) { overallStatus = 'Developing'; statusColor = '#B45309'; }
  else { overallStatus = 'Needs Support'; statusColor = '#DC2626'; }

  const strengths = [];
  if (comp === 'Strong') strengths.push('Excellent reading comprehension — understands key ideas and details');
  if (reason === 'Strong') strengths.push('Strong reasoning skills — can make inferences and connections');
  if (indep === 'Strong') strengths.push('Great independence — answers questions without needing hints');
  if (persist === 'Strong') strengths.push('Wonderful persistence — doesn\'t give up on challenging questions');
  if (accuracy >= 80) strengths.push('High quiz accuracy — consistently answers correctly');
  if (quizzes >= 10) strengths.push('Strong engagement — completed many quizzes');
  if (strengths.length === 0) strengths.push('Still building foundational reading skills');

  const suggestions = [];
  if (comp === 'Needs Support' || comp === 'Developing') suggestions.push('Read aloud together and pause to ask "What just happened?" and "What do you think will happen next?" to build comprehension.');
  if (reason === 'Needs Support' || reason === 'Developing') suggestions.push('Practice making connections by asking "Why do you think the character did that?" and "How is this similar to something you know?"');
  if (indep === 'Needs Support' || indep === 'Developing') suggestions.push('Encourage answering questions before looking at hints. Try saying "What do you think the answer is first?" to build confidence.');
  if (persist === 'Needs Support' || persist === 'Developing') suggestions.push('Celebrate effort, not just correct answers. If the student gets stuck, say "Let\'s try re-reading that part together" instead of giving the answer.');
  if (accuracy < 60) suggestions.push('Focus on re-reading chapters before taking quizzes. Understanding the story first leads to better quiz results.');
  if (quizzes < 3) suggestions.push('Encourage completing more quizzes to build reading stamina and track progress over time.');
  if (suggestions.length === 0) suggestions.push('Keep up the great work! Continue reading regularly and challenging themselves with new books.');

  const skillBar = (label, value) => {
    let pct = 0, color = '#D1D5DB';
    if (value === 'Strong') { pct = 100; color = '#059669'; }
    else if (value === 'Developing') { pct = 60; color = '#F59E0B'; }
    else if (value === 'Needs Support') { pct = 25; color = '#EF4444'; }
    return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>' + label + '</span><span style="color:' + color + ';font-weight:600">' + value + '</span></div><div style="height:8px;background:#E5E7EB;border-radius:4px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:4px"></div></div></div>';
  };

  const html = '<!DOCTYPE html><html><head><title>Progress Report - ' + s.name + '</title>' +
    '<style>' +
    '@page { size: letter; margin: 0.5in; }' +
    'body { font-family: Georgia, "Times New Roman", serif; margin: 0; padding: 0.5in; color: #1a1a1a; font-size: 13px; line-height: 1.5; max-width: 8.5in; }' +
    '.header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1A6FC4; padding-bottom: 14px; margin-bottom: 20px; }' +
    '.header h1 { font-size: 22px; margin: 0 0 2px; color: #0F172A; }' +
    '.header .meta { font-size: 12px; color: #64748B; }' +
    '.header .logo { font-size: 18px; font-weight: 800; color: #1A6FC4; }' +
    '.status-badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; }' +
    '.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin: 18px 0; }' +
    '.stat-box { text-align: center; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; }' +
    '.stat-box .val { font-size: 24px; font-weight: 800; color: #0F172A; }' +
    '.stat-box .lbl { font-size: 11px; color: #64748B; margin-top: 2px; }' +
    '.section { margin-top: 20px; }' +
    '.section h3 { font-size: 15px; margin: 0 0 10px; color: #0F172A; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; }' +
    '.suggestion { padding: 8px 12px; margin-bottom: 6px; background: #F0F9FF; border-left: 3px solid #1A6FC4; border-radius: 0 6px 6px 0; font-size: 12px; line-height: 1.5; }' +
    '.strength { padding: 8px 12px; margin-bottom: 6px; background: #ECFDF5; border-left: 3px solid #059669; border-radius: 0 6px 6px 0; font-size: 12px; line-height: 1.5; }' +
    '.footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<div><h1>' + s.name + '\'s Progress Report</h1>' +
      '<div class="meta">' + teacherName + '\'s Class &bull; ' + dateStr + '</div></div>' +
      '<div class="logo">key2read</div>' +
    '</div>' +
    '<div><strong>Overall Status:</strong> <span class="status-badge" style="background:' + statusColor + '22;color:' + statusColor + '">' + overallStatus + '</span></div>' +
    '<div class="stats-grid">' +
      '<div class="stat-box"><div class="val">' + score + '</div><div class="lbl">Reading Score</div></div>' +
      '<div class="stat-box"><div class="val">' + accuracy + '%</div><div class="lbl">Quiz Accuracy</div></div>' +
      '<div class="stat-box"><div class="val">' + quizzes + '</div><div class="lbl">Quizzes Done</div></div>' +
      '<div class="stat-box"><div class="val">' + keys + ' 🔑</div><div class="lbl">Keys Earned</div></div>' +
    '</div>' +
    '<div class="section"><h3>Reading Skills Breakdown</h3>' +
      skillBar('Comprehension', comp) +
      skillBar('Reasoning', reason) +
      skillBar('Independence', indep) +
      skillBar('Persistence', persist) +
      (vocab > 0 ? '<div style="font-size:12px;color:#64748B;margin-top:4px">Vocabulary words learned: <strong>' + vocab + '</strong></div>' : '') +
    '</div>' +
    '<div class="section"><h3>✨ Strengths</h3>' +
      strengths.map(st => '<div class="strength">' + st + '</div>').join('') +
    '</div>' +
    '<div class="section"><h3>💡 Suggestions to Help</h3>' +
      suggestions.map(sg => '<div class="suggestion">' + sg + '</div>').join('') +
    '</div>' +
    '<div class="footer"><span>Generated by key2read &bull; ' + dateStr + '</span><span>For questions, contact ' + teacherName + '</span></div>' +
    '</body></html>';

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
  closeModal();
}

// ---- Struggling Reader Report (local data, no API) ----
function showStrugglingReaderReport() {
  if (students.length === 0) {
    showToast('No students in your class yet.');
    return;
  }

  // Identify struggling readers: low reading score or low accuracy
  const struggling = students
    .map(s => ({
      name: s.name,
      initials: s.initials || s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: s.color || '#2563EB',
      score: s.reading_score || s.score || 0,
      accuracy: s.accuracy || 0,
      quizzes: s.quizzes_completed || 0,
      keys: s.keys_earned || s.keys || 0,
      comprehension: s.comprehension_label || 'No Data',
      reasoning: s.reasoning_label || 'No Data',
      independence: s.independence_label || 'No Data',
      persistence: s.persistence_label || 'No Data',
    }))
    .sort((a, b) => a.score - b.score);

  // Students with score < 500 or accuracy < 60% are "needs support"
  const needsSupport = struggling.filter(s => s.score < 500 || s.accuracy < 60);
  const developing = struggling.filter(s => s.score >= 500 && s.score < 700 && s.accuracy >= 60);

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:700px">
        <div class="modal-header">
          <h3>${IC.warn} Struggling Reader Report</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:24px;max-height:70vh;overflow-y:auto">
          <div style="margin-bottom:20px">
            <div style="font-size:0.85rem;color:var(--g500);margin-bottom:4px">Report generated from current class data</div>
            <div style="font-size:0.85rem;color:var(--g400)">${students.length} students analyzed • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>

          ${needsSupport.length > 0 ? `
            <h4 style="color:#DC2626;margin:0 0 12px 0;font-size:0.95rem">⚠️ Needs Support (${needsSupport.length} student${needsSupport.length > 1 ? 's' : ''})</h4>
            ${needsSupport.map(s => renderStudentReportRow(s, 'red')).join('')}
          ` : '<div style="padding:16px;background:#ECFDF5;border-radius:10px;color:#059669;font-size:0.9rem;margin-bottom:16px">✅ No students currently need urgent support!</div>'}

          ${developing.length > 0 ? `
            <h4 style="color:#B45309;margin:16px 0 12px 0;font-size:0.95rem">📊 Developing (${developing.length} student${developing.length > 1 ? 's' : ''})</h4>
            ${developing.map(s => renderStudentReportRow(s, 'gold')).join('')}
          ` : ''}

          <div style="margin-top:20px;padding:16px;background:var(--g50);border-radius:10px;font-size:0.85rem;color:var(--g500);line-height:1.6">
            <strong>How to read this report:</strong><br>
            • <strong style="color:#DC2626">Needs Support</strong>: Reading score below 500 or accuracy below 60%<br>
            • <strong style="color:#B45309">Developing</strong>: Reading score 500–700 with accuracy above 60%<br>
            • Students scoring above 700 with good accuracy are on track
          </div>
        </div>
      </div>
    </div>`;
}

function renderStudentReportRow(s, level) {
  const bgColor = level === 'red' ? '#FEE2E2' : '#FEF9C3';
  const borderColor = level === 'red' ? '#FECACA' : '#FDE68A';
  return `
    <div style="display:flex;align-items:flex-start;gap:14px;padding:14px;background:${bgColor};border:1px solid ${borderColor};border-radius:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:50%;background:${s.color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0">${escapeHtml(s.initials)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;color:var(--navy);margin-bottom:4px">${escapeHtml(s.name)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:0.8rem;color:var(--g600)">
          <span>Score: <strong>${s.score}</strong></span>
          <span>Accuracy: <strong>${s.accuracy}%</strong></span>
          <span>Quizzes: <strong>${s.quizzes}</strong></span>
          <span>Keys: <strong>${s.keys}</strong></span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
          ${renderSkillPill('Comprehension', s.comprehension)}
          ${renderSkillPill('Reasoning', s.reasoning)}
          ${renderSkillPill('Independence', s.independence)}
          ${renderSkillPill('Persistence', s.persistence)}
        </div>
      </div>
    </div>`;
}

function renderSkillPill(label, value) {
  let bg, color;
  if (value === 'Strong') { bg = '#DCFCE7'; color = '#166534'; }
  else if (value === 'Developing') { bg = '#FEF9C3'; color = '#92400E'; }
  else if (value === 'Needs Support') { bg = '#FEE2E2'; color = '#991B1B'; }
  else { bg = 'var(--g100)'; color = 'var(--g500)'; }
  return `<span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:0.7rem;font-weight:600;background:${bg};color:${color}">${label}: ${value}</span>`;
}

// ---- Parent Report Generator (local data, no API) ----
function showParentReportPicker() {
  if (students.length === 0) {
    showToast('No students in your class yet.');
    return;
  }

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:450px">
        <div class="modal-header">
          <h3>${IC.download} Parent Report Generator</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:24px">
          <p style="font-size:0.9rem;color:var(--g500);margin-bottom:16px">Select a student to generate their parent progress report:</p>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${students.map(s => {
              const initials = s.initials || s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return `<button class="btn btn-outline" style="justify-content:flex-start;gap:12px;padding:12px 16px" onclick="generateParentReport(${s.id})">
                <div style="width:32px;height:32px;border-radius:50%;background:${s.color || '#2563EB'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;flex-shrink:0">${escapeHtml(initials)}</div>
                <span>${escapeHtml(s.name)}</span>
              </button>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function generateParentReport(studentId) {
  const s = students.find(st => st.id === studentId);
  if (!s) return;

  const initials = s.initials || s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const score = s.reading_score || s.score || 0;
  const accuracy = s.accuracy || 0;
  const quizzes = s.quizzes_completed || 0;
  const keys = s.keys_earned || s.keys || 0;
  const comp = s.comprehension_label || 'No Data';
  const reason = s.reasoning_label || 'No Data';
  const indep = s.independence_label || 'No Data';
  const persist = s.persistence_label || 'No Data';
  const vocab = s.vocab_words_learned || 0;

  // Determine overall status
  let overallStatus, statusColor, statusBg;
  if (score >= 700 && accuracy >= 70) { overallStatus = 'On Track'; statusColor = '#059669'; statusBg = '#ECFDF5'; }
  else if (score >= 500 && accuracy >= 50) { overallStatus = 'Developing'; statusColor = '#B45309'; statusBg = '#FEF9C3'; }
  else { overallStatus = 'Needs Support'; statusColor = '#DC2626'; statusBg = '#FEE2E2'; }

  // Generate encouragement based on strengths
  const strengths = [];
  if (comp === 'Strong') strengths.push('excellent reading comprehension');
  if (reason === 'Strong') strengths.push('strong reasoning skills');
  if (indep === 'Strong') strengths.push('great independence when answering questions');
  if (persist === 'Strong') strengths.push('wonderful persistence — they don\'t give up easily');
  if (accuracy >= 80) strengths.push('high quiz accuracy');

  const areas = [];
  if (comp === 'Needs Support') areas.push('reading comprehension');
  if (reason === 'Needs Support') areas.push('reasoning and inference');
  if (indep === 'Needs Support') areas.push('answering independently (using fewer hints)');
  if (persist === 'Needs Support') areas.push('persistence with challenging questions');

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:600px">
        <div class="modal-header">
          <h3>${IC.download} Parent Report — ${escapeHtml(s.name)}</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="padding:24px;max-height:70vh;overflow-y:auto" id="parent-report-content">
          <div style="text-align:center;margin-bottom:20px">
            <div style="width:56px;height:56px;border-radius:50%;background:${s.color || '#2563EB'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;margin:0 auto 8px">${escapeHtml(initials)}</div>
            <h2 style="margin:0 0 4px 0;font-size:1.25rem">${escapeHtml(s.name)}'s Progress Report</h2>
            <div style="font-size:0.85rem;color:var(--g400)">${currentUser?.name || 'Teacher'}'s Class • ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>

          <div style="display:inline-block;padding:6px 16px;border-radius:999px;font-size:0.85rem;font-weight:700;background:${statusBg};color:${statusColor};margin-bottom:20px">${overallStatus}</div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
            <div style="padding:14px;background:var(--g50);border-radius:10px;text-align:center">
              <div style="font-size:0.75rem;color:var(--g500);margin-bottom:4px">Reading Score</div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--navy)">${score}</div>
            </div>
            <div style="padding:14px;background:var(--g50);border-radius:10px;text-align:center">
              <div style="font-size:0.75rem;color:var(--g500);margin-bottom:4px">Quiz Accuracy</div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--navy)">${accuracy}%</div>
            </div>
            <div style="padding:14px;background:var(--g50);border-radius:10px;text-align:center">
              <div style="font-size:0.75rem;color:var(--g500);margin-bottom:4px">Quizzes Completed</div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--navy)">${quizzes}</div>
            </div>
            <div style="padding:14px;background:var(--g50);border-radius:10px;text-align:center">
              <div style="font-size:0.75rem;color:var(--g500);margin-bottom:4px">Keys Earned</div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--gold)">${keys} 🔑</div>
            </div>
          </div>

          <h4 style="margin:0 0 10px 0;font-size:0.95rem">Reading Skills</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">
            ${renderSkillPill('Comprehension', comp)}
            ${renderSkillPill('Reasoning', reason)}
            ${renderSkillPill('Independence', indep)}
            ${renderSkillPill('Persistence', persist)}
            ${vocab > 0 ? `<span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:0.7rem;font-weight:600;background:#DBEAFE;color:#1E40AF">Vocab: ${vocab} words</span>` : ''}
          </div>

          ${strengths.length > 0 ? `
            <div style="padding:14px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;margin-bottom:12px;font-size:0.875rem;line-height:1.6">
              <strong style="color:#059669">✨ Strengths:</strong> ${escapeHtml(s.name)} shows ${strengths.join(', ')}.
            </div>
          ` : ''}

          ${areas.length > 0 ? `
            <div style="padding:14px;background:#FEF9C3;border:1px solid #FDE68A;border-radius:10px;margin-bottom:12px;font-size:0.875rem;line-height:1.6">
              <strong style="color:#92400E">📌 Areas to grow:</strong> ${escapeHtml(s.name)} could use more practice with ${areas.join(', ')}.
            </div>
          ` : ''}

          <div style="padding:14px;background:var(--blue-p, #EFF6FF);border:1px solid #BFDBFE;border-radius:10px;font-size:0.875rem;line-height:1.6">
            <strong style="color:var(--blue)">💡 How to help at home:</strong> Encourage ${escapeHtml(s.name)} to read for 15–20 minutes each day and discuss what they've read. Ask questions like "What happened in this chapter?" and "Why do you think the character did that?" to strengthen comprehension and reasoning.
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid var(--g200);display:flex;justify-content:flex-end;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="printParentReport()">🖨️ Print</button>
          <button class="btn btn-primary btn-sm" onclick="closeModal()">Done</button>
        </div>
      </div>
    </div>`;
}

function printParentReport() {
  const content = document.getElementById('parent-report-content');
  if (!content) return;
  const win = window.open('', '_blank');
  win.document.write('<html><head><title>Parent Report</title><style>body{font-family:system-ui,-apple-system,sans-serif;padding:32px;max-width:700px;margin:0 auto;color:#1a1a1a;font-size:14px;line-height:1.6}h2{margin:0 0 4px}h4{margin:16px 0 8px}strong{font-weight:700}</style></head><body>' + content.innerHTML + '</body></html>');
  win.document.close();
  win.print();
}

// ---- Page: Growth Reports (Class View) ----
function renderReports() {
  if (students.length === 0) {
    return `
      <div class="page-header"><h1>${IC.chart} Growth Reports</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.chart}</div>
        <h2>No Data Yet</h2>
        <p>Growth reports will appear once students join your class and start taking quizzes. Share your class code to get started!</p>
        <button class="btn btn-primary" onclick="navigate('quizzes')">${IC.arrowLeft} Go to Dashboard</button>
      </div>`;
  }

  // Aggregate class data
  const avgScore = Math.round(students.reduce((sum, s) => sum + (s.reading_score || s.score || 0), 0) / students.length);
  const avgAcc = Math.round(students.reduce((sum, s) => sum + (s.accuracy || 0), 0) / students.length);
  const totalKeysAll = students.reduce((s, st) => s + (st.keys || 0), 0);
  const improvingCount = 0; // will be updated when real data loads

  return `
    <div class="page-header">
      <h1>${IC.chart} Growth Reports</h1>
      <div class="page-header-actions">
        <button class="btn btn-ghost btn-sm" onclick="printReport()">${IC.printer} Print Report</button>
        <button class="btn btn-primary btn-sm" onclick="printReport()">${IC.download} Export PDF</button>
      </div>
    </div>

    <div class="report-header-card">
      <div class="report-header-bar"></div>
      <div class="report-header-body">
        <div class="report-header-top">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="/public/logo.png" alt="key2read" style="height:40px;width:auto" class="print-logo">
            <div>
              <h2>Class Growth Report</h2>
              <div class="report-meta">
                <span>${currentUser?.name || 'Teacher'}'s Class</span>
                <span>${IC.calendar} Last 12 Weeks</span>
                <span>${students.length} Students</span>
              </div>
            </div>
          </div>
          <div class="report-share-badge no-print">
            <span class="badge badge-green">${IC.check} Ready to Share</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card" style="cursor:pointer" onclick="showStatHelp('Average Reading Score', 'A composite score (0–1000) based on quiz accuracy, reading effort, independence (fewer hints), vocabulary growth, and persistence. Each quiz adjusts the score up or down based on performance.')">
        <div class="stat-card-icon"><img src="/public/Book_Outline_Icon.png" alt="Reading Score"></div>
        <div class="stat-card-label">Average Reading Score <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Reading Score', 'A composite score (0–1000) based on quiz accuracy, reading effort, independence (fewer hints), vocabulary growth, and persistence. Each quiz adjusts the score up or down based on performance.')">?</button></div>
        <div class="stat-card-value">${avgScore}</div>
      </div>
      <div class="stat-card" style="cursor:pointer" onclick="showStatHelp('Average Accuracy', 'The average percentage of quiz questions your students answer correctly across all quizzes taken.')">
        <div class="stat-card-icon"><img src="/public/Comprehension_Outline_Icon.png" alt="Accuracy"></div>
        <div class="stat-card-label">Average Accuracy <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Average Accuracy', 'The average percentage of quiz questions your students answer correctly across all quizzes taken.')">?</button></div>
        <div class="stat-card-value">${avgAcc}%</div>
      </div>
      <div class="stat-card" style="cursor:pointer" onclick="showStatHelp('Total Keys Earned', 'Keys are rewards students earn by passing quizzes with 80% or higher. Students can spend keys in the Class Store.')">
        <div class="stat-card-icon"><img src="/public/Key_Outline_Icon.png" alt="Keys Earned"></div>
        <div class="stat-card-label">Total Keys Earned <button class="stat-help-btn" onclick="event.stopPropagation(); showStatHelp('Total Keys Earned', 'Keys are rewards students earn by passing quizzes with 80% or higher. Students can spend keys in the Class Store.')">?</button></div>
        <div class="stat-card-value">${totalKeysAll.toLocaleString()}</div>
      </div>
      <div class="stat-card clickable-card" onclick="navigate('students')">
        <div class="stat-card-icon"><img src="/public/Student_Outline_Icon.png" alt="Students"></div>
        <div class="stat-card-label">Students</div>
        <div class="stat-card-value">${students.length}</div>
      </div>
    </div>

    <div class="report-charts-grid">
      <div class="chart-container">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div>
            <h3 style="margin:0;display:flex;align-items:center"><img src="/public/Growth_Outline_.png" alt="" style="width:32px;height:32px;margin-right:8px">Class Reading Score Trend</h3>
            <p class="chart-subtitle" style="margin:2px 0 0">Average reading score across all students</p>
          </div>
          <div style="display:flex;gap:4px" id="reports-range-btns">
            <button class="btn btn-sm btn-primary" onclick="loadReportsChart('week')" style="font-size:0.72rem;padding:4px 10px;border-radius:16px" data-range="week">Week</button>
            <button class="btn btn-sm btn-ghost" onclick="loadReportsChart('month')" style="font-size:0.72rem;padding:4px 10px;border-radius:16px" data-range="month">Month</button>
            <button class="btn btn-sm btn-ghost" onclick="loadReportsChart('quarter')" style="font-size:0.72rem;padding:4px 10px;border-radius:16px" data-range="quarter">Quarter</button>
            <button class="btn btn-sm btn-ghost" onclick="loadReportsChart('year')" style="font-size:0.72rem;padding:4px 10px;border-radius:16px" data-range="year">Year</button>
          </div>
        </div>
        <div id="reports-trend-chart" style="display:flex;align-items:center;justify-content:center;min-height:200px;color:var(--g400);font-size:0.875rem">Loading chart...</div>
      </div>
      <div class="chart-container">
        <h3 style="display:flex;align-items:center"><img src="/public/Book_Outline_Icon_Black.png" alt="" style="width:32px;height:32px;margin-right:8px">Reading Score Distribution</h3>
        <p class="chart-subtitle">How your students are performing across reading levels</p>
        ${(() => {
          const ns = students.filter(s => (s.reading_score || s.score || 0) < 400).length;
          const dev = students.filter(s => { const sc = s.reading_score || s.score || 0; return sc >= 400 && sc < 600; }).length;
          const ot = students.filter(s => { const sc = s.reading_score || s.score || 0; return sc >= 600 && sc < 800; }).length;
          const adv = students.filter(s => (s.reading_score || s.score || 0) >= 800).length;
          return svgPieChart([
            { label: 'Needs Support (0\u2013399)', value: ns, color: '#EF4444' },
            { label: 'Developing (400\u2013599)', value: dev, color: '#F59E0B' },
            { label: 'On Track (600\u2013799)', value: ot, color: '#10B981' },
            { label: 'Advanced (800+)', value: adv, color: '#2563EB' }
          ], 280);
        })()}
      </div>
    </div>

    <div class="data-table-wrap" style="margin-top:24px">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Reading Score</th>
            <th>Accuracy</th>
            <th>Quizzes</th>
            <th>Keys Earned</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${[...students].sort((a, b) => (b.reading_score || b.score || 0) - (a.reading_score || a.score || 0)).map(s => {
            const sc = s.reading_score || s.score || 0;
            let statusCls = 'green', statusLabel = 'On Track';
            if (sc < 400) { statusCls = 'red'; statusLabel = 'Needs Support'; }
            else if (sc < 600) { statusCls = 'gold'; statusLabel = 'Developing'; }
            else if (sc >= 800) { statusCls = 'blue'; statusLabel = 'Advanced'; }
            return '<tr onclick="reportStudentId=' + s.id + '; renderMain();" style="cursor:pointer">' +
              '<td><div class="student-cell">' + avatar(s) + ' <span class="student-name">' + s.name + '</span> ' + warnTag(s) + '</div></td>' +
              '<td><strong>' + sc + '</strong></td>' +
              '<td>' + (s.accuracy || 0) + '%</td>' +
              '<td>' + (s.quizzes || 0) + '</td>' +
              '<td>' + (s.keys || 0) + '</td>' +
              '<td><span class="badge badge-' + statusCls + '">' + statusLabel + '</span></td>' +
            '</tr>';
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="info-panel" style="margin-top:24px">
      <h4>${IC.bulb} Key Insights</h4>
      <ul class="insight-list">
        <li>${students.filter(s => (s.reading_score || s.score || 0) >= 600).length} of ${students.length} students are On Track or Advanced</li>
        <li>Class average reading score: ${avgScore} · Average accuracy: ${avgAcc}%</li>
        <li>Students collectively earned ${totalKeysAll.toLocaleString()} Keys, demonstrating consistent engagement</li>
      </ul>
    </div>`;
}

// ---- Load async chart data for reports page ----
function loadReportsChartData() {
  loadReportsChart('week');
}

function loadReportsChart(range) {
  const classId = currentUser?.classId;
  if (!classId) return;

  // Update active button style
  var btns = document.querySelectorAll('#reports-range-btns button');
  btns.forEach(function(b) {
    if (b.getAttribute('data-range') === range) {
      b.className = 'btn btn-sm btn-primary';
    } else {
      b.className = 'btn btn-sm btn-ghost';
    }
  });

  var container = document.getElementById('reports-trend-chart');
  if (container) container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Loading chart...</div>';

  API.getWeeklyGrowth(classId, range).then(function(data) {
    var container = document.getElementById('reports-trend-chart');
    if (!container) return;
    if (!data || data.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">No data for this time range yet</div>';
      return;
    }
    var scores = data.map(function(w) { return w.avgScore; });
    var labels = data.map(function(w) { return w.label; });
    if (scores.length === 1) {
      scores.unshift(500);
      labels.unshift('Start');
    }
    container.innerHTML = svgAreaChart(scores, labels, 620, 280);
  }).catch(function() {
    var container = document.getElementById('reports-trend-chart');
    if (container) container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--g400);font-size:0.875rem">Could not load chart data</div>';
  });
}

// ---- Print / Export Report ----
function printReport() {
  window.print();
}

// ---- Page: Individual Student Report ----
function renderStudentReport() {
  const s = students.find(x => x.id === reportStudentId);
  if (!s) return '<p>Student not found.</p>';
  const gd = growthData[s.id];

  // Simplified report (works with or without growth data)
  if (!gd) {
    const raw = s._raw || {};
    const firstName = s.name.split(' ')[0];
    return `
      <button class="back-btn" onclick="reportStudentId=null; renderMain()">${IC.arrowLeft} Back to Class Report</button>
      <div class="report-header-card">
        <div class="report-header-bar"></div>
        <div class="report-header-body">
          <div class="report-header-top">
            <div style="display:flex;align-items:center;gap:16px">
              <img src="/public/logo.png" alt="key2read" style="height:36px;width:auto">
              ${avatar(s, 'lg')}
              <div>
                <h2>${s.name} ${warnTag(s)}</h2>
                <div class="report-meta">
                  <span>Grade: ${s.grade}</span>
                  <span>Level ${s.level}</span>
                </div>
              </div>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary btn-sm" onclick="printReport()">${IC.download} Export PDF</button>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-icon"><img src="/public/Book_Outline_Icon.png" alt="Reading Score"></div>
          <div class="stat-card-label">Reading Score</div>
          <div class="stat-card-value">${s.score}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon"><img src="/public/Comprehension_Outline_Icon.png" alt="Accuracy"></div>
          <div class="stat-card-label">Accuracy</div>
          <div class="stat-card-value">${s.accuracy}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon"><img src="/public/Key_Outline_Icon.png" alt="Keys"></div>
          <div class="stat-card-label">Keys Earned</div>
          <div class="stat-card-value">${(s.keys || 0).toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon"><img src="/public/Quiz_Outline_Icon.png" alt="Quizzes"></div>
          <div class="stat-card-label">Quizzes Taken</div>
          <div class="stat-card-value">${s.quizzes || 0}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Book_Outline_Icon_Black.png" alt="" style="width:28px;height:28px;margin-right:8px">Reading Score <button class="stat-help-btn no-print" onclick="showStatHelp('Reading Score', 'A score from 0–1000 based on quiz accuracy, effort, independence, vocabulary, and persistence. Each quiz adjusts the score up or down.')">?</button></h3>
          <div style="font-size:2rem;font-weight:800;color:var(--navy)">${s.score}</div>
          <div style="font-size:0.8rem;color:var(--g500);margin-top:4px">${s.score < 400 ? 'Needs Support — below grade level' : s.score < 600 ? 'Developing — building skills' : s.score < 800 ? 'On Track — reading at grade level' : 'Advanced — above grade level'}</div>
        </div>
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Comprehension_Outline_Black_Icon_.png" alt="" style="width:28px;height:28px;margin-right:8px">Comprehension <button class="stat-help-btn no-print" onclick="showStatHelp('Comprehension', 'The percentage of quiz questions answered correctly. Shows how well the student understands what they read.')">?</button></h3>
          <div style="font-size:2rem;font-weight:800;color:var(--navy)">${s.accuracy}%</div>
          <div style="font-size:0.8rem;color:var(--g500);margin-top:4px">${s.accuracy >= 80 ? 'Strong comprehension' : s.accuracy >= 60 ? 'Building comprehension' : 'Needs reading support'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Quiz_Outline_Icon_Blk.png" alt="" style="width:28px;height:28px;margin-right:8px">Quizzes Completed <button class="stat-help-btn no-print" onclick="showStatHelp('Quizzes Completed', 'Total chapter quizzes completed. Each book chapter has a 5-question quiz testing comprehension, vocabulary, and reasoning.')">?</button></h3>
          <div style="font-size:2rem;font-weight:800;color:var(--navy)">${s.quizzes || 0}</div>
          <div id="student-report-quizzes" style="margin-top:12px;font-size:0.8rem;color:var(--g400)">Loading quiz history...</div>
        </div>
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Key_Outline_Icon_Blk.png" alt="" style="width:28px;height:28px;margin-right:8px">Keys Earned <button class="stat-help-btn no-print" onclick="showStatHelp('Keys Earned', 'Keys are rewards earned by scoring 80% or higher on quizzes. Students can spend keys in the Class Store for prizes you set up.')">?</button></h3>
          <div style="font-size:2rem;font-weight:800;color:var(--navy)">${(s.keys || 0).toLocaleString()}</div>
          <div style="font-size:0.8rem;color:var(--g500);margin-top:4px">${s.keys > 0 ? 'Keep it up!' : 'Score 80%+ on quizzes to start earning keys'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Stacked_Book_Outline.png" alt="" style="width:28px;height:28px;margin-right:8px">Books Progress <button class="stat-help-btn no-print" onclick="showStatHelp('Books Progress', 'Books the student is reading or has completed, based on quiz activity. Each book has multiple chapters with quizzes.')">?</button></h3>
          <div id="student-report-books" style="font-size:0.8rem;color:var(--g400)">Loading book progress...</div>
        </div>
        <div class="list-card" style="padding:24px">
          <h3 style="margin:0 0 12px 0;display:flex;align-items:center"><img src="/public/Recent_Outline_Icon_.png" alt="" style="width:28px;height:28px;margin-right:8px">Quiz Effort <button class="stat-help-btn no-print" onclick="showStatHelp('Quiz Effort', 'Measures whether the student takes their time and answers thoughtfully. This rewards effort, not speed.')">?</button></h3>
          <div id="student-report-effort" style="font-size:0.8rem;color:var(--g400)">Loading effort data...</div>
        </div>
      </div>

      <div class="info-panel" style="margin-top:24px">
        <h4>${IC.info} Growth Data</h4>
        <p>More detailed growth charts will appear as ${firstName} completes more quizzes over time. Keep reading!</p>
      </div>

      <script>
      (function() {
        const sid = ${s.id};
        // Load quiz results
        API.getQuizResults(sid).then(function(results) {
          const el = document.getElementById('student-report-quizzes');
          if (!el) return;
          if (!results || results.length === 0) {
            el.innerHTML = 'No quizzes completed yet';
            return;
          }
          // Calculate avg time
          let totalTime = 0, timeCount = 0;
          results.forEach(function(r) {
            if (r.time_taken) { totalTime += r.time_taken; timeCount++; }
          });
          const avgTime = timeCount > 0 ? Math.round(totalTime / timeCount) : 0;
          const avgMin = Math.floor(avgTime / 60);
          const avgSec = avgTime % 60;

          el.innerHTML = '<div style="display:flex;flex-direction:column;gap:6px">' +
            results.slice(0, 5).map(function(r) {
              const date = r.completed_at ? new Date(r.completed_at).toLocaleDateString() : '';
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--g100)">' +
                '<span style="font-weight:500;color:var(--g700)">' + (r.book_title || 'Quiz') + ' Ch.' + (r.chapter_number || '?') + '</span>' +
                '<span style="font-weight:700;color:' + (r.score >= 80 ? 'var(--green)' : 'var(--gold)') + '">' + r.score + '%</span>' +
              '</div>';
            }).join('') +
            (results.length > 5 ? '<div style="color:var(--g400);padding-top:6px">+ ' + (results.length - 5) + ' more</div>' : '') +
          '</div>';

          // Update effort section
          const effortEl = document.getElementById('student-report-effort');
          if (effortEl) {
            if (timeCount > 0) {
              effortEl.innerHTML = '<div style="font-size:2rem;font-weight:800;color:var(--navy)">' + avgMin + 'm ' + avgSec + 's</div>' +
                '<div style="color:var(--g500);margin-top:4px">Average time per quiz (' + timeCount + ' quiz' + (timeCount > 1 ? 'es' : '') + ')</div>';
            } else {
              effortEl.innerHTML = 'No time data available yet';
            }
          }
        }).catch(function() {
          const el = document.getElementById('student-report-quizzes');
          if (el) el.innerHTML = 'Could not load quiz data';
        });

        // Load book progress
        API.getBookProgress(sid).then(function(booksData) {
          const el = document.getElementById('student-report-books');
          if (!el) return;
          if (!booksData || booksData.length === 0) {
            el.innerHTML = 'No books started yet';
            return;
          }
          el.innerHTML = booksData.slice(0, 5).map(function(b) {
            const pct = b.total_chapters > 0 ? Math.round((b.chapters_completed / b.total_chapters) * 100) : 0;
            const done = pct === 100;
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--g100)">' +
              '<span style="font-weight:500;color:var(--g700)">' + (b.title || 'Book') + '</span>' +
              '<span style="font-weight:600;color:' + (done ? 'var(--green)' : 'var(--blue)') + '">' + (done ? '✓ Complete' : b.chapters_completed + '/' + b.total_chapters + ' chapters') + '</span>' +
            '</div>';
          }).join('') +
          (booksData.length > 5 ? '<div style="color:var(--g400);padding-top:6px">+ ' + (booksData.length - 5) + ' more</div>' : '');
        }).catch(function() {
          const el = document.getElementById('student-report-books');
          if (el) el.innerHTML = 'Could not load book data';
        });
      })();
      </script>`;
  }

  return `
    <button class="back-btn" onclick="reportStudentId=null; renderMain()">${IC.arrowLeft} Back to Class Report</button>

    <div class="report-header-card">
      <div class="report-header-bar"></div>
      <div class="report-header-body">
        <div class="report-header-top">
          <div style="display:flex;align-items:center;gap:16px">
            <img src="/public/logo.png" alt="key2read" style="height:36px;width:auto">
            ${avatar(s, 'lg')}
            <div>
              <h2>${s.name} ${warnTag(s)}</h2>
              <div class="report-meta">
                <span>Grade: ${s.grade}</span>
                <span>Level ${s.level}</span>
                <span>${IC.calendar} Last 8 Weeks</span>
              </div>
            </div>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-ghost btn-sm" onclick="printReport()">${IC.printer} Print</button>
            <button class="btn btn-primary btn-sm" onclick="printReport()">${IC.download} Export PDF</button>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">Reading Score</div>
        <div class="stat-card-value">${s.score} ${growthArrow(gd.scores[0], gd.scores[gd.scores.length - 1])}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Accuracy</div>
        <div class="stat-card-value">${s.accuracy}% ${growthArrow(gd.accuracy[0], gd.accuracy[gd.accuracy.length - 1])}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Keys Earned</div>
        <div class="stat-card-value">${(s.keys || 0).toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Quizzes Taken</div>
        <div class="stat-card-value">${s.quizzes || 0}</div>
      </div>
    </div>

    <div class="chart-container">
      <h3>Reading Score Growth</h3>
      <p class="chart-subtitle">${s.name.split(' ')[0]}'s reading score over time</p>
      ${svgAreaChart(gd.scores, months, 620, 280)}
    </div>

    <div class="data-table-wrap" style="margin-top:24px">
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Reading Score</th>
            <th>Accuracy</th>
            <th>Quizzes</th>
          </tr>
        </thead>
        <tbody>
          ${months.map((m, i) => `
            <tr>
              <td><strong>${m} ${i < 4 ? '2025' : '2026'}</strong></td>
              <td>${gd.scores[i]} ${i > 0 ? `<span class="growth-arrow ${gd.scores[i] >= gd.scores[i-1] ? 'up' : 'down'}">${gd.scores[i] >= gd.scores[i-1] ? IC.arrowUp + '+' : IC.arrowDown}${Math.abs(gd.scores[i] - gd.scores[i-1])}</span>` : ''}</td>
              <td>${gd.accuracy[i]}%</td>
              <td>${gd.quizzes[i]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

  `;
}

// ---- Onboarding Helpers ----
function nextOnboardingStep() {
  onboardingStep++;
  openModal('onboarding', onboardingStudent);
}

function prevOnboardingStep() {
  onboardingStep = Math.max(0, onboardingStep - 1);
  openModal('onboarding', onboardingStudent);
}

function selectInterestTag(tagId) {
  const idx = selectedInterests.indexOf(tagId);
  if (idx >= 0) selectedInterests.splice(idx, 1);
  else if (selectedInterests.length < 3) selectedInterests.push(tagId);
  refreshOnboardingContent();
}

function selectReadingStyle(style) {
  selectedReadingStyle = style;
  refreshOnboardingContent();
}

function toggleSurveyChip(type, id) {
  const key = '_survey' + type.charAt(0).toUpperCase() + type.slice(1);
  if (!window[key]) window[key] = [];
  const idx = window[key].indexOf(id);
  if (idx >= 0) window[key].splice(idx, 1);
  else window[key].push(id);
  refreshOnboardingContent();
}

function refreshOnboardingContent() {
  const modalBody = document.querySelector('.modal-body');
  if (!modalBody) { openModal('onboarding', onboardingStudent); return; }
  // Re-generate just the modal body content without re-rendering the overlay/modal shell
  const s = students.find(x => x.id === onboardingStudent);
  if (!s) return;
  const bodyHtml = getOnboardingBodyHtml(s);
  modalBody.innerHTML = bodyHtml;
}

function saveSurveyInputs() {
  // placeholder for future survey input fields
}

async function saveOnboarding() {
  const s = students.find(x => x.id === onboardingStudent);
  if (s) {
    s.interests.tags = [...selectedInterests];
    s.interests.readingStyle = selectedReadingStyle || 'detailed';
    const genreSelect = document.getElementById('genre-select');
    s.interests.favoriteGenre = genreSelect ? genreSelect.value : 'Fantasy';
    s.interests.onboarded = true;

    // Save to backend DB (favorite_animals array length vs "Pick up to 3" instruction
    // reveals instruction-following ability — teachers can see this in student details)
    try {
      await API.updateSurvey(s.id, {
        interest_tags: JSON.stringify(selectedInterests),
        reading_style: selectedReadingStyle || 'detailed',
        favorite_genre: genreSelect ? genreSelect.value : 'Fantasy',
        favorite_animals: JSON.stringify(window._surveyAnimals || []),
        reading_feeling: window._surveyReadingFeeling || '',
        likes_reading: window._surveyLikesReading || ''
      });
    } catch(e) { console.log('Survey save (offline mode):', e.message); }
  }

  // Mark current user as onboarded so the wizard won't re-trigger
  if (currentUser) currentUser.onboarded = 1;

  // Clean up
  onboardingStep = 0;
  onboardingStudent = null;
  selectedInterests = [];
  window._surveyAnimals = [];
  window._surveyReadingFeeling = '';
  window._surveyLikesReading = '';
  closeModal();
  renderMain();

  // Show badge earned popup for "Learned About You" badge
  setTimeout(function() {
    showBadgeEarnedPopup({ img: '/public/Learned_About_You.png', name: 'Learned About You', desc: 'You filled out your student profile! Now your quizzes will be personalized just for you.' });
  }, 600);
}

// ---- Onboarding Body Content (extracted so modal shell doesn't re-render) ----
function getOnboardingBodyHtml(s) {
  const totalSteps = 6;
  const stepDots = Array.from({length: totalSteps}, (_, i) => {
    let cls = 'step-dot';
    if (i === onboardingStep) cls += ' active';
    else if (i < onboardingStep) cls += ' done';
    return `<div class="${cls}"></div>`;
  }).join('');

  let stepContent = '';

  if (onboardingStep === 0) {
    stepContent = `
      <div class="onboarding-welcome">
        <div style="display:flex;justify-content:center;margin-bottom:8px"><img src="/public/Learned_About_You.png" alt="Learned About You" style="width:160px;height:160px;object-fit:contain"></div>
        <h2 style="text-align:center;margin-bottom:20px">Hello there! We would love to learn a little more about you!</h2>
        <div style="text-align:center">
          <button class="btn btn-primary" onclick="nextOnboardingStep()">Let's Go!</button>
        </div>
      </div>`;
  } else if (onboardingStep === 1) {
    if (!window._surveyLikesReading) window._surveyLikesReading = '';
    stepContent = `
      <h3 style="text-align:center;margin-bottom:8px">Do you like reading?</h3>
      <div class="survey-chips" style="justify-content:center;margin-top:20px;gap:12px">
        <div class="survey-chip ${window._surveyLikesReading === 'yes' ? 'selected' : ''}" onclick="window._surveyLikesReading='yes'; openModal('onboarding', onboardingStudent)" style="font-size:1.05rem;padding:12px 28px">
          <span class="chip-icon">👍</span> Yes
        </div>
        <div class="survey-chip ${window._surveyLikesReading === 'no' ? 'selected' : ''}" onclick="window._surveyLikesReading='no'; openModal('onboarding', onboardingStudent)" style="font-size:1.05rem;padding:12px 28px">
          <span class="chip-icon">👎</span> No
        </div>
        <div class="survey-chip ${window._surveyLikesReading === 'sometimes' ? 'selected' : ''}" onclick="window._surveyLikesReading='sometimes'; openModal('onboarding', onboardingStudent)" style="font-size:1.05rem;padding:12px 28px">
          <span class="chip-icon">🤷</span> Sometimes
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:24px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 2) {
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">What is your favorite kind of book to read?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px"><strong style="color:var(--navy)">Pick 1\u20133</strong> that interest you the most.</p>
      <div class="interest-grid">
        ${interestCategories.map(cat => {
          const selected = selectedInterests.includes(cat.id) ? 'selected' : '';
          return `<div class="interest-card ${selected}" onclick="selectInterestTag('${cat.id}')">
            <div class="interest-card-icon ${cat.color}">${cat.icon}</div>
            <span>${cat.label}</span>
            ${selected ? `<div class="interest-card-check">${IC.check}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
      <p style="text-align:center;color:var(--g400);font-size:0.8125rem;margin-top:12px">${selectedInterests.length}/3 selected ${selectedInterests.length < 1 ? '(pick at least 1)' : ''}</p>
      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()" ${selectedInterests.length < 1 ? 'disabled style="opacity:0.5;pointer-events:none"' : ''}>Next</button>
      </div>`;
  } else if (onboardingStep === 3) {
    const animalOptions = [
      { id: 'dogs', label: 'Dogs', icon: '🐕' }, { id: 'cats', label: 'Cats', icon: '🐱' },
      { id: 'horses', label: 'Horses', icon: '🐴' }, { id: 'dolphins', label: 'Dolphins', icon: '🐬' },
      { id: 'birds', label: 'Birds', icon: '🦜' }, { id: 'rabbits', label: 'Rabbits', icon: '🐰' },
      { id: 'turtles', label: 'Turtles', icon: '🐢' }, { id: 'lizards', label: 'Lizards', icon: '🦎' },
      { id: 'wolves', label: 'Wolves', icon: '🐺' }, { id: 'butterflies', label: 'Butterflies', icon: '🦋' },
      { id: 'owls', label: 'Owls', icon: '🦉' }, { id: 'fish', label: 'Fish', icon: '🐠' },
      { id: 'hamsters', label: 'Hamsters', icon: '🐹' },
    ];
    if (!window._surveyAnimals) window._surveyAnimals = [];
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">What are your favorite animals?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px"><strong style="color:var(--navy)">Pick up to 3</strong> animals you love!</p>

      <div class="survey-chips" style="justify-content:center">
        ${animalOptions.map(a => `
          <div class="survey-chip ${(window._surveyAnimals||[]).includes(a.id)?'selected':''}" onclick="toggleSurveyChip('animals','${a.id}')">
            <span class="chip-icon">${a.icon}</span> ${a.label}
          </div>
        `).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 4) {
    const feelings = [
      { id: 'confident',  label: 'Confident', icon: '💪' },
      { id: 'frustrated', label: 'Frustrated', icon: '😤' },
      { id: 'calm',       label: 'Calm', icon: '😌' },
      { id: 'bored',      label: 'Bored', icon: '😴' },
    ];
    if (!window._surveyReadingFeeling) window._surveyReadingFeeling = '';
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">How does reading make you feel?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px">Pick the one that fits you best.</p>

      <div class="survey-chips" style="justify-content:center">
        ${feelings.map(f => `
          <div class="survey-chip ${window._surveyReadingFeeling === f.id ? 'selected' : ''}" onclick="window._surveyReadingFeeling='${f.id}'; openModal('onboarding', onboardingStudent)">
            <span class="chip-icon">${f.icon}</span> ${f.label}
          </div>
        `).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:24px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 5) {
    const animals = (window._surveyAnimals || []).slice(0, 3);
    stepContent = `
      <h3 style="text-align:center;margin-bottom:10px">Thank you for telling us about you!</h3>
      ${window._surveyLikesReading ? `<div style="margin-bottom:8px"><span class="interest-profile-label" style="display:inline;margin-right:6px">Likes Reading:</span><span style="color:var(--g600);font-size:0.85rem">${window._surveyLikesReading.charAt(0).toUpperCase() + window._surveyLikesReading.slice(1)}</span></div>` : ''}
      <div style="margin-bottom:8px">
        <span class="interest-profile-label" style="display:inline;margin-right:6px">Favorite Books:</span>
        ${selectedInterests.map(tagId => {
          const cat = interestCategories.find(c => c.id === tagId);
          return cat ? `<span class="interest-tag ${cat.color}">${cat.label}</span>` : '';
        }).join(' ')}
      </div>
      ${animals.length > 0 ? `<div style="margin-bottom:8px"><span class="interest-profile-label" style="display:inline;margin-right:6px">Favorite Animals:</span><span style="color:var(--g600);font-size:0.85rem">${animals.join(', ')}</span></div>` : ''}
      ${window._surveyReadingFeeling ? `<div style="margin-bottom:8px"><span class="interest-profile-label" style="display:inline;margin-right:6px">Reading Makes Me Feel:</span><span style="color:var(--g600);font-size:0.85rem">${window._surveyReadingFeeling.charAt(0).toUpperCase() + window._surveyReadingFeeling.slice(1)}</span></div>` : ''}

      <div style="display:flex;justify-content:space-between;margin-top:16px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="saveOnboarding()">${IC.check} Save Profile</button>
      </div>`;
  }

  return `<div class="onboarding-step-indicator">${stepDots}</div>${stepContent}`;
}

// ---- Modal System ----
function openModal(type, prefill) {
  let html = '';
  const modalRoot = 'modal-root';

  if (type === 'dashboard-help') {
    const classCode = currentUser?.classCode || '';
    html = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal modal-lg dashboard-help-modal" onclick="event.stopPropagation()" style="max-width:680px">
          <div class="modal-header">
            <h3 style="font-size:1.35rem">&#128218; How This Dashboard Works</h3>
            <button class="modal-close" onclick="closeModal()">${IC.x}</button>
          </div>
          <div class="modal-body" style="padding:28px 32px">
            <div class="getting-started-steps getting-started-steps-lg" style="margin:0;max-width:100%;gap:20px">
              <div class="gs-step gs-step-lg"><div class="gs-step-num gs-step-num-lg">1</div><div><strong>Share Your Class Code</strong><p>Give students the code <strong>${classCode}</strong> so they can join your class.</p></div></div>
              <div class="gs-step gs-step-lg"><div class="gs-step-num gs-step-num-lg">2</div><div><strong>Students Sign Up</strong><p>They go to the signup page, choose "Student", and enter the class code.</p></div></div>
              <div class="gs-step gs-step-lg"><div class="gs-step-num gs-step-num-lg">3</div><div><strong>Students Read &amp; Take Quizzes</strong><p>Students pick books from the library, read chapters, and take quizzes after each one.</p></div></div>
              <div class="gs-step gs-step-lg"><div class="gs-step-num gs-step-num-lg">4</div><div><strong>Track Growth</strong><p>Watch your students' reading scores, comprehension, vocabulary, and independence grow on this dashboard.</p></div></div>
              <div class="gs-step gs-step-lg"><div class="gs-step-num gs-step-num-lg">5</div><div><strong>Celebrate Success</strong><p>Print certificates when students complete books! You can find these on each student's profile page.</p></div></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  if (type === 'onboarding') {
    const s = students.find(x => x.id === onboardingStudent);
    if (!s) return;

    html = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal modal-lg" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>Student Interest Setup</h3>
            <button class="modal-close" onclick="closeModal()">${IC.x}</button>
          </div>
          <div class="modal-body">
            ${getOnboardingBodyHtml(s)}
          </div>
        </div>
      </div>`;
  }

  if (type === 'goal') {
    html = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>Add Class Goal</h3>
            <button class="modal-close" onclick="closeModal()">${IC.x}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Goal Description</label>
              <input type="text" class="form-input" placeholder="e.g. Class reads 50 books">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Target Value</label>
                <input type="number" class="form-input" placeholder="100">
              </div>
              <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-input">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Goal Type</label>
              <select class="form-select">
                <option>Books Completed</option>
                <option>Average Comprehension %</option>
                <option>Total Keys</option>
                <option>Students Passing</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Keys Bonus (optional)</label>
              <input type="number" class="form-input" placeholder="Bonus Keys per student on completion">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="closeModal()">Create Goal</button>
          </div>
        </div>
      </div>`;
  }

  if (type === 'template') {
    html = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>Create Custom Template</h3>
            <button class="modal-close" onclick="closeModal()">${IC.x}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Template Name</label>
              <input type="text" class="form-input" placeholder="e.g. My Custom Quiz">
            </div>
            <div class="form-group">
              <label class="form-label">Type</label>
              <select class="form-select">
                <option>Quiz</option>
                <option>Assessment</option>
                <option>Challenge</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Questions</label>
                <input type="number" class="form-input" placeholder="10" value="10">
              </div>
              <div class="form-group">
                <label class="form-label">Time Limit</label>
                <input type="text" class="form-input" placeholder="15 min" value="15 min">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-input" placeholder="Describe what this template covers..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="closeModal()">Create Template</button>
          </div>
        </div>
      </div>`;
  }

  document.getElementById(modalRoot).innerHTML = html;
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modal-root').innerHTML = '';
}

function closeModal2(e) {
  if (e && e.target !== e.currentTarget) return;
  const el = document.getElementById('modal-root-2');
  if (el) el.innerHTML = '';
}

// ============================================================
// ---- WEEKLY WINS DRILL-DOWN MODALS ----
// ============================================================

async function showKeysBreakdown() {
  if (!currentUser?.studentId) return;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()" style="max-width:540px">
        <div class="modal-header">
          <h3>🔑 Keys Earned</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:32px">
          <p style="color:var(--g400)">Loading...</p>
        </div>
      </div>
    </div>`;

  try {
    const results = await getCachedQuizResults(currentUser.studentId);
    const withKeys = results.filter(r => r.keys_earned > 0);
    const totalKeys = withKeys.reduce((sum, r) => sum + (r.keys_earned || 0), 0);

    // Group by book
    const byBook = {};
    withKeys.forEach(r => {
      const title = r.book_title || 'Unknown Book';
      if (!byBook[title]) byBook[title] = [];
      byBook[title].push(r);
    });

    let listHtml = '';
    if (withKeys.length === 0) {
      listHtml = `<div style="text-align:center;padding:24px;color:var(--g400)">
        <p style="font-size:1.125rem;margin-bottom:4px">No keys earned yet</p>
        <p style="font-size:0.875rem">Complete quizzes with 80% or higher to earn keys!</p>
      </div>`;
    } else {
      for (const [bookTitle, quizzes] of Object.entries(byBook)) {
        const bookKeys = quizzes.reduce((sum, r) => sum + (r.keys_earned || 0), 0);
        listHtml += `<div style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h4 style="margin:0;font-size:0.9375rem;font-weight:700;color:var(--navy)">${bookTitle}</h4>
            <span class="badge badge-gold" style="font-size:0.75rem">${bookKeys} keys</span>
          </div>`;
        quizzes.forEach(r => {
          const date = r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          listHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--g50);border-radius:var(--radius-sm);margin-bottom:4px;font-size:0.8125rem">
            <span style="color:var(--g600)">Ch. ${r.chapter_number || '?'}: ${r.chapter_title || 'Quiz'}</span>
            <div style="display:flex;align-items:center;gap:12px">
              <span style="color:var(--g400)">${date}</span>
              <span style="font-weight:700;color:var(--gold)">+${r.keys_earned}</span>
            </div>
          </div>`;
        });
        listHtml += `</div>`;
      }
    }

    const body = modal.querySelector('.modal-body');
    body.style.textAlign = '';
    body.style.padding = '';
    body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 20px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);border-radius:var(--radius-md);margin-bottom:20px">
        <span style="font-size:1.5rem">🔑</span>
        <span style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;color:var(--g900)">${totalKeys}</span>
        <span style="font-size:0.875rem;font-weight:600;color:var(--g600)">Total Keys</span>
      </div>
      ${listHtml}`;
  } catch(e) {
    console.error('Keys breakdown error:', e);
    const body = modal.querySelector('.modal-body');
    if (body) body.innerHTML = '<p style="color:var(--red);text-align:center">Failed to load key history.</p>';
  }
}

function showCompletedBooks() {
  const progressMap = {};
  (currentUser?.bookProgress || []).forEach(p => { progressMap[p.bookId] = p; });
  const completedBooks = books.filter(b => progressMap[b.id]?.isComplete);

  let gridHtml = '';
  if (completedBooks.length === 0) {
    gridHtml = `<div style="text-align:center;padding:32px;color:var(--g400)">
      <p style="font-size:2rem;margin-bottom:8px">📚</p>
      <p style="font-size:1.125rem;margin-bottom:4px">No books completed yet</p>
      <p style="font-size:0.875rem">Finish all chapters in a book to see it here!</p>
    </div>`;
  } else {
    gridHtml = `<div class="book-progress-grid" style="gap:16px">
      ${completedBooks.map(b => `
        <div class="book-progress-card" onclick="closeModal(); openBook(${b.id})" style="cursor:pointer">
          <div class="book-progress-cover">
            ${b.cover_url ? `<img src="${b.cover_url}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
            <div class="book-progress-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>
              <span>${b.title}</span>
            </div>
            <div class="book-completed-overlay">
              <div class="book-completed-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>COMPLETED</span>
              </div>
            </div>
          </div>
          <div class="book-progress-info">
            <div class="book-progress-title">${b.title}</div>
            <div class="book-progress-status" style="color:var(--green)">✅ All done!</div>
          </div>
        </div>`).join('')}
    </div>`;
  }

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()" style="max-width:560px">
        <div class="modal-header">
          <h3>📚 Completed Books</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body">
          ${gridHtml}
        </div>
      </div>
    </div>`;
}

async function showCompletedQuizzes() {
  if (!currentUser?.studentId) return;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()" style="max-width:580px">
        <div class="modal-header">
          <h3><img src="/public/Paper_Icon_.png" alt="" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;margin-right:6px">Quizzes</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:32px">
          <p style="color:var(--g400)">Loading...</p>
        </div>
      </div>
    </div>`;

  try {
    const results = await getCachedQuizResults(currentUser.studentId);
    const totalQuizzes = results.length;

    // Group completed quizzes by book
    const byBook = {};
    results.forEach(r => {
      const title = r.book_title || 'Unknown Book';
      if (!byBook[title]) byBook[title] = [];
      byBook[title].push(r);
    });

    // Build in-progress books section
    const progressMap = {};
    (currentUser?.bookProgress || []).forEach(p => { progressMap[p.bookId] = p; });
    const inProgressBooks = books.filter(b => {
      const p = progressMap[b.id];
      return p && !p.isComplete && p.completedChapters > 0;
    });

    let listHtml = '';

    // Completed quizzes section
    if (totalQuizzes === 0 && inProgressBooks.length === 0) {
      listHtml = `<div style="text-align:center;padding:24px;color:var(--g400)">
        <p style="font-size:2rem;margin-bottom:8px">📝</p>
        <p style="font-size:1.125rem;margin-bottom:4px">No quizzes completed yet</p>
        <p style="font-size:0.875rem">Start reading a book to begin!</p>
      </div>`;
    } else {
      // Completed quizzes grouped by book
      if (totalQuizzes > 0) {
        listHtml += `<div style="margin-bottom:8px;font-size:0.8125rem;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:0.5px">Completed</div>`;
        for (const [bookTitle, quizzes] of Object.entries(byBook)) {
          const bookScore = Math.round(quizzes.reduce((sum, r) => sum + (r.score || 0), 0) / quizzes.length);
          const bookKeys = quizzes.reduce((sum, r) => sum + (r.keys_earned || 0), 0);
          listHtml += `<div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <h4 style="margin:0;font-size:0.9375rem;font-weight:700;color:var(--navy)">${bookTitle}</h4>
              <div style="display:flex;gap:8px;align-items:center">
                <span style="font-size:0.75rem;font-weight:600;color:var(--g400)">${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''}</span>
                ${bookKeys > 0 ? `<span class="badge badge-gold" style="font-size:0.7rem">${bookKeys} keys</span>` : ''}
              </div>
            </div>`;
          quizzes.forEach(r => {
            const date = r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            const score = r.score || 0;
            const scoreColor = score >= 80 ? 'var(--green)' : score >= 60 ? '#F59E0B' : 'var(--red)';
            listHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--g50);border-radius:var(--radius-sm);margin-bottom:4px;font-size:0.8125rem">
              <span style="color:var(--g600)">Ch. ${r.chapter_number || '?'}: ${r.chapter_title || 'Quiz'}</span>
              <div style="display:flex;align-items:center;gap:10px">
                <span style="color:var(--g400)">${date}</span>
                <span style="font-weight:700;color:${scoreColor}">${score}%</span>
                ${r.keys_earned > 0 ? `<span style="font-weight:700;color:var(--gold)">+${r.keys_earned} 🔑</span>` : ''}
              </div>
            </div>`;
          });
          listHtml += `</div>`;
        }
      }

      // In-progress books section
      if (inProgressBooks.length > 0) {
        listHtml += `<div style="margin-top:16px;margin-bottom:8px;font-size:0.8125rem;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:0.5px">In Progress</div>`;
        inProgressBooks.forEach(b => {
          const p = progressMap[b.id];
          const pct = Math.round((p.completedChapters / p.totalChapters) * 100);
          listHtml += `<div onclick="closeModal(); openBook(${b.id})" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--g50);border-radius:var(--radius-sm);margin-bottom:6px">
            ${b.cover_url ? `<img src="${b.cover_url}" alt="" style="width:40px;height:52px;object-fit:cover;border-radius:var(--radius-sm)">` : `<div style="width:40px;height:52px;background:var(--g200);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--g400);text-align:center;padding:4px">${b.title}</div>`}
            <div style="flex:1">
              <div style="font-size:0.875rem;font-weight:700;color:var(--navy);margin-bottom:4px">${b.title}</div>
              <div style="height:8px;background:var(--g200);border-radius:4px;overflow:hidden">
                <div style="width:${pct}%;height:100%;background:var(--teal);border-radius:4px"></div>
              </div>
              <div style="font-size:0.75rem;color:var(--g400);margin-top:4px">${p.completedChapters} of ${p.totalChapters} chapters</div>
            </div>
          </div>`;
        });
      }
    }

    const body = modal.querySelector('.modal-body');
    body.style.textAlign = '';
    body.style.padding = '';
    body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 20px;background:linear-gradient(135deg,#DBEAFE,#BFDBFE);border-radius:var(--radius-md);margin-bottom:20px">
        <img src="/public/Paper_Icon_.png" alt="" style="width:32px;height:32px;object-fit:contain">
        <span style="font-family:var(--font-display);font-size:1.75rem;font-weight:800;color:var(--g900)">${totalQuizzes}</span>
        <span style="font-size:0.875rem;font-weight:600;color:var(--g600)">Quizzes Completed</span>
      </div>
      ${listHtml}`;
  } catch(e) {
    console.error('Quizzes breakdown error:', e);
    const body = modal.querySelector('.modal-body');
    if (body) body.innerHTML = '<p style="color:var(--red);text-align:center">Failed to load quiz history.</p>';
  }
}

async function showQuizResult(bookId, chapterNumber) {
  if (!currentUser?.studentId) return;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:420px">
        <div class="modal-header">
          <h3>Quiz Results</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:32px">
          <p style="color:var(--g400)">Loading...</p>
        </div>
      </div>
    </div>`;

  try {
    const results = await getCachedQuizResults(currentUser.studentId);
    // Find matching result for this book + chapter (most recent)
    const match = results.find(r => r.book_id === bookId && r.chapter_number === chapterNumber)
                || results.find(r => r.chapter_number === chapterNumber);
    if (!match) {
      modal.querySelector('.modal-body').innerHTML = '<p style="color:var(--g400);text-align:center">No results found for this quiz.</p>';
      return;
    }

    const score = match.score || 0;
    const scoreColor = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
    const correct = match.correct_count || 0;
    const total = match.total_questions || 5;
    const missed = total - correct;
    const keys = match.keys_earned || 0;
    const hints = match.hints_used || 0;
    const date = match.completed_at ? new Date(match.completed_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';
    const chTitle = match.chapter_title || `Chapter ${chapterNumber}`;
    const bTitle = match.book_title || '';

    const body = modal.querySelector('.modal-body');
    body.style.textAlign = '';
    body.style.padding = '';
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:0.8125rem;color:var(--g400);margin-bottom:4px">${bTitle}</div>
        <div style="font-size:1rem;font-weight:700;color:var(--navy)">Ch. ${chapterNumber}: ${chTitle}</div>
      </div>

      <div style="display:flex;justify-content:center;margin-bottom:20px">
        <div style="position:relative;width:100px;height:100px">
          <svg viewBox="0 0 120 120" width="100" height="100">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--g200)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="${scoreColor}" stroke-width="8" stroke-linecap="round"
              stroke-dasharray="${(score / 100) * 339.3} 339.3" transform="rotate(-90 60 60)"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <span style="font-size:1.5rem;font-weight:800;color:${scoreColor}">${Math.round(score)}%</span>
            <span style="font-size:0.75rem;color:var(--g400)">${correct}/${total}</span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div style="background:var(--g50);padding:12px;border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:1.25rem;font-weight:800;color:var(--green)">${correct}</div>
          <div style="font-size:0.75rem;color:var(--g400)">Correct</div>
        </div>
        <div style="background:var(--g50);padding:12px;border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:1.25rem;font-weight:800;color:var(--red)">${missed}</div>
          <div style="font-size:0.75rem;color:var(--g400)">Missed</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        ${keys > 0 ? `<div style="display:flex;justify-content:space-between;padding:10px 12px;background:linear-gradient(135deg,#FFF7ED,#FEF3C7);border-radius:var(--radius-sm)">
          <span style="font-size:0.8125rem;color:var(--g600)">🔑 Keys Earned</span>
          <span style="font-size:0.875rem;font-weight:700;color:#D97706">+${keys}</span>
        </div>` : score >= 80 ? `<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--g50);border-radius:var(--radius-sm)">
          <span style="font-size:0.8125rem;color:var(--g600)">🔑 Keys Earned</span>
          <span style="font-size:0.8125rem;color:var(--g400)">0 — Keys already earned for this chapter</span>
        </div>` : `<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--g50);border-radius:var(--radius-sm)">
          <span style="font-size:0.8125rem;color:var(--g400)">🔑 Keys Earned</span>
          <span style="font-size:0.8125rem;color:var(--g400)">Score 80%+ to earn keys!</span>
        </div>`}
        ${date ? `<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--g50);border-radius:var(--radius-sm)">
          <span style="font-size:0.8125rem;color:var(--g600)">📅 Date</span>
          <span style="font-size:0.8125rem;font-weight:600;color:var(--g700)">${date}</span>
        </div>` : ''}
        ${hints > 0 ? `<div style="display:flex;justify-content:space-between;padding:10px 12px;background:var(--g50);border-radius:var(--radius-sm)">
          <span style="font-size:0.8125rem;color:var(--g600)">💡 Hints Used</span>
          <span style="font-size:0.8125rem;font-weight:600;color:var(--g700)">${hints}</span>
        </div>` : ''}
      </div>
    `;
  } catch(e) {
    console.error('View results error:', e);
    const body = modal.querySelector('.modal-body');
    if (body) body.innerHTML = '<p style="color:var(--red);text-align:center">Failed to load results.</p>';
  }
}

// ============================================================
// ---- STUDENT DASHBOARD PAGES ----
// ============================================================

function getStudentBadges() {
  const s = {
    quizzes: currentUser?.quizzes_completed || 0,
    keys: currentUser?.keys_earned || 0,
    accuracy: currentUser?.accuracy || 0,
    streak: currentUser?.streak_days || 0,
    totalBooks: currentUser?.totalBooksCompleted || 0
  };
  const genreSet = new Set();
  (currentUser?.bookProgress || []).forEach(p => {
    if (p.isComplete) {
      const bk = books.find(b => b.id === p.bookId);
      if (bk && bk.genre) genreSet.add(bk.genre);
    }
  });
  return [
    { img: '/public/Learned_About_You.png',     name: 'Learned About You',     desc: 'Fill out your student profile',    earned: !!(currentUser?.onboarded) },
    { img: '/public/Quiz_Streak_Badge_.png',    name: 'Quiz Streak',           desc: 'Complete 3 quizzes in a row',      earned: s.quizzes >= 3 },
    { img: '/public/Book_Boss_Badge.png',       name: 'Book Boss',             desc: 'Complete 3 books',                 earned: s.totalBooks >= 3 },
    { img: '/public/Genre_Jumper_Badge.png',    name: 'Genre Jumper',          desc: 'Read books from 3 different genres', earned: genreSet.size >= 3 },
    { img: '/public/First_Book_Badge.png',      name: 'First Book Done',       desc: 'Finish your very first book',      earned: s.totalBooks >= 1 },
    { img: '/public/Quiz_Conqueror_Badge.png',  name: 'Quiz Conqueror',        desc: 'Complete 10 quizzes',              earned: s.quizzes >= 10 },
    { img: '/public/Grow_Hero_Badge.png',       name: 'Grow Hero',             desc: 'Complete 2 books and grow your reading score', earned: s.totalBooks >= 2 && s.quizzes >= 2 },
    { img: '/public/Ultimate_Key_Badge.png',    name: 'Ultimate Key Reader',   desc: 'Earn 500 keys',                    earned: s.keys >= 500 },
  ];
}

function renderDashboardBadges() {
  const badges = getStudentBadges();
  return `
    <div class="dashboard-badges-section">
      <div class="dash-section-header">
        <h2 class="dash-section-title"><img src="/public/Orange_Star_Icon_.png" alt="">Badges</h2>
        <span class="dash-section-link" onclick="navigate('student-badges')">See all &rarr;</span>
      </div>
      <div class="dashboard-badge-grid">
        ${badges.map(b => `
          <div class="dashboard-badge-card${b.earned ? '' : ' locked'}" title="${b.desc}">
            <img class="dashboard-badge-img" src="${b.img}" alt="${b.name}">
            <div class="dashboard-badge-name">${b.name}</div>
            <div class="dashboard-badge-status ${b.earned ? 'earned' : 'locked-label'}">${b.earned ? 'Earned' : 'Locked'}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderStudentDashboard() {
  let s = {
    id: currentUser?.studentId || 0,
    name: currentUser?.name || 'Student',
    keys: currentUser?.keys_earned || 0,
    quizzes: currentUser?.quizzes_completed || 0,
    onboarded: currentUser?.onboarded || 0
  };
  const hasQuizzes = s.quizzes > 0;
  const displayBooks = showFavoritesOnly ? books.filter(b => studentFavorites.some(fid => Number(fid) === Number(b.id))) : books;

  // Weekly stats (fetched during loadApp)
  const w = currentUser?.weeklyStats || { keysThisWeek: 0, quizzesThisWeek: 0, booksCompletedThisWeek: 0 };

  // Weekly goals
  const WEEKLY_GOALS = { keys: 50, quizzes: 10, books: 2 };
  const keysPct = Math.min(Math.round((w.keysThisWeek / WEEKLY_GOALS.keys) * 100), 100);
  const quizPct = Math.min(Math.round((w.quizzesThisWeek / WEEKLY_GOALS.quizzes) * 100), 100);
  const bookPct = Math.min(Math.round((w.booksCompletedThisWeek / WEEKLY_GOALS.books) * 100), 100);

  return `
    <div class="page-header" style="margin-bottom:6px"><h1>Welcome${hasQuizzes ? ' back' : ''}, ${s.name.split(' ')[0]}!</h1></div>

    <div style="width:100%;border-radius:16px;overflow:hidden;margin-bottom:10px">
      <img src="/public/Dashboard_Banner_Update.png" alt="The KEY to growing your reading SKILLS!" style="width:100%;display:block">
    </div>

    ${!s.onboarded ? `<script>setTimeout(function(){ onboardingStudent=${s.id}; onboardingStep=0; openModal('onboarding'); }, 500);</script>` : ''}

    <div class="wins-badges-row">
      <div class="weekly-wins-combined">
        <div class="weekly-wins-header">
          <h3><img src="/public/Star_Icon_.png" alt="" style="width:56px;height:56px;object-fit:contain"> Weekly Wins</h3>
          <span class="wins-reset">Resets every Monday</span>
        </div>
        <div class="weekly-wins-chart">
          <div class="chart-icons-row">
            <div class="chart-column" onclick="showKeysBreakdown()">
              <img class="chart-col-icon" src="/public/Key_Circle_Icon.png" alt="Keys">
              <span class="chart-col-label">Keys Earned</span>
            </div>
            <div class="chart-column" onclick="showCompletedQuizzes()">
              <img class="chart-col-icon" src="/public/Quiz_Circle_Icon.png" alt="Quizzes">
              <span class="chart-col-label">Quizzes</span>
            </div>
            <div class="chart-column" onclick="showCompletedBooks()">
              <img class="chart-col-icon" src="/public/Book_Circle_Icon.png" alt="Books">
              <span class="chart-col-label">Books</span>
            </div>
          </div>
          <div class="chart-bars-row">
            <div class="chart-bar-wrap" onclick="showKeysBreakdown()">
              <div class="chart-bar bar-gold" style="height:${Math.max(keysPct, 22)}%">
                <span class="chart-bar-number">${w.keysThisWeek}</span>
              </div>
            </div>
            <div class="chart-bar-wrap" onclick="showCompletedQuizzes()">
              <div class="chart-bar bar-green" style="height:${Math.max(quizPct, 22)}%">
                <span class="chart-bar-number">${w.quizzesThisWeek}</span>
              </div>
            </div>
            <div class="chart-bar-wrap" onclick="showCompletedBooks()">
              <div class="chart-bar bar-coral" style="height:${Math.max(bookPct, 22)}%">
                <span class="chart-bar-number">${w.booksCompletedThisWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="badges-section-wrap">
        <div class="badges-combined-header">
          <h3><img src="/public/Badge_Icon.png" alt=""> Badges</h3>
          <span class="dash-section-link" onclick="navigate('student-badges')">See all &rarr;</span>
        </div>
        <div class="badges-combined" onclick="navigate('student-badges')" style="cursor:pointer">
          <div class="badges-compact-grid">
            ${getStudentBadges().sort((a, b) => b.earned - a.earned).slice(0, 6).map(b => `
              <div class="badge-compact${b.earned ? '' : ' locked'}" title="${b.name}">
                <img src="${b.img}" alt="${b.name}">
                ${!b.earned ? '<div class="badge-lock-overlay"><img src="/public/Lock_Icon_.png" alt="Locked"></div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    ${renderStoreSneak()}

    <div style="margin-top:24px">
      <div class="dash-section-header">
        <h2 class="dash-section-title">Browse Books</h2>
        <span style="color:var(--g500);font-size:0.8125rem" id="student-book-count">${displayBooks.length} books</span>
      </div>
      <div class="book-filter-toggle" style="margin-bottom:12px">
        <button class="book-filter-btn${!showFavoritesOnly ? ' active' : ''}" onclick="showFavoritesOnly=false; renderMain()">All Books</button>
        <button class="book-filter-btn${showFavoritesOnly ? ' active' : ''}" onclick="showFavoritesOnly=true; renderMain()">&#10084;&#65039; My Favorites</button>
      </div>
      <div style="position:relative;margin-bottom:16px">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--g400);pointer-events:none">${IC.search}</span>
        <input type="text" id="student-book-search" placeholder="Search books by title, author, or genre..."
          style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--g200);border-radius:var(--radius-md);font-size:0.875rem;outline:none;transition:border-color .2s"
          onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--g200)'">
      </div>
      <div class="book-grid" id="student-book-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
        ${displayBooks.length > 0 ? displayBooks.map(b => renderStudentBookCard(b)).join('') : showFavoritesOnly
          ? `<p style="grid-column:1/-1;color:var(--g500);text-align:center;padding:24px">No favorites yet! Tap the &#10084;&#65039; on any book to add it here.</p>`
          : `<p style="grid-column:1/-1;color:var(--g500);text-align:center;padding:24px">No books available yet.</p>`}
      </div>
    </div>
  `;
}

function renderStudentQuizzes() {
  let s = {
    id: currentUser?.studentId || 0,
    name: currentUser?.name || 'Student',
    keys: currentUser?.keys_earned || 0,
    quizzes: currentUser?.quizzes_completed || 0
  };
  const hasQuizzes = s.quizzes > 0;

  // Build book progress map: bookId → { completedChapters, totalChapters, isComplete }
  const progressMap = {};
  (currentUser?.bookProgress || []).forEach(p => { progressMap[p.bookId] = p; });

  // Books the student has started (at least one quiz)
  const startedBooks = books.filter(b => progressMap[b.id]);

  // Separate completed, incomplete, and favorite books
  const completedBooks = startedBooks.filter(b => progressMap[b.id]?.isComplete);
  const incompleteBooks = startedBooks.filter(b => !progressMap[b.id]?.isComplete);
  const favBooks = books.filter(b => studentFavorites.some(fid => Number(fid) === Number(b.id)));

  return `
    <div class="page-header"><h1>My Quizzes</h1></div>
    <div class="stat-cards" style="grid-template-columns: repeat(3, 1fr)">
      <div class="stat-card clickable-card" onclick="showCompletedQuizzes()" style="display:flex;align-items:center;gap:14px;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:linear-gradient(135deg,#dbeafe,#bfdbfe);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
        </div>
        <div><div class="stat-card-label">Quizzes</div><div class="stat-card-value">${s.quizzes}</div><div style="font-size:0.7rem;color:var(--blue);font-weight:600;margin-top:2px">Tap to view</div></div>
      </div>
      <div class="stat-card clickable-card" style="display:flex;align-items:center;gap:14px;cursor:pointer" onclick="document.getElementById('completed-books-section')?.scrollIntoView({behavior:'smooth'})">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:linear-gradient(135deg,#d1fae5,#a7f3d0);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div><div class="stat-card-label">Books</div><div class="stat-card-value">${completedBooks.length}</div><div style="font-size:0.7rem;color:#059669;font-weight:600;margin-top:2px">${completedBooks.length > 0 ? 'Completed' : 'None yet'}</div></div>
      </div>
      <div class="stat-card clickable-card" onclick="showKeysBreakdown()" style="display:flex;align-items:center;gap:14px;cursor:pointer">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:linear-gradient(135deg,#fef3c7,#fde68a);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px"><circle cx="8" cy="8" r="4"/><path d="M10.5 10.5L21 21"/><path d="M16 16l5 0"/><path d="M19 13l0 6"/></svg>
        </div>
        <div><div class="stat-card-label">Keys</div><div class="stat-card-value">${s.keys}</div><div style="font-size:0.7rem;color:var(--gold, #d97706);font-weight:600;margin-top:2px">Tap to view</div></div>
      </div>
    </div>

    ${incompleteBooks.length > 0 ? `
    <div style="margin-top:28px">
      <h3 style="margin:0 0 16px;font-size:1rem;font-weight:700">&#128218; Books That Still Need Completion</h3>
      <div class="book-progress-grid">
        ${incompleteBooks.map(b => {
          const prog = progressMap[b.id];
          return `
          <div class="book-progress-card" onclick="openBook(${b.id})" style="cursor:pointer">
            <div class="book-progress-cover">
              ${b.cover_url ? `<img src="${b.cover_url}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
              <div class="book-progress-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>
                <span>${b.title}</span>
              </div>
            </div>
            <div class="book-progress-info">
              <div class="book-progress-title">${b.title}</div>
              <div class="book-progress-status">${prog.completedChapters}/${prog.totalChapters} chapters</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    ${completedBooks.length > 0 ? `
    <div id="completed-books-section" style="margin-top:28px">
      <h3 style="margin:0 0 16px;font-size:1rem;font-weight:700">🏆 Completed Books</h3>
      <div class="book-progress-grid">
        ${completedBooks.map(b => {
          const certData = JSON.stringify({
            bookTitle: b.title || 'Book',
            bookAuthor: b.author || '',
            studentName: currentUser?.name || 'Student',
            coverUrl: b.cover_url || '',
            dateStr: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }).replace(/"/g, '&quot;');
          return `
          <div class="book-progress-card" style="cursor:pointer;position:relative">
            <div class="book-progress-cover" onclick="openBook(${b.id})">
              ${b.cover_url ? `<img src="${b.cover_url}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
              <div class="book-progress-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>
                <span>${b.title}</span>
              </div>
              <div class="book-completed-overlay">
                <div class="book-completed-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>COMPLETED</span>
                </div>
              </div>
            </div>
            <div class="book-progress-info">
              <div class="book-progress-title">${escapeHtml(b.title)}</div>
              <div style="display:flex;gap:6px;margin-top:4px">
                <button class="btn btn-sm btn-primary" style="font-size:0.7rem;padding:3px 8px" data-cert="${certData}" onclick="event.stopPropagation();downloadCertificatePDF(JSON.parse(this.dataset.cert))">📥 PDF</button>
                <button class="btn btn-sm btn-outline" style="font-size:0.7rem;padding:3px 8px" data-cert="${certData}" onclick="event.stopPropagation();printCertificate(JSON.parse(this.dataset.cert))">🖨️ Print</button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    ${(() => {
      if (favBooks.length > 0) {
        return `<div style="margin-top:28px">
          <h3 style="margin:0 0 16px;font-size:1rem;font-weight:700">&#10084;&#65039; My Favorites</h3>
          <div class="book-progress-grid">
            ${favBooks.map(b => {
              const prog = progressMap[b.id];
              const isComplete = prog && prog.isComplete;
              const hasProgress = !!prog;
              return `
              <div class="book-progress-card" onclick="openBook(${b.id})" style="cursor:pointer">
                <div class="book-progress-cover">
                  ${b.cover_url ? `<img src="${b.cover_url}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                  <div class="book-progress-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>
                    <span>${b.title}</span>
                  </div>
                  ${isComplete ? `
                  <div class="book-completed-overlay">
                    <div class="book-completed-badge">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>COMPLETED</span>
                    </div>
                  </div>` : ''}
                </div>
                <div class="book-progress-info">
                  <div class="book-progress-title">${b.title}</div>
                  <div class="book-progress-status">${isComplete ? '&#9989; All done!' : hasProgress ? `${prog.completedChapters}/${prog.totalChapters} chapters` : 'Not started'}</div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      } else {
        return `<div style="margin-top:20px;padding:20px;background:var(--blue-p);border-radius:var(--radius-md);text-align:center;color:var(--g500);font-size:0.875rem">
          Tap the &#10084;&#65039; on any book to add it to your favorites!
        </div>`;
      }
    })()}

    ${assignments.length > 0 ? `
    <div class="list-card" style="margin-top:24px">
      <div style="padding:16px 20px;border-bottom:1px solid var(--g150);font-weight:700;color:var(--navy)">Assigned To You</div>
      ${assignments.map(a => `
        <div class="list-item">
          <div class="list-item-info">
            <span class="list-item-name">${a.name}</span>
            <span class="list-item-sub">Due: ${a.due || 'No due date'}</span>
          </div>
          <div class="list-item-right" style="display:flex;align-items:center;gap:12px">
            ${statusPill(a.status)}
          </div>
        </div>
      `).join('')}
    </div>` : !hasQuizzes ? `
    <div class="empty-state" style="margin-top:24px">
      <div class="empty-state-icon" style="font-size:2rem">&#128203;</div>
      <h2>No Quizzes Yet</h2>
      <p>Browse the book in your library to see and take a quiz!</p>
      <button class="btn btn-primary" onclick="navigate('library')">Go to Library</button>
    </div>` : ''}
  `;
}

function renderStudentProgress() {
  let s = {
    id: currentUser?.studentId || 0,
    name: currentUser?.name || 'Student',
    keys: currentUser?.keys_earned || 0,
    quizzes: currentUser?.quizzes_completed || 0
  };
  const hasQuizzes = s.quizzes > 0;

  const w = currentUser?.weeklyStats || { keysThisWeek: 0, quizzesThisWeek: 0, booksCompletedThisWeek: 0 };
  const totalBooksCompleted = currentUser?.totalBooksCompleted || 0;
  const totalKeysEarned = currentUser?.weeklyStats?.totalKeysEarned || s.keys;

  return `
    <div class="page-header"><h1>My Reading Progress</h1></div>

    <div class="weekly-wins-section">
      <div class="weekly-wins-header">
        <h2 class="weekly-wins-title"><img src="/public/Teal_Star_Icon_.png" alt="" style="width:40px;height:40px;object-fit:contain;vertical-align:middle;margin-right:8px">Weekly Wins</h2>
        <span class="weekly-wins-reset">Resets every Monday</span>
      </div>
      <div class="weekly-wins-cards">
        <div class="weekly-win-card weekly-win-keys" onclick="showKeysBreakdown()">
          <div class="weekly-win-emoji"><img src="/public/Key_Icon.png" alt="Keys" style="width:56px;height:56px;object-fit:contain"></div>
          <div class="weekly-win-value">${w.keysThisWeek}</div>
          <div class="weekly-win-label">Keys Earned</div>
        </div>
        <div class="weekly-win-card weekly-win-quizzes" onclick="showCompletedQuizzes()">
          <div class="weekly-win-emoji"><img src="/public/Paper_Icon_.png" alt="Quizzes" style="width:36px;height:36px;object-fit:contain"></div>
          <div class="weekly-win-value">${w.quizzesThisWeek}</div>
          <div class="weekly-win-label">Quizzes Done</div>
        </div>
        <div class="weekly-win-card weekly-win-books" onclick="showCompletedBooks()">
          <div class="weekly-win-emoji"><img src="/public/Red_Book_Icon_.png" alt="Books" style="width:36px;height:36px;object-fit:contain"></div>
          <div class="weekly-win-value">${w.booksCompletedThisWeek}</div>
          <div class="weekly-win-label">Books Finished</div>
        </div>
      </div>
    </div>

    <div class="total-progress-section" style="margin-top:24px">
      <h3 class="total-progress-title"><img src="/public/Star_Icon_.png" alt="" style="width:28px;height:28px;object-fit:contain;vertical-align:middle;margin-right:6px">Total Progress</h3>
      <div class="total-progress-cards">
        <div class="total-progress-card" onclick="showKeysBreakdown()" style="cursor:pointer">
          <span class="total-progress-value">${totalKeysEarned}</span>
          <span class="total-progress-label">Total Keys</span>
          <span class="total-progress-desc">All the keys you've ever earned from quizzes. This number only goes up!</span>
        </div>
        <div class="total-progress-card" onclick="navigate('store')" style="cursor:pointer">
          <span class="total-progress-value" style="color:#D97706">${s.keys}</span>
          <span class="total-progress-label">Keys to Spend</span>
          <span class="total-progress-desc">Keys you have left to use in the class store. Goes down when you buy rewards!</span>
        </div>
        <div class="total-progress-card" onclick="showCompletedQuizzes()" style="cursor:pointer">
          <span class="total-progress-value">${s.quizzes}</span>
          <span class="total-progress-label">Total Quizzes</span>
        </div>
        <div class="total-progress-card" onclick="showCompletedBooks()" style="cursor:pointer">
          <span class="total-progress-value">${totalBooksCompleted}</span>
          <span class="total-progress-label">Total Books</span>
        </div>
      </div>
    </div>

  `;
}

function renderStudentBadges() {
  const badges = getStudentBadges();
  const earnedCount = badges.filter(b => b.earned).length;
  return `
    <div class="page-header">
      <h1><img src="/public/Badge_Icon.png" alt="" style="width:48px;height:48px;object-fit:contain;vertical-align:middle;margin-right:8px">My Badges</h1>
      <span style="font-size:1rem;color:var(--g500);font-weight:600">${earnedCount} / ${badges.length} earned</span>
    </div>
    <div class="all-badges-grid">
      ${badges.map((b, i) => `
        <div class="all-badge-card${b.earned ? ' earned' : ' locked'}" onclick="showBadgeDetail(${i})">
          <div class="all-badge-img-wrap">
            <img src="${b.img}" alt="${b.name}">
            ${!b.earned ? '<div class="all-badge-lock"><img src="/public/Lock_Icon_.png" alt="Locked"></div>' : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showBadgeDetail(idx) {
  const badges = getStudentBadges();
  const b = badges[idx];
  if (!b) return;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()" style="max-width:380px">
        <div class="modal-header">
          <h3>${b.name}</h3>
          <button class="modal-close" onclick="closeModal()">${IC.x}</button>
        </div>
        <div class="modal-body" style="text-align:center;padding:24px">
          <div style="position:relative;display:inline-block;margin-bottom:16px">
            <img src="${b.img}" alt="${b.name}" style="width:140px;height:140px;object-fit:contain;${b.earned ? '' : 'opacity:0.4;filter:grayscale(1);'}">
            ${!b.earned ? '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"><img src="/public/Lock_Icon_.png" alt="Locked" style="width:48px;height:48px;object-fit:contain"></div>' : ''}
          </div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--navy);margin-bottom:8px">${b.name}</div>
          <div style="font-size:0.9rem;color:var(--g500);margin-bottom:16px;line-height:1.5">${b.desc}</div>
          ${b.earned ? '<div style="display:inline-block;padding:8px 20px;border-radius:999px;font-size:0.875rem;font-weight:700;background:#ECFDF5;color:#059669">✅ Badge Earned!</div>' : ''}
        </div>
      </div>
    </div>`;
}

// ---- Badge Earned Popup ----
function showBadgeEarnedPopup(badge) {
  const modal = document.getElementById('modal-root');
  modal.innerHTML = '<div class="modal-overlay" onclick="closeModal(event)" style="display:flex;align-items:center;justify-content:center;padding:20px">' +
    '<div class="modal" onclick="event.stopPropagation()" style="max-width:380px;width:100%;text-align:center;overflow:visible;margin:0 auto">' +
      '<div class="modal-body" style="padding:32px">' +
        '<div style="font-size:3rem;margin-bottom:8px">🎉</div>' +
        '<div style="font-size:1.4rem;font-weight:800;color:var(--navy);margin-bottom:4px;font-family:var(--font-display)">Congratulations!</div>' +
        '<div style="font-size:1rem;color:var(--g500);margin-bottom:16px">You earned a new badge!</div>' +
        '<div style="position:relative;display:flex;justify-content:center;margin-bottom:16px">' +
          '<img src="' + badge.img + '" alt="' + badge.name + '" style="width:160px;height:160px;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2))">' +
        '</div>' +
        '<div style="font-size:1.15rem;font-weight:800;color:var(--purple);margin-bottom:6px">' + badge.name + '</div>' +
        '<div style="font-size:0.9rem;color:var(--g500);margin-bottom:24px;line-height:1.5">' + badge.desc + '</div>' +
        '<button class="btn btn-primary" onclick="closeModal()" style="min-width:160px;font-size:1rem;padding:12px 24px">Awesome!</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// Track which badges have been shown this session to avoid re-showing
var _shownBadges = {};

function checkAndShowNewBadges() {
  var badges = getStudentBadges();
  var newlyEarned = badges.filter(function(b) { return b.earned && !_shownBadges[b.name]; });
  // Mark all currently earned badges as shown
  badges.forEach(function(b) { if (b.earned) _shownBadges[b.name] = true; });
  // Show popup for first newly earned badge (with delay to not overlap quiz results)
  if (newlyEarned.length > 0) {
    var queue = newlyEarned.slice();
    function showNext() {
      if (queue.length === 0) return;
      var badge = queue.shift();
      showBadgeEarnedPopup(badge);
      // If multiple badges, show the next one after this modal closes
      if (queue.length > 0) {
        var origClose = window.closeModal;
        window.closeModal = function(e) {
          origClose(e);
          window.closeModal = origClose;
          setTimeout(showNext, 400);
        };
      }
    }
    setTimeout(showNext, 1500);
  }
}

// Initialize shown badges on load so we don't re-trigger for existing badges
function initShownBadges() {
  try {
    var badges = getStudentBadges();
    badges.forEach(function(b) { if (b.earned) _shownBadges[b.name] = true; });
  } catch(e) {}
}

// ============================================================
// ---- PRINCIPAL DASHBOARD PAGES ----
// ============================================================

function renderPrincipalDashboard() {
  const totalStudents = students.length;
  const avgScore = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.score || 0), 0) / totalStudents) : 0;
  const avgAccuracy = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.accuracy || 0), 0) / totalStudents) : 0;
  const totalKeys = students.reduce((a, s) => a + (s.keys || 0), 0);

  const classes = [
    { name: "Sarah Johnson's 4th Grade", teacher: 'Sarah Johnson', students: 10, avgScore: avgScore, code: 'SARAH4' },
    { name: "Mike Rivera's 3rd Grade", teacher: 'Mike Rivera', students: 22, avgScore: 612, code: 'MIKE3R' },
    { name: "Emily Chen's 5th Grade", teacher: 'Emily Chen', students: 18, avgScore: 738, code: 'EMILY5' },
    { name: "Lisa Park's 4th Grade", teacher: 'Lisa Park', students: 20, avgScore: 695, code: 'LISAP4' },
  ];

  return `
    <div class="page-header">
      <h1>School Dashboard</h1>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="navigate('reports')">${IC.chart} View Growth Reports</button>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-label">Total Students</div><div class="stat-card-value">${totalStudents + 60}</div></div>
      <div class="stat-card"><div class="stat-card-label">Average Reading Score</div><div class="stat-card-value">${avgScore}</div><div class="stat-card-trend" style="color:var(--green)"><span class="icon-sm">${IC.arrowUp}</span> +14%</div></div>
      <div class="stat-card"><div class="stat-card-label">Active Teachers</div><div class="stat-card-value">4</div></div>
      <div class="stat-card"><div class="stat-card-label">Total Keys Earned</div><div class="stat-card-value">${(totalKeys + 12500).toLocaleString()}</div></div>
    </div>

    <div class="list-card" style="margin-top:24px">
      <div style="padding:16px 20px;border-bottom:1px solid var(--g150);display:flex;align-items:center;justify-content:space-between">
        <span style="font-weight:700;color:var(--navy)">Classes Overview</span>
        <button class="btn btn-sm btn-outline" onclick="navigate('principal-classes')">View All</button>
      </div>
      <table class="data-table">
        <thead><tr><th>CLASS</th><th>TEACHER</th><th>STUDENTS</th><th>AVG SCORE</th><th>STATUS</th></tr></thead>
        <tbody>
          ${classes.map(c => {
            const status = c.avgScore >= 700 ? 'Excellent' : c.avgScore >= 600 ? 'Good' : 'Needs Attention';
            const statusCls = c.avgScore >= 700 ? 'green' : c.avgScore >= 600 ? 'blue' : 'red';
            return `<tr onclick="navigate('principal-classes')" style="cursor:pointer">
              <td><strong>${c.name}</strong></td>
              <td>${c.teacher}</td>
              <td>${c.students}</td>
              <td><strong>${c.avgScore}</strong></td>
              <td><span class="badge badge-${statusCls}">${status}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px">
      <div class="list-card" style="padding:24px">
        <h3 style="margin-bottom:16px">Recent Activity</h3>
        ${['Sarah Johnson assigned Charlotte\'s Web quiz', 'Mike Rivera completed Winter Reading Benchmark', 'Emily Chen added 3 new students', 'Lisa Park assigned February Mystery Challenge'].map((a, i) => `
          <div style="padding:8px 0;border-bottom:1px solid var(--g100);font-size:0.875rem;color:var(--g600)"><span style="color:var(--g400);font-size:0.75rem">${i + 1}h ago</span> &mdash; ${a}</div>
        `).join('')}
      </div>
      <div class="list-card" style="padding:24px">
        <h3 style="margin-bottom:16px">Quick Insights</h3>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="padding:12px;background:var(--green-p, #ECFDF5);border-radius:var(--radius-sm);font-size:0.875rem"><strong style="color:var(--green)">School Average Up 14%</strong><br><span style="color:var(--g600)">Reading scores improving across all grades</span></div>
          <div style="padding:12px;background:var(--blue-p);border-radius:var(--radius-sm);font-size:0.875rem"><strong style="color:var(--blue)">70 Students Active This Week</strong><br><span style="color:var(--g600)">92% participation rate</span></div>
          <div style="padding:12px;background:var(--gold-p);border-radius:var(--radius-sm);font-size:0.875rem"><strong style="color:var(--gold)">16,500 Keys Earned</strong><br><span style="color:var(--g600)">Students are highly engaged with the reward system</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalClasses() {
  const classes = [
    { name: "Sarah Johnson's 4th Grade", teacher: 'Sarah Johnson', students: 10, avgScore: 674, accuracy: 81, books: 48, code: 'SARAH4' },
    { name: "Mike Rivera's 3rd Grade", teacher: 'Mike Rivera', students: 22, avgScore: 612, accuracy: 76, books: 35, code: 'MIKE3R' },
    { name: "Emily Chen's 5th Grade", teacher: 'Emily Chen', students: 18, avgScore: 738, accuracy: 85, books: 62, code: 'EMILY5' },
    { name: "Lisa Park's 4th Grade", teacher: 'Lisa Park', students: 20, avgScore: 695, accuracy: 79, books: 44, code: 'LISAP4' },
  ];

  return `
    <div class="page-header"><h1>All Classes <span class="badge badge-blue">${classes.length}</span></h1></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      ${classes.map(c => `
        <div class="stat-card" style="padding:24px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div>
              <div style="font-weight:700;color:var(--navy)">${c.name}</div>
              <div style="font-size:0.8125rem;color:var(--g500)">${c.teacher} &bull; ${c.students} students</div>
            </div>
            <span class="badge badge-blue">Code: ${c.code}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;text-align:center">
            <div><div style="font-size:1.25rem;font-weight:700;color:var(--navy)">${c.avgScore}</div><div style="font-size:0.7rem;color:var(--g500)">Avg Score</div></div>
            <div><div style="font-size:1.25rem;font-weight:700;color:var(--navy)">${c.accuracy}%</div><div style="font-size:0.7rem;color:var(--g500)">Accuracy</div></div>
            <div><div style="font-size:1.25rem;font-weight:700;color:var(--navy)">${c.books}</div><div style="font-size:0.7rem;color:var(--g500)">Books</div></div>
            <div><div style="font-size:1.25rem;font-weight:700;color:var(--navy)">${c.students}</div><div style="font-size:0.7rem;color:var(--g500)">Students</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPrincipalTeachers() {
  const teachers = [
    { name: 'Sarah Johnson', grade: '4th', students: 10, avgScore: 674, classes: 1, initials: 'SJ', color: '#2563EB' },
    { name: 'Mike Rivera',   grade: '3rd', students: 22, avgScore: 612, classes: 1, initials: 'MR', color: '#F59E0B' },
    { name: 'Emily Chen',    grade: '5th', students: 18, avgScore: 738, classes: 1, initials: 'EC', color: '#10B981' },
    { name: 'Lisa Park',     grade: '4th', students: 20, avgScore: 695, classes: 1, initials: 'LP', color: '#8B5CF6' },
  ];

  return `
    <div class="page-header"><h1>Teachers <span class="badge badge-blue">${teachers.length}</span></h1></div>
    <div class="list-card">
      <table class="data-table">
        <thead><tr><th>TEACHER</th><th>GRADE</th><th>STUDENTS</th><th>AVG READING SCORE</th><th>STATUS</th></tr></thead>
        <tbody>
          ${teachers.map(t => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar-sm" style="background:${t.color}">${t.initials}</div><strong>${t.name}</strong></div></td>
              <td>${t.grade} Grade</td>
              <td>${t.students}</td>
              <td><strong>${t.avgScore}</strong></td>
              <td><span class="badge badge-green">Active</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPrincipalSettings() {
  return `
    <div class="page-header"><h1>School Settings</h1></div>
    <div class="list-card" style="padding:24px;max-width:600px">
      <h3 style="margin-bottom:20px">School Information</h3>
      <div class="auth-form" style="display:flex;flex-direction:column;gap:18px">
        <div class="form-group">
          <label class="form-label">School Name</label>
          <input type="text" class="form-input" value="${currentUser?.school || 'Lincoln Elementary'}">
        </div>
        <div class="form-group">
          <label class="form-label">District</label>
          <input type="text" class="form-input" value="Westfield Unified School District">
        </div>
        <div class="form-group">
          <label class="form-label">Principal Email</label>
          <input type="text" class="form-input" value="${currentUser?.email || 'principal@school.edu'}">
        </div>
        <button class="btn btn-primary" style="align-self:flex-start">Save Changes</button>
      </div>
    </div>
  `;
}

// ---- Owner Dashboard ----
function renderOwnerDashboard() {
  // SVG Pie Chart for genre distribution
  const genreColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'];
  const totalGenreCount = ownerGenres.reduce((sum, g) => sum + g.count, 0) || 1;

  let pieSlices = '';
  let pieLegend = '';
  let cumulativePercent = 0;

  ownerGenres.filter(g => g.genre && g.genre !== 'Not Set').slice(0, 8).forEach((g, i) => {
    const percent = g.count / totalGenreCount;
    const startAngle = cumulativePercent * 2 * Math.PI - Math.PI / 2;
    const endAngle = (cumulativePercent + percent) * 2 * Math.PI - Math.PI / 2;
    const largeArc = percent > 0.5 ? 1 : 0;
    const x1 = 100 + 80 * Math.cos(startAngle);
    const y1 = 100 + 80 * Math.sin(startAngle);
    const x2 = 100 + 80 * Math.cos(endAngle);
    const y2 = 100 + 80 * Math.sin(endAngle);
    const color = genreColors[i % genreColors.length];

    if (percent > 0.001) {
      pieSlices += `<path d="M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" opacity="0.85"/>`;
    }
    pieLegend += `<div class="chart-legend-item"><span class="chart-legend-dot" style="background:${color}"></span>${g.genre} <span style="color:var(--g400);margin-left:auto">${g.count}</span></div>`;
    cumulativePercent += percent;
  });

  // If no data, show a full circle placeholder
  if (ownerGenres.filter(g => g.genre && g.genre !== 'Not Set').length === 0) {
    pieSlices = `<circle cx="100" cy="100" r="80" fill="var(--g100)"/>`;
    pieLegend = '<div style="color:var(--g400);font-size:0.875rem;text-align:center;padding:20px">No genre data yet. Students will set their favorite genres during onboarding.</div>';
  }

  // Bar chart: students per teacher
  const maxStudents = Math.max(...ownerTeachers.map(t => t.studentCount), 1);
  const barChartRows = ownerTeachers.slice(0, 10).map(t => {
    const barWidth = Math.round((t.studentCount / maxStudents) * 100);
    return `<div class="bar-chart-row">
      <span class="bar-chart-label">${t.name.split(' ')[0]}</span>
      <div class="bar-chart-track"><div class="bar-chart-fill" style="width:${barWidth}%"></div></div>
      <span class="bar-chart-value">${t.studentCount}</span>
    </div>`;
  }).join('');

  return `
    <div class="page-header">
      <h1>Platform Dashboard</h1>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">Total Students</div>
        <div class="stat-card-value">${ownerStats.totalStudents}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Teachers</div>
        <div class="stat-card-value">${ownerStats.totalTeachers}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Quizzes Taken</div>
        <div class="stat-card-value">${ownerStats.totalQuizzes}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Classes</div>
        <div class="stat-card-value">${ownerStats.totalClasses}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px">
      <div class="list-card" style="padding:24px">
        <h3 style="margin-bottom:16px">Favorite Genres</h3>
        <div style="display:flex;align-items:flex-start;gap:24px">
          <svg viewBox="0 0 200 200" width="180" height="180" style="flex-shrink:0">${pieSlices}</svg>
          <div class="chart-legend">${pieLegend}</div>
        </div>
      </div>
      <div class="list-card" style="padding:24px">
        <h3 style="margin-bottom:16px">Students per Teacher</h3>
        ${barChartRows || '<div style="color:var(--g400);font-size:0.875rem;text-align:center;padding:20px">No teachers yet.</div>'}
      </div>
    </div>
  `;
}

function renderOwnerTeachers() {
  if (ownerTeachers.length === 0) {
    return `
      <div class="page-header"><h1>Teachers</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.user}</div>
        <h3>No Teachers Yet</h3>
        <p>Teachers will appear here when they sign up.</p>
      </div>`;
  }

  return `
    <div class="page-header"><h1>Teachers <span class="badge badge-blue">${ownerTeachers.length}</span></h1></div>
    <div class="list-card">
      <table class="data-table">
        <thead><tr><th>TEACHER</th><th>EMAIL</th><th>GRADE</th><th>STUDENTS</th><th>CLASS CODE</th><th>JOINED</th></tr></thead>
        <tbody>
          ${ownerTeachers.map(t => {
            const initials = t.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const joined = t.created_at ? new Date(t.created_at).toLocaleDateString() : '-';
            return `<tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar-sm" style="background:#2563EB">${initials}</div><strong>${t.name}</strong></div></td>
              <td style="color:var(--g500)">${t.email || '-'}</td>
              <td>${t.grade} Grade</td>
              <td>${t.studentCount}</td>
              <td><code style="background:var(--g50);padding:2px 8px;border-radius:4px;font-size:0.8125rem">${t.classCode}</code></td>
              <td style="color:var(--g400);font-size:0.8125rem">${joined}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderOwnerStudents() {
  if (ownerStudents.length === 0) {
    return `
      <div class="page-header"><h1>Students</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.users}</div>
        <h3>No Students Yet</h3>
        <p>Students will appear here when they join a class.</p>
      </div>`;
  }

  return `
    <div class="page-header"><h1>Students <span class="badge badge-green">${ownerStudents.length}</span></h1></div>
    <div class="list-card">
      <table class="data-table">
        <thead><tr><th>STUDENT</th><th>CLASS</th><th>TEACHER</th><th>READING SCORE</th><th>ACCURACY</th><th>QUIZZES</th><th>GENRE</th></tr></thead>
        <tbody>
          ${ownerStudents.map(s => {
            const initials = s.initials || s.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            const scoreLabel = s.reading_score >= 700 ? 'green' : s.reading_score >= 500 ? 'blue' : 'red';
            return `<tr>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar-sm" style="background:${s.color || '#2563EB'}">${initials}</div><strong>${s.name}</strong></div></td>
              <td>${s.className || '-'}</td>
              <td>${s.teacherName || '-'}</td>
              <td><span class="badge badge-${scoreLabel}">${s.reading_score}</span></td>
              <td>${s.accuracy}%</td>
              <td>${s.quizzes_completed}</td>
              <td>${s.favorite_genre || '<span style="color:var(--g300)">-</span>'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderOwnerSettings() {
  return `
    <div class="page-header"><h1>Settings</h1></div>
    <div class="list-card" style="padding:24px;max-width:600px">
      <h3 style="margin-bottom:20px">Owner Account</h3>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div>
          <span style="font-weight:600;color:var(--navy)">Email</span>
          <p style="color:var(--g500);margin-top:2px">${currentUser?.email || '-'}</p>
        </div>
        <div>
          <span style="font-weight:600;color:var(--navy)">Role</span>
          <p style="color:var(--g500);margin-top:2px">Platform Owner</p>
        </div>
        <div>
          <span style="font-weight:600;color:var(--navy)">Platform Stats</span>
          <p style="color:var(--g500);margin-top:2px">${ownerStats.totalTeachers} teachers, ${ownerStats.totalStudents} students, ${ownerStats.totalClasses} classes</p>
        </div>
      </div>
    </div>
  `;
}

// ---- Owner: Reward Gallery Management ----
let galleryAdding = false;
let galleryNewPreview = null;

function renderOwnerGallery() {
  return `
    <div class="page-header">
      <h1>Reward Gallery <span class="badge badge-gold">${rewardGallery.length}</span></h1>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="galleryAdding=true; galleryNewPreview=null; renderMain()">${IC.plus} Add Image</button>
      </div>
    </div>

    <div class="info-panel" style="margin-bottom:20px">
      <h4>${IC.info} Reward Image Gallery</h4>
      <p>Upload images here for teachers to use as reward icons in their Class Store. Teachers can choose from these images when creating store rewards (stickers, badges, prizes, etc).</p>
    </div>

    ${galleryAdding ? `
    <div class="store-edit-card" style="background:#fff;border:2px solid var(--blue);border-radius:var(--radius-md);padding:20px;margin-bottom:16px">
      <h4 style="margin-bottom:12px;font-size:0.9375rem;font-weight:600;color:var(--g900)">Upload New Image</h4>
      <div style="display:flex;gap:16px;align-items:end">
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Image</label>
          <div style="position:relative;width:80px;height:80px;border:2px dashed var(--g300);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;background:var(--g50)" onclick="document.getElementById('gallery-new-file').click()">
            ${galleryNewPreview
              ? `<img src="${galleryNewPreview}" style="width:100%;height:100%;object-fit:cover">`
              : `<span style="font-size:2rem;color:var(--g400)">+</span>`}
            <input id="gallery-new-file" type="file" accept="image/*" style="display:none" onchange="galleryPreviewNew(this)">
          </div>
        </div>
        <div style="flex:1">
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Name</label>
          <input id="gallery-new-name" type="text" placeholder="e.g. Gold Star Sticker" style="width:100%;padding:8px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
        </div>
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Category</label>
          <select id="gallery-new-category" style="padding:8px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
            <option value="stickers">Stickers</option>
            <option value="badges">Badges</option>
            <option value="prizes">Prizes</option>
            <option value="general">General</option>
          </select>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="galleryAddItem()">Upload</button>
          <button class="btn btn-ghost btn-sm" onclick="galleryAdding=false; galleryNewPreview=null; renderMain()">Cancel</button>
        </div>
      </div>
    </div>` : ''}

    ${rewardGallery.length === 0 ? `
      <div style="padding:48px;text-align:center;color:var(--g400)">
        <p>No images in the gallery yet. Click "Add Image" to upload reward icons for teachers to use.</p>
      </div>` : `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px">
        ${rewardGallery.map(g => `
          <div style="background:#fff;border:1.5px solid var(--g200);border-radius:var(--radius-md);padding:12px;text-align:center;position:relative">
            <img src="${escapeHtml(g.image_url)}" alt="${escapeHtml(g.name)}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:8px">
            <div style="font-size:0.8125rem;font-weight:600;color:var(--g700);margin-bottom:2px">${escapeHtml(g.name)}</div>
            <div style="font-size:0.6875rem;color:var(--g400);text-transform:capitalize;margin-bottom:8px">${g.category || 'general'}</div>
            <button class="btn btn-sm btn-ghost" onclick="galleryRemoveItem(${g.id})" style="color:var(--red);font-size:0.75rem">${IC.x} Remove</button>
          </div>
        `).join('')}
      </div>`}
  `;
}

function galleryPreviewNew(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    resizeImage(e.target.result, 200, 200, (resized) => {
      galleryNewPreview = resized;
      renderMain();
    });
  };
  reader.readAsDataURL(file);
}

async function galleryAddItem() {
  const name = document.getElementById('gallery-new-name')?.value?.trim();
  const category = document.getElementById('gallery-new-category')?.value || 'general';
  if (!name) { alert('Please enter a name for this image.'); return; }
  if (!galleryNewPreview) { alert('Please select an image to upload.'); return; }

  try {
    const item = await API.addRewardGallery({ name, imageData: galleryNewPreview, category });
    if (item) {
      rewardGallery.push(item);
    }
  } catch(e) {
    alert('Failed to upload image. Please try again.');
    return;
  }

  galleryAdding = false;
  galleryNewPreview = null;
  renderMain();
  renderSidebar(); // Update badge count
}

async function galleryRemoveItem(id) {
  if (!confirm('Remove this image from the gallery? Teachers who are already using it will keep their existing store items.')) return;
  try {
    await API.deleteRewardGallery(id);
    rewardGallery = rewardGallery.filter(g => g.id !== id);
  } catch(e) {
    alert('Failed to remove image.');
  }
  renderMain();
  renderSidebar();
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  // Detect user role from session
  try {
    const me = await API.getMe();
    if (me.user) {
      currentUser = me.user;
      userRole = me.user.role || 'teacher';
    } else {
      // Not logged in — try auto-login from saved remember-me credentials
      let reauthed = false;
      const savedCreds = localStorage.getItem('k2r_remember_creds');
      if (savedCreds) {
        try {
          const creds = JSON.parse(atob(savedCreds));
          if (creds.email && creds.password && creds.role) {
            const result = await API.login({ email: creds.email, password: creds.password, role: creds.role, rememberMe: true });
            if (result.user) { currentUser = result.user; userRole = result.user.role || 'teacher'; reauthed = true; }
          }
        } catch(e2) { localStorage.removeItem('k2r_remember_creds'); }
      }
      // Try student auto-login
      if (!reauthed) {
        const savedName = localStorage.getItem('k2r_student_name');
        const savedCode = localStorage.getItem('k2r_student_classcode');
        if (savedName && savedCode) {
          try {
            const result = await API.login({ name: savedName, classCode: savedCode, role: 'student' });
            if (result.user) { currentUser = result.user; userRole = result.user.role || 'student'; reauthed = true; }
          } catch(e2) { localStorage.removeItem('k2r_student_name'); localStorage.removeItem('k2r_student_classcode'); }
        }
      }
      // Try child auto-login
      if (!reauthed) {
        const savedChildName = localStorage.getItem('k2r_child_name');
        const savedFamilyCode = localStorage.getItem('k2r_child_familycode');
        if (savedChildName && savedFamilyCode) {
          try {
            const result = await API.login({ name: savedChildName, classCode: savedFamilyCode, role: 'child' });
            if (result.user) { currentUser = result.user; userRole = result.user.role || 'student'; reauthed = true; }
          } catch(e2) { localStorage.removeItem('k2r_child_name'); localStorage.removeItem('k2r_child_familycode'); }
        }
      }
      if (!reauthed) { userRole = 'guest'; currentUser = null; }
    }
  } catch(e) {
    // API error — try auto-login from saved credentials before falling to guest
    let reauthed = false;
    const savedCreds = localStorage.getItem('k2r_remember_creds');
    if (savedCreds) {
      try {
        const creds = JSON.parse(atob(savedCreds));
        if (creds.email && creds.password && creds.role) {
          const result = await API.login({ email: creds.email, password: creds.password, role: creds.role, rememberMe: true });
          if (result.user) { currentUser = result.user; userRole = result.user.role || 'teacher'; reauthed = true; }
        }
      } catch(e2) { localStorage.removeItem('k2r_remember_creds'); }
    }
    if (!reauthed) {
      const savedName = localStorage.getItem('k2r_student_name');
      const savedCode = localStorage.getItem('k2r_student_classcode');
      if (savedName && savedCode) {
        try {
          const result = await API.login({ name: savedName, classCode: savedCode, role: 'student' });
          if (result.user) { currentUser = result.user; userRole = result.user.role || 'student'; reauthed = true; }
        } catch(e2) { localStorage.removeItem('k2r_student_name'); localStorage.removeItem('k2r_student_classcode'); }
      }
    }
    if (!reauthed) {
      const savedChildName = localStorage.getItem('k2r_child_name');
      const savedFamilyCode = localStorage.getItem('k2r_child_familycode');
      if (savedChildName && savedFamilyCode) {
        try {
          const result = await API.login({ name: savedChildName, classCode: savedFamilyCode, role: 'child' });
          if (result.user) { currentUser = result.user; userRole = result.user.role || 'student'; reauthed = true; }
        } catch(e2) { localStorage.removeItem('k2r_child_name'); localStorage.removeItem('k2r_child_familycode'); }
      }
    }
    if (!reauthed) { userRole = 'guest'; currentUser = null; }
  }

  // Load books from API and sort: Book 1 first (randomized), then rest (randomized)
  try {
    books = await API.getBooks();
    books = sortBooksForDisplay(books);
  } catch(e) { console.warn('Could not load books:', e); }

  // Guest mode — skip teacher/student data loading
  if (userRole === 'guest') {
    // Check for deep-link from landing page search (e.g. ?book=56)
    const params = new URLSearchParams(window.location.search);
    const bookParam = params.get('book');
    if (bookParam) {
      page = 'book-detail';
      renderSidebar();
      renderHeader();
      openBook(parseInt(bookParam));
      return;
    }
    page = 'guest-browse';
    renderSidebar();
    renderHeader();
    renderMain();
    return;
  }

  // Load class code for teachers
  if (userRole === 'teacher' && currentUser) {
    try {
      const codeData = await API.getClassCode();
      if (codeData.classCode) {
        currentUser.classCode = codeData.classCode;
        currentUser.className = codeData.className;
      }
    } catch(e) { /* no class yet */ }

    // Load students for this teacher's class
    if (currentUser.classId) {
      try {
        const rawStudents = await API.getStudents(currentUser.classId);
        students = rawStudents.filter(s => !s.is_teacher_demo).map(mapStudentFromAPI);
      } catch(e) { console.warn('Could not load students:', e); }

      // Fetch class analytics and merge into student records for the Students table
      try {
        const analytics = await API.getClassAnalytics(currentUser.classId);
        if (analytics && analytics.length > 0) {
          const analyticsMap = {};
          for (const a of analytics) { analyticsMap[a.id] = a; }
          for (const s of students) {
            const a = analyticsMap[s.id];
            if (a) {
              // Sync the reading score from live analytics
              if (a.readingScore) s.score = a.readingScore;
              if (s._raw) {
                s._raw.comprehension_label = a.comprehension !== 'No Data' ? a.comprehension : null;
                s._raw.comprehension_pct = a.comprehensionPct;
                s._raw.reasoning_label = a.reasoning !== 'No Data' ? a.reasoning : null;
                s._raw.reasoning_pct = a.reasoningPct;
                s._raw.vocab_words_learned = a.vocabWordsLearned || 0;
                s._raw.independence_label = a.independence !== 'No Data' ? a.independence : null;
                s._raw.persistence_label = a.persistence !== 'No Data' ? a.persistence : null;
                s._raw.score_trend = a.scoreTrend || 'stable';
              }
            }
          }
        }
      } catch(e) { console.warn('Could not load class analytics:', e); }

      // Load assignments for this teacher's class
      try {
        const rawAssignments = await API.getAssignments(currentUser.classId);
        assignments = rawAssignments.map(mapAssignmentFromAPI);
      } catch(e) { console.warn('Could not load assignments:', e); }

      // Load store items from DB
      await loadStoreItems();
    }
  }

  // Set default page based on role
  if (userRole === 'student' || userRole === 'child') {
    page = 'student-dashboard';

    // Fetch weekly stats and book progress for the student dashboard
    const sid = _studentId();
    if (sid) {
      try {
        const ws = await API.getWeeklyStats(sid);
        currentUser.weeklyStats = ws;
        currentUser.totalBooksCompleted = ws.totalBooksCompleted || 0;
      } catch(e) {
        currentUser.weeklyStats = { keysThisWeek: 0, quizzesThisWeek: 0, booksCompletedThisWeek: 0 };
        currentUser.totalBooksCompleted = 0;
      }
      try {
        currentUser.bookProgress = await API.getBookProgress(sid);
      } catch(e) {
        currentUser.bookProgress = [];
      }
      // Load favorites: try server first, fall back to localStorage
      try {
        const favResult = await API.getFavorites(sid);
        const serverFavs = (favResult.favorites || []).map(Number);
        const localFavs = _loadFavsLocal();
        // Use whichever has more favorites (server may return empty if column missing)
        studentFavorites = serverFavs.length >= localFavs.length ? serverFavs : localFavs;
        _saveFavsLocal(studentFavorites);
      } catch(e) {
        studentFavorites = _loadFavsLocal();
      }
    } else {
      // No studentId from server — still load favorites from localStorage
      studentFavorites = _loadFavsLocal();
    }

    // Load store items for student (to show sneak peek on dashboard + store page)
    if (currentUser?.classId) {
      await loadStoreItems();
    }

    // Auto-launch onboarding wizard for new students (onboarded === 0)
    if (currentUser && currentUser.onboarded === 0) {
      // Push current student into students array so the onboarding modal can find them
      students = [{
        id: currentUser.studentId,
        name: currentUser.name,
        initials: currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        color: '#2563EB',
        reading_score: currentUser.reading_score || 500,
        accuracy: currentUser.accuracy || 0,
        keys_earned: currentUser.keys_earned || 0,
        quizzes_completed: currentUser.quizzes_completed || 0,
        streak_days: currentUser.streak_days || 0,
        interests: { tags: [], readingStyle: 'detailed', favoriteGenre: '', onboarded: false },
      }];
      onboardingStudent = currentUser.studentId;
      onboardingStep = 0;
      selectedInterests = [];
      renderSidebar();
      renderHeader();
      renderMain();
      openModal('onboarding', currentUser.studentId);
      return;
    }
  } else if (userRole === 'owner') {
    page = 'owner-dashboard';

    // Load owner analytics data
    try {
      const [stats, genres, teachers, students_data] = await Promise.all([
        API.getOwnerStats(),
        API.getOwnerGenres(),
        API.getOwnerTeachers(),
        API.getOwnerStudents(),
      ]);
      ownerStats = stats;
      ownerGenres = genres;
      ownerTeachers = teachers;
      ownerStudents = students_data;
    } catch(e) { console.warn('Could not load owner data:', e); }
    // Load reward gallery for owner
    await loadRewardGallery();
  } else if (userRole === 'principal') {
    page = 'principal-dashboard';
  } else if (userRole === 'parent') {
    page = 'teacher-dashboard';

    // Load family code for parents
    try {
      const codeData = await API.getClassCode();
      if (codeData.classCode) {
        currentUser.classCode = codeData.classCode;
        currentUser.className = codeData.className;
      }
    } catch(e) { /* no class yet */ }

    // Load children for this parent's class
    if (currentUser.classId) {
      try {
        const rawStudents = await API.getStudents(currentUser.classId);
        students = rawStudents.filter(s => !s.is_teacher_demo).map(mapStudentFromAPI);
      } catch(e) { console.warn('Could not load children:', e); }

      // Fetch class analytics for parent view
      try {
        const analytics = await API.getClassAnalytics(currentUser.classId);
        if (analytics && analytics.length > 0) {
          const analyticsMap = {};
          for (const a of analytics) { analyticsMap[a.id] = a; }
          for (const s of students) {
            const a = analyticsMap[s.id];
            if (a) {
              if (a.readingScore) s.score = a.readingScore;
              if (s._raw) {
                s._raw.comprehension_label = a.comprehension !== 'No Data' ? a.comprehension : null;
                s._raw.comprehension_pct = a.comprehensionPct;
                s._raw.reasoning_label = a.reasoning !== 'No Data' ? a.reasoning : null;
                s._raw.reasoning_pct = a.reasoningPct;
                s._raw.vocab_words_learned = a.vocabWordsLearned || 0;
                s._raw.independence_label = a.independence !== 'No Data' ? a.independence : null;
                s._raw.persistence_label = a.persistence !== 'No Data' ? a.persistence : null;
                s._raw.score_trend = a.scoreTrend || 'stable';
              }
            }
          }
        }
      } catch(e) { console.warn('Could not load class analytics:', e); }

      // Load assignments for this parent's class
      try {
        const rawAssignments = await API.getAssignments(currentUser.classId);
        assignments = rawAssignments.map(mapAssignmentFromAPI);
      } catch(e) { console.warn('Could not load assignments:', e); }

      // Load store items
      await loadStoreItems();
    }
  }

  // Check for deep-link from homepage (e.g. ?book=56) for logged-in users
  const urlParams = new URLSearchParams(window.location.search);
  const bookDeepLink = urlParams.get('book');
  const pageDeepLink = urlParams.get('page');
  if (bookDeepLink) {
    page = 'book-detail';
    renderSidebar();
    renderHeader();
    openBook(parseInt(bookDeepLink));
    return;
  }
  if (pageDeepLink) {
    page = pageDeepLink;
  }

  renderSidebar();
  renderHeader();
  renderMain();
});
