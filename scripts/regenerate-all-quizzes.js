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
const strip = (s) => typeof s === 'string' ? s.replace(/<[^>]*>/g, '') : s;

// Wait between API calls (rate limit: 8000 output tokens/min ≈ 1 quiz every 30-45s)
const WAIT_MS = 45000;
const MAX_RETRIES = 3;

async function generateWithRetry(book, ch, questionCount, pages) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const generated = await claude.generateChapterQuiz(
        book.title, book.author, ch.chapter_number, ch.title, ch.summary,
        book.grade_level, questionCount, pages?.start || null, pages?.end || null
      );
      return generated;
    } catch (e) {
      if (e.message && e.message.includes('rate_limit') && attempt < MAX_RETRIES) {
        console.log(`    ⏳ Rate limited, waiting 60s before retry ${attempt + 1}/${MAX_RETRIES}...`);
        await new Promise(r => setTimeout(r, 60000));
      } else {
        throw e;
      }
    }
  }
}

async function regenerateAll() {
  console.log('🔑 key2read — Regenerating Quizzes with Real Page Numbers\n');
  if (bookFilter) console.log(`📖 Filtering to books matching: "${bookFilter}"\n`);

  const { data: books } = await supabase.from('books').select('*');
  if (!books) { console.log('No books found'); process.exit(1); }

  const filtered = bookFilter
    ? books.filter(b => b.title.toLowerCase().includes(bookFilter.toLowerCase()))
    : books;

  let totalRegenerated = 0;
  let totalFailed = 0;

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

    const pages = getChapterPages(book.title, 1);
    if (!pages && !bookFilter) {
      console.log(`⏭️  ${book.title} — no page data, skipping`);
      continue;
    }

    console.log(`\n📖 ${book.title} (${chapters.length} chapters)`);

    for (const ch of chapters) {
      // Check if quiz questions exist OR were deleted by a failed previous run
      const { data: existing } = await supabase
        .from('quiz_questions')
        .select('id, strategy_tip')
        .eq('chapter_id', ch.id)
        .limit(1);

      // Skip if already has page numbers in hints (already regenerated)
      if (existing && existing.length > 0) {
        const tip = existing[0].strategy_tip || '';
        if (/page \d+/i.test(tip)) {
          console.log(`  ✅ Ch ${ch.chapter_number}: "${ch.title}" — already has page numbers, skipping`);
          continue;
        }
      }

      // If no questions exist at all (deleted by failed run), we need to regenerate
      const chPages = getChapterPages(book.title, ch.chapter_number);
      const pageInfo = chPages ? `pages ${chPages.start}-${chPages.end}` : 'no page data';
      console.log(`  🔄 Ch ${ch.chapter_number}: "${ch.title}" (${pageInfo}) — regenerating...`);

      // Delete old questions (if any)
      if (existing && existing.length > 0) {
        await supabase.from('quiz_questions').delete().eq('chapter_id', ch.id);
      }

      // Generate new quiz with page numbers from config
      const questionCount = chapters.length <= 9 ? 7 : 5;
      try {
        const generated = await generateWithRetry(book, ch, questionCount, chPages);

        for (const q of generated.questions) {
          await supabase.from('quiz_questions').insert({
            chapter_id: ch.id,
            question_number: q.question_number,
            question_type: q.question_type,
            question_text: strip(q.question_text),
            passage_excerpt: strip(q.passage_excerpt || ''),
            options: (q.options || []).map(o => strip(o)),
            correct_answer: q.correct_answer,
            strategy_type: q.strategy_type,
            strategy_tip: strip(q.strategy_tip),
            explanation: strip(q.explanation),
            vocabulary_words: q.vocabulary_words || []
          });
        }
        console.log(`  ✅ Ch ${ch.chapter_number}: ${generated.questions.length} questions generated`);
        totalRegenerated++;
      } catch (e) {
        console.error(`  ❌ Ch ${ch.chapter_number}: ${e.message?.substring(0, 100)}`);
        totalFailed++;
      }

      // Rate limit wait between calls
      console.log(`    ⏳ Waiting ${WAIT_MS / 1000}s for rate limit...`);
      await new Promise(r => setTimeout(r, WAIT_MS));
    }
  }

  console.log(`\n✅ Done! Regenerated: ${totalRegenerated}, Failed: ${totalFailed}`);
  if (totalFailed > 0) console.log('💡 Re-run this script to retry failed chapters.');
  process.exit(0);
}

regenerateAll().catch(e => { console.error(e); process.exit(1); });
