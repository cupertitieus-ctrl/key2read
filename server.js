require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./server/db');
const claude = require('./server/claude');

const app = express();
const PORT = process.env.PORT || 3456;

// Trust proxy in production (Render uses a reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'key2read-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Serve only public-safe directories (not server/, package.json, .env, etc.)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages'), { extensions: ['html'] }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));

// ─── Helper: build full session data for a user ───
async function buildSessionUser(user) {
  let sessionUser = { ...user };

  if (user.role === 'student') {
    const studentRecord = await db.getStudentByUserId(user.id);
    if (studentRecord) {
      // Get class info for the student
      const { data: cls } = await db.supabase.from('classes').select('*, users!teacher_id (name)').eq('id', studentRecord.class_id).single();
      sessionUser = {
        ...sessionUser,
        studentId: studentRecord.id,
        classId: studentRecord.class_id,
        className: cls?.name || '',
        teacherName: cls?.users?.name || '',
        reading_level: studentRecord.reading_level || 3.0,
        reading_score: studentRecord.reading_score || 500,
        keys_earned: studentRecord.keys_earned || 0,
        quizzes_completed: studentRecord.quizzes_completed || 0,
        accuracy: studentRecord.accuracy || 0,
        streak_days: studentRecord.streak_days || 0,
        onboarded: studentRecord.onboarded || 0
      };
    }
  } else if (user.role === 'teacher') {
    const cls = await db.getTeacherClass(user.id);
    if (cls) {
      sessionUser.classId = cls.id;
      sessionUser.classCode = cls.class_code;
      sessionUser.className = cls.name;
      sessionUser.grade = cls.grade || '4th';
    }
  }

  return sessionUser;
}

// ─── AUTH ROUTES ───
app.post('/api/auth/login', async (req, res) => {
  const { email, name, classCode, role, password } = req.body;

  try {
    if (role === 'student') {
      // Student login: find by name + class code
      if (!name) return res.status(400).json({ error: 'Please enter your name.' });
      if (!classCode) return res.status(400).json({ error: 'Please enter your class code.' });

      const cls = await db.getClassByCode(classCode);
      if (!cls) return res.status(400).json({ error: 'Invalid class code. Ask your teacher for the correct code.' });

      // Find student by name in this class
      const { data: studentRecords } = await db.supabase
        .from('students')
        .select('*, users!user_id (id, email, name, role)')
        .eq('class_id', cls.id)
        .ilike('name', name.trim());

      if (!studentRecords || studentRecords.length === 0) {
        return res.status(400).json({ error: `No student named "${name}" found in this class. Did you sign up first?` });
      }

      const studentRecord = studentRecords[0];
      const user = studentRecord.users || await db.getUserById(studentRecord.user_id);
      if (!user) return res.status(400).json({ error: 'Student account not found.' });

      const sessionUser = await buildSessionUser(user);
      req.session.userId = user.id;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });

    } else if (role === 'owner') {
      // Owner login: verify email + password
      if (!email) return res.status(400).json({ error: 'Please enter your email.' });
      if (!password) return res.status(400).json({ error: 'Please enter your password.' });

      const ownerEmail = process.env.OWNER_EMAIL;
      const ownerHash = process.env.OWNER_PASSWORD_HASH;
      if (!ownerEmail || !ownerHash) {
        return res.status(400).json({ error: 'Owner account is not configured.' });
      }
      if (email.toLowerCase() !== ownerEmail.toLowerCase()) {
        return res.status(400).json({ error: 'Invalid owner credentials.' });
      }

      const passwordMatch = await bcrypt.compare(password, ownerHash);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid owner credentials.' });
      }

      // Owner is authenticated
      const sessionUser = {
        id: 0,
        name: 'Owner',
        email: ownerEmail,
        role: 'owner',
      };
      req.session.userId = 0;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });

    } else {
      // Teacher / Principal login: find by email
      if (!email) return res.status(400).json({ error: 'Please enter your email.' });

      const user = await db.getUserByEmail(email);
      if (!user) return res.status(400).json({ error: 'No account found with this email. Did you sign up first?' });

      const sessionUser = await buildSessionUser(user);
      req.session.userId = user.id;
      req.session.user = sessionUser;
      return res.json({ success: true, user: sessionUser });
    }
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/demo-login', async (req, res) => {
  const { name, email, role } = req.body;
  let user = await db.getUserByEmail(email || 'sarah@demo.com');
  if (!user) {
    user = await db.createUser({ email, name: name || 'Demo Teacher', role: role || 'teacher', auth_provider: 'demo' });
    // If teacher, create a class for them
    if ((role || 'teacher') === 'teacher') {
      const cls = await db.createClass(`${name || 'Demo Teacher'}'s Class`, '4th', user.id);
      user.classId = cls.id;
      user.classCode = cls.class_code;
    }
  }
  const sessionUser = await buildSessionUser(user);
  req.session.userId = user.id;
  req.session.user = sessionUser;
  res.json({ success: true, user: sessionUser });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const parts = credential.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const { email, name, picture, sub } = payload;

    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({ email, name, role: 'teacher', auth_provider: 'google', auth_id: sub, avatar_url: picture });
      // Create class for new teacher
      const cls = await db.createClass(`${name}'s Class`, '4th', user.id);
      user.classId = cls.id;
      user.classCode = cls.class_code;
    }
    const sessionUser = await buildSessionUser(user);
    req.session.userId = user.id;
    req.session.user = sessionUser;
    res.json({ success: true, user: sessionUser });
  } catch (e) {
    console.error('Google auth error:', e);
    res.status(400).json({ error: 'Invalid Google credential' });
  }
});

