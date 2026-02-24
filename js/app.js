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
  { id: 'sports',      label: 'Sports',         icon: IC.target,   color: 'blue'   },
  { id: 'animals',     label: 'Animals',         icon: IC.eye,      color: 'green'  },
  { id: 'science',     label: 'Science',         icon: IC.bulb,     color: 'purple' },
  { id: 'adventure',   label: 'Adventure',       icon: IC.fire,     color: 'orange' },
  { id: 'fantasy',     label: 'Fantasy',         icon: IC.star,     color: 'gold'   },
  { id: 'mystery',     label: 'Mystery',         icon: IC.search,   color: 'red'    },
  { id: 'technology',  label: 'Technology',       icon: IC.layers,   color: 'blue'   },
  { id: 'art',         label: 'Art & Music',     icon: IC.activity, color: 'purple' },
  { id: 'history',     label: 'History',          icon: IC.clock,    color: 'orange' },
  { id: 'humor',       label: 'Funny Stories',   icon: IC.star,     color: 'gold'   },
  { id: 'friendship',  label: 'Friendship',      icon: IC.users,    color: 'green'  },
  { id: 'cooking',     label: 'Food & Cooking',  icon: IC.bag,      color: 'red'    },
];

// ---- Data (loaded from API on init) ----
let students = [];
let assignments = [];

const templates = [
  { id: 't1', type: 'quiz',       name: 'Comprehension Quick Check', desc: 'A fast 10-question comprehension check for any book.', questions: 10, time: '15 min', level: 'Any' },
  { id: 't2', type: 'assessment', name: 'Reading Level Benchmark',   desc: 'Full benchmark assessment for determining reading level.', questions: 20, time: '30 min', level: 'Auto' },
  { id: 't3', type: 'quiz',       name: 'Deep Comprehension Quiz',   desc: 'In-depth quiz covering inference, theme, and vocabulary.', questions: 15, time: '25 min', level: '3.0\u20138.0' },
  { id: 't4', type: 'assessment', name: 'Fluency & Comprehension',   desc: 'Measures both fluency and reading comprehension together.', questions: 12, time: '20 min', level: '1.0\u20133.5' },
  { id: 't5', type: 'challenge',  name: 'Genre Explorer Challenge',  desc: 'Challenge students to explore a new genre with guided questions.', questions: 10, time: '15 min', level: 'Any' },
  { id: 't6', type: 'assessment', name: 'Vocabulary in Context',     desc: 'Assess vocabulary understanding within reading passages.', questions: 15, time: '20 min', level: '2.0\u20136.0' },
];

let goals = [];

// Default store items (teacher can customize)
let storeItems = [
  { name: 'Homework Pass',    stock: 10, price: 50, icon: '📝' },
  { name: 'Extra Recess',     stock: 5,  price: 75, icon: '⏰' },
  { name: 'Class DJ',         stock: 3,  price: 30, icon: '🎵' },
  { name: 'Sit With a Friend', stock: 10, price: 20, icon: '👫' },
  { name: 'Candy Jar',        stock: 15, price: 15, icon: '🍬' },
  { name: 'Sticker Pack',     stock: 20, price: 10, icon: '⭐' },
];

// Books loaded from API (populated on init)
let books = [];
let selectedBookId = null; // For book detail view
let bookChapters = []; // Chapters for selected book
let completedChapters = []; // Chapter numbers the student has completed for current book

// Sort books: Book 1 first (randomized), then rest (randomized)
function sortBooksForDisplay(bookList) {
  const book1 = bookList.filter(b => b.book_number === 1);
  const rest = bookList.filter(b => b.book_number !== 1);
  // Fisher-Yates shuffle both groups
  for (let i = book1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [book1[i], book1[j]] = [book1[j], book1[i]];
  }
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...book1, ...rest];
}

let quizHistory = [];

// ---- Growth Data (6 months: Sep-Feb) ----
const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
let growthData = {};

// ---- State ----
let page = 'quizzes';
let detailId = null;
let studentId = null;
let templateFilter = 'all';
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

function svgAreaChart(data, labels, color, w, h) {
  w = w || 600; h = h || 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
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

  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${pts[0].x},${pad.top + ch} ${linePoints} ${pts[pts.length-1].x},${pad.top + ch}`;

  // Gridlines
  const gridCount = 4;
  let gridLines = '';
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + (i / gridCount) * ch;
    const val = Math.round(max - (i / gridCount) * range);
    gridLines += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="var(--g200)" stroke-width="1"/>`;
    gridLines += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="var(--g400)" font-size="11">${val}</text>`;
  }

  // X labels
  let xLabels = labels.map((l, i) => {
    const x = pad.left + (i / (labels.length - 1)) * cw;
    return `<text x="${x}" y="${h - 6}" text-anchor="middle" fill="var(--g400)" font-size="11">${l}</text>`;
  }).join('');

  // Dots
  let dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="#fff" stroke-width="2"/>`).join('');
  let dotLabels = pts.map(p => `<text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="var(--g700)" font-size="11" font-weight="600">${p.v}</text>`).join('');

  return `<svg class="svg-chart" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
    ${gridLines}
    <polygon points="${areaPoints}" fill="${color}" opacity="0.08"/>
    <polyline points="${linePoints}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${dotLabels}
    ${xLabels}
  </svg>`;
}

// ---- Render Sidebar ----
function renderSidebar() {
  let items;
  if (userRole === 'student') {
    items = [
      { section: 'My Learning' },
      { id: 'student-dashboard', icon: IC.target, label: 'My Dashboard' },
      { id: 'student-quizzes',   icon: IC.clip,   label: 'My Quizzes', badge: assignments.length > 0 ? String(assignments.length) : '', badgeCls: 'red' },
      { id: 'library',           icon: IC.book,   label: 'Book Library' },
      { id: 'student-progress',  icon: IC.chart,  label: 'My Progress' },
      { section: 'Fun' },
      { id: 'store',             icon: IC.bag,    label: 'Class Store', badge: storeItems.length > 0 ? String(storeItems.length) : '', badgeCls: 'gold' },
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
  } else if (userRole === 'guest') {
    items = [
      { id: 'guest-browse', icon: IC.book, label: 'Browse Books' },
    ];
  } else {
    items = [
      { section: 'Dashboard' },
      { id: 'quizzes',    icon: IC.clip,  label: 'Quizzes & Assessments', badge: assignments.length > 0 ? String(assignments.length) : '', badgeCls: 'red' },
      { id: 'students',   icon: IC.users, label: 'Students',             badge: students.length > 0 ? String(students.length) : '', badgeCls: 'blue' },
      { id: 'goals',      icon: IC.trend, label: 'Class Goals' },
      { id: 'reports',    icon: IC.chart, label: 'Growth Reports' },
      { id: 'templates',  icon: IC.grid,  label: 'Quiz Templates' },
      { section: 'Management' },
      { id: 'store',      icon: IC.bag,   label: 'Class Store',          badge: String(storeItems.length), badgeCls: 'gold' },
      { id: 'library',    icon: IC.book,  label: 'Book Library' },
      { section: 'Tools' },
      { id: 'celebrate',  icon: IC.star,  label: 'Celebrate Students' },
      { id: 'aitools',    icon: IC.bulb,  label: 'Teaching Tools' },
    ];
  }

  const userName = currentUser?.name || 'Student';
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const roleLabel = userRole === 'student' ? (currentUser?.grade || '4th') + ' Grade Student' :
                    userRole === 'owner' ? 'Platform Owner' :
                    userRole === 'principal' ? 'School Principal' :
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
    html += `<button class="sidebar-item ${active}" onclick="navigate('${item.id}')">${item.icon}<span>${item.label}</span>${badge}</button>`;
  });

  html += `</nav>`;

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
      <div class="sidebar-avatar">${userInitials}</div>
      <div style="flex:1;min-width:0">
        <div class="sidebar-user-name">${userName}</div>
        <div class="sidebar-user-role">${roleLabel}</div>
      </div>
      <button class="sidebar-logout-btn" onclick="handleLogout()" title="Log out">${IC.logout}</button>
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
  document.getElementById('dash-header').innerHTML = `
    <div class="header-tabs">
      <button class="header-tab active">Reading</button>
    </div>
    <div class="header-search">
      ${IC.search}
      <input type="text" placeholder="Search students, books, quizzes...">
    </div>
    <div class="header-actions">
      <button class="header-icon-btn">${IC.bell}<span class="notif-dot"></span></button>
      <button class="header-icon-btn">${IC.gear}</button>
    </div>`;
}

// ---- Logout ----
async function handleLogout() {
  try { await API.logout(); } catch(e) { /* ignore */ }
  // Clear student auto-signin localStorage
  localStorage.removeItem('k2r_student_name');
  localStorage.removeItem('k2r_student_classcode');
  window.location.href = 'signin.html';
}

