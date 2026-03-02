// ============================================================
// key2read — Supabase Database Layer
// ============================================================
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── INIT (no-op for Supabase — schema is managed via SQL Editor) ───
async function initDB() {
  // Verify connection by checking if users table exists
  const { data, error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('   Run the migration SQL in Supabase SQL Editor first!');
    console.error('   File: supabase/migration.sql');
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('⚠️  Database is empty — run: node supabase/seed.js');
  } else {
    console.log('✅ Supabase connected, data found');
  }
}

// ─── QUERY HELPERS (async versions) ───

// Survey fields that are safe to query (favorite_books added separately if column exists)
const SURVEY_FIELDS = 'interest_tags, reading_style, favorite_genre, hobbies, favorite_animals, favorite_sports, favorite_subjects, favorite_foods, dream_job, favorite_place, favorite_color, favorite_movie_or_show, fun_fact, reading_feeling, likes_reading';

async function getStudents(classId) {
  // Try with favorite_books first, fall back without it
  let data, error;
  ({ data, error } = await supabase
    .from('students')
    .select(`*, student_surveys (${SURVEY_FIELDS}, favorite_books)`)
    .eq('class_id', classId || 1)
    .order('name'));

  if (error && error.code === '42703') {
    // favorite_books column doesn't exist yet — retry without it
    ({ data, error } = await supabase
      .from('students')
      .select(`*, student_surveys (${SURVEY_FIELDS})`)
      .eq('class_id', classId || 1)
      .order('name'));
  }

  if (error) { console.error('getStudents error:', error); return []; }

  // Flatten the survey join into the student object
  return (data || []).map(s => {
    const survey = s.student_surveys?.[0] || s.student_surveys || {};
    delete s.student_surveys;
    return {
      ...s,
      interest_tags: survey.interest_tags || '[]',
      reading_style: survey.reading_style || 'detailed',
      favorite_genre: survey.favorite_genre || '',
      hobbies: survey.hobbies || '[]',
      favorite_animals: survey.favorite_animals || '[]',
      favorite_sports: survey.favorite_sports || '[]',
      favorite_subjects: survey.favorite_subjects || '[]',
      favorite_foods: survey.favorite_foods || '[]',
      dream_job: survey.dream_job || '',
      favorite_place: survey.favorite_place || '',
      favorite_color: survey.favorite_color || '',
      favorite_movie_or_show: survey.favorite_movie_or_show || '',
      fun_fact: survey.fun_fact || '',
      reading_feeling: survey.reading_feeling || '',
      likes_reading: survey.likes_reading || '',
      favorite_books: survey.favorite_books || []
    };
  });
}

async function getStudent(id) {
  let data, error;
  ({ data, error } = await supabase
    .from('students')
    .select(`*, student_surveys (${SURVEY_FIELDS}, favorite_books)`)
    .eq('id', id)
    .single());

  if (error && error.code === '42703') {
    ({ data, error } = await supabase
      .from('students')
      .select(`*, student_surveys (${SURVEY_FIELDS})`)
      .eq('id', id)
      .single());
  }

  if (error || !data) return null;

  const survey = data.student_surveys?.[0] || data.student_surveys || {};
  delete data.student_surveys;
  return {
    ...data,
    interest_tags: survey.interest_tags || '[]',
    reading_style: survey.reading_style || 'detailed',
    favorite_genre: survey.favorite_genre || '',
    hobbies: survey.hobbies || '[]',
    favorite_animals: survey.favorite_animals || '[]',
    favorite_sports: survey.favorite_sports || '[]',
    favorite_subjects: survey.favorite_subjects || '[]',
    favorite_foods: survey.favorite_foods || '[]',
    dream_job: survey.dream_job || '',
    favorite_place: survey.favorite_place || '',
    favorite_color: survey.favorite_color || '',
    favorite_movie_or_show: survey.favorite_movie_or_show || '',
    fun_fact: survey.fun_fact || '',
    reading_feeling: survey.reading_feeling || '',
    likes_reading: survey.likes_reading || '',
    favorite_books: survey.favorite_books || []
  };
}

async function updateStudentSurvey(studentId, surveyData) {
  const fields = ['interest_tags', 'reading_style', 'favorite_genre', 'hobbies', 'favorite_animals', 'favorite_sports', 'favorite_subjects', 'favorite_foods', 'dream_job', 'favorite_place', 'favorite_color', 'favorite_movie_or_show', 'fun_fact', 'reading_feeling', 'likes_reading', 'favorite_books'];
  const updates = {};
  for (const f of fields) {
    if (surveyData[f] !== undefined) updates[f] = surveyData[f];
  }
  if (Object.keys(updates).length === 0) return;

  updates.updated_at = new Date().toISOString();

  // Upsert the survey
  await supabase
    .from('student_surveys')
    .upsert({ student_id: studentId, ...updates }, { onConflict: 'student_id' });

  // Mark student as onboarded
  await supabase
    .from('students')
    .update({ onboarded: 1 })
    .eq('id', studentId);
}

async function updateReadingLevel(studentId, newScore, source) {
  const level = (newScore / 160).toFixed(1);

  await supabase
    .from('students')
    .update({ reading_score: newScore, lexile: newScore, reading_level: parseFloat(level) })
    .eq('id', studentId);

  await supabase
    .from('reading_level_history')
    .insert({ student_id: studentId, level: parseFloat(level), lexile: newScore, source: source || 'quiz' });
}

// Book 1 titles — the first book a reader should start with
const BOOK_NUMBER_MAP = {
  56: 1,  // Purple Space Chickens (first in series)
  61: 1,  // Don't Trust the Nacho Hamster
  62: 1,  // Fluff and Robodog
  63: 1,  // Tryouts
  64: 1,  // Life of a Sparkly Turtle
  65: 1,  // Sprinkles and Unicorn
  66: 1,  // Diary of a Famous Cat: Now I Have A Name
  68: 1,  // Dragon Diaries
  71: 1,  // Tiny and Mighty: Sock Rescue (Book 1)
};

async function getBooks() {
  const { data: books } = await supabase.from('books').select('*').order('title');
  if (!books || books.length === 0) return [];

  // Determine which books have quiz questions
  const { data: quizBooks } = await supabase
    .from('chapters')
    .select('book_id, quiz_questions(id)')
    .not('quiz_questions', 'is', null);

  const booksWithQuizzes = new Set();
  if (quizBooks) {
    quizBooks.forEach(ch => {
      if (ch.quiz_questions && ch.quiz_questions.length > 0) {
        booksWithQuizzes.add(ch.book_id);
      }
    });
  }

  return books.map(b => ({
    ...b,
    book_number: BOOK_NUMBER_MAP[b.id] || 2,
    has_quizzes: booksWithQuizzes.has(b.id)
  }));
}

async function getBookChapters(bookId) {
  const { data } = await supabase.from('chapters').select('*').eq('book_id', bookId).order('chapter_number');
  return data || [];
}

async function getChapterQuiz(chapterId) {
  const { data } = await supabase.from('quiz_questions').select('*').eq('chapter_id', chapterId).order('question_number');
  return data || [];
}

async function getChapterByBookAndNum(bookId, chapterNum) {
  const { data } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .eq('chapter_number', chapterNum)
    .single();
  return data || null;
}

async function saveQuizResult(resultData) {
  const { data, error } = await supabase.from('quiz_results').insert({
    student_id: resultData.studentId,
    assignment_id: resultData.assignmentId || null,
    chapter_id: resultData.chapterId,
    answers: resultData.answers,
    score: resultData.score,
    correct_count: resultData.correctCount,
    total_questions: resultData.totalQuestions,
    reading_level_change: resultData.readingLevelChange,
    keys_earned: resultData.keysEarned,
    time_taken_seconds: resultData.timeTaken || 0,
    strategies_used: resultData.strategiesUsed || [],
    hints_used: resultData.hintsUsed || 0,
    attempt_data: resultData.attemptData || [],
    vocab_lookups: resultData.vocabLookups || []
  }).select().single();

  if (error) console.error('saveQuizResult error:', error);
  return data;
}