app.post('/api/auth/clever', async (req, res) => {
  const { code } = req.body;
  try {
    if (process.env.CLEVER_CLIENT_ID && process.env.CLEVER_CLIENT_ID !== 'your-clever-client-id-here') {
      const tokenResp = await fetch('https://clever.com/oauth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(process.env.CLEVER_CLIENT_ID + ':' + process.env.CLEVER_CLIENT_SECRET).toString('base64') },
        body: JSON.stringify({ code, grant_type: 'authorization_code', redirect_uri: `http://localhost:${PORT}/api/auth/clever/callback` })
      });
      const tokenData = await tokenResp.json();
      const meResp = await fetch('https://api.clever.com/v3.0/me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const meData = await meResp.json();
      const profile = meData.data;

      let user = await db.getUserByAuthId(profile.id, 'clever');
      if (!user) {
        user = await db.createUser({
          email: profile.email || `${profile.id}@clever.com`,
          name: profile.name?.first + ' ' + profile.name?.last,
          role: profile.type || 'teacher',
          auth_provider: 'clever',
          auth_id: profile.id
        });
      }
      req.session.userId = user.id;
      req.session.user = user;
      return res.json({ success: true, user });
    }
    // Demo Clever login
    let user = await db.getUserByEmail('sarah@demo.com');
    if (!user) {
      user = await db.createUser({ email: 'sarah@demo.com', name: 'Sarah Johnson', role: 'teacher', auth_provider: 'demo' });
    }
    const sessionUser = await buildSessionUser(user);
    req.session.userId = user.id;
    req.session.user = sessionUser;
    res.json({ success: true, user: sessionUser, demo: true });
  } catch (e) {
    console.error('Clever auth error:', e);
    res.status(400).json({ error: 'Clever authentication failed' });
  }
});

