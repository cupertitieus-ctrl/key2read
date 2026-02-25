// ============================================================
// key2read — Regenerate ALL quizzes with real page numbers
// Uses server/book-pages.js for page data (no DB migration needed)
// Usage: node scripts/regenerate-all-quizzes.js
//   or:  node scripts/regenerate-all-quizzes.js --book "Charlie Picasso"
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const claude = require('../server/claude');
const { getChapterPages } = require('../server/book-pages');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const bookFilter = process.argv.find(a => a === '--book') ? process.argv[process.argv.indexOf('--book') + 1] : null;

async function regenerateAll() {
  console.log('🔑 key2read — Regenerating Quizzes with Real Page Numbers\n');
  if (bookFilter) console.log(`📖 Filtering to books matching: "${bookFilter}"\n`);

  const { data: books } = await supabase.from('books').select('*');
  if (!books) { console.log('No books found'); process.exit(1); }

  const filtered = bookFilter
    ? books.filter(b => b.title.toLowerCase().includes(bookFilter.toLowerCase()))
    : books;

  let totalRegenerated = 0;

  for (const book of filtered) {
    const { data: chapters } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', book.id)
      .order('chapter_number');

    if (!chapters || chapters.length === 0) {
      console.log(`⏭️  ${book.title} — no chapters`);
      continue;
    }

    console.log(`\n📖 ${book.title} (${chapters.length} chapters)`);

    for (const ch of chapters) {
      // Check if quiz questions exist
      const { data: existing } = await supabase
        .from('quiz_questions')
        .select('id')
        .eq('chapter_id', ch.id)
        .limit(1);

      if (!existing || existing.length === 0) {
        console.log(`  ⏭️  Ch ${ch.chapter_number}: "${ch.title}" — no existing quiz, skipping`);
        continue;
      }

      const pages = getChapterPages(book.title, ch.chapter_number);
      const pageInfo = pages ? `pages ${pages.start}-${pages.end}` : 'no page data';
      console.log(`  🔄 Ch ${ch.chapter_number}: "${ch.title}" (${pageInfo}) — regenerating...`);

      // Delete old questions
      await supabase.from('quiz_questions').delete().eq('chapter_id', ch.id);

      // Generate new quiz with page numbers from config
      const questionCount = chapters.length <= 9 ? 7 : 5;
      try {
        const generated = await claude.generateChapterQuiz(
          book.title, book.author, ch.chapter_number, ch.title, ch.summary,
          book.grade_level, questionCount, pages?.start || null, pages?.end || null
        );

        for (const q of generated.questions) {
          await supabase.from('quiz_questions').insert({
            chapter_id: ch.id,
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
        console.log(`  ✅ Ch ${ch.chapter_number}: ${generated.questions.length} questions generated`);
        totalRegenerated++;
      } catch (e) {
        console.error(`  ❌ Ch ${ch.chapter_number}: ${e.message}`);
      }

      // Rate limit - wait 2 seconds between API calls
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ Done! Regenerated quizzes for ${totalRegenerated} chapters.`);
  process.exit(0);
}

regenerateAll().catch(e => { console.error(e); process.exit(1); });