async function getStudentResults(studentId) {
  const { data } = await supabase
    .from('quiz_results')
    .select(`
      *,
      chapters!inner (
        title,
        chapter_number,
        book_id,
        books!inner ( title )
      )
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });

  // Flatten the join
  return (data || []).map(r => ({
    ...r,
    chapter_title: r.chapters?.title,
    chapter_number: r.chapters?.chapter_number,
    book_id: r.chapters?.book_id,
    book_title: r.chapters?.books?.title,
    chapters: undefined
  }));
}

async function getReadingHistory(studentId) {
  const { data } = await supabase
    .from('reading_level_history')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at');
  return data || [];
}

// ─── USER HELPERS ───

async function getUserByEmail(email) {
  const { data } = await supabase.from('users').select('*').eq('email', email).single();
  return data;
}

async function getUserById(id) {
  const { data } = await supabase.from('users').select('*').eq('id', id).single();
  return data;
}

async function createUser(userData) {
  const { data, error } = await supabase.from('users').insert(userData).select().single();
  if (error) { console.error('createUser error:', error); return null; }
  return data;
}

async function getUserByAuthId(authId, provider) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .eq('auth_provider', provider)
    .single();
  return data;
}

// ─── CLASS HELPERS ───

async function getClassByCode(code) {
  const { data } = await supabase
    .from('classes')
    .select('*, users!teacher_id (name)')
    .eq('class_code', code.toUpperCase())
    .single();

  if (!data) return null;
  return { ...data, teacher_name: data.users?.name, users: undefined };
}

async function createClass(name, grade, teacherId) {
  const code = generateClassCode();
  const { data, error } = await supabase
    .from('classes')
    .insert({ name, grade, teacher_id: teacherId, class_code: code })
    .select()
    .single();

  if (error) { console.error('createClass error:', error); return null; }
  return { id: data.id, class_code: data.class_code };
}

function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createStudent(name, classId, userId, explicitGrade) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const colors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Get class grade if classId provided
  let grade = explicitGrade || '4th';
  if (classId) {
    const { data: cls } = await supabase.from('classes').select('grade').eq('id', classId).single();
    if (cls?.grade) grade = cls.grade;
  }

  const insertData = { name, initials, color, user_id: userId, grade };
  if (classId) insertData.class_id = classId;

  const { data: student, error } = await supabase.from('students').insert(insertData).select().single();

  if (error) { console.error('createStudent error:', error); return null; }

  // Create empty survey
  await supabase.from('student_surveys').upsert({ student_id: student.id }, { onConflict: 'student_id' });

  return await getStudent(student.id);
}

async function getStudentByUserId(userId) {
  const { data } = await supabase.from('students').select('*').eq('user_id', userId).single();
  return data;
}

// ─── ASSIGNMENT HELPERS ───

async function createAssignment(assignmentData) {
  const { data, error } = await supabase.from('assignments').insert(assignmentData).select().single();
  if (error) { console.error('createAssignment error:', error); return null; }
  return data;
}

async function getAssignments(classId) {
  const { data } = await supabase
    .from('assignments')
    .select('*, books (title, author)')
    .eq('class_id', classId || 1)
    .order('created_at', { ascending: false });

  return (data || []).map(a => ({
    ...a,
    book_title: a.books?.title,
    book_author: a.books?.author,
    books: undefined
  }));
}

// ─── QUIZ QUESTION INSERT (for AI-generated quizzes) ───

async function insertQuizQuestion(questionData) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .upsert(questionData, { onConflict: 'chapter_id,question_number' })
    .select()
    .single();
  if (error) console.error('insertQuizQuestion error:', error);
  return data;
}

// ─── BOOK LOOKUP ───

async function getBookById(bookId) {
  const { data } = await supabase.from('books').select('*').eq('id', bookId).single();
  return data;
}

// ─── STUDENT STATS UPDATE ───

async function updateStudentStats(studentId, keysEarned, newAccuracy) {
  await supabase.rpc('update_student_stats_fn', {
    p_student_id: studentId,
    p_keys: keysEarned,
    p_accuracy: newAccuracy
  }).then(({ error }) => {
    // Fallback if RPC doesn't exist: do it with regular update
    if (error) {
      return supabase
        .from('students')
        .select('keys_earned, quizzes_completed')
        .eq('id', studentId)
        .single()
        .then(({ data: s }) => {
          if (!s) return;
          return supabase.from('students').update({
            keys_earned: (s.keys_earned || 0) + keysEarned,
            quizzes_completed: (s.quizzes_completed || 0) + 1,
            accuracy: newAccuracy
          }).eq('id', studentId);
        });
    }
  });
}

// ─── STUDENT FAVORITES ───

async function getFavoriteBooks(studentId) {
  const { data, error } = await supabase
    .from('student_surveys')
    .select('favorite_books')
    .eq('student_id', studentId)
    .limit(1)
    .maybeSingle();
  if (error) { console.error('getFavoriteBooks error:', error); return []; }
  return Array.isArray(data?.favorite_books) ? data.favorite_books : [];
}

async function toggleFavoriteBook(studentId, bookId) {
  let favorites = await getFavoriteBooks(studentId);
  // Ensure bookId types match (compare as numbers)
  const numBookId = Number(bookId);
  const idx = favorites.findIndex(id => Number(id) === numBookId);
  const added = idx === -1;
  if (added) {
    favorites.push(numBookId);
  } else {
    favorites.splice(idx, 1);
  }
  await supabase
    .from('student_surveys')
    .upsert({ student_id: studentId, favorite_books: favorites, updated_at: new Date().toISOString() }, { onConflict: 'student_id' });
  return { favorites, added };
}

// ─── DEDUCT STUDENT KEYS (Class Store Purchase) ───

async function deductStudentKeys(studentId, amount) {
  const { data: student } = await supabase
    .from('students')
    .select('keys_earned')
    .eq('id', studentId)
    .single();
  if (!student) return { success: false, reason: 'Student not found' };
  const current = student.keys_earned || 0;
  if (current < amount) return { success: false, reason: 'Not enough keys' };
  const newBalance = current - amount;
  const { error } = await supabase
    .from('students')
    .update({ keys_earned: newBalance })
    .eq('id', studentId);
  if (error) return { success: false, reason: 'Database error' };
  return { success: true, newBalance };
}

async function addStudentKeys(studentId, amount) {
  const { data: student } = await supabase
    .from('students')
    .select('keys_earned')
    .eq('id', studentId)
    .single();
  if (!student) return { success: false, reason: 'Student not found' };
  const current = student.keys_earned || 0;
  const newBalance = current + amount;
  const { error } = await supabase
    .from('students')
    .update({ keys_earned: newBalance })
    .eq('id', studentId);
  if (error) return { success: false, reason: 'Database error' };
  return { success: true, newBalance };
}

async function recordPurchase(studentId, classId, itemName, price) {
  try {
    const { data, error } = await supabase.from('store_purchases').insert({
      student_id: studentId,
      class_id: classId,
      item_name: itemName,
      price: price
    }).select();
    if (error) {
      console.error('recordPurchase error:', error.message, error.code);
      // If table doesn't exist, try to create it
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('store_purchases table does not exist — creating it now');
        await supabase.rpc('exec_sql', { sql: `
          CREATE TABLE IF NOT EXISTS store_purchases (
            id SERIAL PRIMARY KEY,
            student_id INTEGER REFERENCES students(id),
            class_id INTEGER REFERENCES classes(id),
            item_name TEXT NOT NULL,
            price INTEGER NOT NULL DEFAULT 0,
            purchased_at TIMESTAMPTZ DEFAULT NOW()
          );
        `}).catch(() => {});
        // Retry the insert
        const { error: retryErr } = await supabase.from('store_purchases').insert({
          student_id: studentId, class_id: classId, item_name: itemName, price: price
        });
        if (retryErr) console.error('recordPurchase retry failed:', retryErr.message);
      }
    } else {
      console.log('Purchase recorded:', data);
    }
  } catch (e) {
    console.error('Could not record purchase:', e.message);
  }
}

async function getRecentPurchases(classId) {
  try {
    // Try with fulfilled column first, fall back without it
    let data, error;
    ({ data, error } = await supabase
      .from('store_purchases')
      .select('id, item_name, price, purchased_at, student_id, fulfilled')
      .eq('class_id', classId)
      .order('purchased_at', { ascending: false })
      .limit(50));

    if (error && error.message?.includes('fulfilled')) {
      // Column doesn't exist yet — query without it
      ({ data, error } = await supabase
        .from('store_purchases')
        .select('id, item_name, price, purchased_at, student_id')
        .eq('class_id', classId)
        .order('purchased_at', { ascending: false })
        .limit(50));
    }

    if (error) {
      console.error('getRecentPurchases query error:', error.message, error.code);
      return [];
    }
    // Join student names
    const studentIds = [...new Set((data || []).map(p => p.student_id))];
    if (studentIds.length === 0) return [];
    const { data: students } = await supabase
      .from('students')
      .select('id, name')
      .in('id', studentIds);
    const nameMap = {};
    (students || []).forEach(s => { nameMap[s.id] = s.name; });
    return (data || []).map(p => ({
      id: p.id,
      studentName: nameMap[p.student_id] || 'Unknown',
      itemName: p.item_name,
      price: p.price,
      purchasedAt: p.purchased_at,
      fulfilled: p.fulfilled || false
    }));
  } catch (e) {
    console.warn('Could not get purchases (table may not exist):', e.message);
    return [];
  }
}

// ─── Toggle purchase fulfilled status ───
async function fulfillPurchase(purchaseId, fulfilled) {
  try {
    const { data, error } = await supabase
      .from('store_purchases')
      .update({ fulfilled: fulfilled })
      .eq('id', purchaseId)
      .select()
      .single();
    if (error) {
      console.error('fulfillPurchase error:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error('fulfillPurchase error:', e.message);
    return null;
  }
}

// ─── GET TEACHER CLASS ───

async function getTeacherClass(teacherId) {
  const { data } = await supabase.from('classes').select('*').eq('teacher_id', teacherId).single();
  return data;
}

// ─── OWNER ANALYTICS QUERIES ───

async function getOwnerStats() {
  const [teacherRes, studentRes, classRes, quizRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('classes').select('id', { count: 'exact', head: true }),
    supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
  ]);
  return {
    totalTeachers: teacherRes.count || 0,
    totalStudents: studentRes.count || 0,
    totalClasses: classRes.count || 0,
    totalQuizzes: quizRes.count || 0,
  };
}

async function getGenreDistribution() {
  const { data } = await supabase
    .from('student_surveys')
    .select('favorite_genre');
  if (!data) return [];

  // Count genres
  const counts = {};
  for (const row of data) {
    const genre = row.favorite_genre || 'Not Set';
    counts[genre] = (counts[genre] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

async function getAllTeachers() {
  const { data } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('role', 'teacher')
    .order('created_at', { ascending: false });

  if (!data) return [];

  // For each teacher, get their class info and student count
  const teachers = [];
  for (const t of data) {
    const { data: cls } = await supabase.from('classes').select('id, name, grade, class_code').eq('teacher_id', t.id).single();
    let studentCount = 0;
    if (cls) {
      const { count } = await supabase.from('students').select('id', { count: 'exact', head: true }).eq('class_id', cls.id);
      studentCount = count || 0;
    }
    teachers.push({
      ...t,
      className: cls?.name || 'No class',
      grade: cls?.grade || '-',
      classCode: cls?.class_code || '-',
      studentCount,
    });
  }
  return teachers;
}

async function getAllStudentsForOwner() {
  const { data } = await supabase
    .from('students')
    .select(`
      id, name, initials, color, grade, reading_score, accuracy, keys_earned, quizzes_completed, onboarded, class_id,
      student_surveys (favorite_genre, interest_tags, reading_style),
      classes!class_id (name, class_code, users!teacher_id (name))
    `)
    .order('name');

  if (!data) return [];
  return data.map(s => ({
    id: s.id,
    name: s.name,
    initials: s.initials,
    color: s.color,
    grade: s.grade,
    reading_score: s.reading_score || 500,
    accuracy: s.accuracy || 0,
    keys_earned: s.keys_earned || 0,
    quizzes_completed: s.quizzes_completed || 0,
    onboarded: s.onboarded || 0,
    favorite_genre: s.student_surveys?.[0]?.favorite_genre || s.student_surveys?.favorite_genre || '',
    interest_tags: s.student_surveys?.[0]?.interest_tags || s.student_surveys?.interest_tags || '[]',
    className: s.classes?.name || '',
    classCode: s.classes?.class_code || '',
    teacherName: s.classes?.users?.name || '',
  }));
}

// ─── CHAPTER PROGRESS ───

async function getCompletedChapters(studentId, bookId) {
  // Get all chapter IDs for this book
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('book_id', bookId)
    .order('chapter_number');

  if (!chapters || chapters.length === 0) return [];

  const chapterIds = chapters.map(c => c.id);

  // Get quiz results for these chapters by this student
  const { data: results } = await supabase
    .from('quiz_results')
    .select('chapter_id, score')
    .eq('student_id', studentId)
    .in('chapter_id', chapterIds);

  if (!results) return [];

  // A chapter is completed if there's at least one quiz result for it
  const completedIds = new Set(results.map(r => r.chapter_id));
  return chapters
    .filter(c => completedIds.has(c.id))
    .map(c => c.chapter_number);
}

// ─── STUDENT BOOK PROGRESS (for My Quizzes page) ───

async function getStudentBookProgress(studentId) {
  // Get all quiz results for this student with chapter → book mapping
  const { data: results } = await supabase
    .from('quiz_results')
    .select('chapter_id, chapters!inner(book_id)')
    .eq('student_id', studentId);

  if (!results || results.length === 0) return [];

  // Collect unique book IDs the student has worked on
  const bookIds = [...new Set(results.map(r => r.chapters.book_id))];

  // For each book, get total chapters and how many the student completed
  const progress = [];
  for (const bookId of bookIds) {
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('book_id', bookId);

    const totalChapters = chapters ? chapters.length : 0;
    const chapterIds = chapters ? chapters.map(c => c.id) : [];
    const completedChapterIds = new Set(
      results.filter(r => chapterIds.includes(r.chapter_id)).map(r => r.chapter_id)
    );

    progress.push({
      bookId,
      completedChapters: completedChapterIds.size,
      totalChapters,
      isComplete: totalChapters > 0 && completedChapterIds.size >= totalChapters
    });
  }

  return progress;
}

// ─── WEEKLY STATS ───

async function getWeeklyStats(studentId) {
  // Calculate Monday 00:00:00 UTC of the current week
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - daysSinceMonday);
  monday.setUTCHours(0, 0, 0, 0);
  const mondayISO = monday.toISOString();

  // 1. Get all quiz_results this week for this student, with chapter → book join
  const { data: weekResults } = await supabase
    .from('quiz_results')
    .select(`
      id, keys_earned, reading_level_change, chapter_id,
      chapters!inner (
        chapter_number, book_id,
        books!inner ( id, chapter_count )
      )
    `)
    .eq('student_id', studentId)
    .gte('completed_at', mondayISO);

  // Compute total keys ever earned (all-time sum from all quiz results)
  const { data: allKeysData } = await supabase
    .from('quiz_results')
    .select('keys_earned')
    .eq('student_id', studentId);
  const totalKeysEarned = (allKeysData || []).reduce((sum, r) => sum + (r.keys_earned || 0), 0);

  if (!weekResults || weekResults.length === 0) {
    // Still need total books completed (all-time)
    const totalBooksCompleted = await countBooksCompleted(studentId);
    return { keysThisWeek: 0, quizzesThisWeek: 0, growthScoreThisWeek: 0, booksCompletedThisWeek: 0, totalBooksCompleted, totalKeysEarned };
  }

  // 2. Simple aggregations
  const keysThisWeek = weekResults.reduce((sum, r) => sum + (r.keys_earned || 0), 0);
  const quizzesThisWeek = weekResults.length;
  const growthScoreThisWeek = weekResults.reduce((sum, r) => sum + (r.reading_level_change || 0), 0);

  // 3. Books Completed This Week
  //    A book counts if ALL its chapters have quiz results AND at least one chapter was completed this week
  const bookIdsThisWeek = [...new Set(weekResults.map(r => r.chapters.book_id))];
  let booksCompletedThisWeek = 0;

  for (const bookId of bookIdsThisWeek) {
    const bookInfo = weekResults.find(r => r.chapters.book_id === bookId)?.chapters?.books;
    const totalChapters = bookInfo?.chapter_count || 0;
    if (totalChapters === 0) continue;

    // Get all chapter IDs for this book
    const { data: bookChapters } = await supabase.from('chapters').select('id').eq('book_id', bookId);
    if (!bookChapters) continue;
    const chapterIds = bookChapters.map(c => c.id);

    // Get all completed chapters for this student (all time)
    const { data: allResults } = await supabase
      .from('quiz_results')
      .select('chapter_id')
      .eq('student_id', studentId)
      .in('chapter_id', chapterIds);

    const uniqueCompleted = new Set((allResults || []).map(r => r.chapter_id));
    if (uniqueCompleted.size >= totalChapters) booksCompletedThisWeek++;
  }

  // 4. Total books completed (all time)
  const totalBooksCompleted = await countBooksCompleted(studentId);

  return { keysThisWeek, quizzesThisWeek, growthScoreThisWeek, booksCompletedThisWeek, totalBooksCompleted, totalKeysEarned };
}

async function countBooksCompleted(studentId) {
  // Get all books with chapter counts
  const { data: allBooks } = await supabase.from('books').select('id, chapter_count');
  if (!allBooks) return 0;

  // Get all quiz results for this student
  const { data: allResults } = await supabase
    .from('quiz_results')
    .select('chapter_id, chapters!inner(book_id)')
    .eq('student_id', studentId);

  if (!allResults || allResults.length === 0) return 0;

  // Group completed chapter_ids by book_id
  const bookChapters = {};
  for (const r of allResults) {
    const bid = r.chapters.book_id;
    if (!bookChapters[bid]) bookChapters[bid] = new Set();
    bookChapters[bid].add(r.chapter_id);
  }

  // Count books where all chapters are completed
  let count = 0;
  for (const book of allBooks) {
    if (!book.chapter_count || book.chapter_count === 0) continue;
    const completed = bookChapters[book.id];
    if (completed && completed.size >= book.chapter_count) count++;
  }
  return count;
}

// ─── STUDENT PERFORMANCE (Reading Score 0-1000) ───

async function getStudentPerformance(studentId) {
  // 1. Fetch all quiz results with chapter/book joins
  const { data: allResults } = await supabase
    .from('quiz_results')
    .select(`
      id, score, correct_count, total_questions, time_taken_seconds,
      reading_level_change, keys_earned, hints_used, attempt_data, vocab_lookups,
      strategies_used, completed_at,
      chapters!inner (
        title, chapter_number, book_id,
        books!inner ( title, lexile_level )
      )
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: true });

  const results = allResults || [];

  // 2. Fetch reading level history for sparkline
  const { data: historyData } = await supabase
    .from('reading_level_history')
    .select('level, lexile, source, recorded_at')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: true });
  const history = historyData || [];

  // 3. Fetch student info
  const student = await getStudent(studentId);

  // 3b. Fetch warmup results (included with performance — no separate API call)
  const { data: warmupData } = await supabase
    .from('warmup_results')
    .select('id, book_id, passed, score, correct_count, total_questions, attempts, completed_at')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });
  const warmupResults = warmupData || [];

  // 4. Fetch weekly stats
  const weeklyStats = await getWeeklyStats(studentId);

  // If no quiz results, return empty performance
  if (results.length === 0) {
    return {
      readingScore: student?.reading_score || 500,
      scoreChangeThisWeek: 0,
      scoreChangeLastWeek: 0,
      trend: 'stable',
      sparklineData: [],
      components: buildEmptyComponents(),
      keyActivity: {
        balance: student?.keys_earned || 0,
        earnedThisWeek: weeklyStats.keysThisWeek || 0,
        spentThisWeek: 0
      },
      weeklyStats,
      quizHistory: [],
      warmups: warmupResults
    };
  }

  // ─── Time boundaries ───
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(now);
  thisMonday.setUTCDate(now.getUTCDate() - daysSinceMonday);
  thisMonday.setUTCHours(0, 0, 0, 0);

  const lastMonday = new Date(thisMonday);
  lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);

  const thisWeekResults = results.filter(r => new Date(r.completed_at) >= thisMonday);
  const lastWeekResults = results.filter(r => {
    const d = new Date(r.completed_at);
    return d >= lastMonday && d < thisMonday;
  });

  // Use last 20 quizzes for scoring (recent performance)
  const recent = results.slice(-20);
  const recentScores = recent.map(r => r.score);

  // ─── 1) COMPREHENSION (30%) ───
  const comprehension = calcComprehension(recentScores, thisWeekResults, lastWeekResults);

  // ─── 2) QUIZ EFFORT (20%) ───
  const effort = calcEffort(recent, thisWeekResults, lastWeekResults);

  // ─── 3) SUPPORT & INDEPENDENCE (20%) ───
  const independence = calcIndependence(recent, thisWeekResults, lastWeekResults);

  // ─── 4) VOCABULARY DEVELOPMENT (15%) ───
  const vocabulary = calcVocabulary(results, thisWeekResults, lastWeekResults);

  // ─── 5) MASTERY & PERSISTENCE (15%) ───
  const persistence = calcPersistence(recent, thisWeekResults, lastWeekResults);

  // ─── RECENT FAILURE PENALTY ───
  // "Struggling" = last 3 quizzes in a row all scored below 60%
  const last3 = results.slice(-3);
  const recentFailStreak = last3.length >= 3 && last3.every(r => r.score < 60);

  // ─── COMPOSITE READING SCORE ───
  const compositeScore = Math.round(
    comprehension.score * 0.30 +
    effort.score * 0.20 +
    independence.score * 0.20 +
    vocabulary.score * 0.15 +
    persistence.score * 0.15
  );

  // Week-over-week change
  const thisWeekScoreChange = thisWeekResults.reduce((sum, r) => sum + (r.reading_level_change || 0), 0);
  const lastWeekScoreChange = lastWeekResults.reduce((sum, r) => sum + (r.reading_level_change || 0), 0);

  // Sparkline: reading scores over time from history
  const sparklineData = history.slice(-12).map(h => h.lexile || Math.round(h.level * 160));

  // Trend
  let trend = 'stable';
  if (thisWeekScoreChange > 5) trend = 'improving';
  else if (thisWeekScoreChange < -5) trend = 'declining';

  // Quiz history for the table (most recent 20)
  const quizHistory = results.slice(-20).reverse().map(r => ({
    id: r.id,
    bookTitle: r.chapters?.books?.title || '',
    chapterTitle: r.chapters?.title || '',
    chapterNumber: r.chapters?.chapter_number,
    score: r.score,
    correctCount: r.correct_count,
    totalQuestions: r.total_questions,
    keysEarned: r.keys_earned,
    timeTaken: r.time_taken_seconds,
    hintsUsed: r.hints_used || 0,
    completedAt: r.completed_at
  }));

  return {
    readingScore: compositeScore,
    scoreChangeThisWeek: thisWeekScoreChange,
    scoreChangeLastWeek: lastWeekScoreChange,
    trend,
    sparklineData,
    components: {
      comprehension: { ...comprehension, weight: 30 },
      effort: { ...effort, weight: 20 },
      independence: { ...independence, weight: 20 },
      vocabulary: { ...vocabulary, weight: 15 },
      persistence: { ...persistence, weight: 15 }
    },
    keyActivity: {
      balance: student?.keys_earned || 0,
      earnedThisWeek: weeklyStats.keysThisWeek || 0,
      spentThisWeek: 0
    },
    weeklyStats,
    quizHistory,
    warmups: warmupResults,
    recentFailStreak
  };
}

