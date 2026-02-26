#!/usr/bin/env node
// ============================================================
// Batch regenerate ALL quiz questions for ALL chapters
// Uses the improved ANSWER_RULES from server/claude.js
// ============================================================
// Usage:
//   node scripts/regen-all-quizzes.js              # Regenerate all
//   node scripts/regen-all-quizzes.js --book 68    # Regenerate specific book
//   node scripts/regen-all-quizzes.js --dry-run    # Preview without changes
// ============================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { generateChapterQuiz, isConfigured } = require('../server/claude');

// Load book page data for hint generation
let BOOK_PAGES;
try {
  BOOK_PAGES = require('../server/book-pages').BOOK_PAGES;
} catch (e) {
  console.warn('Warning: book-pages.js not found, hints will use generic format');
  BOOK_PAGES = {};
}

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bookIdIdx = args.indexOf('--book');
const specificBookId = bookIdIdx >= 0 ? parseInt(args[bookIdIdx + 1]) : null;
const chapterIdIdx = args.indexOf('--chapter');
const specificChapterId = chapterIdIdx >= 0 ? parseInt(args[chapterIdIdx + 1]) : null;

// Rate limiting - delay between API calls (ms)
const DELAY_BETWEEN_CALLS = 3000; // 3 seconds between each chapter
const DELAY_ON_ERROR = 10000; // 10 seconds after an error

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validateQuestions(questions, questionCount) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return { valid: false, reason: 'Empty or missing questions array' };
  }

  // Check for fallback questions
  const isFallback = questions[0] && questions[0].options && questions[0].options.includes('Option A');
  if (isFallback) {
    return { valid: false, reason: 'Got fallback quiz (API may not be configured)' };
  }

  // Check answer bias - longest answer shouldn't always be correct
  let longestIsCorrect = 0;
  for (const q of questions) {
    if (!q.options || q.options.length !== 4) {
      return { valid: false, reason: `Question has ${q.options?.length || 0} options instead of 4` };
    }
    const lengths = q.options.map(o => (o || '').length);
    const maxLen = Math.max(...lengths);
    const correctLen = lengths[q.correct_answer];
    if (correctLen === maxLen && correctLen > lengths.reduce((a, b) => a + b, 0) / 4 * 1.3) {
      longestIsCorrect++;
    }
  }
  if (longestIsCorrect > Math.ceil(questions.length / 2)) {
    return { valid: false, reason: `Answer bias detected: longest answer is correct in ${longestIsCorrect}/${questions.length} questions` };
  }

  // Check correct answer position distribution
  const positionCounts = [0, 0, 0, 0];
  for (const q of questions) {
    positionCounts[q.correct_answer]++;
  }
  const maxPositionCount = Math.max(...positionCounts);
  if (maxPositionCount > Math.ceil(questions.length * 0.6)) {
    return { valid: false, reason: `Position bias: position ${positionCounts.indexOf(maxPositionCount)} has ${maxPositionCount}/${questions.length} correct answers` };
  }

  return { valid: true };
}