// ---- Navigate ----
function navigate(p, detail, sid) {
  page = p;
  detailId = detail != null ? detail : null;
  studentId = sid != null ? sid : null;
  if (p !== 'reports') reportStudentId = null;
  renderSidebar();
  renderMain();
}

// ---- Render Main ----
function renderMain() {
  const el = document.getElementById('dash-main');
  switch (page) {
    // Teacher pages
    case 'quizzes':
      if (detailId) { el.innerHTML = renderAssignmentDetail(); break; }
      el.innerHTML = renderQuizzes();
      break;
    case 'students':
      if (studentId !== null) { el.innerHTML = renderStudentProfile(); break; }
      el.innerHTML = renderStudents();
      break;
    case 'templates':  el.innerHTML = renderTemplates(); break;
    case 'goals':      el.innerHTML = renderGoals(); break;
    case 'store':      el.innerHTML = renderStore(); break;
    case 'library':    el.innerHTML = renderLibrary(); initLibrarySearch(); break;
    case 'book-detail': el.innerHTML = renderBookDetail(); break;
    case 'celebrate':  el.innerHTML = renderCelebrate(); break;
    case 'aitools':    el.innerHTML = renderAITools(); break;
    case 'reports':
      if (reportStudentId !== null) { el.innerHTML = renderStudentReport(); break; }
      el.innerHTML = renderReports();
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
    default:
      if (userRole === 'guest') { el.innerHTML = renderGuestBrowse(); initBookSearch(); }
      else if (userRole === 'student') el.innerHTML = renderStudentDashboard();
      else if (userRole === 'owner') el.innerHTML = renderOwnerDashboard();
      else if (userRole === 'principal') el.innerHTML = renderPrincipalDashboard();
      else el.innerHTML = renderQuizzes();
  }
}

// ---- Launch Quiz Player ----
async function launchQuiz(bookId, chapterNum, sid) {
  // Find student — check students array first, then fall back to currentUser for student role
  let s = sid != null ? students.find(st => st.id === sid) : students[0];
  if (!s && userRole === 'student' && currentUser) {
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
  // Guests get no student object — quiz uses local scoring
  page = 'quiz-player';
  renderSidebar();
  renderMain();

  const playerRoot = document.getElementById('quiz-player-root');
  if (playerRoot) playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">📖</div>Loading quiz...<br><small>Loading chapter questions</small></div>';

  try {
    const quizData = await API.getChapterQuiz(bookId, chapterNum);
    // Get book info
    let book = books.find(b => b.id === bookId);
    if (!book) {
      try { const allBooks = await API.getBooks(); book = allBooks.find(b => b.id === bookId); } catch(e) {}
    }
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
      // Update currentUser so dashboard shows new scores immediately
      if (currentUser && userRole === 'student') {
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
        try { setTimeout(() => showBookCompletionCelebration(book, results), 600); } catch(err) { console.error('Celebration error:', err); }
      }
    }, nextChapterInfo);
    QuizEngine.render();
  } catch(e) {
    playerRoot.innerHTML = '<div style="text-align:center;padding:60px;color:var(--g400)"><div style="font-size:2rem;margin-bottom:12px">⚠️</div>Could not load quiz.<br><small>' + (e.message || 'Check that the server is running') + '</small><br><br><button class="btn btn-outline" onclick="navigate(\'guest-browse\')">Back to Books</button></div>';
  }
}