// ─── Component Calculators ───

function calcComprehension(recentScores, thisWeek, lastWeek) {
  if (recentScores.length === 0) return { score: 0, trend: 'stable', insight: 'No quizzes yet.', details: {} };

  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  // Standard deviation for consistency
  const stdDev = Math.sqrt(recentScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / recentScores.length);
  const consistencyMultiplier = stdDev < 10 ? 1.05 : stdDev < 20 ? 1.0 : stdDev < 30 ? 0.95 : 0.9;

  // Trend: compare recent 5 vs older quizzes
  const recent5 = recentScores.slice(-5);
  const older = recentScores.slice(0, -5);
  const recent5Avg = recent5.length > 0 ? recent5.reduce((a, b) => a + b, 0) / recent5.length : avg;
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avg;
  const trendMultiplier = recent5Avg > olderAvg + 5 ? 1.05 : recent5Avg < olderAvg - 5 ? 0.95 : 1.0;

  let score = Math.round(Math.min(1000, Math.max(0, avg * 10 * consistencyMultiplier * trendMultiplier)));

  const thisWeekScores = thisWeek.map(r => r.score);
  const lastWeekScores = lastWeek.map(r => r.score);
  const thisWeekAvg = thisWeekScores.length > 0 ? thisWeekScores.reduce((a, b) => a + b, 0) / thisWeekScores.length : null;
  const lastWeekAvg = lastWeekScores.length > 0 ? lastWeekScores.reduce((a, b) => a + b, 0) / lastWeekScores.length : null;

  const trend = determineTrend(thisWeekAvg, lastWeekAvg);

  const consistency = stdDev < 10 ? 'Very High' : stdDev < 20 ? 'High' : stdDev < 30 ? 'Medium' : 'Low';
  let insight = score >= 800 ? 'Excellent comprehension — strong and consistent.' :
                score >= 600 ? 'Good comprehension with room to grow.' :
                score >= 400 ? 'Building comprehension skills.' : 'Working on building comprehension.';

  return {
    score, trend, insight,
    details: {
      avgQuizScore: Math.round(avg),
      bestThisWeek: thisWeekScores.length > 0 ? Math.round(Math.max(...thisWeekScores)) : null,
      lowestThisWeek: thisWeekScores.length > 0 ? Math.round(Math.min(...thisWeekScores)) : null,
      totalQuizzes: recentScores.length,
      consistency
    }
  };
}

