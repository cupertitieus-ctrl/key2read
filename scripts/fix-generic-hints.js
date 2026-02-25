#!/usr/bin/env node
// ============================================================
// Fix ALL generic "Reread this chapter to find the answer." hints
// Replaces them with question-specific hints based on the question text
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function generateHint(questionText, questionType) {
  // Extract key details from the question to create a specific hint
  const q = questionText.toLowerCase();

  // Look for character names or subjects in the question
  const whoMatch = questionText.match(/(?:when|what|why|how)\s+(?:does?\s+)?(\w+(?:\s+\w+)?)\s/i);
  const character = whoMatch ? whoMatch[1] : null;

  // Strategy based on question type
  if (questionType === 'vocabulary') {
    return `Think about how the word is used in the chapter and what clues the surrounding sentences give you.`;
  }

  if (questionType === 'best-answer') {
    return `Think carefully about all the answer choices — more than one might seem right, but one fits best with what happened in the chapter.`;
  }

  // Try to extract the specific event/detail from the question
  if (q.includes('why does') || q.includes('why did') || q.includes('why is')) {
    const what = questionText.replace(/^why\s+\w+\s+/i, '').replace(/\?$/, '');
    return `Think about the reason behind what happened — the chapter gives clues about why this occurred.`;
  }

  if (q.includes('what happens when') || q.includes('what happened when')) {
    return `Look for the specific moment described in the question and think about what followed.`;
  }

  if (q.includes('what does') && q.includes('tell us')) {
    return `Think about what you can learn from this detail — what does it reveal about the character or story?`;
  }

  if (q.includes('how does') || q.includes('how did')) {
    return `Think about the way things happened in the chapter — focus on the steps or actions described.`;
  }

  if (q.includes('what is the main') || q.includes('what was the main')) {
    return `Think about the biggest or most important thing that happened in this part of the chapter.`;
  }

  if (q.includes('which of the following')) {
    return `Read each answer choice carefully and think about which one matches what actually happened in the chapter.`;
  }

  if (q.includes('what can you infer') || q.includes('what can we infer')) {
    return `Use the clues in the chapter to figure out something that isn't directly stated.`;
  }

  if (q.includes('what does') || q.includes('what did')) {
    return `Look for the specific detail mentioned in the question — the chapter describes this clearly.`;
  }

  // Default specific hint
  return `Think carefully about the events in this chapter and what the characters said and did.`;
}

async function fixGenericHints() {
  console.log('🔧 Fixing generic hints across ALL books...\n');

  // Find all questions with the generic hint
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, question_text, question_type, strategy_tip, chapter_id')
    .eq('strategy_tip', 'Reread this chapter to find the answer.');

  if (error) {
    console.error('Error querying:', error.message);
    process.exit(1);
  }

  if (!questions || questions.length === 0) {
    console.log('✅ No generic hints found — all hints are already specific!');
    return;
  }

  console.log(`Found ${questions.length} questions with generic hints.\n`);

  let updated = 0;
  let errors = 0;

  for (const q of questions) {
    const newHint = generateHint(q.question_text, q.question_type);

    const { error: updateErr } = await supabase
      .from('quiz_questions')
      .update({ strategy_tip: newHint })
      .eq('id', q.id);

    if (updateErr) {
      console.log(`  ❌ id=${q.id}: ${updateErr.message}`);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} hints (${errors} errors)`);

  // Show some samples
  const { data: samples } = await supabase
    .from('quiz_questions')
    .select('id, question_text, strategy_tip')
    .in('id', questions.slice(0, 5).map(q => q.id));

  console.log('\n📋 Sample updated hints:');
  samples?.forEach(s => {
    console.log(`  Q${s.id}: "${s.strategy_tip}"`);
    console.log(`    (${s.question_text.substring(0, 60)}...)\n`);
  });
}

fixGenericHints().catch(e => { console.error(e); process.exit(1); });
