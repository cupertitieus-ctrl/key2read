-- Warm Up Quiz tables
-- warmup_quizzes: stores hardcoded warm-up questions per book (JSONB)
-- warmup_results: tracks student attempts and pass/fail

CREATE TABLE IF NOT EXISTS warmup_quizzes (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT REFERENCES books(id) UNIQUE,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warmup_results (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  book_id BIGINT REFERENCES books(id),
  passed BOOLEAN DEFAULT FALSE,
  score REAL DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 3,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE warmup_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON warmup_quizzes FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE warmup_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON warmup_results FOR ALL TO anon USING (true) WITH CHECK (true);

-- Index for fast student + book lookup
CREATE INDEX IF NOT EXISTS idx_warmup_results_student_book ON warmup_results(student_id, book_id);

-- Seed: Diary of a Famous Cat (book_id 66)
INSERT INTO warmup_quizzes (book_id, questions) VALUES (66, '[
  {
    "question_text": "Go to page 7 and tell us the very LAST word.",
    "options": ["enjoy", "landed", "famous", "angry"],
    "correct_answer": 0
  },
  {
    "question_text": "On page 9, what is the cat in the illustration doing?",
    "options": ["sleeping", "running", "falling", "hiding"],
    "correct_answer": 2
  },
  {
    "question_text": "Turn to page 19, what is the cat doing in the illustration?",
    "options": ["jumping up a tree", "walking on the sidewalk", "running into the bush", "chasing a pigeon"],
    "correct_answer": 2
  }
]') ON CONFLICT (book_id) DO UPDATE SET questions = EXCLUDED.questions;

-- Seed: Charlie Picasso: Don't Draw Robots
INSERT INTO warmup_quizzes (book_id, questions)
SELECT id, '[
  {
    "question_text": "Go to page 11 and tell us the very LAST word.",
    "options": ["enjoy", "landed", "why", "angry"],
    "correct_answer": 2
  },
  {
    "question_text": "On page 43, what is the illustration a drawing of?",
    "options": ["balloon", "cheese", "lamp", "apple"],
    "correct_answer": 0
  },
  {
    "question_text": "Turn to page 55, what is the illustration drawing of?",
    "options": ["cat", "dog", "superhero", "plant"],
    "correct_answer": 2
  }
]'::jsonb FROM books WHERE title LIKE '%Don''t Draw Robots%'
ON CONFLICT (book_id) DO UPDATE SET questions = EXCLUDED.questions;

-- Seed: Fluff and Robo Dog
INSERT INTO warmup_quizzes (book_id, questions)
SELECT id, '[
  {
    "question_text": "Go to page 14 and tell us the very LAST word.",
    "options": ["now", "apple", "fork", "plate"],
    "correct_answer": 2
  },
  {
    "question_text": "On page 39, how many boxes do you see?",
    "options": ["one", "two", "three", "four"],
    "correct_answer": 0
  },
  {
    "question_text": "Turn to page 64, what is robo dog doing?",
    "options": ["balancing on his nose", "doing a cartwheel", "sleeping", "running"],
    "correct_answer": 0
  }
]'::jsonb FROM books WHERE title LIKE '%Fluff and Robo%'
ON CONFLICT (book_id) DO UPDATE SET questions = EXCLUDED.questions;
