require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  // Find quiz questions with "Option A" placeholder answers (fallback quizzes)
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, chapter_id, question_number, question_text, options')
    .order('chapter_id')
    .order('question_number');

  if (error) { console.error('Error:', error); return; }

  const fallbackQs = questions.filter(q => q.options && q.options.includes('Option A'));
  const fallbackChapterIds = [...new Set(fallbackQs.map(q => q.chapter_id))];

  console.log('Total questions:', questions.length);
  console.log('Fallback questions:', fallbackQs.length);
  console.log('Chapters with fallback quizzes:', fallbackChapterIds.length);

  if (fallbackChapterIds.length === 0) {
    console.log('\nNo fallback quizzes found!');
    return;
  }

  // Get chapter and book info
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, book_id, summary')
    .in('id', fallbackChapterIds)
    .order('book_id')
    .order('chapter_number');

  const bookIds = [...new Set(chapters.map(c => c.book_id))];
  const { data: books } = await supabase.from('books').select('id, title').in('id', bookIds);

  console.log('\n=== Chapters with fallback (placeholder) quizzes ===');
  chapters.forEach(ch => {
    const book = books.find(b => b.id === ch.book_id);
    const hasSummary = ch.summary && ch.summary.length > 10;
    console.log(`  ${book ? book.title : 'Book ' + ch.book_id} - Ch ${ch.chapter_number}: ${ch.title} | Summary: ${hasSummary ? 'YES (' + ch.summary.length + ' chars)' : 'MISSING'}`);
  });
})();