app.get('/api/auth/me', (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.json({ user: null });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role, school, classCode } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    // Check if email already exists (for teacher/principal)
    if (email) {
      const existing = await db.getUserByEmail(email);
      if (existing) return res.status(400).json({ error: 'An account with this email already exists' });
    }

    if (role === 'student') {
      if (!classCode) return res.status(400).json({ error: 'Class code is required for students' });
      const cls = await db.getClassByCode(classCode);
      if (!cls) return res.status(400).json({ error: 'Invalid class code. Ask your teacher for the correct code.' });

      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@student.key2read.com`;
      const user = await db.createUser({ email: userEmail, name, role: 'student', auth_provider: 'local', school: school || '' });
      const student = await db.createStudent(name, cls.id, user.id);

      req.session.userId = user.id;
      req.session.user = {
        ...user,
        studentId: student.id,
        classId: cls.id,
        className: cls.name,
        teacherName: cls.teacher_name,
        reading_level: student.reading_level || 3.0,
        reading_score: student.reading_score || 500,
        keys_earned: student.keys_earned || 0,
        quizzes_completed: student.quizzes_completed || 0,
        accuracy: student.accuracy || 0,
        streak_days: student.streak_days || 0,
        onboarded: student.onboarded || 0
      };
      return res.json({ success: true, user: req.session.user });

    } else if (role === 'principal') {
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@key2read.com`;
      const user = await db.createUser({ email: userEmail, name, role: 'principal', auth_provider: 'local', school: school || '' });
      req.session.userId = user.id;
      req.session.user = user;
      return res.json({ success: true, user });

    } else {
      // Teacher signup (default)
      const userEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@key2read.com`;
      const user = await db.createUser({ email: userEmail, name, role: 'teacher', auth_provider: 'local', school: school || '' });
      const grade = req.body.grade || '4th';
      const cls = await db.createClass(`${name}'s Class`, grade, user.id);

      req.session.userId = user.id;
      req.session.user = { ...user, classId: cls.id, classCode: cls.class_code };
      return res.json({ success: true, user: req.session.user, classCode: cls.class_code });
    }
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ─── STUDENT ROUTES ───
app.get('/api/students', async (req, res) => {
  const classId = req.query.classId || req.session.user?.classId;
  if (!classId) return res.json([]);
  const students = await db.getStudents(classId);
  res.json(students);
});

app.get('/api/students/:id', async (req, res) => {
  const s = await db.getStudent(parseInt(req.params.id));
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

app.put('/api/students/:id/survey', async (req, res) => {
  const id = parseInt(req.params.id);
  await db.updateStudentSurvey(id, req.body);
  const student = await db.getStudent(id);
  res.json({ success: true, student });
});

app.get('/api/students/:id/reading-history', async (req, res) => {
  const history = await db.getReadingHistory(parseInt(req.params.id));
  res.json(history);
});

app.get('/api/students/:id/quiz-results', async (req, res) => {
  const results = await db.getStudentResults(parseInt(req.params.id));
  res.json(results);
});

// ─── WEEKLY STATS ───
app.get('/api/students/:id/weekly-stats', async (req, res) => {
  try {
    const stats = await db.getWeeklyStats(parseInt(req.params.id));
    res.json(stats);
  } catch (e) {
    console.error('Weekly stats error:', e);
    res.status(500).json({ error: 'Failed to load weekly stats' });
  }
});

// ─── BOOK PROGRESS (for My Quizzes page) ───
app.get('/api/students/:id/book-progress', async (req, res) => {
  try {
    const progress = await db.getStudentBookProgress(parseInt(req.params.id));
    res.json(progress);
  } catch (e) {
    console.error('Book progress error:', e);
    res.status(500).json({ error: 'Failed to load book progress' });
  }
});

// ─── STUDENT PERFORMANCE (Reading Score 0-1000) ───
app.get('/api/students/:id/performance', async (req, res) => {
  try {
    const performance = await db.getStudentPerformance(parseInt(req.params.id));
    res.json(performance);
  } catch (e) {
    console.error('Student performance error:', e);
    res.status(500).json({ error: 'Failed to load performance data' });
  }
});

// ─── CHAPTER PROGRESS ───
app.get('/api/students/:id/completed-chapters/:bookId', async (req, res) => {
  const studentId = parseInt(req.params.id);
  const bookId = parseInt(req.params.bookId);
  try {
    const completed = await db.getCompletedChapters(studentId, bookId);
    res.json({ completed });
  } catch (e) {
    console.error('Completed chapters error:', e);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// ─── BOOK ROUTES ───
app.get('/api/books', async (req, res) => {
  const books = await db.getBooks();
  res.json(books);
});

app.get('/api/books/:id/chapters', async (req, res) => {
  const chapters = await db.getBookChapters(parseInt(req.params.id));
  res.json(chapters);
});

app.get('/api/books/:bookId/chapters/:num/quiz', async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const chapterNum = parseInt(req.params.num);
  const chapter = await db.getChapterByBookAndNum(bookId, chapterNum);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  let questions = await db.getChapterQuiz(chapter.id);
  if (questions.length > 0) {
    // Parse JSON fields if stored as strings (Supabase JSONB returns objects already)
    questions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
    }));
    return res.json({ chapter, questions });
  }

  // Generate quiz using Claude API
  const book = await db.getBookById(bookId);
  const allChapters = await db.getBookChapters(bookId);
  const questionCount = allChapters.length <= 9 ? 7 : 5;
  const generated = await claude.generateChapterQuiz(book.title, book.author, chapterNum, chapter.title, chapter.summary, book.grade_level, questionCount);

  // Save generated questions to DB
  for (const q of generated.questions) {
    await db.insertQuizQuestion({
      chapter_id: chapter.id,
      question_number: q.question_number,
      question_type: q.question_type,
      question_text: q.question_text,
      passage_excerpt: q.passage_excerpt || '',
      options: q.options,
      correct_answer: q.correct_answer,
      strategy_type: q.strategy_type,
      strategy_tip: q.strategy_tip,
      explanation: q.explanation,
      vocabulary_words: q.vocabulary_words || []
    });
  }

  questions = (await db.getChapterQuiz(chapter.id)).map(q => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
    vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
  }));
  res.json({ chapter, questions });
});

