-- Class Goals feature
-- Lets teachers set goals like "Everyone takes 1 quiz" or "Complete a full book"
CREATE TABLE IF NOT EXISTS class_goals (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL DEFAULT 'quizzes', -- 'quizzes' or 'book'
  target_count INTEGER NOT NULL DEFAULT 1,   -- e.g. 1 quiz, 1 book
  book_id INTEGER,                           -- optional: specific book for 'book' goals
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Track which students have completed each goal
CREATE TABLE IF NOT EXISTS class_goal_progress (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES class_goals(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(goal_id, student_id)
);
