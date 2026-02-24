#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// fix-vocab-distribution.js — Fix vocab words only in correct answer
// ═══════════════════════════════════════════════════════════════
// Finds questions where vocabulary_words match ONLY the correct
// answer text and adds a vocab-level word from a wrong answer
// to the vocabulary_words array so underlines appear on 2+ options.
//
// Usage:
//   node scripts/fix-vocab-distribution.js [--dry-run]
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const DRY_RUN = process.argv.includes('--dry-run');

function parseArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') try { return JSON.parse(val); } catch(e) { return []; }
  return [];
}

// Words that are "vocab-worthy" — longer or less common, lowercase only
function isVocabWorthy(word) {
  const common = new Set(['the','a','an','is','was','are','were','has','had','have','not','but','and','or','for',
    'in','on','at','to','of','it','he','she','they','them','this','that','with','from','by','as','be','been',
    'will','can','could','would','should','do','did','does','get','got','its','his','her','my','your','our',
    'their','who','what','when','where','how','why','all','each','some','any','few','many','much','more',
    'most','other','about','than','then','also','just','only','very','really','too','so','like','into','over',
    'another','being','after','before','every','going','having','still','never','always','often','would',
    'there','these','those','which','could','should','might','while','until','since','though','where',
    'right','wrong','first','second','third','start','began','think','makes','wants','feels','thing','things']);
  const clean = word.toLowerCase();
  // Must be 6+ chars, all lowercase alpha, not a common word, not a proper noun (starts with uppercase)
  if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) return false;
  return clean.length >= 6 && /^[a-z'-]+$/.test(clean) && !common.has(clean);
}

async function fetchAllQuestions() {
  const all = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('id, question_number, question_text, options, correct_answer, vocabulary_words, chapter_id')
      .range(from, from + PAGE - 1)
      .order('id');
    if (error) { console.error('Fetch error:', error); break; }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  FIX VOCABULARY DISTRIBUTION');
  console.log('═══════════════════════════════════════════');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  const questions = await fetchAllQuestions();
  console.log(`Fetched ${questions.length} questions.\n`);

  let fixed = 0, skipped = 0;

  for (const q of questions) {
    const vocabWords = parseArr(q.vocabulary_words);
    if (vocabWords.length === 0) continue;

    const opts = parseArr(q.options);
    if (opts.length < 4) continue;

    // Check which options contain vocab words
    const optsWithVocab = opts.map((opt, i) => {
      const has = vocabWords.some(w => opt.toLowerCase().includes(w.toLowerCase()));
      return { idx: i, has };
    });

    const matchCount = optsWithVocab.filter(o => o.has).length;
    if (matchCount !== 1) continue; // Only fix single-option cases

    const matchIdx = optsWithVocab.find(o => o.has).idx;
    const isCorrect = matchIdx === q.correct_answer;
    const severity = isCorrect ? 'HIGH' : 'MEDIUM';

    // Find a good vocab word from a non-matching option to add
    const otherOpts = opts.filter((_, i) => !optsWithVocab[i].has);
    let bestWord = '';
    for (const opt of otherOpts) {
      const words = opt.split(/\s+/);
      for (const w of words) {
        const clean = w.replace(/[^a-zA-Z'-]/g, '');
        if (isVocabWorthy(clean) && clean.length > bestWord.length) {
          bestWord = clean;
        }
      }
    }

    if (!bestWord) {
      skipped++;
      continue;
    }

    const newVocab = [...vocabWords, bestWord];
    console.log(`[${severity}] ID:${q.id} Q${q.question_number} | Adding "${bestWord}" to vocab: [${vocabWords.join(', ')}] → [${newVocab.join(', ')}]`);

    if (!DRY_RUN) {
      const { error } = await supabase
        .from('quiz_questions')
        .update({ vocabulary_words: newVocab })
        .eq('id', q.id);
      if (error) {
        console.error('  Update error:', error);
        skipped++;
      } else {
        fixed++;
      }
    } else {
      fixed++;
    }
  }

  console.log(`\nFixed: ${fixed} | Skipped: ${skipped}`);
  if (DRY_RUN) console.log('(Dry run — no changes made.)');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