// ---- Page: Quizzes & Assessments ----
function renderQuizzes() {
  const classCode = currentUser?.classCode || '';
  const avgAcc = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.accuracy || 0), 0) / students.length) : 0;
  const totalKeys = students.reduce((s, st) => s + (st.keys_earned || st.keys || 0), 0);
  const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.reading_score || st.score || 0), 0) / students.length) : 0;

  // Class code banner (always show for teachers)
  let html = '';
  if (classCode) {
    html += `
    <div class="class-code-banner">
      <div class="class-code-banner-left">
        <div class="class-code-banner-icon">${IC.users}</div>
        <div>
          <div class="class-code-banner-label">Your Class Code</div>
          <div class="class-code-banner-desc">Share this code with students so they can join your class.</div>
        </div>
      </div>
      <div class="class-code-banner-right">
        <span class="class-code-value">${classCode}</span>
        <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText('${classCode}'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy',1500)">Copy</button>
      </div>
    </div>`;
  }

  // Empty state — no students yet
  if (students.length === 0) {
    html += `
    <div class="empty-state">
      <div class="empty-state-icon">${IC.users}</div>
      <h2>Welcome to key2read!</h2>
      <p>Your class is set up and ready to go. Here's how to get started:</p>
      <div class="getting-started-steps">
        <div class="gs-step">
          <div class="gs-step-num">1</div>
          <div>
            <strong>Share your class code</strong>
            <p>Give students the code <strong>${classCode}</strong> so they can join your class.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">2</div>
          <div>
            <strong>Students sign up</strong>
            <p>They go to the signup page, choose "Student", and enter the class code.</p>
          </div>
        </div>
        <div class="gs-step">
          <div class="gs-step-num">3</div>
          <div>
            <strong>Assign quizzes</strong>
            <p>Browse ${books.length} books in the library and assign reading quizzes.</p>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:24px">
        <button class="btn btn-primary" onclick="navigate('library')">${IC.book} Browse Book Library</button>
        <button class="btn btn-outline" onclick="navigate('templates')">${IC.grid} Quiz Templates</button>
      </div>
    </div>`;
    return html;
  }

  // Normal teacher dashboard with students
  html += `
    <div class="page-header">
      <h1>Quizzes & Assessments <span class="badge badge-blue">${assignments.length}</span></h1>
      <div class="page-header-actions">
        <button class="btn btn-outline btn-sm" onclick="openModal('assign')">Assign Assessment</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('templates')">Browse Templates</button>
      </div>
    </div>

    <div class="stat-cards stat-cards-5">
      <div class="stat-card">
        <div class="stat-card-label">Students</div>
        <div class="stat-card-value">${students.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Reading Score</div>
        <div class="stat-card-value">${avgScore}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Comprehension</div>
        <div class="stat-card-value">${avgAcc}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Keys Earned</div>
        <div class="stat-card-value">${totalKeys.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Books Available</div>
        <div class="stat-card-value">${books.length}</div>
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
      <p>No quizzes assigned yet. <a href="#" onclick="event.preventDefault();navigate('library')" style="color:var(--blue)">Browse the book library</a> to get started.</p>
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
  if (students.length === 0) {
    const classCode = currentUser?.classCode || '';
    return `
      <div class="page-header"><h1>Students <span class="badge badge-blue">0</span></h1></div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.users}</div>
        <h2>No Students Yet</h2>
        <p>Share your class code <strong>${classCode}</strong> with students so they can sign up and join your class.</p>
        <button class="btn btn-primary" onclick="navigate('quizzes')">${IC.arrowLeft} Go to Dashboard</button>
      </div>`;
  }

  const sorted = [...students].sort((a, b) => b.score - a.score);
  return `
    <div class="page-header">
      <h1>Students <span class="badge badge-blue">${students.length}</span></h1>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Level</th>
            <th>Score</th>
            <th>Accuracy</th>
            <th>Interests</th>
            <th>Keys</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(s => {
            const sb = scoreBadge(s.accuracy);
            const intCell = s.interests && s.interests.onboarded
              ? `<div class="interest-tags-compact">${interestTagsCompact(s, 2)}</div>`
              : `<button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); onboardingStudent=${s.id}; onboardingStep=0; selectedInterests=[]; openModal('onboarding',${s.id})">${IC.heart} Set Up</button>`;
            return `
            <tr onclick="navigate('students',null,${s.id})">
              <td><div class="student-cell">${avatar(s)} <span class="student-name">${s.name}</span> ${warnTag(s)}</div></td>
              <td>${s.level}</td>
              <td><strong>${s.score}</strong></td>
              <td>
                <span class="score-badge ${sb.cls}">${s.accuracy}% ${sb.label}</span>
                <div class="mini-progress"><div class="mini-progress-bar" style="width:${s.accuracy}%;background:${sb.barColor}"></div></div>
              </td>
              <td>${intCell}</td>
              <td>${keysDisp(s.keys)}</td>
              <td>${streakDisp(s.streak)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ---- Page: Student Profile ----
function renderStudentProfile() {
  const s = students.find(x => x.id === studentId);
  if (!s) return '<p>Student not found.</p>';
  const sb = scoreBadge(s.accuracy);
  const gd = growthData[s.id];

  return `
    <button class="back-btn" onclick="navigate('students')">${IC.arrowLeft} Back to Students</button>

    <div class="profile-header">
      ${avatar(s, 'lg')}
      <div class="profile-info">
        <h2>${s.name} ${warnTag(s)}</h2>
        <div class="profile-meta">
          <span>Level ${s.level}</span>
          <span>Grade: ${s.grade}</span>
          <span>Joined: ${s.joined}</span>
        </div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="profile-stat-card">
        <div class="stat-icon blue">${IC.barChart}</div>
        <div class="profile-stat-value">${s.score}</div>
        <div class="profile-stat-label">Reading Score</div>
        ${gd ? `<div style="margin-top:6px">${miniChart(gd.scores, 'var(--blue)')}</div>` : ''}
      </div>
      <div class="profile-stat-card">
        <div class="stat-icon green">${IC.check}</div>
        <div class="profile-stat-value">${s.accuracy}%</div>
        <div class="profile-stat-label">Accuracy</div>
        ${gd ? `<div style="margin-top:6px">${miniChart(gd.accuracy, 'var(--green)')}</div>` : ''}
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

    ${quizHistory.length > 0 ? `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Book / Assessment</th>
            <th>Origin</th>
            <th>Score</th>
            <th>Keys</th>
          </tr>
        </thead>
        <tbody>
          ${quizHistory.map(q => {
            const qsb = scoreBadge(q.score);
            return `
            <tr>
              <td>${q.date}</td>
              <td><strong>${q.name}</strong></td>
              <td>
                ${q.origin === 'student'
                  ? `<span class="origin-badge student">${IC.bookOpen} Student Initiated</span>`
                  : `<span class="origin-badge teacher">${IC.target} Teacher Assigned</span>`
                }
              </td>
              <td><span class="score-badge ${qsb.cls}">${q.score}% ${qsb.label}</span></td>
              <td>${keysDisp(q.keys)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="info-panel" style="text-align:center;padding:32px">
      <p style="color:var(--g500);margin:0">${IC.bookOpen} No quiz history yet. Quizzes will appear here as ${s.name} completes them.</p>
    </div>`}`;
}

// ---- Page: Quiz Templates ----
function renderTemplates() {
  const filtered = templateFilter === 'all'
    ? templates
    : templates.filter(t => t.type === templateFilter);

  const chips = [
    { id: 'all', label: 'All' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'assessment', label: 'Assessments' },
    { id: 'challenge', label: 'Challenges' },
  ];

  return `
    <div class="page-header">
      <h1>Quiz Templates</h1>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="openModal('template')">${IC.plus} Create Custom</button>
      </div>
    </div>

    <div class="template-filters">
      ${chips.map(c => `<button class="filter-chip ${templateFilter === c.id ? 'active' : ''}" onclick="setFilter('${c.id}')">${c.label}</button>`).join('')}
    </div>

    <div class="template-grid">
      ${filtered.map(t => `
        <div class="template-card" onclick="openModal('assign','${t.name}')">
          <div class="template-card-bar ${t.type}"></div>
          <div class="template-card-body">
            <span class="badge badge-${t.type === 'quiz' ? 'blue' : t.type === 'assessment' ? 'purple' : 'orange'}">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
            <div class="template-card-meta">
              <span>${IC.hash} ${t.questions} questions</span>
              <span>${IC.clock} ${t.time}</span>
              <span>${IC.layers} ${t.level}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function setFilter(f) {
  templateFilter = f;
  renderMain();
}

// ---- Page: Class Goals ----
function renderGoals() {
  if (goals.length === 0) {
    return `
      <div class="page-header">
        <h1>Class Goals</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary btn-sm" onclick="openModal('goal')">${IC.plus} Add Goal</button>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">${IC.target}</div>
        <h2>No Goals Yet</h2>
        <p>Set class goals to motivate your students! Goals update automatically as students complete quizzes and earn Keys.</p>
        <button class="btn btn-primary" onclick="openModal('goal')">${IC.plus} Create Your First Goal</button>
      </div>`;
  }

  return `
    <div class="page-header">
      <h1>Class Goals</h1>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="openModal('goal')">${IC.plus} Add Goal</button>
      </div>
    </div>

    <div class="goals-grid">
      ${goals.map(g => {
        const p = pct(g.current, g.target);
        return `
        <div class="goal-card">
          <div class="goal-card-header">
            <h3>${g.title}</h3>
            <span class="goal-due">${IC.calendar} Due ${g.due}</span>
          </div>
          <div class="goal-progress">
            <div class="goal-progress-bar">
              <div class="goal-progress-fill ${g.color}" style="width:${p}%"></div>
            </div>
          </div>
          <div class="goal-stats">
            <span class="goal-current">${typeof g.current === 'number' && g.unit === '%' ? g.current + '%' : g.current.toLocaleString()} / ${typeof g.target === 'number' && g.unit === '%' ? g.target + '%' : g.target.toLocaleString()} ${g.unit}</span>
            <span class="goal-pct" style="color:var(--${g.color})">${p}%</span>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="info-panel">
      <h4>${IC.info} How Class Goals Work</h4>
      <p>Goals update automatically as students complete quizzes and earn Keys. Students can see shared goals on their own dashboards, building a sense of class community and collective achievement. When a goal is reached, consider celebrating with a class reward from the Class Store.</p>
    </div>`;
}

// ---- Page: Class Store ----
let storeEditing = null; // index of item being edited, or null
let storeAddingNew = false;

function renderStore() {
  return `
    <div class="page-header">
      <h1>Class Store <span class="badge badge-gold">${storeItems.length}</span></h1>
      <div class="page-header-actions">
        <button class="btn btn-primary btn-sm" onclick="storeAddingNew=true; renderMain()">${IC.plus} Add Reward</button>
      </div>
    </div>

    <div class="info-panel" style="margin-bottom:20px">
      <h4>${IC.info} How the Class Store Works</h4>
      <p>Students spend their earned Keys on rewards you create. Customize the rewards, prices, and stock levels below. Add new rewards or remove ones your class doesn't need.</p>
    </div>

    ${storeAddingNew ? `
    <div class="store-edit-card" style="background:#fff;border:2px solid var(--blue);border-radius:var(--radius-md);padding:20px;margin-bottom:16px">
      <h4 style="margin-bottom:12px;font-size:0.9375rem;font-weight:600;color:var(--g900)">New Reward</h4>
      <div style="display:grid;grid-template-columns:auto 1fr 100px 100px auto;gap:12px;align-items:end">
        <div>
          <label style="font-size:0.75rem;font-weight:600;color:var(--g500);display:block;margin-bottom:4px">Icon</label>
          <input id="store-new-icon" type="text" value="🎁" maxlength="4" style="width:48px;padding:8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:1.25rem;text-align:center">
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
          <button class="btn btn-ghost btn-sm" onclick="storeAddingNew=false; renderMain()">Cancel</button>
        </div>
      </div>
    </div>` : ''}

    <div class="list-card">
      ${storeItems.length === 0 ? `
        <div style="padding:48px;text-align:center;color:var(--g400)">
          <p>No rewards yet. Click "Add Reward" to create your first class store item!</p>
        </div>` :
      storeItems.map((item, idx) => {
        if (storeEditing === idx) {
          return `
          <div class="list-item" style="background:var(--blue-p)">
            <div style="display:flex;align-items:center;gap:12px;flex:1">
              <input id="store-edit-icon" type="text" value="${item.icon}" maxlength="4" style="width:44px;padding:6px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:1.125rem;text-align:center">
              <input id="store-edit-name" type="text" value="${item.name}" style="flex:1;padding:6px 12px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
              <div style="display:flex;align-items:center;gap:4px">
                <span style="font-size:0.75rem;color:var(--g500)">Price:</span>
                <input id="store-edit-price" type="number" value="${item.price}" min="1" style="width:70px;padding:6px 8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
              </div>
              <div style="display:flex;align-items:center;gap:4px">
                <span style="font-size:0.75rem;color:var(--g500)">Stock:</span>
                <input id="store-edit-stock" type="number" value="${item.stock}" min="0" style="width:70px;padding:6px 8px;border:1.5px solid var(--g200);border-radius:var(--radius-sm);font-size:0.875rem">
              </div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-primary btn-sm" onclick="storeSaveEdit(${idx})">Save</button>
              <button class="btn btn-ghost btn-sm" onclick="storeEditing=null; renderMain()">Cancel</button>
            </div>
          </div>`;
        }
        return `
        <div class="list-item">
          <div class="list-item-info" style="display:flex;align-items:center;gap:12px;flex-direction:row">
            <span style="font-size:1.5rem">${item.icon}</span>
            <div>
              <span class="list-item-name">${item.name}</span>
              <span class="list-item-sub">${item.stock} in stock</span>
            </div>
          </div>
          <div class="list-item-right">
            ${keysDisp(item.price)}
            <button class="btn btn-sm btn-ghost" onclick="storeEditing=${idx}; renderMain()" title="Edit">${IC.gear}</button>
            <button class="btn btn-sm btn-ghost" onclick="storeRemoveItem(${idx})" title="Remove" style="color:var(--red)">${IC.x}</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function storeAddItem() {
  const icon = document.getElementById('store-new-icon')?.value || '🎁';
  const name = document.getElementById('store-new-name')?.value?.trim();
  const price = parseInt(document.getElementById('store-new-price')?.value) || 25;
  const stock = parseInt(document.getElementById('store-new-stock')?.value) || 10;
  if (!name) { alert('Please enter a reward name.'); return; }
  storeItems.push({ name, stock, price, icon });
  storeAddingNew = false;
  renderMain();
}

function storeSaveEdit(idx) {
  const icon = document.getElementById('store-edit-icon')?.value || storeItems[idx].icon;
  const name = document.getElementById('store-edit-name')?.value?.trim();
  const price = parseInt(document.getElementById('store-edit-price')?.value) || storeItems[idx].price;
  const stock = parseInt(document.getElementById('store-edit-stock')?.value) || 0;
  if (!name) { alert('Please enter a reward name.'); return; }
  storeItems[idx] = { name, stock, price, icon };
  storeEditing = null;
  renderMain();
}

function storeRemoveItem(idx) {
  if (confirm(`Remove "${storeItems[idx].name}" from the store?`)) {
    storeItems.splice(idx, 1);
    renderMain();
  }
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
      ${comingSoon ? '<div class="coming-soon-overlay">Coming Soon</div>' : ''}
      <div class="book-card-cover">
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

function initLibrarySearch() {
  const input = document.getElementById('library-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const grid = document.getElementById('library-book-grid');
    const countEl = document.getElementById('library-book-count');
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
      : filtered.map(b => {
          const coverUrl = b.cover_url || '';
          const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
          const genre = b.genre || '';
          return `<div class="book-card" onclick="openBook(${b.id})">
            <div class="book-card-cover">${coverUrl ? `<img src="${coverUrl}" alt="${b.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}<div class="book-card-cover-fallback" ${coverUrl ? 'style="display:none"' : ''}><span style="font-size:0.875rem;font-weight:600;color:var(--g500);padding:12px;text-align:center;line-height:1.4">${b.title}</span></div></div>
            <div class="book-card-info"><h4 class="book-card-title">${b.title}</h4><p class="book-card-author">${b.author || ''}</p><div class="book-card-meta">${level ? `<span class="badge badge-blue">${level}</span>` : ''}${genre ? `<span class="badge badge-outline">${genre}</span>` : ''}</div></div>
          </div>`;
        }).join('');
    if (countEl) countEl.textContent = filtered.length;
  });
}

function renderStudentBookCard(b) {
  const coverUrl = b.cover_url || '';
  const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
  const genre = b.genre || '';
  const comingSoon = b.has_quizzes === false;
  return `
    <div class="book-card${comingSoon ? ' book-card-coming-soon' : ''}" ${comingSoon ? '' : `onclick="openBook(${b.id})" style="cursor:pointer"`}>
      ${comingSoon ? '<div class="coming-soon-overlay">Coming Soon</div>' : ''}
      <div class="book-card-cover" style="height:200px">
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

function initStudentBookSearch() {
  const input = document.getElementById('student-book-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const grid = document.getElementById('student-book-grid');
    const countEl = document.getElementById('student-book-count');
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

  return `
    <div class="page-header">
      <h1>Book Library <span class="badge badge-blue" id="library-book-count">${books.length}</span></h1>
    </div>

    <div style="position:relative;margin-bottom:20px;max-width:480px">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--g400);pointer-events:none">${IC.search}</span>
      <input type="text" id="library-search-input" placeholder="Search books by title, author, or genre..."
        style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--g200);border-radius:var(--radius-md);font-size:0.875rem;outline:none;transition:border-color .2s"
        onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--g200)'">
    </div>

    <div class="book-grid" id="library-book-grid">
      ${books.map(b => {
        const coverUrl = b.cover_url || '';
        const level = displayGradeLevel(b.grade_level || b.lexile_level || '');
        const genre = b.genre || '';
        const comingSoon = b.has_quizzes === false;
        return `
        <div class="book-card${comingSoon ? ' book-card-coming-soon' : ''}" ${comingSoon ? '' : `onclick="openBook(${b.id})"`}>
          ${comingSoon ? '<div class="coming-soon-overlay">Coming Soon</div>' : ''}
          <div class="book-card-cover">
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
    <button class="back-btn" onclick="navigate('${userRole === 'guest' ? 'guest-browse' : userRole === 'student' ? 'student-dashboard' : 'library'}')">${IC.arrowLeft} Back to ${userRole === 'guest' ? 'Books' : userRole === 'student' ? 'Dashboard' : 'Library'}</button>

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
            const isCompleted = completedChapters.includes(ch.chapter_number);
            const isUnlocked = ch.chapter_number === 1 || completedChapters.includes(ch.chapter_number - 1);
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
              <div class="list-item-right">
                <span class="btn btn-sm ${isCompleted ? 'btn-outline' : 'btn-primary'}">${isCompleted ? 'Retake Quiz' : 'Take Quiz'}</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      `}
    </div>`;
}

async function launchFullBookQuiz(bookId, sid) {
  // Find student
  let s = sid != null ? students.find(st => st.id === sid) : students[0];
  if (!s && userRole === 'student' && currentUser) {
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
    let book = books.find(b => b.id === bookId);
    if (!book) {
      try { const allBooks = await API.getBooks(); book = allBooks.find(b => b.id === bookId); } catch(e) {}
    }
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
      if (currentUser && userRole === 'student') {
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
      try { setTimeout(() => showBookCompletionCelebration(book, results), 600); } catch(err) { console.error('Celebration error:', err); }
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
        <button class="btn btn-primary" onclick="downloadCertificatePDF()">Download PDF</button>
        <button class="btn btn-outline" onclick="printCertificate()">Print Certificate</button>
      </div>
      <button class="celebration-dismiss" onclick="closeCelebration()">Close</button>
    </div>`;
}

function closeCelebration() {
  const modal = document.getElementById('modal-root-2');
  if (modal) modal.innerHTML = '';
}

function downloadCertificatePDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library not loaded. Please try again.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = 297, h = 210;
  const book = books.find(b => b.id === selectedBookId) || { title: 'Book', author: '' };
  const studentName = currentUser?.name || 'Student';
  const score = document.querySelector('.celebration-cert-meta span:last-child')?.textContent || '';
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, 'F');

  // Decorative border — outer
  doc.setDrawColor(74, 58, 163); // purple brand
  doc.setLineWidth(2);
  doc.rect(10, 10, w - 20, h - 20);

  // Decorative border — inner
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, w - 28, h - 28);

  // Trophy emoji as text
  doc.setFontSize(32);
  doc.text('🏆', w / 2, 40, { align: 'center' });

  // Title
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 46);
  doc.text('Certificate of Achievement', w / 2, 56, { align: 'center' });

  // Divider line
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 50, 62, w / 2 + 50, 62);

  // "This certifies that"
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('This certifies that', w / 2, 74, { align: 'center' });

  // Student name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 46);
  doc.text(studentName, w / 2, 88, { align: 'center' });

  // "has successfully completed all quizzes for"
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('has successfully completed all quizzes for', w / 2, 100, { align: 'center' });

  // Book title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(74, 58, 163);
  doc.text(book.title || 'Book', w / 2, 114, { align: 'center' });

  // Author
  if (book.author) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('by ' + book.author, w / 2, 124, { align: 'center' });
  }

  // Date and score
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(dateStr, w / 2 - 30, 145, { align: 'center' });
  doc.text(score, w / 2 + 30, 145, { align: 'center' });

  // Branding
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 58, 163);
  doc.text('key2read', w / 2, 175, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Building Critical Thinking Skills Through Reading', w / 2, 181, { align: 'center' });

  // Save
  const safeTitle = (book.title || 'Book').replace(/[^a-zA-Z0-9]/g, '-');
  doc.save(`${safeTitle}-Certificate.pdf`);
}

