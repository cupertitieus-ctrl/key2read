#!/usr/bin/env node
// Updates Famous Cat quiz questions to:
// 1. Add vocabulary_words to questions that are missing them (at least 2 per chapter)
// 2. Add page number references to strategy_tip hints

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const DRY_RUN = process.argv.includes('--dry-run');

// Diary of a Famous Cat: Now I Have A Name (book 66, chapters 103-115)
// Vocab + hint updates per question
// Page ranges from the actual book PDF:
// Entry 1: pp 5-10, Entry 2: pp 11-16, Entry 3: pp 17-23, Entry 4: pp 24-30,
// Entry 5: pp 31-41, Entry 6: pp 42-48, Entry 7: pp 49-54, Entry 8: pp 55-59,
// Entry 9: pp 60-66, Entry 10: pp 67-70, Entry 11: pp 71-74, Entry 12: pp 75-79,
// Entry 13: pp 80-85

const UPDATES = {
  // Entry 1 (ch 103) pages 5-10
  '103-1': { vocabulary_words: ['stray'], strategy_tip: 'Go to page 5 to find the answer.' },
  '103-2': { vocabulary_words: ['viral'], strategy_tip: 'Go to page 6 to find the answer.' },
  '103-3': { strategy_tip: 'Go to page 5 to find the answer.' },
  '103-4': { vocabulary_words: ['stumbled'], strategy_tip: 'Go to page 9 to find the answer.' },
  '103-5': { strategy_tip: 'Go to page 10 to find the answer.' },

  // Entry 2 (ch 104) pages 11-16
  '104-1': { strategy_tip: 'Go to page 11 to find the answer.' },
  '104-2': { vocabulary_words: ['alley'], strategy_tip: 'Go to page 12 to find the answer.' },
  '104-3': { vocabulary_words: ['stray'], strategy_tip: 'Go to page 16 to find the answer.' },
  '104-4': { strategy_tip: 'Go to page 13 to find the answer.' },
  '104-5': { vocabulary_words: ['announced'], strategy_tip: 'Go to page 14 to find the answer.' },

  // Entry 3 (ch 105) pages 17-23
  '105-1': { vocabulary_words: ['crashed'], strategy_tip: 'Go to page 17 to find the answer.' },
  '105-2': { strategy_tip: 'Go to page 18 to find the answer.' },
  '105-3': { vocabulary_words: ['drifted'], strategy_tip: 'Go to page 23 to find the answer.' },
  '105-4': { strategy_tip: 'Go to page 19 to find the answer.' },
  '105-5': { strategy_tip: 'Go to page 23 to find the answer.' },

  // Entry 4 (ch 106) pages 24-30
  '106-1': { vocabulary_words: ['experiments'], strategy_tip: 'Go to page 24 to find the answer.' },
  '106-2': { strategy_tip: 'Go to page 25 to find the answer.' },
  '106-3': { strategy_tip: 'Go to page 28 to find the answer.' },
  '106-4': { vocabulary_words: ['connection'], strategy_tip: 'Go to page 30 to find the answer.' },
  '106-5': { strategy_tip: 'Go to page 29 to find the answer.' },

  // Entry 5 (ch 107) pages 31-41
  '107-1': { strategy_tip: 'Go to page 31 to find the answer.' },
  '107-2': { vocabulary_words: ['compared'], strategy_tip: 'Go to page 34 to find the answer.' },
  '107-3': { vocabulary_words: ['performing'], strategy_tip: 'Go to page 36 to find the answer.' },
  '107-4': { strategy_tip: 'Go to page 37 to find the answer.' },
  '107-5': { strategy_tip: 'Go to pages 31-41 to find the answer.' },

  // Entry 6 (ch 108) pages 42-48
  '108-1': { vocabulary_words: ['sprinted'], strategy_tip: 'Go to page 42 to find the answer.' },
  '108-2': { vocabulary_words: ['recognized'], strategy_tip: 'Go to page 44 to find the answer.' },
  '108-3': { strategy_tip: 'Go to pages 44-45 to find the answer.' },
  '108-4': { strategy_tip: 'Go to page 45 to find the answer.' },
  '108-5': { strategy_tip: 'Go to page 47 to find the answer.' },

  // Entry 7 (ch 109) pages 49-54
  '109-1': { vocabulary_words: ['experiment'], strategy_tip: 'Go to page 50 to find the answer.' },
  '109-2': { vocabulary_words: ['slouched'], strategy_tip: 'Go to page 51 to find the answer.' },
  '109-3': { strategy_tip: 'Go to page 52 to find the answer.' },
  '109-4': { strategy_tip: 'Go to page 53 to find the answer.' },
  '109-5': { strategy_tip: 'Go to page 53 to find the answer.' },

  // Entry 8 (ch 110) pages 55-59
  '110-1': { vocabulary_words: ['library'], strategy_tip: 'Go to page 55 to find the answer.' },
  '110-2': { vocabulary_words: ['confident'], strategy_tip: 'Go to page 56 to find the answer.' },
  '110-3': { strategy_tip: 'Go to page 55 to find the answer.' },
  '110-4': { strategy_tip: 'Go to page 58 to find the answer.' },
  '110-5': { strategy_tip: 'Go to page 59 to find the answer.' },

  // Entry 9 (ch 111) pages 60-66
  '111-1': { vocabulary_words: ['recognized'], strategy_tip: 'Go to page 60 to find the answer.' },
  '111-2': { strategy_tip: 'Go to page 62 to find the answer.' },
  '111-3': { vocabulary_words: ['suspicious'], strategy_tip: 'Go to page 66 to find the answer.' },
  '111-4': { strategy_tip: 'Go to page 61 to find the answer.' },
  '111-5': { strategy_tip: 'Go to page 63 to find the answer.' },

  // Entry 10 (ch 112) pages 67-70
  '112-1': { vocabulary_words: ['filmed'], strategy_tip: 'Go to page 67 to find the answer.' },
  '112-2': { vocabulary_words: ['excuses'], strategy_tip: 'Go to page 68 to find the answer.' },
  '112-3': { strategy_tip: 'Go to page 70 to find the answer.' },
  '112-4': { strategy_tip: 'Go to page 69 to find the answer.' },
  '112-5': { strategy_tip: 'Go to page 67 to find the answer.' },

  // Entry 11 (ch 113) pages 71-74
  '113-1': { vocabulary_words: ['chaotic'], strategy_tip: 'Go to page 72 to find the answer.' },
  '113-2': { vocabulary_words: ['nervous'], strategy_tip: 'Go to page 73 to find the answer.' },
  '113-3': { strategy_tip: 'Go to page 74 to find the answer.' },
  '113-4': { strategy_tip: 'Go to page 73 to find the answer.' },
  '113-5': { strategy_tip: 'Go to page 72 to find the answer.' },

  // Entry 12 (ch 114) pages 75-79
  '114-1': { vocabulary_words: ['revealed'], strategy_tip: 'Go to page 76 to find the answer.' },
  '114-2': { vocabulary_words: ['proud'], strategy_tip: 'Go to page 77 to find the answer.' },
  '114-3': { strategy_tip: 'Go to page 78 to find the answer.' },
  '114-4': { strategy_tip: 'Go to page 77 to find the answer.' },
  '114-5': { strategy_tip: 'Go to page 79 to find the answer.' },

  // Entry 13 (ch 115) pages 80-85
  '115-1': { vocabulary_words: ['whispered'], strategy_tip: 'Go to page 81 to find the answer.' },
  '115-2': { vocabulary_words: ['teased', 'confident'], strategy_tip: 'Go to page 82 to find the answer.' },
  '115-3': { strategy_tip: 'Go to page 85 to find the answer.' },
  '115-4': { strategy_tip: 'Go to page 82 to find the answer.' },
  '115-5': { strategy_tip: 'Go to page 85 to find the answer.' },
};

