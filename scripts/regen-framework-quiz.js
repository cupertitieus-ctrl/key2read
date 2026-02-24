#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// regen-framework-quiz.js — Generate quiz questions using the
// Universal Question Generation Framework
// ═══════════════════════════════════════════════════════════════
// Calls the Claude API to generate questions, validates them
// against the framework rules, and stores them in Supabase.
//
// REQUIRES: CLAUDE_API_KEY in .env (get from console.anthropic.com)
//
// Usage:
//   node scripts/regen-framework-quiz.js --book-id 66 --chapter 1 --dry-run
//   node scripts/regen-framework-quiz.js --book-id 66 --all-chapters --dry-run
//   node scripts/regen-framework-quiz.js --book-id 66 --all-chapters --preserve-pages
//   node scripts/regen-framework-quiz.js --book-id 66 --all-chapters --preserve-pages --dry-run
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const claude = require('../server/claude');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ─── CLI Args ───
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ALL_CHAPTERS = args.includes('--all-chapters');
const PRESERVE_PAGES = args.includes('--preserve-pages');

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

const bookIdArg = getArg('--book-id');
const chapterArg = getArg('--chapter');

// ─── Famous Cat Page Map ───
// Chapter DB IDs → [startPage, endPage]
const PAGE_MAP = {
  103: [5, 10],    // Chapter 1: pages 5-10
  104: [11, 16],   // Chapter 2: pages 11-16
  105: [17, 23],   // Chapter 3: pages 17-23
  106: [24, 30],   // Chapter 4: pages 24-30
  107: [31, 41],   // Chapter 5: pages 31-41
  108: [42, 48],   // Chapter 6: pages 42-48
  109: [49, 54],   // Chapter 7: pages 49-54
  110: [55, 59],   // Chapter 8: pages 55-59
  111: [60, 66],   // Chapter 9: pages 60-66
  112: [67, 70],   // Chapter 10: pages 67-70
  113: [71, 74],   // Chapter 11: pages 71-74
  114: [75, 79],   // Chapter 12: pages 75-79
  115: [80, 85]    // Chapter 13: pages 80-85
};

// ─── Validation ───
function validateQuestions(questions, questionCount) {
  const errors = [];

  // Check question count
  if (questions.length !== questionCount) {
    errors.push(`Expected ${questionCount} questions, got ${questions.length}`);
  }

  // Check required types present
  const types = questions.map(q => q.question_type);
  const requiredTypes = ['literal', 'cause-effect', 'vocabulary', 'inference', 'best-answer'];
  for (const t of requiredTypes) {
    if (!types.includes(t)) {
      errors.push(`Missing required question type: ${t}`);
    }
  }

  // Check BEST answer question has "BEST" in question text
  const bestQ = questions.find(q => q.question_type === 'best-answer');
  if (bestQ && !bestQ.question_text.includes('BEST')) {
    errors.push('BEST answer question must contain "BEST" in question_text');
  }

  // Check answer length ratio (no option should be >2x the average of others)
  for (const q of questions) {
    if (!q.options || q.options.length !== 4) {
      errors.push(`Q${q.question_number}: Must have exactly 4 options`);
      continue;
    }
    const lengths = q.options.map(o => (o || '').length);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    if (minLen > 0 && maxLen / minLen > 3.0) {
      errors.push(`Q${q.question_number}: Answer length ratio too high (${(maxLen / minLen).toFixed(1)}x)`);
    }
  }

  // Check correct answer position variance
  const positions = questions.map(q => q.correct_answer);
  const positionCounts = [0, 0, 0, 0];
  positions.forEach(p => { if (p >= 0 && p <= 3) positionCounts[p]++; });
  const maxAtPosition = Math.max(...positionCounts);
  if (maxAtPosition / questions.length > 0.5) {
    errors.push(`Correct answer position bias: position ${positionCounts.indexOf(maxAtPosition)} has ${maxAtPosition}/${questions.length} answers`);
  }

  // Check vocabulary words coverage (at least 2 questions should have vocab)
  const vocabCount = questions.filter(q => q.vocabulary_words && q.vocabulary_words.length > 0).length;
  if (vocabCount < 2) {
    errors.push(`Only ${vocabCount} questions have vocabulary words (need at least 2)`);
  }

  return errors;
}