(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(' key2read — Batch Quiz Regeneration');
  console.log('═══════════════════════════════════════════════════════');

  if (!isConfigured()) {
    console.error('ERROR: Claude API key not configured. Set CLAUDE_API_KEY in .env');
    process.exit(1);
  }

  if (dryRun) {
    console.log('DRY RUN MODE — No changes will be made');
  }

  // Fetch all chapters with book info
  let query = supabase
    .from('chapters')
    .select('id, chapter_number, title, summary, book_id, books(id, title, author, grade_level)')
    .order('book_id', { ascending: true })
    .order('chapter_number', { ascending: true });

  if (specificBookId) {
    query = query.eq('book_id', specificBookId);
    console.log(`Filtering to book ID: ${specificBookId}`);
  }
  if (specificChapterId) {
    query = query.eq('id', specificChapterId);
    console.log(`Filtering to chapter ID: ${specificChapterId}`);
  }

  const { data: chapters, error: chErr } = await query;
  if (chErr) {
    console.error('Error fetching chapters:', chErr.message);
    process.exit(1);
  }

  if (!chapters || chapters.length === 0) {
    console.log('No chapters found.');
    process.exit(0);
  }

  // Group by book for display
  const bookGroups = {};
  for (const ch of chapters) {
    const bookTitle = ch.books?.title || `Book ${ch.book_id}`;
    if (!bookGroups[bookTitle]) bookGroups[bookTitle] = [];
    bookGroups[bookTitle].push(ch);
  }

  console.log(`\nFound ${chapters.length} chapters across ${Object.keys(bookGroups).length} books:\n`);
  for (const [title, chs] of Object.entries(bookGroups)) {
    console.log(`  📚 ${title} — ${chs.length} chapters`);
  }
  console.log('');

  // Process stats
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;
  let biasRetries = 0;
  const errors = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const book = ch.books;
    const bookTitle = book?.title || 'Unknown';
    const bookAuthor = book?.author || 'Unknown';
    const gradeLevel = book?.grade_level || '2nd-3rd';

    // Determine question count (5 for standard, 7 for longer chapters)
    const questionCount = 5;

    // Get page info
    const pageData = BOOK_PAGES[bookTitle];
    const chapterPages = pageData ? pageData.find(p => p.chapter === ch.chapter_number) : null;
    const pageStart = chapterPages ? chapterPages.start : null;
    const pageEnd = chapterPages ? chapterPages.end : null;

    console.log(`\n[${i + 1}/${chapters.length}] 📖 ${bookTitle} — Ch ${ch.chapter_number}: "${ch.title}"`);
    if (pageStart) console.log(`  Pages: ${pageStart}-${pageEnd}`);

    if (!ch.summary) {
      console.log('  ⚠️  SKIPPED — No chapter summary available');
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log('  🔍 DRY RUN — Would regenerate quiz');
      processed++;
      continue;
    }

    // Generate new quiz with retry for bias
    let questions = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`  Generating quiz${attempts > 1 ? ` (attempt ${attempts})` : ''}...`);
        const result = await generateChapterQuiz(
          bookTitle, bookAuthor, ch.chapter_number, ch.title, ch.summary,
          gradeLevel, questionCount, pageStart, pageEnd
        );

        // Extract questions array - handle both { questions: [...] } and direct array
        const qs = result?.questions || (Array.isArray(result) ? result : null);

        if (!qs || qs.length === 0) {
          console.log('  ❌ Empty result from AI');
          if (attempts < maxAttempts) {
            console.log('  Retrying...');
            await sleep(DELAY_ON_ERROR);
            continue;
          }
          break;
        }

        // Validate quality
        const validation = validateQuestions(qs, questionCount);
        if (!validation.valid) {
          console.log(`  ⚠️  Quality issue: ${validation.reason}`);
          biasRetries++;
          if (attempts < maxAttempts) {
            console.log('  Retrying for better quality...');
            await sleep(DELAY_BETWEEN_CALLS);
            continue;
          }
          // Use it anyway on last attempt
          console.log('  Using result despite quality issue (max retries reached)');
        }

        questions = qs;
        break;
      } catch (e) {
        console.error(`  ❌ Error: ${e.message}`);
        if (attempts < maxAttempts) {
          console.log(`  Waiting ${DELAY_ON_ERROR / 1000}s before retry...`);
          await sleep(DELAY_ON_ERROR);
        }
      }
    }

    if (!questions) {
      console.log('  ❌ FAILED — Could not generate quiz after all attempts');
      failed++;
      errors.push({ chapter: ch.id, book: bookTitle, chapterNum: ch.chapter_number, reason: 'Generation failed' });
      await sleep(DELAY_BETWEEN_CALLS);
      continue;
    }

    // Strip HTML tags and fix hints
    for (const q of questions) {
      q.question_text = (q.question_text || '').replace(/<[^>]*>/g, '');
      q.options = (q.options || []).map(o => (o || '').replace(/<[^>]*>/g, ''));
      q.passage_excerpt = (q.passage_excerpt || '').replace(/<[^>]*>/g, '');
      q.explanation = (q.explanation || '').replace(/<[^>]*>/g, '');

      // Fix hint format
      if (pageStart && pageEnd) {
        const pageMatch = (q.strategy_tip || '').match(/(\d+)/);
        if (pageMatch) {
          const page = parseInt(pageMatch[1]);
          if (page >= pageStart && page <= pageEnd) {
            q.strategy_tip = 'You can find the answer on page ' + page;
          } else {
            q.strategy_tip = 'You can find the answer by rereading this chapter.';
          }
        }
      }
    }

    // Delete old questions
    const { error: delError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('chapter_id', ch.id);

    if (delError) {
      console.error(`  ❌ Delete error: ${delError.message}`);
      failed++;
      errors.push({ chapter: ch.id, book: bookTitle, chapterNum: ch.chapter_number, reason: 'Delete failed' });
      await sleep(DELAY_BETWEEN_CALLS);
      continue;
    }

    // Insert new questions
    const inserts = questions.map((q, idx) => ({
      chapter_id: ch.id,
      question_number: idx + 1,
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
      console.error(`  ❌ Insert error: ${insError.message}`);
      failed++;
      errors.push({ chapter: ch.id, book: bookTitle, chapterNum: ch.chapter_number, reason: 'Insert failed' });
      await sleep(DELAY_BETWEEN_CALLS);
      continue;
    }

    // Show summary
    const positions = questions.map(q => q.correct_answer);
    const positionStr = positions.map(p => String.fromCharCode(65 + p)).join(',');
    console.log(`  ✅ Inserted ${inserts.length} questions — correct positions: [${positionStr}]`);

    // Brief preview of Q1
    console.log(`     Q1: ${inserts[0].question_text.substring(0, 70)}...`);

    processed++;
    succeeded++;

    // Rate limit delay
    if (i < chapters.length - 1) {
      await sleep(DELAY_BETWEEN_CALLS);
    }
  }

  // Final report
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(' REGENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Total chapters: ${chapters.length}`);
  console.log(`  Succeeded:      ${succeeded} ✅`);
  console.log(`  Failed:         ${failed} ❌`);
  console.log(`  Skipped:        ${skipped} ⚠️`);
  console.log(`  Bias retries:   ${biasRetries} 🔄`);

  if (errors.length > 0) {
    console.log('\n  Failed chapters:');
    for (const e of errors) {
      console.log(`    - Chapter ${e.chapter} (${e.book} Ch${e.chapterNum}): ${e.reason}`);
    }
  }

  if (dryRun) {
    console.log(`\n  DRY RUN — ${processed} chapters would be regenerated`);
  }

  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(errors.length > 0 ? 1 : 0);
})();