async function main() {
  console.log('Updating Famous Cat quiz questions (vocab + hints)');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  let updated = 0;
  for (const [key, updates] of Object.entries(UPDATES)) {
    const [chapterId, qNum] = key.split('-').map(Number);

    // Get current question
    const { data: q } = await sb.from('quiz_questions')
      .select('id, vocabulary_words, strategy_tip')
      .eq('chapter_id', chapterId)
      .eq('question_number', qNum)
      .single();

    if (!q) { console.log(`  SKIP ${key}: not found`); continue; }

    const patch = {};
    if (updates.vocabulary_words) {
      // Merge existing + new vocab, deduplicate
      const existing = q.vocabulary_words || [];
      const merged = [...new Set([...existing, ...updates.vocabulary_words])];
      if (JSON.stringify(merged) !== JSON.stringify(existing)) {
        patch.vocabulary_words = merged;
      }
    }
    if (updates.strategy_tip) {
      patch.strategy_tip = updates.strategy_tip;
    }

    if (Object.keys(patch).length === 0) {
      if (!DRY_RUN) console.log(`  SKIP ${key}: no changes`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`  UPDATE ${key} (id=${q.id}):`, JSON.stringify(patch).substring(0, 100));
      updated++;
    } else {
      const { error } = await sb.from('quiz_questions').update(patch).eq('id', q.id);
      if (error) console.error(`  ERROR ${key}:`, error.message);
      else { updated++; }
    }
  }

  console.log(`\nTotal: ${updated} questions ${DRY_RUN ? 'would be' : ''} updated.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