// ─── Full Book Quiz (20 questions across all chapters) ───
app.get('/api/books/:bookId/full-quiz', async (req, res) => {
  const bookId = parseInt(req.params.bookId);

  // Books without full book quizzes (all books)
  const noFullQuiz = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69];
  if (noFullQuiz.includes(bookId)) return res.status(404).json({ error: 'Full book quiz is not available for this book' });

  try {
    const { chapters, allQuestions } = await db.getFullBookQuiz(bookId);
    if (!chapters.length || !allQuestions.length) return res.status(404).json({ error: 'No quiz data found' });

    // Parse JSON fields
    const parsed = allQuestions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []),
      vocabulary_words: typeof q.vocabulary_words === 'string' ? JSON.parse(q.vocabulary_words) : (q.vocabulary_words || [])
    }));

    // Select 20 questions spread across chapters
    const perChapter = Math.max(1, Math.floor(20 / chapters.length));
    const extra = 20 - perChapter * chapters.length;
    let selected = [];

    chapters.forEach((ch, idx) => {
      const chQuestions = parsed.filter(q => q.chapter_id === ch.id);
      // Shuffle
      for (let i = chQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chQuestions[i], chQuestions[j]] = [chQuestions[j], chQuestions[i]];
      }
      const take = idx < extra ? perChapter + 1 : perChapter;
      selected.push(...chQuestions.slice(0, Math.min(take, chQuestions.length)));
    });

    // If we still have fewer than 20, grab more from any chapter
    if (selected.length < 20) {
      const selectedIds = new Set(selected.map(q => q.id));
      const remaining = parsed.filter(q => !selectedIds.has(q.id));
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      selected.push(...remaining.slice(0, 20 - selected.length));
    }

    // Cap at 20
    selected = selected.slice(0, 20);

    // Attach chapter info to each question for vocab lookup
    selected.forEach(q => {
      const ch = chapters.find(c => c.id === q.chapter_id);
      if (ch) q._chapterVocab = ch.key_vocabulary;
    });

    res.json({
      chapter: { id: null, chapter_number: 0, title: 'Full Book Quiz', key_vocabulary: [] },
      questions: selected,
      chapters
    });
  } catch(e) {
    res.status(500).json({ error: 'Failed to load full book quiz' });
  }
});

// ─── QUIZ / AI ROUTES ───
app.post('/api/quiz/personalize', async (req, res) => {
  const { questionId, studentId } = req.body;
  const { data: question } = await db.supabase.from('quiz_questions').select('*').eq('id', questionId).single();
  const student = await db.getStudent(studentId);
  if (!question || !student) return res.status(404).json({ error: 'Not found' });
  const personalized = await claude.personalizeQuestion(question, student);
  res.json(personalized);
});

app.post('/api/quiz/personalize-all', async (req, res) => {
  const { chapterId, studentId } = req.body;
  const questions = await db.getChapterQuiz(chapterId);
  const student = await db.getStudent(studentId);
  if (!student || questions.length === 0) return res.status(404).json({ error: 'Not found' });

  const personalized = [];
  for (const q of questions) {
    const p = await claude.personalizeQuestion(q, student);
    personalized.push({
      ...p,
      options: typeof p.options === 'string' ? JSON.parse(p.options) : (p.options || []),
      vocabulary_words: typeof p.vocabulary_words === 'string' ? JSON.parse(p.vocabulary_words) : (p.vocabulary_words || [])
    });
  }
  res.json({ questions: personalized });
});