function calcEffort(recent, thisWeek, lastWeek) {
  if (recent.length === 0) return { score: 0, trend: 'stable', insight: 'No quizzes yet.', details: {} };

  // Time per question — sweet spot is 15-45 seconds
  const timesPerQ = recent.map(r => {
    const total = r.time_taken_seconds || 0;
    const numQ = r.total_questions || 5;
    return total / numQ;
  });
  const avgTimePerQ = timesPerQ.reduce((a, b) => a + b, 0) / timesPerQ.length;

  // Score based on time sweet spot
  let timeScore;
  if (avgTimePerQ >= 15 && avgTimePerQ <= 45) {
    timeScore = 1000; // perfect range
  } else if (avgTimePerQ < 8) {
    timeScore = 300; // rushing
  } else if (avgTimePerQ < 15) {
    timeScore = 300 + (avgTimePerQ - 8) / 7 * 700; // 300–1000 ramp
  } else if (avgTimePerQ <= 60) {
    timeScore = 1000 - (avgTimePerQ - 45) / 15 * 200; // slight decrease past sweet spot
  } else {
    timeScore = 700; // very slow but still trying
  }

  // Completion rate — always 100% since quizzes auto-submit
  const completionRate = 100;
  const rushingRate = Math.round(timesPerQ.filter(t => t < 8).length / timesPerQ.length * 100);

  // Factor in quiz accuracy — good pacing without results indicates disengagement
  const avgAccuracy = recent.reduce((sum, r) => {
    const correct = r.correct_count || 0;
    const total = r.total_questions || 5;
    return sum + correct / total;
  }, 0) / recent.length;
  const accuracyMultiplier = avgAccuracy >= 0.7 ? 1.0 : avgAccuracy >= 0.5 ? 0.85 : avgAccuracy >= 0.3 ? 0.7 : 0.55;

  // Recent failure streak penalty — if last 3 quizzes in a row failed, effort cannot be "Strong"
  const last3 = recent.slice(-3);
  const recentFailStreak = last3.length >= 3 && last3.every(r => r.score < 60);
  const failStreakCap = recentFailStreak ? 700 : 1000; // 700 = below "Strong" threshold of 750

  const score = Math.round(Math.min(failStreakCap, Math.max(0, timeScore * accuracyMultiplier)));

  const thisWeekTPQ = thisWeek.map(r => (r.time_taken_seconds || 0) / (r.total_questions || 5));
  const lastWeekTPQ = lastWeek.map(r => (r.time_taken_seconds || 0) / (r.total_questions || 5));
  const thisAvg = thisWeekTPQ.length > 0 ? thisWeekTPQ.reduce((a, b) => a + b, 0) / thisWeekTPQ.length : null;
  const lastAvg = lastWeekTPQ.length > 0 ? lastWeekTPQ.reduce((a, b) => a + b, 0) / lastWeekTPQ.length : null;

  // For effort, closer to sweet spot is better
  const trend = determineTrend(
    thisAvg !== null ? -Math.abs(thisAvg - 30) : null,
    lastAvg !== null ? -Math.abs(lastAvg - 30) : null
  );

  let insight = recentFailStreak ? 'Recent quizzes suggest more engagement is needed.' :
                score >= 800 ? 'Great pacing — thoughtful and steady.' :
                score >= 600 ? 'Good effort with solid pacing.' :
                score >= 400 ? 'Could benefit from slowing down a bit.' : 'Try spending more time on each question.';

  return {
    score, trend, insight,
    details: {
      avgTimePerQuestion: Math.round(avgTimePerQ),
      completionRate,
      rushingRate
    }
  };
}

