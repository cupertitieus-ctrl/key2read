require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { generateChapterQuiz } = require('../server/claude');

(async () => {
  // Find the chapter
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, summary, book_id')
    .eq('id', 98);

  if (!chapters || chapters.length === 0) {
    console.log('Chapter not found');
    return;
  }

  const ch = chapters[0];
  console.log('Found chapter:', ch.id, '- Ch', ch.chapter_number, ch.title);

  // Get book info
  const { data: book } = await supabase.from('books').select('title, author, grade_level').eq('id', ch.book_id).single();
  console.log('Book:', book.title, 'by', book.author);
  console.log('Summary:', ch.summary.substring(0, 100) + '...');

  // Get page info from book-pages.js
  const { BOOK_PAGES } = require('../server/book-pages');
  const pageData = BOOK_PAGES[book.title];
  const chapterPages = pageData ? pageData.find(p => p.chapter === ch.chapter_number) : null;
  const pageStart = chapterPages ? chapterPages.start : null;
  const pageEnd = chapterPages ? chapterPages.end : null;
  console.log('Pages:', pageStart, '-', pageEnd);

  // Delete old fallback questions
  const { error: delError } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('chapter_id', ch.id);

  if (delError) {
    console.error('Delete error:', delError);
    return;
  }
  console.log('Deleted old fallback questions');

  // Generate new quiz
  console.log('Generating new quiz...');
  const questions = await generateChapterQuiz(
    book.title,
    book.author,
    ch.chapter_number,
    ch.title,
    ch.summary,
    book.grade_level || '2nd-3rd',
    5,
    pageStart,
    pageEnd
  );

  if (!questions || questions.length === 0) {
    console.error('Failed to generate quiz! Got empty array.');
    return;
  }

  console.log('Raw questions:', JSON.stringify(questions[0], null, 2));

  // Check if these are still fallback
  const isFallback = questions[0] && questions[0].options && questions[0].options.includes('Option A');
  if (isFallback) {
    console.error('Still got fallback quiz - AI may not be configured');
    return;
  }

  console.log('Generated', questions.length, 'questions');

  // Strip HTML and fix hints before inserting
  for (const q of questions) {
    q.question_text = (q.question_text || '').replace(/<[^>]*>/g, '');
    q.options = (q.options || []).map(o => (o || '').replace(/<[^>]*>/g, ''));

    // Fix hint format
    const pageMatch = (q.strategy_tip || '').match(/(\d+)/);
    if (pageMatch) {
      q.strategy_tip = 'You can find the answer on page ' + pageMatch[1];
    }
  }

  // Insert new questions
  const inserts = questions.map((q, i) => ({
    chapter_id: ch.id,
    question_number: i + 1,
    question_type: q.question_type || 'literal',
    question_text: q.question_text,
    passage_excerpt: q.passage_excerpt || '',
    options: q.options,
    correct_answer: q.correct_answer,
    strategy_type: q.strategy_type || 'finding-details',
    strategy_tip: q.strategy_tip || 'Reread this chapter.',
    explanation: q.explanation || '',
    vocabulary_words: q.vocabulary_words || []
  }));

  const { error: insError } = await supabase
    .from('quiz_questions')
    .insert(inserts);

  if (insError) {
    console.error('Insert error:', insError);
    return;
  }

  console.log('Inserted', inserts.length, 'new questions');

  // Show the questions
  inserts.forEach((q, i) => {
    console.log(`\nQ${i + 1}: ${q.question_text}`);
    q.options.forEach((o, j) => {
      console.log(`  ${j === q.correct_answer ? '✅' : '  '} ${String.fromCharCode(65 + j)}: ${o}`);
    });
    console.log('  Hint:', q.strategy_tip);
  });
})();