function printCertificate() {
  const book = books.find(b => b.id === selectedBookId) || { title: 'Book', author: '' };
  const studentName = currentUser?.name || 'Student';
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const scoreEl = document.querySelector('.celebration-cert-meta span:last-child');
  const score = scoreEl ? scoreEl.textContent : '';

  const html = `<!DOCTYPE html><html><head><title>Certificate</title>
    <style>
      @page { size: landscape; margin: 0; }
      body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Georgia, 'Times New Roman', serif; background: #fff; }
      .cert { width: 267mm; height: 180mm; border: 3px solid #4A3AA3; padding: 30px; text-align: center; position: relative; box-sizing: border-box; }
      .cert::after { content: ''; position: absolute; inset: 6px; border: 1px solid #8B5CF6; pointer-events: none; }
      .trophy { font-size: 48px; margin-bottom: 8px; }
      h1 { font-size: 32px; color: #1a1a2e; margin: 0 0 8px; font-weight: 700; }
      .subtitle { color: #888; font-size: 14px; margin: 12px 0 4px; }
      .name { font-size: 28px; color: #1a1a2e; font-weight: 700; margin: 4px 0; }
      .book-title { font-size: 22px; color: #4A3AA3; font-style: italic; margin: 4px 0; }
      .author { font-size: 14px; color: #888; margin: 4px 0; }
      .meta { font-size: 12px; color: #888; margin-top: 20px; display: flex; justify-content: center; gap: 40px; }
      .brand { margin-top: 20px; font-size: 12px; color: #4A3AA3; font-weight: 700; }
      .brand-sub { font-size: 9px; color: #aaa; }
    </style>
  </head><body>
    <div class="cert">
      <div class="trophy">🏆</div>
      <h1>Certificate of Achievement</h1>
      <p class="subtitle">This certifies that</p>
      <p class="name">${studentName}</p>
      <p class="subtitle">has successfully completed all quizzes for</p>
      <p class="book-title">${book.title || 'Book'}</p>
      ${book.author ? `<p class="author">by ${book.author}</p>` : ''}
      <div class="meta"><span>${dateStr}</span><span>${score}</span></div>
      <div class="brand">key2read</div>
      <div class="brand-sub">Building Critical Thinking Skills Through Reading</div>
    </div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none';
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 1000);
  }, 300);
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
    </div>`;
}

