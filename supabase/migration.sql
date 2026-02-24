-- ============================================================
-- key2read — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Drop existing tables if re-running
DROP TABLE IF EXISTS reading_level_history CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS student_surveys CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── USERS ───
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'teacher',
  auth_provider TEXT DEFAULT 'demo',
  auth_id TEXT,
  avatar_url TEXT,
  school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLASSES ───
CREATE TABLE classes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  class_code TEXT UNIQUE,
  teacher_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STUDENTS ───
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT,
  color TEXT DEFAULT '#2563EB',
  class_id BIGINT REFERENCES classes(id),
  user_id BIGINT REFERENCES users(id),
  grade TEXT,
  reading_level REAL DEFAULT 3.0,
  reading_score INTEGER DEFAULT 500,
  lexile INTEGER DEFAULT 500,
  keys_earned INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  accuracy REAL DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  onboarded INTEGER DEFAULT 0,
  is_teacher_demo BOOLEAN DEFAULT FALSE,
  comprehension_label TEXT DEFAULT NULL,
  comprehension_pct INTEGER DEFAULT NULL,
  reasoning_label TEXT DEFAULT NULL,
  reasoning_pct INTEGER DEFAULT NULL,
  vocab_words_learned INTEGER DEFAULT 0,
  independence_label TEXT DEFAULT NULL,
  persistence_label TEXT DEFAULT NULL,
  score_trend TEXT DEFAULT 'stable',
  analytics_updated_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STUDENT SURVEYS ───
CREATE TABLE student_surveys (
  student_id BIGINT PRIMARY KEY REFERENCES students(id),
  interest_tags JSONB DEFAULT '[]'::jsonb,
  reading_style TEXT DEFAULT 'detailed',
  favorite_genre TEXT DEFAULT '',
  hobbies JSONB DEFAULT '[]'::jsonb,
  favorite_animals JSONB DEFAULT '[]'::jsonb,
  favorite_sports JSONB DEFAULT '[]'::jsonb,
  favorite_subjects JSONB DEFAULT '[]'::jsonb,
  favorite_foods JSONB DEFAULT '[]'::jsonb,
  dream_job TEXT DEFAULT '',
  favorite_place TEXT DEFAULT '',
  favorite_color TEXT DEFAULT '',
  favorite_movie_or_show TEXT DEFAULT '',
  fun_fact TEXT DEFAULT '',
  favorite_books JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BOOKS ───
CREATE TABLE books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  lexile_level INTEGER DEFAULT 500,
  grade_level TEXT,
  genre TEXT,
  chapter_count INTEGER DEFAULT 1,
  description TEXT
);

-- ─── CHAPTERS ───
CREATE TABLE chapters (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT REFERENCES books(id),
  chapter_number INTEGER,
  title TEXT,
  summary TEXT,
  key_vocabulary JSONB DEFAULT '[]'::jsonb,
  UNIQUE(book_id, chapter_number)
);

-- ─── QUIZ QUESTIONS ───
CREATE TABLE quiz_questions (
  id BIGSERIAL PRIMARY KEY,
  chapter_id BIGINT REFERENCES chapters(id),
  question_number INTEGER,
  question_type TEXT,
  question_text TEXT,
  passage_excerpt TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer INTEGER DEFAULT 0,
  strategy_type TEXT,
  strategy_tip TEXT,
  explanation TEXT,
  vocabulary_words JSONB DEFAULT '[]'::jsonb,
  UNIQUE(chapter_id, question_number)
);

-- ─── ASSIGNMENTS ───
CREATE TABLE assignments (
  id BIGSERIAL PRIMARY KEY,
  class_id BIGINT REFERENCES classes(id),
  teacher_id BIGINT REFERENCES users(id),
  book_id BIGINT REFERENCES books(id),
  name TEXT,
  chapter_start INTEGER DEFAULT 1,
  chapter_end INTEGER DEFAULT 1,
  due_date TEXT,
  personalized INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── QUIZ RESULTS ───
CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  assignment_id BIGINT,
  chapter_id BIGINT REFERENCES chapters(id),
  answers JSONB DEFAULT '[]'::jsonb,
  score REAL DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 5,
  reading_level_change REAL DEFAULT 0,
  keys_earned INTEGER DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  strategies_used JSONB DEFAULT '[]'::jsonb,
  hints_used INTEGER DEFAULT 0,
  attempt_data JSONB DEFAULT '[]'::jsonb,
  vocab_lookups JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── READING LEVEL HISTORY ───
CREATE TABLE reading_level_history (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  level REAL,
  lexile INTEGER,
  source TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ───
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_level_history ENABLE ROW LEVEL SECURITY;

-- Allow full access for authenticated and anon users (since we handle auth in Express)
-- In production, you'd make these more restrictive
CREATE POLICY "Allow all for anon" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON classes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON student_surveys FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON books FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON chapters FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON quiz_questions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON assignments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON quiz_results FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON reading_level_history FOR ALL TO anon USING (true) WITH CHECK (true);

-- Done!
-- Now run the seed script: node supabase/seed.js