app.post('/api/quiz/submit', async (req, res) => {
  const { studentId, chapterId, assignmentId, answers, timeTaken, hintCount, attemptData, vocabLookups } = req.body;
  const student = await db.getStudent(studentId);
  const questions = await db.getChapterQuiz(chapterId);
  if (!student || questions.length === 0) return res.status(400).json({ error: 'Invalid submission' });

  let correctCount = 0;
  const strategiesUsed = [];
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
    const studentAnswer = answers[i]; // answer text (from shuffled client options)
    const correctText = opts[q.correct_answer] || '';
    const isCorrect = studentAnswer === correctText;
    if (isCorrect) correctCount++;
    if (q.strategy_type && !strategiesUsed.includes(q.strategy_type)) strategiesUsed.push(q.strategy_type);

    const feedback = await claude.getAnswerFeedback(q.question_text, studentAnswer || 'No answer', correctText, isCorrect, q.strategy_type, student.grade);
    results.push({ questionId: q.id, isCorrect, feedback: feedback.feedback, strategyReminder: feedback.strategy_reminder });
  }

  const { data: chapter } = await db.supabase
    .from('chapters')
    .select('*, books!inner (lexile_level)')
    .eq('id', chapterId)
    .single();

  const score = (correctCount / questions.length) * 100;
  const levelChange = claude.calculateReadingLevelChange(student.reading_score, chapter?.books?.lexile_level || 600, correctCount, questions.length);
  // 5 keys if pass (>=80%), 4 if used try-again at all, 0 if fail
  const hints = hintCount || 0;
  let keysEarned = score >= 80 ? (hints > 0 ? 4 : 5) : 0;

  // Prevent retake key duplication: if student already passed this chapter, no additional keys
  const { data: existingResults } = await db.supabase
    .from('quiz_results')
    .select('id, score, keys_earned')
    .eq('student_id', studentId)
    .eq('chapter_id', chapterId)
    .gte('score', 80);
  if (existingResults && existingResults.length > 0) {
    keysEarned = 0; // Already earned keys for this chapter
  }

  const newScore = Math.max(200, student.reading_score + levelChange);
  await db.updateReadingLevel(studentId, newScore, 'quiz');

  // Update student stats
  const newAccuracy = Math.round((student.accuracy * student.quizzes_completed + score) / (student.quizzes_completed + 1));
  await db.updateStudentStats(studentId, keysEarned, newAccuracy);

  await db.saveQuizResult({
    studentId, assignmentId, chapterId, answers,
    score, correctCount, totalQuestions: questions.length,
    readingLevelChange: levelChange, keysEarned,
    timeTaken: timeTaken || 0, strategiesUsed,
    hintsUsed: hints,
    attemptData: attemptData || [],
    vocabLookups: vocabLookups || []
  });

  res.json({
    score, correctCount, totalQuestions: questions.length,
    readingLevelChange: levelChange, newReadingScore: newScore,
    newReadingLevel: (newScore / 160).toFixed(1),
    keysEarned, results, strategiesUsed
  });
});

app.post('/api/define', async (req, res) => {
  const { word, context, gradeLevel } = req.body;
  const def = await claude.defineWord(word, context, gradeLevel);
  res.json(def);
});

app.post('/api/strategy', async (req, res) => {
  const { strategyType, question, passage, gradeLevel } = req.body;
  const help = await claude.getStrategyHelp(strategyType, question, passage, gradeLevel);
  res.json(help);
});

app.post('/api/feedback', async (req, res) => {
  const { question, studentAnswer, correctAnswer, isCorrect, strategyType, gradeLevel } = req.body;
  const feedback = await claude.getAnswerFeedback(question, studentAnswer, correctAnswer, isCorrect, strategyType, gradeLevel);
  res.json(feedback);
});

// ─── STUDENT FAVORITES ───
app.get('/api/students/:id/favorites', async (req, res) => {
  try {
    const favorites = await db.getFavoriteBooks(parseInt(req.params.id));
    res.json({ favorites });
  } catch (e) {
    console.error('Get favorites error:', e);
    res.json({ favorites: [] });
  }
});

