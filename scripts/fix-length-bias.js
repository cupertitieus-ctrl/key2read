#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// fix-length-bias.js — Fix answer length bias in existing quizzes
// ═══════════════════════════════════════════════════════════════
// Finds questions where the correct answer is significantly longer
// than wrong answers and uses Claude to rewrite the distractors
// to be similar in length and quality.
//
// Usage:
//   node scripts/fix-length-bias.js [--dry-run] [--limit N] [--min-ratio 1.5]
//
// Options:
//   --dry-run      Show what would be changed without updating DB
//   --limit N      Only fix N questions (default: all)
//   --min-ratio N  Minimum length ratio to fix (default: 1.5)
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const ratioIdx = args.indexOf('--min-ratio');
const MIN_RATIO = ratioIdx >= 0 ? parseFloat(args[ratioIdx + 1]) : 1.5;

function parseArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') try { return JSON.parse(val); } catch(e) { return []; }
  return [];
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

function findBiasedQuestions(questions) {
  const biased = [];
  for (const q of questions) {
    const opts = parseArr(q.options);
    if (opts.length < 4) continue;
    const lengths = opts.map(o => o.length);
    const correctLen = lengths[q.correct_answer];
    const maxLen = Math.max(...lengths);
    if (correctLen !== maxLen) continue; // correct is not longest
    const otherLens = lengths.filter((_, i) => i !== q.correct_answer);
    const avgOtherLen = otherLens.reduce((a, b) => a + b, 0) / otherLens.length;
    if (avgOtherLen === 0) continue;
    const ratio = correctLen / avgOtherLen;
    if (ratio >= MIN_RATIO) {
      biased.push({ ...q, opts, ratio, correctLen, avgOtherLen: Math.round(avgOtherLen) });
    }
  }
  // Sort by worst ratio first
  biased.sort((a, b) => b.ratio - a.ratio);
  return biased;
}

async function rewriteDistractors(q) {
  const opts = q.opts;
  const correctIdx = q.correct_answer;
  const correctText = opts[correctIdx];
  const wrongOpts = opts.map((o, i) => i === correctIdx ? null : o).filter(Boolean);

  const resp = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{ role: 'user', content: `You are fixing answer length bias in a reading comprehension quiz question. The correct answer is much longer than the wrong answers, which makes it obvious to students.

QUESTION: ${q.question_text}

CORRECT ANSWER (index ${correctIdx}): "${correctText}" (${correctText.length} chars)

CURRENT WRONG ANSWERS:
${wrongOpts.map((o, i) => `- "${o}" (${o.length} chars)`).join('\n')}

TARGET: All 4 options should be similar in length (${Math.round(correctText.length * 0.7)}-${Math.round(correctText.length * 1.1)} chars each).

Rewrite ONLY the wrong answers to be:
1. Similar length to the correct answer (within ~20%)
2. Still plausible but clearly wrong
3. Well-crafted distractors that test comprehension
4. Using varied sentence starters (not all beginning with the same words)

Keep the correct answer EXACTLY as-is. Return ONLY valid JSON:
{ "options": ["option0", "option1", "option2", "option3"] }

The correct answer must remain at index ${correctIdx} unchanged.` }]
  });

  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const result = JSON.parse(jsonMatch[0]);
    if (!result.options || result.options.length !== 4) return null;
    // Verify correct answer wasn't changed
    if (result.options[correctIdx] !== correctText) {
      // Force it back
      result.options[correctIdx] = correctText;
    }
    return result.options;
  } catch (e) {
    console.error('  Parse error:', e.message);
    return null;
  }
}

async function updateQuestion(id, newOptions) {
  const { error } = await supabase
    .from('quiz_questions')
    .update({ options: newOptions })
    .eq('id', id);
  if (error) console.error('  Update error for ID', id, ':', error);
  return !error;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  FIX ANSWER LENGTH BIAS');
  console.log('═══════════════════════════════════════════');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no DB changes)' : 'LIVE (will update DB)'}`);
  console.log(`Min ratio: ${MIN_RATIO}x`);
  console.log(`Limit: ${LIMIT === Infinity ? 'all' : LIMIT}\n`);

  console.log('Fetching all questions...');
  const questions = await fetchAllQuestions();
  console.log(`Found ${questions.length} total questions.\n`);

  const biased = findBiasedQuestions(questions);
  console.log(`Found ${biased.length} questions with correct answer ${MIN_RATIO}x+ longer.\n`);

  const toFix = biased.slice(0, LIMIT);
  let fixed = 0, failed = 0, skipped = 0;

  for (let i = 0; i < toFix.length; i++) {
    const q = toFix[i];
    console.log(`[${i + 1}/${toFix.length}] ID:${q.id} | ratio=${q.ratio.toFixed(2)}x | correct=${q.correctLen} avg_other=${q.avgOtherLen}`);
    console.log(`  Q: ${q.question_text.substring(0, 80)}...`);

    const newOptions = await rewriteDistractors(q);
    if (!newOptions) {
      console.log('  SKIP — Claude did not return valid options');
      skipped++;
      continue;
    }

    // Verify improvement
    const newLengths = newOptions.map(o => o.length);
    const newCorrectLen = newLengths[q.correct_answer];
    const newOtherLens = newLengths.filter((_, i) => i !== q.correct_answer);
    const newAvg = newOtherLens.reduce((a, b) => a + b, 0) / newOtherLens.length;
    const newRatio = newAvg > 0 ? (newCorrectLen / newAvg).toFixed(2) : 'N/A';

    console.log(`  Before: ${q.opts.map(o => o.length).join(', ')} chars | ratio=${q.ratio.toFixed(2)}x`);
    console.log(`  After:  ${newLengths.join(', ')} chars | ratio=${newRatio}x`);

    if (!DRY_RUN) {
      const ok = await updateQuestion(q.id, newOptions);
      if (ok) {
        fixed++;
        console.log('  UPDATED');
      } else {
        failed++;
        console.log('  FAILED to update');
      }
    } else {
      fixed++;
      console.log('  [DRY RUN] Would update');
    }

    // Rate limit: small delay between API calls
    if (i < toFix.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('  RESULTS');
  console.log('═══════════════════════════════════════════');
  console.log(`Total biased: ${biased.length}`);
  console.log(`Processed: ${toFix.length}`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
  if (DRY_RUN) console.log('\n(Dry run — no changes were made. Remove --dry-run to apply.)');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