// ---- Page: Teaching Tools ----
function renderAITools() {
  const tools = [
    { name: 'Generate Quiz Questions',   desc: 'Create custom comprehension questions for any book in the library.', barColor: 'blue',   iconColor: 'blue',   icon: IC.layers },
    { name: 'Struggling Reader Report',  desc: 'Get an in-depth analysis of students who need additional support.', barColor: 'red',    iconColor: 'red',    icon: IC.warn },
    { name: 'Reading Level Predictor',   desc: 'Predict where each student\'s reading level will be in 30/60/90 days.', barColor: 'green',  iconColor: 'green',  icon: IC.trend },
    { name: 'Adaptive Recommendations',  desc: 'Smart book recommendations matched to each student\'s level and interests.', barColor: 'purple', iconColor: 'purple', icon: IC.target },
    { name: 'Parent Report Generator',   desc: 'Auto-generate parent-friendly progress reports with actionable insights.', barColor: 'orange', iconColor: 'orange', icon: IC.download },
    { name: 'Vocabulary Gap Analysis',   desc: 'Identify vocabulary gaps across your class based on quiz performance data.', barColor: 'gold',   iconColor: 'gold',   icon: IC.activity },
  ];

  return `
    <div class="page-header">
      <h1>Teaching Tools</h1>
    </div>

    <div class="tools-grid">
      ${tools.map(t => `
        <div class="tool-card">
          <div class="tool-card-bar ${t.barColor}"></div>
          <div class="tool-card-body">
            <div class="tool-card-icon ${t.iconColor}">${t.icon}</div>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>`;
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

  // Aggregate class data (use growthData if available, else use current student scores)
  const hasGrowthData = students.some(s => growthData[s.id]);
  const classScores = hasGrowthData
    ? months.map((_, mi) => {
        const validStudents = students.filter(s => growthData[s.id]);
        if (validStudents.length === 0) return 0;
        return Math.round(validStudents.reduce((sum, s) => sum + growthData[s.id].scores[mi], 0) / validStudents.length);
      })
    : months.map(() => Math.round(students.reduce((sum, s) => sum + s.score, 0) / students.length));
  const classAccuracy = hasGrowthData
    ? months.map((_, mi) => {
        const validStudents = students.filter(s => growthData[s.id]);
        if (validStudents.length === 0) return 0;
        return Math.round(validStudents.reduce((sum, s) => sum + growthData[s.id].accuracy[mi], 0) / validStudents.length);
      })
    : months.map(() => Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length));
  const totalKeysAll = students.reduce((s, st) => s + (st.keys || 0), 0);
  const improvingCount = students.filter(s => {
    const gd = growthData[s.id];
    return gd ? gd.scores[5] > gd.scores[0] : false;
  }).length;

  return `
    <div class="page-header">
      <h1>${IC.chart} Growth Reports</h1>
      <div class="page-header-actions">
        <button class="btn btn-ghost btn-sm">${IC.printer} Print Report</button>
        <button class="btn btn-primary btn-sm">${IC.download} Export PDF</button>
      </div>
    </div>

    <div class="report-header-card">
      <div class="report-header-bar"></div>
      <div class="report-header-body">
        <div class="report-header-top">
          <div>
            <h2>Class Growth Report</h2>
            <div class="report-meta">
              <span>${currentUser?.name || 'Teacher'}'s Class</span>
              <span>${IC.calendar} Sep 2025 \u2014 Feb 2026</span>
              <span>${students.length} Students</span>
            </div>
          </div>
          <div class="report-share-badge">
            <span class="badge badge-green">${IC.check} Ready to Share</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">Avg Reading Score</div>
        <div class="stat-card-value">${classScores[5]} ${growthArrow(classScores[0], classScores[5])}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Accuracy</div>
        <div class="stat-card-value">${classAccuracy[5]}% ${growthArrow(classAccuracy[0], classAccuracy[5])}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Total Keys Earned</div>
        <div class="stat-card-value">${totalKeysAll.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Students Improving</div>
        <div class="stat-card-value">${improvingCount}/${students.length}</div>
      </div>
    </div>

    <div class="chart-container">
      <h3>Class Reading Score Trend</h3>
      <p class="chart-subtitle">Average reading score across all students, Sep 2025 \u2013 Feb 2026</p>
      ${svgAreaChart(classScores, months, 'var(--blue)', 620, 220)}
    </div>

    <div class="data-table-wrap" style="margin-top:24px">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Sep Score</th>
            <th>Feb Score</th>
            <th>Change</th>
            <th>Trend</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${[...students].sort((a, b) => {
            const aGd = growthData[a.id];
            const bGd = growthData[b.id];
            const aGain = aGd ? aGd.scores[5] - aGd.scores[0] : 0;
            const bGain = bGd ? bGd.scores[5] - bGd.scores[0] : 0;
            return bGain - aGain;
          }).map(s => {
            const gd = growthData[s.id];
            if (!gd) {
              return `
              <tr onclick="reportStudentId=${s.id}; renderMain();" style="cursor:pointer">
                <td><div class="student-cell">${avatar(s)} <span class="student-name">${s.name}</span> ${warnTag(s)}</div></td>
                <td>${s.score}</td>
                <td><strong>${s.score}</strong></td>
                <td><span style="color:var(--g400)">New</span></td>
                <td><span style="color:var(--g400)">\u2014</span></td>
                <td><span class="badge badge-blue">New</span></td>
              </tr>`;
            }
            const gain = gd.scores[5] - gd.scores[0];
            const gainPct = Math.round((gain / gd.scores[0]) * 100);
            let statusCls = 'green', statusLabel = 'Improving';
            if (gainPct < 5) { statusCls = 'gold'; statusLabel = 'Steady'; }
            if (gainPct < 0) { statusCls = 'red'; statusLabel = 'Declining'; }
            return `
            <tr onclick="reportStudentId=${s.id}; renderMain();" style="cursor:pointer">
              <td><div class="student-cell">${avatar(s)} <span class="student-name">${s.name}</span> ${warnTag(s)}</div></td>
              <td>${gd.scores[0]}</td>
              <td><strong>${gd.scores[5]}</strong></td>
              <td><span class="growth-arrow ${gain >= 0 ? 'up' : 'down'}">${gain >= 0 ? IC.arrowUp + '+' : IC.arrowDown}${Math.abs(gain)} pts</span></td>
              <td>${miniChart(gd.scores, gain >= 50 ? 'var(--green)' : 'var(--gold)', 80, 28)}</td>
              <td><span class="badge badge-${statusCls}">${statusLabel}</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="info-panel" style="margin-top:24px">
      <h4>${IC.bulb} Key Insights</h4>
      <ul class="insight-list">
        <li>${improvingCount} of ${students.length} students showed reading score improvement since September</li>
        <li>Class average reading score increased by ${classScores[5] - classScores[0]} points (+${Math.round(((classScores[5] - classScores[0]) / classScores[0]) * 100)}%)</li>
        <li>Average accuracy improved from ${classAccuracy[0]}% to ${classAccuracy[5]}% (+${classAccuracy[5] - classAccuracy[0]} percentage points)</li>
        <li>Students collectively earned ${totalKeysAll.toLocaleString()} Keys, demonstrating consistent engagement</li>
      </ul>
    </div>`;
}

// ---- Page: Individual Student Report ----
function renderStudentReport() {
  const s = students.find(x => x.id === reportStudentId);
  if (!s) return '<p>Student not found.</p>';
  const gd = growthData[s.id];

  // If no growth data exists for this student, show a simplified report
  if (!gd) {
    return `
      <button class="back-btn" onclick="reportStudentId=null; renderMain()">${IC.arrowLeft} Back to Class Report</button>
      <div class="report-header-card">
        <div class="report-header-bar"></div>
        <div class="report-header-body">
          <div class="report-header-top">
            <div style="display:flex;align-items:center;gap:16px">
              ${avatar(s, 'lg')}
              <div>
                <h2>${s.name} ${warnTag(s)}</h2>
                <div class="report-meta">
                  <span>Grade: ${s.grade}</span>
                  <span>Level ${s.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="stat-cards">
        <div class="stat-card"><div class="stat-card-label">Reading Score</div><div class="stat-card-value">${s.score}</div></div>
        <div class="stat-card"><div class="stat-card-label">Accuracy</div><div class="stat-card-value">${s.accuracy}%</div></div>
        <div class="stat-card"><div class="stat-card-label">Keys Earned</div><div class="stat-card-value">${(s.keys || 0).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-card-label">Quizzes Taken</div><div class="stat-card-value">${s.quizzes || 0}</div></div>
      </div>
      <div class="info-panel" style="margin-top:24px">
        <h4>${IC.info} Growth Data</h4>
        <p>More detailed growth data will appear as ${s.name.split(' ')[0]} completes more quizzes over time.</p>
      </div>`;
  }

  return `
    <button class="back-btn" onclick="reportStudentId=null; renderMain()">${IC.arrowLeft} Back to Class Report</button>

    <div class="report-header-card">
      <div class="report-header-bar"></div>
      <div class="report-header-body">
        <div class="report-header-top">
          <div style="display:flex;align-items:center;gap:16px">
            ${avatar(s, 'lg')}
            <div>
              <h2>${s.name} ${warnTag(s)}</h2>
              <div class="report-meta">
                <span>Grade: ${s.grade}</span>
                <span>Level ${s.level}</span>
                <span>${IC.calendar} Sep 2025 \u2014 Feb 2026</span>
              </div>
            </div>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-ghost btn-sm">${IC.printer} Print</button>
            <button class="btn btn-primary btn-sm">${IC.download} Export PDF</button>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">Reading Score</div>
        <div class="stat-card-value">${s.score} ${growthArrow(gd.scores[0], gd.scores[5])}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Accuracy</div>
        <div class="stat-card-value">${s.accuracy}% ${growthArrow(gd.accuracy[0], gd.accuracy[5])}</div>
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
      ${svgAreaChart(gd.scores, months, 'var(--blue)', 620, 220)}
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
  else if (selectedInterests.length < 4) selectedInterests.push(tagId);
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
  const job = document.getElementById('survey-dream-job');
  const place = document.getElementById('survey-fav-place');
  const fact = document.getElementById('survey-fun-fact');
  if (job) window._surveyDreamJob = job.value;
  if (place) window._surveyFavPlace = place.value;
  if (fact) window._surveyFunFact = fact.value;
}

async function saveOnboarding() {
  const s = students.find(x => x.id === onboardingStudent);
  if (s) {
    s.interests.tags = [...selectedInterests];
    s.interests.readingStyle = selectedReadingStyle || 'detailed';
    const genreSelect = document.getElementById('genre-select');
    s.interests.favoriteGenre = genreSelect ? genreSelect.value : 'Fantasy';
    s.interests.onboarded = true;

    // Save to backend DB
    try {
      await API.updateSurvey(s.id, {
        interest_tags: JSON.stringify(selectedInterests),
        reading_style: selectedReadingStyle || 'detailed',
        favorite_genre: genreSelect ? genreSelect.value : 'Fantasy',
        hobbies: JSON.stringify(window._surveyHobbies || []),
        favorite_animals: JSON.stringify(window._surveyAnimals || []),
        dream_job: window._surveyDreamJob || '',
        favorite_place: window._surveyFavPlace || '',
        fun_fact: window._surveyFunFact || ''
      });
    } catch(e) { console.log('Survey save (offline mode):', e.message); }
  }

  // Mark current user as onboarded so the wizard won't re-trigger
  if (currentUser) currentUser.onboarded = 1;

  // Clean up
  onboardingStep = 0;
  onboardingStudent = null;
  selectedInterests = [];
  window._surveyHobbies = [];
  window._surveyAnimals = [];
  window._surveyDreamJob = '';
  window._surveyFavPlace = '';
  window._surveyFunFact = '';
  closeModal();
  renderMain();
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
        <div style="margin:0 auto 20px">${avatar(s, 'lg')}</div>
        <h2 style="text-align:center;margin-bottom:8px">Welcome, ${s.name.split(' ')[0]}!</h2>
        <p style="text-align:center;color:var(--g500);margin-bottom:24px">We'd love to learn about you! Answer a few fun questions so your teacher can get to know you better.</p>
        <div style="text-align:center">
          <button class="btn btn-primary" onclick="nextOnboardingStep()">Let's Go!</button>
        </div>
      </div>`;
  } else if (onboardingStep === 1) {
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">What do you love?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px">Pick 2\u20134 topics that interest you the most.</p>
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
      <p style="text-align:center;color:var(--g400);font-size:0.8125rem;margin-top:12px">${selectedInterests.length}/4 selected ${selectedInterests.length < 2 ? '(pick at least 2)' : ''}</p>
      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()" ${selectedInterests.length < 2 ? 'disabled style="opacity:0.5;pointer-events:none"' : ''}>Next</button>
      </div>`;
  } else if (onboardingStep === 2) {
    const hobbyOptions = [
      { id: 'drawing', label: 'Drawing', icon: '🎨' }, { id: 'sports', label: 'Sports', icon: '⚽' },
      { id: 'reading', label: 'Reading', icon: '📚' }, { id: 'gaming', label: 'Video Games', icon: '🎮' },
      { id: 'music', label: 'Music', icon: '🎵' }, { id: 'cooking', label: 'Cooking', icon: '🍳' },
      { id: 'building', label: 'Building / LEGO', icon: '🧱' }, { id: 'coding', label: 'Coding', icon: '💻' },
      { id: 'swimming', label: 'Swimming', icon: '🏊' }, { id: 'dance', label: 'Dance', icon: '💃' },
      { id: 'writing', label: 'Writing Stories', icon: '✏️' }, { id: 'nature', label: 'Nature / Outdoors', icon: '🌳' },
      { id: 'science', label: 'Science Experiments', icon: '🔬' }, { id: 'skateboarding', label: 'Skateboarding', icon: '🛹' },
      { id: 'baking', label: 'Baking', icon: '🧁' }, { id: 'gardening', label: 'Gardening', icon: '🌱' },
    ];
    if (!window._surveyHobbies) window._surveyHobbies = [];
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">What do you like to do for fun?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px">Pick your favorite hobbies and activities!</p>
      <div class="survey-chips" style="justify-content:center">
        ${hobbyOptions.map(h => `
          <div class="survey-chip ${(window._surveyHobbies||[]).includes(h.id)?'selected':''}" onclick="toggleSurveyChip('hobbies','${h.id}')">
            <span class="chip-icon">${h.icon}</span> ${h.label}
          </div>
        `).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 3) {
    const animalOptions = [
      { id: 'dogs', label: 'Dogs', icon: '🐕' }, { id: 'cats', label: 'Cats', icon: '🐱' },
      { id: 'horses', label: 'Horses', icon: '🐴' }, { id: 'dolphins', label: 'Dolphins', icon: '🐬' },
      { id: 'birds', label: 'Birds', icon: '🦜' }, { id: 'rabbits', label: 'Rabbits', icon: '🐰' },
      { id: 'turtles', label: 'Turtles', icon: '🐢' }, { id: 'lizards', label: 'Lizards', icon: '🦎' },
      { id: 'wolves', label: 'Wolves', icon: '🐺' }, { id: 'butterflies', label: 'Butterflies', icon: '🦋' },
      { id: 'owls', label: 'Owls', icon: '🦉' }, { id: 'fish', label: 'Fish', icon: '🐠' },
    ];
    if (!window._surveyAnimals) window._surveyAnimals = [];
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">Tell us about your favorites!</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px">This helps us make your quizzes super interesting.</p>

      <div class="survey-section">
        <div class="survey-section-label">Favorite Animals (pick a few!)</div>
        <div class="survey-chips">
          ${animalOptions.map(a => `
            <div class="survey-chip ${(window._surveyAnimals||[]).includes(a.id)?'selected':''}" onclick="toggleSurveyChip('animals','${a.id}')">
              <span class="chip-icon">${a.icon}</span> ${a.label}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="survey-section">
        <div class="survey-section-label">What do you want to be when you grow up?</div>
        <input class="survey-input" id="survey-dream-job" placeholder="e.g., Veterinarian, Astronaut, Chef..." value="${window._surveyDreamJob||''}">
      </div>

      <div class="survey-section">
        <div class="survey-section-label">Favorite place in the world?</div>
        <input class="survey-input" id="survey-fav-place" placeholder="e.g., The beach, a treehouse, outer space..." value="${window._surveyFavPlace||''}">
      </div>

      <div class="survey-section">
        <div class="survey-section-label">A fun fact about you!</div>
        <input class="survey-input" id="survey-fun-fact" placeholder="e.g., I can juggle, I have 3 pets..." value="${window._surveyFunFact||''}">
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="saveSurveyInputs(); prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="saveSurveyInputs(); nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 4) {
    const styles = [
      { id: 'detailed', label: 'Detailed Reader', desc: 'I like lots of details', icon: IC.bookOpen },
      { id: 'visual',   label: 'Visual Learner',  desc: 'Show me pictures',      icon: IC.eye },
      { id: 'fast',     label: 'Speed Reader',    desc: 'I read fast',            icon: IC.fire },
    ];
    stepContent = `
      <h3 style="text-align:center;margin-bottom:4px">How do you like to read?</h3>
      <p style="text-align:center;color:var(--g500);margin-bottom:20px">Choose the style that fits you best.</p>
      <div class="reading-style-grid">
        ${styles.map(st => `
          <div class="interest-card ${selectedReadingStyle === st.id ? 'selected' : ''}" onclick="selectReadingStyle('${st.id}')">
            <div class="interest-card-icon blue">${st.icon}</div>
            <span>${st.label}</span>
            <span style="font-size:0.6875rem;color:var(--g400)">${st.desc}</span>
          </div>
        `).join('')}
      </div>

      <div class="form-group" style="margin-top:20px">
        <label class="form-label">What's your favorite kind of story?</label>
        <select class="form-select" id="genre-select">
          <option>Fantasy</option><option>Mystery</option><option>Realistic Fiction</option>
          <option>Sci-Fi</option><option>Adventure</option><option>Sports Fiction</option>
          <option>Non-Fiction</option><option>Funny Stories</option><option>Historical Fiction</option>
        </select>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px">
        <button class="btn btn-ghost" onclick="prevOnboardingStep()">Back</button>
        <button class="btn btn-primary" onclick="nextOnboardingStep()">Next</button>
      </div>`;
  } else if (onboardingStep === 5) {
    const hobbies = (window._surveyHobbies || []).slice(0, 4);
    const animals = (window._surveyAnimals || []).slice(0, 3);
    stepContent = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="margin:0 auto 12px">${avatar(s, 'lg')}</div>
        <h2>You're all set, ${s.name.split(' ')[0]}!</h2>
        <p style="color:var(--g500);margin-top:6px">Thanks for telling us about yourself!</p>
      </div>
      <div style="margin-bottom:16px">
        <span class="interest-profile-label" style="display:block;margin-bottom:6px">Your Interests</span>
        <div class="interest-tags-wrap">
          ${selectedInterests.map(tagId => {
            const cat = interestCategories.find(c => c.id === tagId);
            return cat ? `<span class="interest-tag ${cat.color}">${cat.label}</span>` : '';
          }).join('')}
        </div>
      </div>
      ${hobbies.length > 0 ? `<div style="margin-bottom:12px"><span class="interest-profile-label" style="display:block;margin-bottom:4px">Hobbies</span><span style="color:var(--g600);font-size:0.85rem">${hobbies.join(', ')}</span></div>` : ''}
      ${animals.length > 0 ? `<div style="margin-bottom:12px"><span class="interest-profile-label" style="display:block;margin-bottom:4px">Favorite Animals</span><span style="color:var(--g600);font-size:0.85rem">${animals.join(', ')}</span></div>` : ''}
      ${window._surveyDreamJob ? `<div style="margin-bottom:12px"><span class="interest-profile-label" style="display:block;margin-bottom:4px">Dream Job</span><span style="color:var(--g600);font-size:0.85rem">${window._surveyDreamJob}</span></div>` : ''}

      <div style="display:flex;justify-content:space-between;margin-top:20px">
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

  if (type === 'assign') {
    html = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal modal-lg" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>Assign Assessment</h3>
            <button class="modal-close" onclick="closeModal()">${IC.x}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Assessment Name</label>
              <input type="text" class="form-input" value="${prefill || ''}" placeholder="e.g. Charlotte's Web Quiz">
            </div>
            <div class="form-group">
              <label class="form-label">Assign To</label>
              <select class="form-select">
                <option>Entire Class</option>
                <option>Reading Group A</option>
                <option>Struggling Readers</option>
                <option>Individual Student</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Due Date</label>
              <input type="date" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Instructions (optional)</label>
              <textarea class="form-input" placeholder="Add any special instructions for students..."></textarea>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="closeModal()">Assign</button>
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
                <option>Avg Comprehension %</option>
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
// ---- STUDENT DASHBOARD PAGES ----
// ============================================================

function renderStudentDashboard() {
  let s = {
    id: currentUser?.studentId || 0,
    name: currentUser?.name || 'Student',
    keys: currentUser?.keys_earned || 0,
    quizzes: currentUser?.quizzes_completed || 0,
    onboarded: currentUser?.onboarded || 0
  };
  const hasQuizzes = s.quizzes > 0;

  // Weekly stats (fetched during loadApp)
  const w = currentUser?.weeklyStats || { keysThisWeek: 0, quizzesThisWeek: 0, booksCompletedThisWeek: 0 };
  const totalBooksCompleted = currentUser?.totalBooksCompleted || 0;

  return `
    <div class="page-header"><h1>Welcome${hasQuizzes ? ' back' : ''}, ${s.name.split(' ')[0]}!</h1></div>

    ${!s.onboarded ? `
    <div class="interest-cta-card" style="margin-bottom:24px">
      <h3 style="margin-bottom:8px">Personalize Your Experience!</h3>
      <p style="margin-bottom:16px">Tell us about your interests so we can make your quizzes more fun!</p>
      <button class="btn btn-primary" onclick="onboardingStudent=${s.id}; onboardingStep=0; openModal('onboarding')">Set Up My Profile</button>
    </div>` : ''}

    <div class="weekly-wins-section">
      <div class="weekly-wins-header">
        <h2 class="weekly-wins-title">Weekly Wins</h2>
        <span class="weekly-wins-reset">Resets every Monday</span>
      </div>
      <div class="weekly-wins-cards">
        <div class="weekly-win-card weekly-win-keys">
          <div class="weekly-win-emoji">🔑</div>
          <div class="weekly-win-value">${w.keysThisWeek}</div>
          <div class="weekly-win-label">Keys Earned</div>
        </div>
        <div class="weekly-win-card weekly-win-quizzes">
          <div class="weekly-win-emoji">✅</div>
          <div class="weekly-win-value">${w.quizzesThisWeek}</div>
          <div class="weekly-win-label">Quizzes Done</div>
        </div>
        <div class="weekly-win-card weekly-win-books">
          <div class="weekly-win-emoji">📚</div>
          <div class="weekly-win-value">${w.booksCompletedThisWeek}</div>
          <div class="weekly-win-label">Books Finished</div>
        </div>
      </div>
    </div>

    <div class="total-progress-section">
      <h3 class="total-progress-title">Total Progress</h3>
      <div class="total-progress-cards">
        <div class="total-progress-card">
          <span class="total-progress-value">${s.keys}</span>
          <span class="total-progress-label">Keys</span>
        </div>
        <div class="total-progress-card">
          <span class="total-progress-value">${s.quizzes}</span>
          <span class="total-progress-label">Quizzes</span>
        </div>
        <div class="total-progress-card">
          <span class="total-progress-value">${totalBooksCompleted}</span>
          <span class="total-progress-label">Books</span>
        </div>
      </div>
    </div>

    <div style="margin-top:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <h3 style="margin:0;font-size:1rem;font-weight:700">Browse Books</h3>
        <span style="color:var(--g500);font-size:0.8125rem" id="student-book-count">${books.length} books</span>
      </div>
      <div style="position:relative;margin-bottom:16px">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--g400);pointer-events:none">${IC.search}</span>
        <input type="text" id="student-book-search" placeholder="Search books by title, author, or genre..."
          style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--g200);border-radius:var(--radius-md);font-size:0.875rem;outline:none;transition:border-color .2s"
          onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--g200)'">
      </div>
      <div class="book-grid" id="student-book-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
        ${books.length > 0 ? books.map(b => renderStudentBookCard(b)).join('') : `<p style="grid-column:1/-1;color:var(--g500);text-align:center;padding:24px">No books available yet.</p>`}
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

  return `
    <div class="page-header"><h1>My Quizzes</h1></div>
    <div class="stat-cards" style="grid-template-columns: repeat(2, 1fr)">
      <div class="stat-card"><div class="stat-card-label">Quizzes Completed</div><div class="stat-card-value">${s.quizzes}</div></div>
      <div class="stat-card"><div class="stat-card-label">Keys Earned</div><div class="stat-card-value">${s.keys}</div></div>
    </div>

    ${startedBooks.length > 0 ? `
    <div style="margin-top:28px">
      <h3 style="margin:0 0 16px;font-size:1rem;font-weight:700">My Books</h3>
      <div class="book-progress-grid">
        ${startedBooks.map(b => {
          const prog = progressMap[b.id];
          const isComplete = prog && prog.isComplete;
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
              <div class="book-progress-status">${isComplete ? '✅ All done!' : `${prog.completedChapters}/${prog.totalChapters} chapters`}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

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
      <div class="empty-state-icon" style="font-size:2rem">📋</div>
      <h2>No Quizzes Yet</h2>
      <p>Pick a book from the dashboard and start reading!</p>
      <button class="btn btn-primary" onclick="navigate('student-dashboard')">Browse Books</button>
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

  return `
    <div class="page-header"><h1>My Reading Progress</h1></div>

    <div class="weekly-wins-section">
      <div class="weekly-wins-header">
        <h2 class="weekly-wins-title">Weekly Wins</h2>
        <span class="weekly-wins-reset">Resets every Monday</span>
      </div>
      <div class="weekly-wins-cards">
        <div class="weekly-win-card weekly-win-keys">
          <div class="weekly-win-emoji">🔑</div>
          <div class="weekly-win-value">${w.keysThisWeek}</div>
          <div class="weekly-win-label">Keys Earned</div>
        </div>
        <div class="weekly-win-card weekly-win-quizzes">
          <div class="weekly-win-emoji">✅</div>
          <div class="weekly-win-value">${w.quizzesThisWeek}</div>
          <div class="weekly-win-label">Quizzes Done</div>
        </div>
        <div class="weekly-win-card weekly-win-books">
          <div class="weekly-win-emoji">📚</div>
          <div class="weekly-win-value">${w.booksCompletedThisWeek}</div>
          <div class="weekly-win-label">Books Finished</div>
        </div>
      </div>
    </div>

    <div class="total-progress-section" style="margin-top:24px">
      <h3 class="total-progress-title">Total Progress</h3>
      <div class="total-progress-cards">
        <div class="total-progress-card">
          <span class="total-progress-value">${s.keys}</span>
          <span class="total-progress-label">Total Keys</span>
        </div>
        <div class="total-progress-card">
          <span class="total-progress-value">${s.quizzes}</span>
          <span class="total-progress-label">Total Quizzes</span>
        </div>
        <div class="total-progress-card">
          <span class="total-progress-value">${totalBooksCompleted}</span>
          <span class="total-progress-label">Total Books</span>
        </div>
      </div>
    </div>

    ${!hasQuizzes ? `
    <div class="empty-state" style="margin-top:24px">
      <div class="empty-state-icon" style="font-size:2rem">📊</div>
      <h2>No Progress Yet</h2>
      <p>Complete your first quiz to start tracking your reading progress!</p>
      <button class="btn btn-primary" onclick="navigate('library')">Browse Books</button>
    </div>` : ''}
  `;
}

function renderStudentBadges() {
  let s = {
    id: currentUser?.studentId || 0,
    name: currentUser?.name || 'Student',
    level: currentUser?.reading_level || '3.0',
    score: currentUser?.reading_score || 500,
    keys: currentUser?.keys_earned || 0,
    quizzes: currentUser?.quizzes_completed || 0,
    accuracy: currentUser?.accuracy || 0,
    streak: currentUser?.streak_days || 0,
    interests: null
  };
  const badges = [
    { icon: '🔥', name: 'Reading Streak',    desc: `${s.streak} day streak!`, earned: s.streak >= 3, color: 'orange' },
    { icon: '⭐', name: 'Quiz Champion',     desc: 'Complete 10 quizzes',     earned: s.quizzes >= 10, color: 'gold' },
    { icon: '🎯', name: 'Sharp Shooter',     desc: '90%+ accuracy',           earned: s.accuracy >= 90, color: 'green' },
    { icon: '📚', name: 'Bookworm',          desc: 'Read 5 books',            earned: s.quizzes >= 15, color: 'blue' },
    { icon: '🔑', name: 'Key Collector',      desc: 'Earn 500 keys',           earned: s.keys >= 500, color: 'purple' },
    { icon: '📈', name: 'Level Up',           desc: 'Improve reading level',   earned: true, color: 'blue' },
    { icon: '❤️', name: 'Personalized',       desc: 'Set up your profile',     earned: !!(s.interests && s.interests.onboarded), color: 'red' },
    { icon: '✅', name: 'Perfect Score',      desc: 'Get 100% on a quiz',      earned: s.accuracy >= 95, color: 'green' },
  ];

  return `
    <div class="page-header"><h1>My Badges</h1></div>
    <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:16px;margin-top:8px">
      ${badges.map(b => `
        <div class="stat-card" style="text-align:center;padding:24px 16px;${b.earned ? '' : 'opacity:0.4;filter:grayscale(1)'}">
          <div style="width:48px;height:48px;margin:0 auto 12px;border-radius:50%;background:var(--${b.color}-p, var(--g100));display:flex;align-items:center;justify-content:center;color:var(--${b.color}, var(--g500))">${b.icon}</div>
          <div style="font-weight:700;color:var(--navy);margin-bottom:4px">${b.name}</div>
          <div style="font-size:0.75rem;color:var(--g500)">${b.desc}</div>
          ${b.earned ? '<div style="margin-top:8px;font-size:0.7rem;font-weight:700;color:var(--green)">EARNED</div>' : '<div style="margin-top:8px;font-size:0.7rem;font-weight:600;color:var(--g400)">LOCKED</div>'}
        </div>
      `).join('')}
    </div>
  `;
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
      <div class="stat-card"><div class="stat-card-label">Avg Reading Score</div><div class="stat-card-value">${avgScore}</div><div class="stat-card-trend" style="color:var(--green)"><span class="icon-sm">${IC.arrowUp}</span> +14%</div></div>
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  // Detect user role from session
  try {
    const me = await API.getMe();
    if (me.user) {
      currentUser = me.user;
      userRole = me.user.role || 'teacher';
    } else {
      // Not logged in — guest mode
      userRole = 'guest';
      currentUser = null;
    }
  } catch(e) {
    // API error — guest mode
    userRole = 'guest';
    currentUser = null;
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
        students = rawStudents.map(mapStudentFromAPI);
      } catch(e) { console.warn('Could not load students:', e); }

      // Load assignments for this teacher's class
      try {
        const rawAssignments = await API.getAssignments(currentUser.classId);
        assignments = rawAssignments.map(mapAssignmentFromAPI);
      } catch(e) { console.warn('Could not load assignments:', e); }
    }
  }

  // Set default page based on role
  if (userRole === 'student') {
    page = 'student-dashboard';

    // Fetch weekly stats and book progress for the student dashboard
    if (currentUser?.studentId) {
      try {
        const ws = await API.getWeeklyStats(currentUser.studentId);
        currentUser.weeklyStats = ws;
        currentUser.totalBooksCompleted = ws.totalBooksCompleted || 0;
      } catch(e) {
        currentUser.weeklyStats = { keysThisWeek: 0, quizzesThisWeek: 0, booksCompletedThisWeek: 0 };
        currentUser.totalBooksCompleted = 0;
      }
      try {
        currentUser.bookProgress = await API.getBookProgress(currentUser.studentId);
      } catch(e) {
        currentUser.bookProgress = [];
      }
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
  } else if (userRole === 'principal') {
    page = 'principal-dashboard';
  }

  renderSidebar();
  renderHeader();
  renderMain();
});