app.post('/api/students/:id/favorites/toggle', async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ error: 'Missing bookId' });
  try {
    const result = await db.toggleFavoriteBook(parseInt(req.params.id), bookId);
    res.json(result);
  } catch (e) {
    console.error('Toggle favorite error:', e);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// ─── CLASS STORE PURCHASE ───
app.post('/api/store/purchase', async (req, res) => {
  const { studentId, itemName, price } = req.body;
  if (!studentId || !price || price <= 0) return res.status(400).json({ error: 'Invalid purchase data' });
  try {
    const result = await db.deductStudentKeys(studentId, price);
    if (!result.success) return res.status(400).json({ error: result.reason });
    res.json({ success: true, newBalance: result.newBalance, itemName });
  } catch (e) {
    console.error('Store purchase error:', e);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// ─── ASSIGNMENT ROUTES ───
app.post('/api/assignments', async (req, res) => {
  const { classId, bookId, name, chapterStart, chapterEnd, dueDate, personalized } = req.body;
  const teacherId = req.session.userId || 1;
  const assignment = await db.createAssignment({
    class_id: classId || 1,
    teacher_id: teacherId,
    book_id: bookId,
    name,
    chapter_start: chapterStart || 1,
    chapter_end: chapterEnd || 1,
    due_date: dueDate,
    personalized: personalized !== undefined ? personalized : 1
  });
  res.json({ success: true, id: assignment?.id });
});

app.get('/api/assignments', async (req, res) => {
  const classId = req.query.classId || req.session.user?.classId;
  if (!classId) return res.json([]);
  const assignments = await db.getAssignments(classId);
  res.json(assignments);
});

app.get('/api/class/code', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  const cls = await db.getTeacherClass(req.session.userId);
  if (!cls) return res.json({ classCode: null });
  res.json({ classCode: cls.class_code, className: cls.name });
});

app.get('/api/class/validate/:code', async (req, res) => {
  const cls = await db.getClassByCode(req.params.code);
  if (!cls) return res.json({ valid: false });
  res.json({ valid: true, className: cls.name, teacherName: cls.teacher_name, grade: cls.grade });
});

// ─── OWNER ROUTES ───
function requireOwner(req, res, next) {
  if (req.session.user?.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
}

app.get('/api/owner/stats', requireOwner, async (req, res) => {
  try {
    const stats = await db.getOwnerStats();
    res.json(stats);
  } catch (e) {
    console.error('Owner stats error:', e);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

app.get('/api/owner/genres', requireOwner, async (req, res) => {
  try {
    const genres = await db.getGenreDistribution();
    res.json(genres);
  } catch (e) {
    console.error('Owner genres error:', e);
    res.status(500).json({ error: 'Failed to load genre data' });
  }
});

app.get('/api/owner/teachers', requireOwner, async (req, res) => {
  try {
    const teachers = await db.getAllTeachers();
    res.json(teachers);
  } catch (e) {
    console.error('Owner teachers error:', e);
    res.status(500).json({ error: 'Failed to load teachers' });
  }
});

app.get('/api/owner/students', requireOwner, async (req, res) => {
  try {
    const students = await db.getAllStudentsForOwner();
    res.json(students);
  } catch (e) {
    console.error('Owner students error:', e);
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// ─── STATUS ───
app.get('/api/status', (req, res) => {
  res.json({
    version: '1.0.0',
    claudeConfigured: claude.isConfigured(),
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here'),
    cleverConfigured: !!(process.env.CLEVER_CLIENT_ID && process.env.CLEVER_CLIENT_ID !== 'your-clever-client-id-here')
  });
});

// Catch-all
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
(async () => {
  await db.initDB();
  app.listen(PORT, () => {
    console.log(`\n🔑 key2read server running at http://localhost:${PORT}`);
    console.log(`   Dashboard: http://localhost:${PORT}/pages/dashboard.html`);
    console.log(`   Database: ✅ Supabase (PostgreSQL)`);
    console.log(`   Claude API: ${claude.isConfigured() ? '✅ Configured' : '⚠️  Not configured — add CLAUDE_API_KEY to .env'}`);
    console.log(`   Google Auth: ${process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here' ? '✅ Configured' : '⚠️  Not configured — add GOOGLE_CLIENT_ID to .env'}`);
    console.log('');
  });
})();