function calcIndependence(recent, thisWeek, lastWeek) {
  if (recent.length === 0) return { score: 0, trend: 'stable', insight: 'No quizzes yet.', details: {} };

  const hintRates = recent.map(r => {
    const hints = r.hints_used || 0;
    const numQ = r.total_questions || 5;
    return hints / numQ;
  });
  const avgHintRate = hintRates.reduce((a, b) => a + b, 0) / hintRates.length;
  const zeroHintQuizzes = recent.filter(r => (r.hints_used || 0) === 0).length;
  const zeroHintRate = Math.round(zeroHintQuizzes / recent.length * 100);

  // Trend: fewer hints over time = improving
  const recent5Hints = hintRates.slice(-5);
  const older5Hints = hintRates.slice(0, -5);
  const r5Avg = recent5Hints.length > 0 ? recent5Hints.reduce((a, b) => a + b, 0) / recent5Hints.length : avgHintRate;
  const o5Avg = older5Hints.length > 0 ? older5Hints.reduce((a, b) => a + b, 0) / older5Hints.length : avgHintRate;
  const hintTrendMultiplier = r5Avg < o5Avg - 0.05 ? 1.1 : r5Avg > o5Avg + 0.05 ? 0.9 : 1.0;

  let score = Math.round(Math.min(1000, Math.max(0, (1 - avgHintRate) * 1000 * hintTrendMultiplier)));

  const thisWeekHints = thisWeek.reduce((sum, r) => sum + (r.hints_used || 0), 0);
  const lastWeekHints = lastWeek.reduce((sum, r) => sum + (r.hints_used || 0), 0);
  // For independence, fewer hints = better (invert for trend)
  const trend = determineTrend(
    thisWeek.length > 0 ? -(thisWeekHints / thisWeek.length) : null,
    lastWeek.length > 0 ? -(lastWeekHints / lastWeek.length) : null
  );

  let insight = score >= 800 ? 'Very independent — rarely needs hints!' :
                score >= 600 ? 'Growing independence with occasional support.' :
                score >= 400 ? 'Building confidence to work independently.' : 'Still learning to use strategies on their own.';

  return {
    score, trend, insight,
    details: {
      avgHintsPerQuiz: Math.round(avgHintRate * (recent[0]?.total_questions || 5) * 10) / 10,
      zeroHintRate,
      hintsThisWeek: thisWeekHints
    }
  };
}

function calcVocabulary(allResults, thisWeek, lastWeek) {
  // Gather all vocab lookups from all quizzes
  const allWords = [];
  const recentWords = [];
  for (const r of allResults) {
    const lookups = r.vocab_lookups || [];
    if (Array.isArray(lookups)) {
      allWords.push(...lookups);
      if (new Date(r.completed_at) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) {
        recentWords.push(...lookups);
      }
    }
  }

  const uniqueWords = [...new Set(allWords.map(w => (w || '').toLowerCase()))].filter(Boolean);
  const wordCounts = {};
  allWords.forEach(w => {
    const key = (w || '').toLowerCase();
    if (key) wordCounts[key] = (wordCounts[key] || 0) + 1;
  });
  const repeatedWords = Object.values(wordCounts).filter(c => c > 1).length;

  if (uniqueWords.length === 0) {
    return {
      score: 0, trend: 'stable',
      insight: 'Building vocabulary data — tap words during quizzes to learn definitions!',
      details: { uniqueWordsLooked: 0, wordsRepeated: 0, recentWords: [] }
    };
  }

  // Score: more unique words + fewer repeats = better engagement
  // Cap at 50 unique words for max score
  const engagementScore = Math.min(1000, (uniqueWords.length / 50) * 800);
  const masteryBonus = repeatedWords > 0 ? Math.min(200, (1 - repeatedWords / uniqueWords.length) * 200) : 200;
  const score = Math.round(Math.min(1000, engagementScore + masteryBonus));

  const thisWeekWords = thisWeek.flatMap(r => r.vocab_lookups || []);
  const lastWeekWords = lastWeek.flatMap(r => r.vocab_lookups || []);
  const trend = determineTrend(
    thisWeekWords.length > 0 ? new Set(thisWeekWords).size : null,
    lastWeekWords.length > 0 ? new Set(lastWeekWords).size : null
  );

  const uniqueRecent = [...new Set(recentWords.map(w => (w || '').toLowerCase()))].filter(Boolean).slice(0, 5);

  let insight = score >= 800 ? 'Active vocabulary explorer — great curiosity!' :
                score >= 600 ? 'Good vocabulary engagement.' :
                score >= 400 ? 'Starting to explore new words.' : 'Encourage tapping unfamiliar words for definitions.';

  return {
    score, trend, insight,
    details: {
      uniqueWordsLooked: uniqueWords.length,
      wordsRepeated: repeatedWords,
      recentWords: uniqueRecent
    }
  };
}

function calcPersistence(recent, thisWeek, lastWeek) {
  if (recent.length === 0) return { score: 0, trend: 'stable', insight: 'No quizzes yet.', details: {} };

  // Attempt data: average attempts per quiz, improvement after retry
  const attemptQuizzes = recent.filter(r => r.attempt_data && Array.isArray(r.attempt_data) && r.attempt_data.length > 0);

  if (attemptQuizzes.length === 0) {
    // No attempt data yet — use score and first-attempt proxy
    const avgScore = recent.reduce((s, r) => s + r.score, 0) / recent.length;
    const score = Math.round(Math.min(1000, avgScore * 8));
    return {
      score, trend: 'stable',
      insight: 'Building persistence data — keep taking quizzes!',
      details: { avgAttemptsPerQuiz: 1, improvedAfterRetry: 0, firstAttemptMastery: Math.round(avgScore) }
    };
  }

  // Average attempts per question across all quizzes
  const allAttempts = attemptQuizzes.flatMap(r => r.attempt_data);
  const avgAttempts = allAttempts.length > 0 ? allAttempts.reduce((a, b) => a + b, 0) / allAttempts.length : 1;

  // First attempt mastery: % of questions answered correctly on first try (attempt = 1)
  const firstTryCorrect = allAttempts.filter(a => a === 1).length;
  const firstAttemptMastery = Math.round(firstTryCorrect / allAttempts.length * 100);

  // Improvement after retry: quizzes where retries happened and score was still decent
  const retryQuizzes = attemptQuizzes.filter(r => r.attempt_data.some(a => a > 1));
  const improvedQuizzes = retryQuizzes.filter(r => r.score >= 60);
  const improvedAfterRetry = retryQuizzes.length > 0 ? Math.round(improvedQuizzes.length / retryQuizzes.length * 100) : 0;

  // Score: balanced between first-attempt mastery and persistence through retries
  const masteryScore = firstAttemptMastery * 6; // 0-600
  const persistenceBonus = Math.min(400, improvedAfterRetry * 4); // 0-400
  const score = Math.round(Math.min(1000, Math.max(0, masteryScore + persistenceBonus)));

  const thisWeekAttempts = thisWeek.filter(r => r.attempt_data?.length > 0).flatMap(r => r.attempt_data);
  const lastWeekAttempts = lastWeek.filter(r => r.attempt_data?.length > 0).flatMap(r => r.attempt_data);
  // For persistence, higher first-attempt rate is better
  const thisFirstRate = thisWeekAttempts.length > 0 ? thisWeekAttempts.filter(a => a === 1).length / thisWeekAttempts.length : null;
  const lastFirstRate = lastWeekAttempts.length > 0 ? lastWeekAttempts.filter(a => a === 1).length / lastWeekAttempts.length : null;
  const trend = determineTrend(thisFirstRate, lastFirstRate);

  let insight = score >= 800 ? 'Persistent and accurate — great mastery!' :
                score >= 600 ? 'Shows persistence and keeps trying.' :
                score >= 400 ? 'Building persistence — keep it up!' : 'Encourage trying again after mistakes.';

  return {
    score, trend, insight,
    details: {
      avgAttemptsPerQuiz: Math.round(avgAttempts * 10) / 10,
      improvedAfterRetry,
      firstAttemptMastery
    }
  };
}

function determineTrend(thisWeekVal, lastWeekVal) {
  if (thisWeekVal === null || lastWeekVal === null) return 'stable';
  const diff = thisWeekVal - lastWeekVal;
  if (diff > 0.05 || diff > lastWeekVal * 0.1) return 'up';
  if (diff < -0.05 || diff < -lastWeekVal * 0.1) return 'down';
  return 'stable';
}

function buildEmptyComponents() {
  const empty = { score: 0, trend: 'stable', insight: 'No quizzes yet — start reading to build your score!', details: {} };
  return {
    comprehension: { ...empty, weight: 30 },
    effort: { ...empty, weight: 20 },
    independence: { ...empty, weight: 20 },
    vocabulary: { ...empty, weight: 15 },
    persistence: { ...empty, weight: 15 }
  };
}

// ─── CLASS ANALYTICS (batch summary for Students table) ───

