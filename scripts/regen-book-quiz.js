#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// regen-book-quiz.js — Delete quiz questions for a book so they regenerate
// ═══════════════════════════════════════════════════════════════
// Deletes existing quiz questions for specified book chapters from
// Supabase. The quiz endpoint will auto-regenerate them using the
// improved Claude prompt (with answer length balance, vocab
// distribution, and varied sentence starters).
//
// Usage:
//   node scripts/regen-book-quiz.js --book "Dragon Diaries" [--chapter 1]
//   node scripts/regen-book-quiz.js --book-id 68 [--chapter 1]
//   node scripts/regen-book-quiz.js --book-id 68 --all-chapters
//   node scripts/regen-book-quiz.js --book-id 68 --dry-run
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ALL_CHAPTERS = args.includes('--all-chapters');

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

const bookName = getArg('--book');
const bookIdArg = getArg('--book-id');
const chapterArg = getArg('--chapter');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  REGENERATE BOOK QUIZ QUESTIONS');
  console.log('═══════════════════════════════════════════');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  // Find the book
  let bookId;
  if (bookIdArg) {
    bookId = parseInt(bookIdArg);
  } else if (bookName) {
    const { data: books } = await supabase.from('books').select('id, title').ilike('title', `%${bookName}%`);
    if (!books || books.length === 0) { console.error(`No book found matching "${bookName}"`); process.exit(1); }
    if (books.length > 1) {
      console.log('Multiple matches:');
      books.forEach(b => console.log(`  ID:${b.id} — ${b.title}`));
      console.error('Please use --book-id to specify exactly.');
      process.exit(1);
    }
    bookId = books[0].id;
    console.log(`Found: "${books[0].title}" (ID: ${bookId})`);
  } else {
    console.error('Usage: node scripts/regen-book-quiz.js --book "Dragon Diaries" [--chapter 1]');
    process.exit(1);
  }

  // Get chapters for this book
  const { data: chapters } = await supabase.from('chapters').select('id, chapter_number, title').eq('book_id', bookId).order('chapter_number');
  if (!chapters || chapters.length === 0) { console.error('No chapters found for this book.'); process.exit(1); }

  console.log(`Book has ${chapters.length} chapters.\n`);

  // Filter to specific chapter or all
  let targetChapters = chapters;
  if (chapterArg && !ALL_CHAPTERS) {
    const num = parseInt(chapterArg);
    targetChapters = chapters.filter(c => c.chapter_number === num);
    if (targetChapters.length === 0) { console.error(`Chapter ${num} not found.`); process.exit(1); }
  } else if (!ALL_CHAPTERS && !chapterArg) {
    console.error('Specify --chapter N or --all-chapters');
    process.exit(1);
  }

  let totalDeleted = 0;

  for (const ch of targetChapters) {
    // Count existing questions
    const { data: questions, count } = await supabase
      .from('quiz_questions')
      .select('id, question_text, options, correct_answer', { count: 'exact' })
      .eq('chapter_id', ch.id);

    const qCount = questions?.length || 0;
    console.log(`Chapter ${ch.chapter_number}: "${ch.title}" — ${qCount} questions`);

    if (qCount > 0 && !DRY_RUN) {
      // Show what we're deleting
      questions.forEach(q => {
        const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
        const lengths = opts.map(o => o.length);
        const correctLen = lengths[q.correct_answer] || 0;
        const avgOther = lengths.filter((_, i) => i !== q.correct_answer).reduce((a, b) => a + b, 0) / 3;
        const ratio = avgOther > 0 ? (correctLen / avgOther).toFixed(1) : 'N/A';
        console.log(`  Q${q.id}: "${q.question_text.substring(0, 60)}..." len=[${lengths.join(',')}] ratio=${ratio}x`);
      });

      const { error } = await supabase.from('quiz_questions').delete().eq('chapter_id', ch.id);
      if (error) {
        console.error(`  ERROR deleting: ${error.message}`);
      } else {
        console.log(`  DELETED ${qCount} questions. Will regenerate on next quiz load.`);
        totalDeleted += qCount;
      }
    } else if (qCount > 0) {
      questions.forEach(q => {
        const opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []);
        const lengths = opts.map(o => o.length);
        const correctLen = lengths[q.correct_answer] || 0;
        const avgOther = lengths.filter((_, i) => i !== q.correct_answer).reduce((a, b) => a + b, 0) / 3;
        const ratio = avgOther > 0 ? (correctLen / avgOther).toFixed(1) : 'N/A';
        console.log(`  Q${q.id}: "${q.question_text.substring(0, 60)}..." len=[${lengths.join(',')}] ratio=${ratio}x`);
      });
      console.log(`  [DRY RUN] Would delete ${qCount} questions.`);
      totalDeleted += qCount;
    }
  }

  console.log(`\nTotal: ${totalDeleted} questions ${DRY_RUN ? 'would be' : ''} deleted from ${targetChapters.length} chapter(s).`);
  if (!DRY_RUN) console.log('Questions will regenerate with the improved prompt on next quiz load.');
  if (DRY_RUN) console.log('(Dry run — no changes made. Remove --dry-run to apply.)');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
