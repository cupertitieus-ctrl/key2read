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

async function getStudents(classId) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      student_surveys (
        interest_tags, reading_style, favorite_genre, hobbies,
        favorite_animals, favorite_sports, favorite_subjects, favorite_foods,
        dream_job, favorite_place, favorite_color, favorite_movie_or_show, fun_fact
      )
    `)
    .eq('class_id', classId || 1)
    .order('name');

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
      fun_fact: survey.fun_fact || ''
    };
  });
}

async function getStudent(id) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      student_surveys (
        interest_tags, reading_style, favorite_genre, hobbies,
        favorite_animals, favorite_sports, favorite_subjects, favorite_foods,
        dream_job, favorite_place, favorite_color, favorite_movie_or_show, fun_fact
      )
    `)
    .eq('id', id)
    .single();

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
    fun_fact: survey.fun_fact || ''
  };
}

async function updateStudentSurvey(studentId, surveyData) {
  const fields = ['interest_tags', 'reading_style', 'favorite_genre', 'hobbies', 'favorite_animals', 'favorite_sports', 'favorite_subjects', 'favorite_foods', 'dream_job', 'favorite_place', 'favorite_color', 'favorite_movie_or_show', 'fun_fact'];
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

async function getBooks() {
  const { data } = await supabase.from('books').select('*').order('title');
  return data || [];
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
    strategies_used: resultData.strategiesUsed || []
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

async function createStudent(name, classId, userId) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const colors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Get class grade
  const { data: cls } = await supabase.from('classes').select('grade').eq('id', classId).single();

  const { data: student, error } = await supabase.from('students').insert({
    name, initials, color, class_id: classId, user_id: userId, grade: cls?.grade || '4th'
  }).select().single();

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

// Export everything
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
  getFullBookQuiz
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