async function getClassAnalytics(classId) {
  // Get all students in the class (exclude teacher demo accounts)
  const { data: studentRows } = await supabase
    .from('students')
    .select('id, name, initials, color, grade, reading_score, accuracy, quizzes_completed')
    .eq('class_id', classId || 1)
    .or('is_teacher_demo.is.null,is_teacher_demo.eq.false')
    .order('name');
  const students = studentRows || [];
  if (students.length === 0) return [];

  // Compute LIVE performance for each student using the same method as the profile
  // This ensures the student list always matches what the teacher sees when clicking a student
  const scoreToLabel = (s) => s >= 750 ? 'Strong' : s >= 450 ? 'Developing' : 'Needs Support';
  const indToLabel = (s) => s >= 750 ? 'High' : s >= 450 ? 'Improving' : 'Needs Support';
  const persToLabel = (s) => s >= 750 ? 'High' : s >= 450 ? 'Moderate' : 'Low';

  const analyticsResults = await Promise.all(students.map(async (s) => {
    try {
      const perf = await getStudentPerformance(s.id);
      const comp = perf.components || {};
      const compScore = comp.comprehension?.score || 0;
      const effortScore = comp.effort?.score || 0;
      const indScore = comp.independence?.score || 0;
      const persScore = comp.persistence?.score || 0;
      const vocabScore = comp.vocabulary?.score || 0;

      // Derive vocab words from vocabulary details
      const vocabWordsLearned = comp.vocabulary?.details?.uniqueWordsLooked || 0;

      // If last 3 quizzes all failed, override all labels to "Struggling"
      const struggling = perf.recentFailStreak;

      const result = {
        id: s.id,
        name: s.name,
        initials: s.initials,
        color: s.color,
        readingScore: perf.readingScore,
        scoreTrend: perf.trend === 'improving' ? 'up' : perf.trend === 'declining' ? 'down' : 'stable',
        comprehension: struggling ? 'Struggling' : (compScore > 0 ? scoreToLabel(compScore) : 'No Data'),
        comprehensionPct: comp.comprehension?.details?.avgQuizScore || null,
        reasoning: struggling ? 'Struggling' : (effortScore > 0 ? scoreToLabel(effortScore) : 'No Data'),
        reasoningPct: null,
        vocabWordsLearned,
        independence: struggling ? 'Struggling' : (indScore > 0 ? indToLabel(indScore) : 'No Data'),
        persistence: struggling ? 'Struggling' : (persScore > 0 ? persToLabel(persScore) : 'No Data')
      };

      // Backfill: sync the computed data to the students table
      supabase.from('students').update({
        reading_score: perf.readingScore,
        comprehension_label: result.comprehension === 'No Data' ? null : result.comprehension,
        reasoning_label: result.reasoning === 'No Data' ? null : result.reasoning,
        vocab_words_learned: vocabWordsLearned,
        independence_label: result.independence === 'No Data' ? null : result.independence,
        persistence_label: result.persistence === 'No Data' ? null : result.persistence,
        score_trend: result.scoreTrend,
        analytics_updated_at: new Date().toISOString()
      }).eq('id', s.id).then(({ error }) => {
        if (error && !error.message?.includes('does not exist')) {
          console.error('Backfill analytics error for student', s.id, error.message);
        }
      });

      return result;
    } catch(e) {
      // Fallback for this student
      return {
        id: s.id, name: s.name, initials: s.initials, color: s.color,
        readingScore: s.reading_score || 500, scoreTrend: 'stable',
        comprehension: 'No Data', comprehensionPct: null,
        reasoning: 'No Data', reasoningPct: null,
        vocabWordsLearned: 0, independence: 'No Data', persistence: 'No Data'
      };
    }
  }));

  return analyticsResults;
}

// ─── UPDATE STUDENT ANALYTICS (called after quiz submission) ───

async function updateStudentAnalytics(studentId) {
  try {
    // Fetch recent quiz results for this student
    const { data: allResults } = await supabase
      .from('quiz_results')
      .select('id, chapter_id, answers, score, correct_count, total_questions, hints_used, attempt_data, vocab_lookups, completed_at')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: true });
    const results = allResults || [];
    if (results.length === 0) return;

    const recent = results.slice(-20);

    // Collect chapter_ids and fetch questions for per-type accuracy
    const chapterIds = [...new Set(recent.map(r => r.chapter_id))];
    const questionsByChapter = {};
    if (chapterIds.length > 0) {
      const { data: allQ } = await supabase
        .from('quiz_questions')
        .select('id, chapter_id, question_number, question_type, correct_answer, options')
        .in('chapter_id', chapterIds)
        .order('question_number');
      for (const q of (allQ || [])) {
        if (!questionsByChapter[q.chapter_id]) questionsByChapter[q.chapter_id] = [];
        questionsByChapter[q.chapter_id].push(q);
      }
    }

    // Per-question-type accuracy
    const typeStats = { literal: { correct: 0, total: 0 }, 'cause-effect': { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 }, inference: { correct: 0, total: 0 }, 'best-answer': { correct: 0, total: 0 } };

    for (const r of recent) {
      const questions = questionsByChapter[r.chapter_id] || [];
      const answers = Array.isArray(r.answers) ? r.answers : [];
      for (let i = 0; i < questions.length && i < answers.length; i++) {
        const q = questions[i];
        const qType = q.question_type || 'literal';
        const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
        const correctText = opts[q.correct_answer] || '';
        const isCorrect = answers[i] === correctText;
        if (typeStats[qType]) {
          typeStats[qType].total++;
          if (isCorrect) typeStats[qType].correct++;
        }
      }
    }

    // Comprehension = literal accuracy
    const compTotal = typeStats.literal.total;
    const compPct = compTotal > 0 ? Math.round(typeStats.literal.correct / compTotal * 100) : null;
    const comprehension = compPct === null ? null : compPct >= 75 ? 'Strong' : compPct >= 50 ? 'Developing' : 'Needs Support';

    // Reasoning = inference + cause-effect + best-answer
    const reasonTotal = typeStats.inference.total + typeStats['cause-effect'].total + typeStats['best-answer'].total;
    const reasonCorrect = typeStats.inference.correct + typeStats['cause-effect'].correct + typeStats['best-answer'].correct;
    const reasonPct = reasonTotal > 0 ? Math.round(reasonCorrect / reasonTotal * 100) : null;
    const reasoning = reasonPct === null ? null : reasonPct >= 75 ? 'Strong' : reasonPct >= 50 ? 'Developing' : 'Needs Support';

    // Vocabulary words learned
    const allVocab = results.flatMap(r => Array.isArray(r.vocab_lookups) ? r.vocab_lookups : []);
    const vocabWordsLearned = [...new Set(allVocab.map(w => (w || '').toLowerCase()).filter(Boolean))].length;

    // Independence
    const hintRates = recent.map(r => (r.hints_used || 0) / (r.total_questions || 5));
    const avgHintRate = hintRates.reduce((a, b) => a + b, 0) / hintRates.length;
    const independence = avgHintRate <= 0.2 ? 'High' : avgHintRate <= 0.5 ? 'Improving' : 'Needs Support';

    // Persistence
    const allAttempts = recent.filter(r => r.attempt_data && Array.isArray(r.attempt_data) && r.attempt_data.length > 0)
      .flatMap(r => r.attempt_data);
    const firstTryCorrect = allAttempts.filter(a => a === 1).length;
    const firstAttemptPct = allAttempts.length > 0 ? Math.round(firstTryCorrect / allAttempts.length * 100) : null;
    const persistence = firstAttemptPct === null ? null : firstAttemptPct >= 70 ? 'High' : firstAttemptPct >= 40 ? 'Moderate' : 'Low';

    // Score trend
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const thisMonday = new Date(now);
    thisMonday.setUTCDate(now.getUTCDate() - daysSinceMonday);
    thisMonday.setUTCHours(0, 0, 0, 0);
    const lastMonday = new Date(thisMonday);
    lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);

    const thisWeekResults = results.filter(r => new Date(r.completed_at) >= thisMonday);
    const lastWeekResults = results.filter(r => { const d = new Date(r.completed_at); return d >= lastMonday && d < thisMonday; });
    const thisWeekAvg = thisWeekResults.length > 0 ? thisWeekResults.reduce((s, r) => s + r.score, 0) / thisWeekResults.length : null;
    const lastWeekAvg = lastWeekResults.length > 0 ? lastWeekResults.reduce((s, r) => s + r.score, 0) / lastWeekResults.length : null;
    let scoreTrend = 'stable';
    if (thisWeekAvg !== null && lastWeekAvg !== null) {
      if (thisWeekAvg > lastWeekAvg + 5) scoreTrend = 'up';
      else if (thisWeekAvg < lastWeekAvg - 5) scoreTrend = 'down';
    }

    // Compute the composite reading score AND derive labels from component scores
    // so everything (student list, profile, labels) stays in sync
    let compositeScore = null;
    let syncedLabels = {};
    try {
      const perf = await getStudentPerformance(studentId);
      compositeScore = perf.readingScore;
      // If last 3 quizzes all failed, override all labels to "Struggling"
      const struggling = perf.recentFailStreak;
      const scoreToLabel = (s) => s >= 750 ? 'Strong' : s >= 450 ? 'Developing' : 'Needs Support';
      const indToLabel = (s) => s >= 750 ? 'High' : s >= 450 ? 'Improving' : 'Needs Support';
      const persToLabel = (s) => s >= 750 ? 'High' : s >= 450 ? 'Moderate' : 'Low';
      syncedLabels = {
        comprehension_label: struggling ? 'Struggling' : scoreToLabel(perf.components.comprehension.score),
        reasoning_label: struggling ? 'Struggling' : scoreToLabel(perf.components.effort.score),
        independence_label: struggling ? 'Struggling' : indToLabel(perf.components.independence.score),
        persistence_label: struggling ? 'Struggling' : persToLabel(perf.components.persistence.score)
      };
    } catch(e2) {
      console.warn('Could not compute composite score:', e2.message);
    }

    // Write precomputed analytics + synced score + synced labels to the students table
    const updateData = {
      comprehension_label: syncedLabels.comprehension_label || comprehension,
      comprehension_pct: compPct,
      reasoning_label: syncedLabels.reasoning_label || reasoning,
      reasoning_pct: reasonPct,
      vocab_words_learned: vocabWordsLearned,
      independence_label: syncedLabels.independence_label || independence,
      persistence_label: syncedLabels.persistence_label || persistence,
      score_trend: scoreTrend,
      analytics_updated_at: new Date().toISOString()
    };
    if (compositeScore !== null) {
      updateData.reading_score = compositeScore;
    }
    const { error } = await supabase.from('students').update(updateData).eq('id', studentId);

    if (error) {
      // Columns might not exist yet — silently ignore
      if (error.message && error.message.includes('does not exist')) {
        // Migration hasn't been run yet — skip analytics update
      } else {
        console.error('updateStudentAnalytics error:', error.message);
      }
    }
  } catch(e) {
    console.error('updateStudentAnalytics exception:', e.message);
  }
}