// ─── Page Tip Generator ───
function getPageTip(chapterId, questionNumber, questionCount) {
  const pages = PAGE_MAP[chapterId];
  if (!pages) return 'Reread this chapter to find the answer.';

  const [start, end] = pages;
  const range = end - start;
  // Spread questions across the page range
  const pageOffset = Math.round((questionNumber - 1) / (questionCount - 1 || 1) * range);
  const page = start + pageOffset;
  return `Go to page ${page} to find the answer.`;
}

// ─── Main ───
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  UNIVERSAL QUESTION GENERATION FRAMEWORK');
  console.log('  Regenerate Quiz Questions');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '🔴 LIVE (will modify database)'}`);
  console.log(`Preserve pages: ${PRESERVE_PAGES ? 'Yes' : 'No'}`);

  // Check Claude API
  if (!claude.isConfigured()) {
    console.error('\n❌ CLAUDE_API_KEY is not configured in .env');
    console.error('   Get an API key from https://console.anthropic.com → API Keys');
    console.error('   Add to .env: CLAUDE_API_KEY=sk-ant-...');
    process.exit(1);
  }
  console.log('Claude API: ✅ Configured\n');

  // Find the book
  if (!bookIdArg) {
    console.error('Usage: node scripts/regen-framework-quiz.js --book-id 66 --all-chapters [--preserve-pages] [--dry-run]');
    process.exit(1);
  }
  const bookId = parseInt(bookIdArg);
  const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();
  if (!book) { console.error(`Book ID ${bookId} not found.`); process.exit(1); }
  console.log(`📚 Book: "${book.title}" by ${book.author} (ID: ${bookId})`);
  console.log(`   Grade: ${book.grade_level || 'not set'}, Lexile: ${book.lexile_level || 'not set'}`);

  // Get chapters
  const { data: chapters } = await supabase.from('chapters').select('*').eq('book_id', bookId).order('chapter_number');
  if (!chapters || chapters.length === 0) { console.error('No chapters found.'); process.exit(1); }
  console.log(`   Chapters: ${chapters.length}\n`);

  // Determine question count
  const questionCount = chapters.length <= 9 ? 7 : 5;
  const totalQuestions = chapters.length * questionCount;
  console.log(`📝 Question count per chapter: ${questionCount} (${chapters.length} chapters → ${totalQuestions} total)`);

  if (totalQuestions > 85) {
    console.warn(`⚠️  WARNING: Total questions (${totalQuestions}) exceeds 85. Consider reducing.`);
  }

  // Filter chapters
  let targetChapters = chapters;
  if (chapterArg && !ALL_CHAPTERS) {
    const num = parseInt(chapterArg);
    targetChapters = chapters.filter(c => c.chapter_number === num);
    if (targetChapters.length === 0) { console.error(`Chapter ${num} not found.`); process.exit(1); }
  } else if (!ALL_CHAPTERS && !chapterArg) {
    console.error('Specify --chapter N or --all-chapters');
    process.exit(1);
  }

  console.log(`\n${'─'.repeat(60)}`);

  let totalGenerated = 0;
  let totalErrors = 0;
  const chapterResults = [];

  for (const ch of targetChapters) {
    console.log(`\n📖 Chapter ${ch.chapter_number}: "${ch.title}"`);
    console.log(`   Summary: ${(ch.summary || 'No summary').substring(0, 100)}...`);

    // Generate questions
    let generated;
    let validationErrors = [];
    let retried = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`   ${attempt > 1 ? '🔄 Retry ' : ''}Generating ${questionCount} questions...`);
        generated = await claude.generateChapterQuiz(
          book.title, book.author, ch.chapter_number, ch.title,
          ch.summary, book.grade_level, questionCount
        );

        if (!generated || !generated.questions) {
          console.error(`   ❌ No questions returned`);
          if (attempt === 1) { retried = true; continue; }
          break;
        }

        // Validate
        validationErrors = validateQuestions(generated.questions, questionCount);
        if (validationErrors.length === 0) {
          console.log(`   ✅ Generated ${generated.questions.length} questions — all validations passed`);
          break;
        } else if (attempt === 1) {
          console.warn(`   ⚠️  Validation issues (attempt 1):`);
          validationErrors.forEach(e => console.warn(`      - ${e}`));
          retried = true;
          continue;
        } else {
          console.warn(`   ⚠️  Validation issues remain after retry:`);
          validationErrors.forEach(e => console.warn(`      - ${e}`));
          // Still use the questions if we have them
          if (generated.questions.length > 0) {
            console.log(`   ⚠️  Using ${generated.questions.length} questions despite validation issues`);
          }
        }
      } catch (e) {
        console.error(`   ❌ Generation error: ${e.message}`);
        if (attempt === 2) break;
        retried = true;
      }
    }

    if (!generated || !generated.questions || generated.questions.length === 0) {
      console.error(`   ❌ FAILED — no questions generated for chapter ${ch.chapter_number}`);
      totalErrors++;
      chapterResults.push({ chapter: ch.chapter_number, status: 'FAILED', count: 0 });
      continue;
    }

    // Apply page tips if preserving pages
    if (PRESERVE_PAGES) {
      generated.questions.forEach((q, i) => {
        q.strategy_tip = getPageTip(ch.id, q.question_number || (i + 1), questionCount);
      });
      console.log(`   📄 Applied page references from page map`);
    }

    // Log each question
    generated.questions.forEach(q => {
      const vocabStr = q.vocabulary_words && q.vocabulary_words.length > 0 ? q.vocabulary_words.join(', ') : 'none';
      const optLengths = (q.options || []).map(o => (o || '').length);
      console.log(`   Q${q.question_number} [${q.question_type}] "${q.question_text.substring(0, 65)}..." vocab=[${vocabStr}] lens=[${optLengths.join(',')}]`);
    });

    // Insert into database
    if (!DRY_RUN) {
      // Delete old questions first
      const { data: existing } = await supabase.from('quiz_questions').select('id').eq('chapter_id', ch.id);
      const existingCount = existing?.length || 0;

      if (existingCount > 0) {
        const { error: delError } = await supabase.from('quiz_questions').delete().eq('chapter_id', ch.id);
        if (delError) {
          console.error(`   ❌ Error deleting old questions: ${delError.message}`);
          totalErrors++;
          chapterResults.push({ chapter: ch.chapter_number, status: 'DELETE_ERROR', count: 0 });
          continue;
        }
        console.log(`   🗑️  Deleted ${existingCount} old questions`);
      }

      // Insert new questions
      let insertedCount = 0;
      for (const q of generated.questions) {
        const { error: insError } = await supabase.from('quiz_questions').insert({
          chapter_id: ch.id,
          question_number: q.question_number,
          question_type: q.question_type,
          question_text: q.question_text,
          passage_excerpt: q.passage_excerpt || '',
          options: q.options,
          correct_answer: q.correct_answer,
          strategy_type: q.strategy_type,
          strategy_tip: q.strategy_tip || 'Reread this chapter to find the answer.',
          explanation: q.explanation || '',
          vocabulary_words: q.vocabulary_words || []
        });
        if (insError) {
          console.error(`   ❌ Insert error for Q${q.question_number}: ${insError.message}`);
          totalErrors++;
        } else {
          insertedCount++;
        }
      }
      console.log(`   ✅ Inserted ${insertedCount} new questions`);
      totalGenerated += insertedCount;
      chapterResults.push({ chapter: ch.chapter_number, status: 'OK', count: insertedCount, retried });
    } else {
      console.log(`   [DRY RUN] Would insert ${generated.questions.length} questions`);
      totalGenerated += generated.questions.length;
      chapterResults.push({ chapter: ch.chapter_number, status: 'DRY_RUN', count: generated.questions.length, retried });
    }

    // Small delay between chapters to respect rate limits
    if (targetChapters.indexOf(ch) < targetChapters.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ─── Summary Report ───
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  SUMMARY REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Book: "${book.title}" (ID: ${bookId})`);
  console.log(`Chapters processed: ${targetChapters.length}`);
  console.log(`Questions per chapter: ${questionCount}`);
  console.log(`Total questions generated: ${totalGenerated}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Per-chapter table
  console.log('Chapter | Status     | Questions | Retried');
  console.log('--------|------------|-----------|--------');
  chapterResults.forEach(r => {
    console.log(`  ${String(r.chapter).padStart(3)}   | ${r.status.padEnd(10)} | ${String(r.count).padStart(9)} | ${r.retried ? 'Yes' : 'No'}`);
  });

  if (DRY_RUN) {
    console.log('\n🔍 Dry run complete — no changes made. Remove --dry-run to apply.');
  } else {
    console.log(`\n✅ Done! ${totalGenerated} questions are now in Supabase.`);
    console.log('   Test by loading the book\'s quiz in the browser.');
  }
}

main().catch(e => { console.error('\n💥 Fatal error:', e); process.exit(1); });