// ─── TEACHER QUIZ MODE (shadow student) ───

async function getOrCreateTeacherStudent(userId, classId) {
  // Check if teacher already has a shadow student
  const { data: existing } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId)
    .eq('is_teacher_demo', true)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return existing;

  // Create a new shadow student for the teacher
  const { data: user } = await supabase.from('users').select('name').eq('id', userId).single();
  const teacherName = user?.name || 'Teacher';

  const { data: newStudent, error } = await supabase.from('students').insert({
    name: `${teacherName} (Demo)`,
    initials: teacherName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    color: '#6366f1',
    grade: '4th',
    class_id: classId,
    user_id: userId,
    is_teacher_demo: true,
    reading_score: 500,
    accuracy: 0,
    quizzes_completed: 0,
    keys_earned: 0,
    onboarded: 1
  }).select().single();

  if (error) console.error('Create teacher student error:', error);
  return newStudent;
}

// ─── STORE ITEMS CRUD ───

async function getStoreItems(classId) {
  const { data, error } = await supabase
    .from('store_items')
    .select('*')
    .eq('class_id', classId)
    .order('created_at');
  if (error) {
    // Table might not exist yet
    if (error.message?.includes('does not exist')) return [];
    console.error('getStoreItems error:', error);
    return [];
  }
  return data || [];
}

async function createStoreItem(classId, itemData) {
  const { data, error } = await supabase.from('store_items').insert({
    class_id: classId,
    name: itemData.name,
    price: itemData.price || 25,
    stock: itemData.stock !== undefined ? itemData.stock : 10,
    icon: itemData.icon || '🎁',
    image_url: itemData.image_url || null
  }).select().single();
  if (error) { console.error('createStoreItem error:', error); return null; }
  return data;
}

async function updateStoreItem(id, itemData) {
  const updates = {};
  if (itemData.name !== undefined) updates.name = itemData.name;
  if (itemData.price !== undefined) updates.price = itemData.price;
  if (itemData.stock !== undefined) updates.stock = itemData.stock;
  if (itemData.icon !== undefined) updates.icon = itemData.icon;
  if (itemData.image_url !== undefined) updates.image_url = itemData.image_url;

  const { data, error } = await supabase.from('store_items').update(updates).eq('id', id).select().single();
  if (error) { console.error('updateStoreItem error:', error); return null; }
  return data;
}

async function deleteStoreItem(id) {
  const { error } = await supabase.from('store_items').delete().eq('id', id);
  if (error) { console.error('deleteStoreItem error:', error); return false; }
  return true;
}

async function uploadStoreImage(base64Data, filename) {
  try {
    // Decode base64 to buffer
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    // Determine content type from prefix
    const match = base64Data.match(/^data:(image\/\w+);base64,/);
    const contentType = match ? match[1] : 'image/png';
    const ext = contentType.split('/')[1] || 'png';

    // Generate unique filename
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `store/${uniqueName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('store-images')
      .upload(filePath, buffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      // Fallback: return base64 data URL
      return { url: base64Data, fallback: true };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('store-images')
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, fallback: false };
  } catch (e) {
    console.error('uploadStoreImage error:', e);
    // Fallback: return base64 data URL
    return { url: base64Data, fallback: true };
  }
}

// ─── REWARD GALLERY (admin-managed image library) ───

async function getRewardGallery() {
  const { data, error } = await supabase
    .from('reward_gallery')
    .select('*')
    .order('category')
    .order('name');
  if (error) {
    if (error.message?.includes('does not exist')) return [];
    console.error('getRewardGallery error:', error);
    return [];
  }
  return data || [];
}

async function addRewardGalleryItem(name, imageUrl, category) {
  const { data, error } = await supabase.from('reward_gallery').insert({
    name, image_url: imageUrl, category: category || 'general'
  }).select().single();
  if (error) { console.error('addRewardGalleryItem error:', error); return null; }
  return data;
}

async function deleteRewardGalleryItem(id) {
  const { error } = await supabase.from('reward_gallery').delete().eq('id', id);
  if (error) { console.error('deleteRewardGalleryItem error:', error); return false; }
  return true;
}

// ─── Popular Books for a class ───
async function getPopularBooks(classId) {
  // Get all students in this class
  const { data: classStudents, error: sErr } = await supabase
    .from('students')
    .select('id, name')
    .eq('class_id', classId);
  if (sErr || !classStudents || classStudents.length === 0) return [];

  const studentIds = classStudents.map(s => s.id);

  // Get all quiz results for these students, joined to chapters → books
  const { data: results, error: rErr } = await supabase
    .from('quiz_results')
    .select(`
      id, student_id, chapter_id,
      chapters!inner ( book_id, books!inner ( id, title, cover_url ) )
    `)
    .in('student_id', studentIds);

  if (rErr || !results) return [];

  // Build student name lookup
  const studentNameMap = {};
  classStudents.forEach(s => { studentNameMap[s.id] = s.name; });

  // Aggregate: count unique students per book and total quizzes per book
  const bookMap = {};
  for (const r of results) {
    const bookId = r.chapters.book_id;
    const bookTitle = r.chapters.books.title;
    const coverUrl = r.chapters.books.cover_url || '';
    if (!bookMap[bookId]) {
      bookMap[bookId] = { id: bookId, title: bookTitle, coverUrl, students: new Set(), quizCount: 0 };
    }
    bookMap[bookId].students.add(r.student_id);
    bookMap[bookId].quizCount++;
  }

  // Convert to array, sort by student count desc
  return Object.values(bookMap)
    .map(b => ({
      bookId: b.id,
      title: b.title,
      coverUrl: b.coverUrl,
      studentCount: b.students.size,
      quizCount: b.quizCount,
      studentNames: [...b.students].map(sid => studentNameMap[sid] || 'Student')
    }))
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 8);
}

// ─── Weekly Growth Data for a class (for Class Reading Score Trend chart) ───
// Uses quiz_results table (always populated) instead of reading_level_history
async function getWeeklyGrowthData(classId, range) {
  range = range || 'week';
  // Get all students in this class with their current reading_score
  const { data: classStudents, error: sErr } = await supabase
    .from('students')
    .select('id, reading_score')
    .eq('class_id', classId)
    .or('is_teacher_demo.is.null,is_teacher_demo.eq.false');
  if (sErr || !classStudents || classStudents.length === 0) return [];

  const studentIds = classStudents.map(s => s.id);
  const now = new Date();

  // Calculate start date based on range
  let startDate;
  const dayOfWeek = now.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(now);
  thisMonday.setUTCDate(now.getUTCDate() - daysSinceMonday);
  thisMonday.setUTCHours(0, 0, 0, 0);

  if (range === 'week') {
    startDate = thisMonday;
  } else if (range === 'month') {
    startDate = new Date(now);
    startDate.setUTCDate(now.getUTCDate() - 28);
    startDate.setUTCHours(0, 0, 0, 0);
  } else if (range === 'quarter') {
    startDate = new Date(now);
    startDate.setUTCMonth(now.getUTCMonth() - 3);
    startDate.setUTCHours(0, 0, 0, 0);
  } else { // year
    startDate = new Date(now);
    startDate.setUTCFullYear(now.getUTCFullYear() - 1);
    startDate.setUTCHours(0, 0, 0, 0);
  }

  // Get quiz_results for these students in the date range
  const { data: quizResults, error: qErr } = await supabase
    .from('quiz_results')
    .select('student_id, score, reading_level_change, completed_at')
    .in('student_id', studentIds)
    .gte('completed_at', startDate.toISOString())
    .order('completed_at');

  console.log('[Growth] range=' + range + ' classId=' + classId + ' students=' + studentIds.length + ' quizRows=' + (quizResults ? quizResults.length : 0));

  // Compute current class average reading score as baseline
  const classAvg = Math.round(classStudents.reduce((s, st) => s + (st.reading_score || 500), 0) / classStudents.length);

  // If no quiz results at all, show baseline
  if (!quizResults || quizResults.length === 0) {
    if (range === 'week') {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const results = [];
      for (let d = 0; d < 5; d++) {
        const dayStart = new Date(thisMonday);
        dayStart.setUTCDate(thisMonday.getUTCDate() + d);
        if (dayStart > now) break;
        results.push({ label: dayNames[d], avgScore: classAvg, quizCount: 0 });
      }
      return results;
    }
    return [];
  }

  // Helper: compute average quiz score for a set of quiz results
  function avgQuizScore(entries) {
    const studentBest = {};
    entries.forEach(q => {
      if (!studentBest[q.student_id] || q.score > studentBest[q.student_id]) {
        studentBest[q.student_id] = q.score;
      }
    });
    const scores = Object.values(studentBest);
    return scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  }

  // Helper: compute average reading score change
  function avgReadingScore(entries) {
    // Use the class average + cumulative reading level changes up to this point
    const studentChanges = {};
    entries.forEach(q => {
      if (!studentChanges[q.student_id]) studentChanges[q.student_id] = 0;
      studentChanges[q.student_id] += (q.reading_level_change || 0);
    });
    const changes = Object.values(studentChanges);
    const avgChange = changes.length > 0 ? Math.round(changes.reduce((s, v) => s + v, 0) / changes.length) : 0;
    return classAvg + avgChange;
  }

  const results = [];

  if (range === 'week') {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let lastKnownScore = classAvg;
    // Accumulate all quiz results up to each day for running average
    const cumulativeResults = [];
    for (let d = 0; d < 5; d++) {
      const dayStart = new Date(thisMonday);
      dayStart.setUTCDate(thisMonday.getUTCDate() + d);
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayStart.getUTCDate() + 1);
      if (dayStart > now) break;
      const dayEntries = quizResults.filter(q => { const dt = new Date(q.completed_at); return dt >= dayStart && dt < dayEnd; });
      cumulativeResults.push(...dayEntries);
      if (dayEntries.length > 0) {
        lastKnownScore = avgReadingScore(cumulativeResults);
        results.push({ label: dayNames[d], avgScore: lastKnownScore, quizCount: dayEntries.length });
      } else {
        results.push({ label: dayNames[d], avgScore: lastKnownScore, quizCount: 0 });
      }
    }
  } else if (range === 'month') {
    for (let w = 3; w >= 0; w--) {
      const wStart = new Date(now);
      wStart.setUTCDate(now.getUTCDate() - (w * 7) - 6);
      wStart.setUTCHours(0, 0, 0, 0);
      const wEnd = new Date(wStart);
      wEnd.setUTCDate(wStart.getUTCDate() + 7);
      const label = 'Week ' + (4 - w);
      const entries = quizResults.filter(q => { const dt = new Date(q.completed_at); return dt >= wStart && dt < wEnd; });
      if (entries.length === 0) continue;
      results.push({ label, avgScore: avgQuizScore(entries), quizCount: entries.length });
    }
  } else {
    const monthCount = range === 'quarter' ? 3 : 12;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = monthCount - 1; m >= 0; m--) {
      const mStart = new Date(now.getUTCFullYear(), now.getUTCMonth() - m, 1);
      const mEnd = new Date(now.getUTCFullYear(), now.getUTCMonth() - m + 1, 1);
      const label = monthNames[mStart.getMonth()];
      const entries = quizResults.filter(q => { const dt = new Date(q.completed_at); return dt >= mStart && dt < mEnd; });
      if (entries.length === 0) continue;
      results.push({ label, avgScore: avgQuizScore(entries), quizCount: entries.length });
    }
  }

  console.log('[Growth] returning ' + results.length + ' data points');
  return results;
}

// ─── Recent Activity for a class ───
async function getRecentActivity(classId) {
  // Get all students in this class
  const { data: classStudents, error: sErr } = await supabase
    .from('students')
    .select('id, name')
    .eq('class_id', classId);
  if (sErr || !classStudents || classStudents.length === 0) return [];

  const studentIds = classStudents.map(s => s.id);
  const studentMap = {};
  classStudents.forEach(s => { studentMap[s.id] = s.name; });

  // Get recent quiz results
  const { data: results, error: rErr } = await supabase
    .from('quiz_results')
    .select(`
      id, student_id, score, keys_earned, completed_at,
      chapters!inner ( chapter_number, title, books!inner ( title ) )
    `)
    .in('student_id', studentIds)
    .order('completed_at', { ascending: false })
    .limit(10);

  if (rErr || !results) return [];

  return results.map(r => ({
    studentName: studentMap[r.student_id] || 'Student',
    bookTitle: r.chapters.books.title,
    chapterNumber: r.chapters.chapter_number,
    chapterTitle: r.chapters.title,
    score: r.score,
    keysEarned: r.keys_earned,
    completedAt: r.completed_at
  }));
}

// Export everything
// ---- Class Goals ----
async function createClassGoal(classId, title, goalType, targetCount, bookId) {
  try {
    const { data, error } = await supabase
      .from('class_goals')
      .insert({ class_id: classId, title, goal_type: goalType, target_count: targetCount, book_id: bookId || null })
      .select()
      .single();
    if (error) { console.error('createClassGoal error:', error.message); return null; }
    return data;
  } catch (e) { console.error('createClassGoal error:', e.message); return null; }
}

async function getClassGoals(classId) {
  try {
    const { data, error } = await supabase
      .from('class_goals')
      .select('*')
      .eq('class_id', classId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) { console.error('getClassGoals error:', error.message); return []; }
    return data || [];
  } catch (e) { console.error('getClassGoals error:', e.message); return []; }
}

async function getClassGoalProgress(goalId) {
  try {
    const { data, error } = await supabase
      .from('class_goal_progress')
      .select('*, students(name)')
      .eq('goal_id', goalId)
      .order('completed_at', { ascending: false });
    if (error) { console.error('getClassGoalProgress error:', error.message); return []; }
    return (data || []).map(d => ({
      ...d,
      student_name: d.students?.name || 'Unknown',
      students: undefined
    }));
  } catch (e) { console.error('getClassGoalProgress error:', e.message); return []; }
}

async function checkAndUpdateGoalProgress(studentId, classId) {
  // Get active goals for this class
  const goals = await getClassGoals(classId);
  if (!goals || goals.length === 0) return;

  for (const goal of goals) {
    // Check if already completed
    const { data: existing } = await supabase
      .from('class_goal_progress')
      .select('id')
      .eq('goal_id', goal.id)
      .eq('student_id', studentId)
      .single();
    if (existing) continue; // Already completed

    let completed = false;
    if (goal.goal_type === 'quizzes') {
      // Count quizzes completed by this student
      const { count } = await supabase
        .from('quiz_results')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', studentId);
      completed = (count || 0) >= goal.target_count;
    } else if (goal.goal_type === 'book' && goal.book_id) {
      // Check if student completed all chapters of the specified book
      const { data: bookChapters } = await supabase.from('chapters').select('id').eq('book_id', goal.book_id);
      if (bookChapters && bookChapters.length > 0) {
        const chapterIds = bookChapters.map(c => c.id);
        const { data: results } = await supabase
          .from('quiz_results')
          .select('chapter_id')
          .eq('student_id', studentId)
          .in('chapter_id', chapterIds);
        const uniqueCompleted = new Set((results || []).map(r => r.chapter_id));
        completed = uniqueCompleted.size >= bookChapters.length;
      }
    }

    if (completed) {
      await supabase.from('class_goal_progress').insert({ goal_id: goal.id, student_id: studentId });
    }
  }
}

async function deleteClassGoal(goalId) {
  try {
    const { error } = await supabase
      .from('class_goals')
      .update({ active: false })
      .eq('id', goalId);
    if (error) { console.error('deleteClassGoal error:', error.message); return false; }
    return true;
  } catch (e) { console.error('deleteClassGoal error:', e.message); return false; }
}

// ─── WARM UP QUIZZES ───

async function getWarmupQuiz(bookId) {
  const { data } = await supabase
    .from('warmup_quizzes')
    .select('*')
    .eq('book_id', bookId)
    .single();
  return data || null;
}

async function getWarmupResult(studentId, bookId) {
  const { data } = await supabase
    .from('warmup_results')
    .select('*')
    .eq('student_id', studentId)
    .eq('book_id', bookId)
    .eq('passed', true)
    .order('completed_at', { ascending: false })
    .limit(1);
  return (data && data.length > 0) ? data[0] : null;
}

async function saveWarmupResult(resultData) {
  const { data, error } = await supabase
    .from('warmup_results')
    .insert({
      student_id: resultData.studentId,
      book_id: resultData.bookId,
      passed: resultData.passed,
      score: resultData.score,
      correct_count: resultData.correctCount,
      total_questions: resultData.totalQuestions,
      attempts: resultData.attempts
    })
    .select()
    .single();
  if (error) console.error('saveWarmupResult error:', error);
  return data;
}

async function getStudentWarmups(studentId) {
  const { data, error } = await supabase
    .from('warmup_results')
    .select('id, book_id, passed, score, correct_count, total_questions, attempts, completed_at')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });
  if (error) { console.error('getStudentWarmups error:', error.message); return []; }
  return data || [];
}

module.exports = {
  supabase,
  initDB,
  getStudents,
  getStudent,
  updateStudentSurvey,
  updateReadingLevel,
  getBooks,
  getBookChapters,
  getChapterQuiz,
  getChapterByBookAndNum,
  saveQuizResult,
  getStudentResults,
  getReadingHistory,
  getUserByEmail,
  getUserById,
  createUser,
  getUserByAuthId,
  getClassByCode,
  createClass,
  createStudent,
  getStudentByUserId,
  createAssignment,
  getAssignments,
  insertQuizQuestion,
  getBookById,
  updateStudentStats,
  getTeacherClass,
  getOwnerStats,
  getGenreDistribution,
  getAllTeachers,
  getAllStudentsForOwner,
  getCompletedChapters,
  getFullBookQuiz,
  getWeeklyStats,
  getStudentBookProgress,
  deductStudentKeys,
  addStudentKeys,
  recordPurchase,
  getRecentPurchases,
  fulfillPurchase,
  getFavoriteBooks,
  toggleFavoriteBook,
  getStudentPerformance,
  getClassAnalytics,
  updateStudentAnalytics,
  getOrCreateTeacherStudent,
  getStoreItems,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
  uploadStoreImage,
  getRewardGallery,
  addRewardGalleryItem,
  deleteRewardGalleryItem,
  getPopularBooks,
  getRecentActivity,
  getWeeklyGrowthData,
  getWarmupQuiz,
  getWarmupResult,
  saveWarmupResult,
  getStudentWarmups
};

async function getFullBookQuiz(bookId) {
  // Get all chapters for this book
  const chapters = await getBookChapters(bookId);
  if (!chapters || chapters.length === 0) return { chapters: [], questions: [] };

  // Get all questions for all chapters
  const allQuestions = [];
  for (const ch of chapters) {
    const questions = await getChapterQuiz(ch.id);
    questions.forEach(q => {
      q._chapter = ch; // attach chapter info to each question
    });
    allQuestions.push(...questions);
  }

  return { chapters, allQuestions };
}
